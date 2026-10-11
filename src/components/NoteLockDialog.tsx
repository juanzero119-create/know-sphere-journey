import { useEffect, useState } from 'react';
import { Lock, ScanFace } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { enableFaceId, faceIdAvailable, hasFaceId, hasLockPassword, setLockPassword, unlockWithFaceId, verifyLockPassword } from '@/lib/note-lock';

type Props = { open: boolean; onOpenChange: (open: boolean) => void; onUnlocked: () => void };

export function NoteLockDialog({ open, onOpenChange, onUnlocked }: Props) {
  const [setup, setSetup] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [canFace, setCanFace] = useState(false);
  const [faceOn, setFaceOn] = useState(false);
  const [offerFace, setOfferFace] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSetup(!hasLockPassword()); setPassword(''); setConfirm(''); setError(''); setOfferFace(false);
    setFaceOn(hasFaceId());
    void faceIdAvailable().then(setCanFace);
  }, [open]);

  const finish = () => { onUnlocked(); onOpenChange(false); };

  const tryFace = async () => {
    setBusy(true); setError('');
    const ok = await unlockWithFaceId();
    setBusy(false);
    if (ok) finish(); else setError('Face ID did not unlock. Use your password.');
  };

  useEffect(() => { if (open && faceOn && !setup) void tryFace(); }, [open, faceOn, setup]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (setup) {
      if (password.length < 4) return setError('Use at least 4 characters.');
      if (password !== confirm) return setError('Passwords do not match.');
      setBusy(true); await setLockPassword(password); setBusy(false);
      if (canFace) { setOfferFace(true); return; }
      return finish();
    }
    setBusy(true);
    const ok = await verifyLockPassword(password);
    setBusy(false);
    if (ok) finish(); else setError('Wrong password.');
  };

  const turnOnFace = async () => {
    setBusy(true); setError('');
    try { await enableFaceId(); finish(); }
    catch { setError('Face ID could not be turned on here. Your password still works.'); }
    finally { setBusy(false); }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Lock className="size-5"/>{offerFace ? 'Use Face ID?' : setup ? 'Create a notes password' : 'Unlock notes'}</DialogTitle>
        <DialogDescription>{offerFace ? 'Unlock locked notes with Face ID or Touch ID on this device.' : setup ? 'This password locks notes on this device. It cannot be recovered if forgotten.' : 'Enter your notes password to view locked notes.'}</DialogDescription>
      </DialogHeader>
      {offerFace ? <div className="flex flex-col gap-2">
        <Button type="button" onClick={turnOnFace} disabled={busy}><ScanFace/>Turn on Face ID</Button>
        <Button type="button" variant="ghost" onClick={finish}>Not now</Button>
      </div> : <form onSubmit={submit} className="flex flex-col gap-3">
        <Input type="password" autoComplete={setup ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" aria-label="Password" autoFocus/>
        {setup && <Input type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" aria-label="Confirm password"/>}
        <Button type="submit" disabled={busy || !password}>{setup ? 'Save password' : 'Unlock'}</Button>
        {!setup && faceOn && <Button type="button" variant="outline" onClick={tryFace} disabled={busy}><ScanFace/>Use Face ID</Button>}
        {!setup && !faceOn && canFace && hasLockPassword() && <p className="text-xs text-muted-foreground">Unlock once with your password to turn on Face ID in the lock settings.</p>}
      </form>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </DialogContent>
  </Dialog>;
}
