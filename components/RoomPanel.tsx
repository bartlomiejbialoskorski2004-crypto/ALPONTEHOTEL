import { listPhotos } from "@/lib/photos";
import RoomPanelClient from "./RoomPanelClient";
import type { RoomDetail } from "./roomData";

export default function RoomPanel({
  id,
  folder,
  categoryKey,
  ns,
  amenities,
  features,
}: RoomDetail) {
  const photos = listPhotos(folder);
  return (
    <RoomPanelClient
      id={id}
      photos={photos}
      categoryKey={categoryKey}
      ns={ns}
      amenities={amenities}
      features={features}
    />
  );
}
