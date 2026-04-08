"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const leftImages = [
  "/images/InKontakt4.png",
  "/images/230721_HB_PF-7091.jpg",
  "/images/Unbenanntes_Projekt-11.jpg",
  "/images/HaFra_plant-like_object_shaped_like_a_pilea_made_entirely_of_ra_91fa44f4-897c-483c-9aca-c0563029d14b.jpg",
  "/images/230721_HB_PF-6827-Edit-MOCKUP-CARBON.jpg",
  "/images/HansNeuburg_Digitorial_1.mp4",
  "/images/230721_HB_PF-6817-v2.jpg",
  "/images/InKontakt-1.jpg",
  "/images/240727-illu-insta3.png",
  "/images/HaFra_A_distant_goat_with_surreal_intensely_bright_green_fur_pa_8e61d197-be7d-424e-9561-8c807cf0b41b.jpg",
  "/images/pic_2021-06-02_170121.jpg",
  "/images/Wohnheim-innen2.png",
  "/images/IMG_6609.png",
  "/images/230721_HB_PF-7054-v2.jpg",
  "/images/Unbenanntes_Projekt-11.jpg",
  "/images/pic_2022-01-21_145936.png",
];

const rightImages = [
  "/images/2602-TAR-Animation-2 (konvertiert).aep.mp4",
  "/images/221212_Böker2554.jpg",
  "/images/Litfassaule.jpg",
  "/images/230721_HB_PF-6846-Edit.jpg",
  "/images/230721_HB_PF-6980.jpg",
  "/images/pic_2022-01-21_150339.png",
  "/images/HaFra_plant-like_object_shaped_like_a_pilea_made_entirely_of_ra_afb44ae2-1962-4b59-972a-3e5bb184976c.jpg",
  "/images/20250412132714.gif",
  "/images/A4_Brochure_Mockup_7.png",
  "/images/IMG_6603.png",
  "/images/Ei-Lampe.png",
  "/images/Posters_on_Fence_Mockup_1.jpg",
  "/images/230721_HB_PF-6861.jpg",
  "/images/pic_2021-06-02_170919.jpg",
  "/images/230721_HB_PF-6789-EXTRAHINTERGRUND-2.jpg",
  "/images/250316-Illu-insta.mp4",
];

const isVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);

function MediaItem({
  src,
  onPlay,
  onEnded,
  videoRef,
  priority = false,
}: {
  src: string;
  onPlay: () => void;
  onEnded: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  priority?: boolean;
}) {
  useEffect(() => {
    if (isVideo(src) && videoRef?.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [src]);

  if (isVideo(src)) {
    return (
      <video
        ref={videoRef}
        src={src}
        onPlay={onPlay}
        onEnded={onEnded}
        autoPlay
        muted
        playsInline
        preload="auto"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Image
        src={src}
        alt=""
        width={1200}
        height={1600}
        priority={priority}
        sizes="50vw"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function SplitSlideshow() {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  const nextAutoSide = useRef<"left" | "right">("left");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoPlayingRef = useRef({ left: false, right: false });
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);

  const advanceSide = (side: "left" | "right") => {
    if (side === "left") {
      setLeftIndex((p) => (p + 1) % leftImages.length);
    } else {
      setRightIndex((p) => (p + 1) % rightImages.length);
    }
  };

  const scheduleNext = (side: "left" | "right") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      advanceSide(side);
      nextAutoSide.current = side === "left" ? "right" : "left";
      scheduleNext(nextAutoSide.current);
    }, 3000);
  };

  useEffect(() => {
    scheduleNext("left");
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Nächstes Bild vorausladen
  useEffect(() => {
    const nextLeft = (leftIndex + 1) % leftImages.length;
    const nextRight = (rightIndex + 1) % rightImages.length;
    if (!isVideo(leftImages[nextLeft])) {
      const img = new window.Image();
      img.src = leftImages[nextLeft];
    }
    if (!isVideo(rightImages[nextRight])) {
      const img = new window.Image();
      img.src = rightImages[nextRight];
    }
  }, [leftIndex, rightIndex]);

  const handleVideoStart = (side: "left" | "right") => {
    videoPlayingRef.current[side] = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleVideoEnd = (side: "left" | "right") => {
    videoPlayingRef.current[side] = false;
    advanceSide(side);
    nextAutoSide.current = side === "left" ? "right" : "left";
    scheduleNext(nextAutoSide.current);
  };

  const handleClick = () => {
    const side = nextAutoSide.current;
    if (videoPlayingRef.current[side]) {
      const ref = side === "left" ? leftVideoRef : rightVideoRef;
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
      videoPlayingRef.current[side] = false;
    }
    advanceSide(side);
    nextAutoSide.current = side === "left" ? "right" : "left";
    scheduleNext(nextAutoSide.current);
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; min-height: 100vh; overflow-x: hidden; background: #bdf7b2; }
        .split-wrapper { display: flex; width: 100%; min-height: 100vh; cursor: pointer; }
        .panel { width: 50vw; }
        @media (max-width: 375px) {
          .split-wrapper { flex-direction: column; min-height: unset; }
          .panel { width: 100vw; }
        }
      `}</style>

      <div className="split-wrapper" onClick={handleClick}>
        <div className="panel">
          <MediaItem
            src={leftImages[leftIndex]}
            videoRef={leftVideoRef}
            onPlay={() => handleVideoStart("left")}
            onEnded={() => handleVideoEnd("left")}
            priority={leftIndex === 0}
          />
        </div>
        <div className="panel">
          <MediaItem
            src={rightImages[rightIndex]}
            videoRef={rightVideoRef}
            onPlay={() => handleVideoStart("right")}
            onEnded={() => handleVideoEnd("right")}
            priority={rightIndex === 0}
          />
        </div>
      </div>
    </>
  );
}
