import { useCallback, useEffect, useRef, useState } from 'react';

export type PressDrag = { id: string; start: number; end: number; x: number; y: number };

const HOLD_MS = 350;
const MOVE_TOLERANCE = 10;

/** Character offset inside `container` under a screen point. `cover` is an element on top that must be ignored. */
function offsetAt(container: HTMLElement, rawX: number, rawY: number, cover?: HTMLElement | null): number | null {
  // Keep the finger inside the text box so sliding past an edge sticks to the nearest line instead of jumping.
  const box = container.getBoundingClientRect();
  const x = Math.min(Math.max(rawX, box.left + 2), box.right - 2);
  const y = Math.min(Math.max(rawY, box.top + 2), box.bottom - 2);
  const prevCover = cover?.style.pointerEvents;
  const prevContainer = container.style.pointerEvents;
  if (cover) cover.style.pointerEvents = 'none';
  container.style.pointerEvents = 'auto';
  let node: Node | null = null;
  let offset = 0;
  try {
    const doc = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null };
    if (doc.caretPositionFromPoint) {
      const pos = doc.caretPositionFromPoint(x, y);
      if (pos) { node = pos.offsetNode; offset = pos.offset; }
    } else if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(x, y);
      if (range) { node = range.startContainer; offset = range.startOffset; }
    }
  } finally {
    if (cover) cover.style.pointerEvents = prevCover ?? '';
    container.style.pointerEvents = prevContainer;
  }
  if (!node || !container.contains(node)) return null;
  if (node === container && offset >= container.childNodes.length) return (container.textContent ?? '').length;
  const prefix = document.createRange();
  prefix.selectNodeContents(container);
  prefix.setEnd(node, offset);
  return prefix.toString().length;
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
      const [s, e] = snapToWords(t.container.textContent ?? '', Math.min(t.anchor, focus), Math.max(t.anchor, focus));
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
      if (current && current.end > current.start) commitRef.current(current.id, current.start, current.end);
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
