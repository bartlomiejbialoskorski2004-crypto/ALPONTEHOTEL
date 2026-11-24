import { listPhotos } from "@/lib/photos";
import TripleDeluxeClient from "./TripleDeluxeClient";

export default function TripleDeluxe() {
  const photos = listPhotos("triple-deluxe");
  return <TripleDeluxeClient photos={photos} />;
}
