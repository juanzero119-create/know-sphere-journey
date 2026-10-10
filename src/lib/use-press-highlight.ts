import { useCallback, useEffect, useRef, useState } from 'react';

export type PressDrag = { id: string; start: number; end: number; x: number; y: number };

const HOLD_MS = 350;
const MOVE_TOLERANCE = 10;

/** Character offset inside `container` under a screen point. `cover` is an element on top that must be ignored. */
function offsetAt(container: HTMLElement, x: number, y: number, cover?: HTMLElement | null): number | null {
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
  const prefix = document.createRange();
  prefix.selectNodeContents(container);
  prefix.setEnd(node, offset);
  return prefix.toString().length;
}

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
  const target = useRef<{ id: string; container: HTMLElement; cover?: HTMLElement | null; anchor: number } | null>(null);

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
        set({ id, start: anchor, end: anchor, x, y });
      }, HOLD_MS),
    };
  }, []);

  useEffect(() => {
    const move = (x: number, y: number) => {
      if (pending.current && Math.hypot(x - pending.current.x, y - pending.current.y) > MOVE_TOLERANCE) cancelPending();
      const t = target.current;
      if (!t || !dragRef.current) return;
      const focus = offsetAt(t.container, x, y, t.cover) ?? (dragRef.current.end === t.anchor ? dragRef.current.start : dragRef.current.end);
      clearNative();
      set({ id: t.id, start: Math.min(t.anchor, focus), end: Math.max(t.anchor, focus), x, y });
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
    window.addEventListener('pointercancel', () => { if (!dragRef.current) cancelPending(); });
    window.addEventListener('contextmenu', blockMenu);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('touchend', end);
      window.removeEventListener('contextmenu', blockMenu);
      cancelPending();
    };
  }, []);

  return { drag, begin };
}
