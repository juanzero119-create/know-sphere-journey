// Device-only lock for notes: a salted PBKDF2 password hash and an optional
// Face ID / Touch ID passkey. This is a privacy screen on this device, not encryption.
const KEY = 'lexi-note-lock';

type LockConfig = { salt: string; hash: string; credentialId?: string };

const toB64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer)));
const fromB64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

function read(): LockConfig | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LockConfig;
    return typeof parsed?.salt === 'string' && typeof parsed?.hash === 'string' ? parsed : null;
  } catch { return null; }
}
function write(config: LockConfig) {
  try { window.localStorage.setItem(KEY, JSON.stringify(config)); } catch { /* blocked */ }
}

async function derive(password: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt as BufferSource, iterations: 150_000, hash: 'SHA-256' }, material, 256);
  return toB64(bits);
}

export const hasLockPassword = () => read() !== null;
export const hasFaceId = () => Boolean(read()?.credentialId);

export async function setLockPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const previous = read();
  const next: LockConfig = { salt: toB64(salt), hash: await derive(password, salt) };
  if (previous?.credentialId) next.credentialId = previous.credentialId;
  write(next);
}

export async function verifyLockPassword(password: string) {
  const config = read();
  if (!config) return false;
  const hash = await derive(password, fromB64(config.salt));
  if (hash.length !== config.hash.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ config.hash.charCodeAt(i);
  return diff === 0;
}

export async function faceIdAvailable() {
  try {
    return typeof window !== 'undefined' && !!window.PublicKeyCredential
      && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch { return false; }
}

export async function enableFaceId() {
  const config = read();
  if (!config) throw new Error('Set a password first.');
  const credential = await navigator.credentials.create({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    rp: { name: 'Lexi Notes' },
    user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'lexi-notes', displayName: 'Lexi Notes' },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'preferred' },
    timeout: 60_000,
  } }) as PublicKeyCredential | null;
  if (!credential) throw new Error('Face ID was cancelled.');
  write({ ...config, credentialId: toB64(credential.rawId) });
}

export function disableFaceId() {
  const config = read();
  if (config) write({ salt: config.salt, hash: config.hash });
}

export async function unlockWithFaceId() {
  const id = read()?.credentialId;
  if (!id) return false;
  try {
    const result = await navigator.credentials.get({ publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [{ type: 'public-key', id: fromB64(id) as BufferSource, transports: ['internal'] }],
      userVerification: 'required',
      timeout: 60_000,
    } });
    return result !== null;
  } catch { return false; }
}
