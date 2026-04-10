"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styled from "styled-components";

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

const isVideo = (src) => /\.(mp4|webm|ogg)$/i.test(src);

// Wrapper: Desktop = Zeile, Mobile = Spalte. Immer genau 100vh hoch.
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: calc(100vh - 2.5em);
  cursor: pointer;
  background: #8ef2ff;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const Panel = styled.div`
  flex: 1 1 50%;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;

  @media (max-width: 768px) {
    flex: 1 1 50%;
    width: 100%;
  }
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: left top;
  display: block;
  pointer-events: none;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: left top;
  display: block;
  pointer-events: none;
`;

function MediaItem({ src, onPlay, onEnded, videoRef, priority = false }) {
  useEffect(() => {
    if (isVideo(src) && videoRef?.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [src, videoRef]);

  if (isVideo(src)) {
    return (
      <StyledVideo
        ref={videoRef}
        src={src}
        onPlay={onPlay}
        onEnded={onEnded}
        autoPlay
        muted
        playsInline
        preload="auto"
      />
    );
  }

  return (
    <StyledImage
      src={src}
      alt=""
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}

export default function SplitSlideshow() {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  const nextAutoSide = useRef("left");
  const timerRef = useRef(null);
  const videoPlayingRef = useRef({ left: false, right: false });
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);

  const advanceSide = (side) => {
    if (side === "left") {
      setLeftIndex((p) => (p + 1) % leftImages.length);
    } else {
      setRightIndex((p) => (p + 1) % rightImages.length);
    }
  };

  const scheduleNext = (side) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      advanceSide(side);
      nextAutoSide.current = side === "left" ? "right" : "left";
      scheduleNext(nextAutoSide.current);
    }, 3000);
  };

  useEffect(() => {
    scheduleNext("left");
    return () => clearTimeout(timerRef.current);
  }, []);

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

  const handleVideoStart = (side) => {
    videoPlayingRef.current[side] = true;
    clearTimeout(timerRef.current);
  };

  const handleVideoEnd = (side) => {
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
    <Wrapper onClick={handleClick}>
      <Panel style={{ position: "relative" }}>
        <MediaItem
          src={leftImages[leftIndex]}
          videoRef={leftVideoRef}
          onPlay={() => handleVideoStart("left")}
          onEnded={() => handleVideoEnd("left")}
          priority={leftIndex === 0}
        />
      </Panel>
      <Panel style={{ position: "relative" }}>
        <MediaItem
          src={rightImages[rightIndex]}
          videoRef={rightVideoRef}
          onPlay={() => handleVideoStart("right")}
          onEnded={() => handleVideoEnd("right")}
          priority={rightIndex === 0}
        />
      </Panel>
    </Wrapper>
  );
}
