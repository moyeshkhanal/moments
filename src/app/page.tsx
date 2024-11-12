import PolaroidCamera from "@/components/Polaroid/PolaroidCamera";
import PolaroidGallery from "@/components/Polaroid/PolaroidGallery";

export default function Home() {
  return (
    <div>
    <PolaroidCamera albumName="test" />
    <PolaroidGallery albumName="test"/>
    </div>
  );
}
