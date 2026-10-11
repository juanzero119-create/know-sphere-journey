import { useCallback, useEffect, useRef, useState } from 'react';

export type PressDrag = { id: string; start: number; end: number; x: number; y: number };

const HOLD_MS = 350;
const MOVE_TOLERANCE = 10;

/**
 * Character offset inside `container` under a screen point, measured from the rendered
 * character boxes (works the same in every direction and ignores user-select locks).
 */
export function offsetAt(container: HTMLElement, rawX: number, rawY: number, _cover?: HTMLElement | null): number | null {
  const box = container.getBoundingClientRect();
  const x = Math.min(Math.max(rawX, box.left + 1), box.right - 1);
  const y = Math.min(Math.max(rawY, box.top + 1), box.bottom - 1);
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let base = 0;
  let best: { dy: number; dx: number; offset: number } | null = null;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const len = node.textContent?.length ?? 0;
    for (let i = 0; i < len; i++) {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
      const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
      const offset = base + (x > r.left + r.width / 2 ? i + 1 : i);
      if (!best || dy < best.dy || (dy === best.dy && dx < best.dx)) best = { dy, dx, offset };
    }
    base += len;
  }
  return best ? best.offset : null;
}


const lockNative = (on: boolean) => {
  document.documentElement.classList.toggle('press-highlighting', on);
};

/**
 * Press and hold on text to spawn a drag pill; dragging extends a highlight range.
 * Releasing calls onCommit with the covered range.
 */
export function usePressHighlight(onCommit: (id: string, start: number, end: number) => void) {
  const [drag, setDrag] = useState<PressDrag | null>(null);
  const dragRef = useRef<PressDrag | null>(null);
  const commitRef = useRef(onCommit);
  commitRef.current = onCommit;
  const pending = useRef<{ timer: number; x: number; y: number } | null>(null);
  const target = useRef<{ id: string; container: HTMLElement; cover?: HTMLElement | null | undefined; anchor: number } | null>(null);

  const set = (next: PressDrag | null) => { dragRef.current = next; setDrag(next); };
  const cancelPending = () => { if (pending.current) window.clearTimeout(pending.current.timer); pending.current = null; };
  const clearNative = () => {
    window.getSelection()?.removeAllRanges();
    const cover = target.current?.cover;
    if (cover instanceof HTMLTextAreaElement) cover.setSelectionRange(cover.selectionEnd, cover.selectionEnd);
  };

  const begin = useCallback((event: React.PointerEvent, id: string, container: HTMLElement | null, cover?: HTMLElement | null) => {
    if (!container || event.button > 0) return;
    cancelPending();
    const { clientX: x, clientY: y } = event;
    pending.current = {
      x, y,
      timer: window.setTimeout(() => {
        pending.current = null;
        const anchor = offsetAt(container, x, y, cover);
        if (anchor === null) return;
        target.current = { id, container, cover, anchor };
        clearNative();
        navigator.vibrate?.(10);
        lockNative(true);
        set({ id, start: anchor, end: anchor, x, y });
      }, HOLD_MS),
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastFocus: number | null = null;
    let latest = { x: 0, y: 0 };
    const apply = () => {
      frame = 0;
      const t = target.current;
      if (!t || !dragRef.current) return;
      const { x, y } = latest;
      const focus = offsetAt(t.container, x, y, t.cover) ?? lastFocus ?? t.anchor;
      lastFocus = focus;
      const s = Math.min(t.anchor, focus);
      const e = Math.max(t.anchor, focus);
      clearNative();
      const prev = dragRef.current;
      if (prev.start === s && prev.end === e && Math.abs(prev.x - x) < 1 && Math.abs(prev.y - y) < 1) return;
      set({ id: t.id, start: s, end: e, x, y });
    };
    const move = (x: number, y: number) => {
      if (pending.current && Math.hypot(x - pending.current.x, y - pending.current.y) > MOVE_TOLERANCE) cancelPending();
      if (!target.current || !dragRef.current) return;
      latest = { x, y };
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onPointerMove = (event: PointerEvent) => move(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      if (!dragRef.current) { const touch = event.touches[0]; if (touch && pending.current) move(touch.clientX, touch.clientY); return; }
      event.preventDefault(); // keep the page from scrolling or the phone from selecting while dragging the pill
      const touch = event.touches[0];
      if (touch) move(touch.clientX, touch.clientY);
    };
    const end = () => {
      cancelPending();
      if (frame) { cancelAnimationFrame(frame); frame = 0; if (dragRef.current) apply(); }
      lastFocus = null;
      lockNative(false);
      const current = dragRef.current;
      if (current) commitRef.current(current.id, current.start, current.end);
      if (current) clearNative();
      target.current = null;
      set(null);
    };
    const blockMenu = (event: Event) => { if (dragRef.current) event.preventDefault(); };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('pointerup', end);
    window.addEventListener('touchend', end);
    window.addEventListener('touchcancel', end);
    const blockStart = (event: Event) => { if (dragRef.current) event.preventDefault(); };
    document.addEventListener('selectstart', blockStart);
    window.addEventListener('pointercancel', () => { if (!dragRef.current) cancelPending(); });
    window.addEventListener('contextmenu', blockMenu);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('touchend', end);
      window.removeEventListener('touchcancel', end);
      document.removeEventListener('selectstart', blockStart);
      lockNative(false);
      window.removeEventListener('contextmenu', blockMenu);
      cancelPending();
    };
  }, []);

  return { drag, begin };
}
