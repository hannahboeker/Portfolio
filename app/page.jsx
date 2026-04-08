import SplitSlideshow from "@/components/SplitSlideshow";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <main style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <SplitSlideshow />
      <Navigation />
    </main>
  );
}
