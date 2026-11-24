// Which room's capacity tile has "docked" into the RoomNav bar: the index (in
// ROOM_PANELS) of the last tile that has scrolled up under the bar, or -1.
// RoomNav computes it on scroll; the tiles in the room panels subscribe so
// they can hand over to the bar's chip. Same pattern as headerStore.

let docked = -1;
const listeners = new Set<(index: number) => void>();

export function setRoomDocked(next: number) {
  if (next === docked) return;
  docked = next;
  listeners.forEach((l) => l(docked));
}

export function getRoomDocked(): number {
  return docked;
}

export function subscribeRoomDocked(listener: (index: number) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
