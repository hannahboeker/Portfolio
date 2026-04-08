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

// Styled Components
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  cursor: pointer;
  padding-bottom: 2.5em;
  background: #8ef2ff;

  /* Mobile only */
  @media (max-width: 768px) {
    flex-direction: column;
    height: calc(100vh - 2.5em); /* Höhe bis Navigation */
  }
`;

const Panel = styled.div`
  width: 50vw;
  display: flex;
  align-items: flex-start;

  /* Mobile only */
  @media (max-width: 768px) {
    width: 100vw;
    justify-content: flex-start; /* linksbündig */
    align-items: flex-start; /* oben ausrichten */
  }
`;

const MediaWrapper = styled.div`
  width: 100%;
  height: auto;

  /* Mobile only */
  @media (max-width: 768px) {
    height: 100%;
    width: auto;
  }

  img,
  video {
    width: 100%;
    height: auto;
    display: block;
    pointer-events: none;
    object-fit: contain;

    /* Mobile only */
    @media (max-width: 768px) {
      height: 100%;
      width: auto;
      max-height: 100%;
      max-width: 100%;
    }
  }
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
      <MediaWrapper>
        <video
          ref={videoRef}
          src={src}
          onPlay={onPlay}
          onEnded={onEnded}
          autoPlay
          muted
          playsInline
          preload="auto"
        />
      </MediaWrapper>
    );
  }

  return (
    <MediaWrapper>
      <Image
        src={src}
        alt=""
        width={1200}
        height={1600}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
    </MediaWrapper>
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
      <Panel>
        <MediaItem
          src={leftImages[leftIndex]}
          videoRef={leftVideoRef}
          onPlay={() => handleVideoStart("left")}
          onEnded={() => handleVideoEnd("left")}
          priority={leftIndex === 0}
        />
      </Panel>
      <Panel>
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
