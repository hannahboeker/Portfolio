"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styled from "styled-components";

// ── Desktop ──────────────────────────────────────────────────────
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

// ── Mobile ───────────────────────────────────────────────────────
const mobileLeftImages = [
  "/images/mobile/InKontakt4_mobile.jpg", // editorial
  "/images/mobile/HaFra_plant-like_object_shaped_like_a_pilea_made_entirely_of_ra_91fa44f4-897c-483c-9aca-c0563029d14b_mobile.jpg", // KI
  "/images/mobile/Wohnheim-innen2_mobile.jpg", // architektur
  "/images/mobile/230721_HB_PF-6827-Edit-MOCKUP-CARBON_mobile.jpg", // mockup foto
  "/images/mobile/shirt-illu.jpg", // illustration
  "/images/mobile/230721_HB_PF-6861_mobile.jpg", // porträt
  "/images/2602-TAR-Animation-2 (konvertiert).aep.mp4", // video
  "/images/mobile/A4_Karten.jpg", // grafik
  "/images/mobile/HaFra_A_distant_goat_with_surreal_intensely_bright_green_fur_pa_8e61d197-be7d-424e-9561-8c807cf0b41b_mobile.jpg", // KI
  "/images/mobile/230721_HB_PF-6789-EXTRAHINTERGRUND-2_mobile.jpg", // foto
  "/images/mobile/InKontakt-1_mobile.jpg", // editorial
  "/images/mobile/230721_HB_PF-7054-v2_mobile.jpg", // porträt
  "/images/mobile/Wohnheim-innen3_mobile.jpg", // architektur
  "/images/mobile/240727-illu-insta3_mobile.jpg", // illustration
  "/images/mobile/pic_2021-06-02_170121_mobile.jpg", // foto
  "/images/mobile/Unbenanntes_Projekt-11_mobile.jpg", // grafik
  "/images/mobile/230721_HB_PF-6937_mobile.jpg", // porträt
  "/images/mobile/IMG_6609_mobile.jpg", // foto
  "/images/mobile/pic_2022-01-21_145936_mobile.jpg", // foto
];

const mobileRightImages = [
  "/images/mobile/A4_Brochure_Mockup_7_mobile.jpg", // mockup
  "/images/250316-Illu-insta.mp4", // video
  "/images/mobile/221212_Böker2554_mobile.jpg", // editorial foto
  "/images/mobile/HaFra_plant-like_object_shaped_like_a_pilea_made_entirely_of_ra_afb44ae2-1962-4b59-972a-3e5bb184976c_mobile.jpg", // KI
  "/images/mobile/Litfassaule_mobile.jpg", // street/poster
  "/images/HaFra_plant-like_object_shaped_like_a_pilea_made_entirely_of_ra_7c69855d-2a23-4a13-ade7-956c69873a24.mp4", // KI video
  "/images/mobile/Ei-Lampe_mobile.jpg", // objekt
  "/images/mobile/Posters_on_Fence_Mockup_1_mobile.jpg", // mockup
  "/images/mobile/230721_HB_PF-6980_mobile.jpg", // porträt
  "/images/mobile/IMG_6603_mobile.jpg", // foto
  "/images/HansNeuburg_Digitorial_1.mp4", // video editorial
  "/images/Komp 1.mp4", // video
  "/images/mobile/221212_Böker2562-11.14.41_mobile.jpg", // editorial foto
  "/images/mobile/230721_HB_PF-6846-Edit_mobile.jpg", // foto
  "/images/mobile/A4_Brochure_Mockup_6_mobile.jpg", // mockup
  "/images/mobile/pic_2022-01-21_150339_mobile.jpg", // foto
  "/images/mobile/pic_2021-06-02_170712_mobile.jpg", // foto
  "/images/mobile/230721_HB_PF-7091_mobile.jpg", // porträt
  "/images/mobile/pic_2021-06-02_170919_mobile.jpg", // foto
  "/images/mobile/230721_HB_PF-6817-v2_mobile.jpg", // porträt
  "/images/mobile/IMG_6621_mobile.jpg", // foto
];

const isVideo = (src) => /\.(mp4|webm|ogg)$/i.test(src);

// Wrapper: Desktop = Zeile, Mobile = Spalte. Immer genau 100vh hoch.
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100vh - 2.5em);
  cursor: pointer;
  background: #ffffff;
  overflow: hidden;

  @media (max-width: 768px) {
    position: relative;
    height: calc(100dvh - 2.5em);
  }
`;

const Panel = styled.div`
  flex: 1 1 50%;
  min-width: 0;
  min-height: 0;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;

  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    right: 0;
    display: block;
    overflow: hidden;
    transition:
      height 0.25s ease,
      top 0.25s ease;

    &:first-child {
      top: 0;
      height: calc(50% + 1px);
    }

    &:last-child {
      bottom: 0;
      height: calc(50% + 1px);
    }
  }
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: ${({ $pos }) => $pos || "left top"};
  display: block;
  pointer-events: none;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: ${({ $pos }) => $pos || "left top"};
  display: block;
  pointer-events: none;
`;

function MediaItem({
  src,
  onPlay,
  onEnded,
  videoRef,
  priority = false,
  isMobile = false,
  mobileContain = false,
  objectPos = "left top",
  onNaturalDims,
}) {
  useEffect(() => {
    if (isVideo(src) && videoRef?.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [src, videoRef]);

  if (isVideo(src)) {
    const videoStyle = isMobile
      ? {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: mobileContain ? "contain" : "cover",
          objectPosition: objectPos,
          display: "block",
          pointerEvents: "none",
        }
      : {};
    return (
      <StyledVideo
        ref={videoRef}
        src={src}
        onPlay={onPlay}
        onEnded={onEnded}
        onLoadedMetadata={
          isMobile && onNaturalDims
            ? (e) =>
                onNaturalDims({
                  w: e.target.videoWidth,
                  h: e.target.videoHeight,
                })
            : undefined
        }
        autoPlay
        muted
        playsInline
        preload="auto"
        style={videoStyle}
      />
    );
  }

  if (isMobile) {
    return (
      <img
        src={src}
        alt=""
        onLoad={
          onNaturalDims
            ? (e) =>
                onNaturalDims({
                  w: e.target.naturalWidth,
                  h: e.target.naturalHeight,
                })
            : undefined
        }
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: mobileContain ? "contain" : "cover",
          objectPosition: objectPos,
          display: "block",
          pointerEvents: "none",
        }}
      />
    );
  }

  return <StyledImage src={src} alt="" fill priority={priority} sizes="50vw" />;
}

export default function SplitSlideshow() {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeLeft = isMobile ? mobileLeftImages : leftImages;
  const activeRight = isMobile ? mobileRightImages : rightImages;

  const nextAutoSide = useRef("left");
  const timerRef = useRef(null);
  const videoPlayingRef = useRef({ left: false, right: false });
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);

  const wrapperRef = useRef(null);
  const upperDimsRef = useRef(null);
  const [splitY, setSplitY] = useState(null);

  const recalcSplit = useCallback(() => {
    if (!wrapperRef.current || !upperDimsRef.current || !isMobile) return;
    const { w, h } = upperDimsRef.current;
    if (!w || !h) return;
    const ww = wrapperRef.current.offsetWidth;
    const wh = wrapperRef.current.offsetHeight;
    const displayedH = ww * (h / w);
    if (displayedH >= wh / 2) {
      // Hochformat/quadratisch: füllt das 50%-Panel vollständig → kein Gap, CSS-Default reicht
      setSplitY(null);
    } else {
      setSplitY(Math.round(displayedH));
    }
  }, [isMobile]);

  const handleUpperNaturalDims = useCallback(
    ({ w, h }) => {
      upperDimsRef.current = { w, h };
      recalcSplit();
    },
    [recalcSplit],
  );

  useEffect(() => {
    if (!isMobile) return;
    window.addEventListener("resize", recalcSplit);
    return () => window.removeEventListener("resize", recalcSplit);
  }, [isMobile, recalcSplit]);

  const advanceSide = (side) => {
    if (side === "left") {
      setLeftIndex((p) => (p + 1) % activeLeft.length);
    } else {
      setRightIndex((p) => (p + 1) % activeRight.length);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const preloadedVideos = useRef({});
  const preloadedDims = useRef({});

  // Alles beim Startup vorladen — danach kommt alles aus dem Cache
  useEffect(() => {
    const all = [...activeLeft, ...activeRight];
    all.forEach((src) => {
      if (isVideo(src)) {
        // fetch() füllt den HTTP-Cache zuverlässiger als video.load() —
        // besonders auf iOS wo preload="auto" oft ignoriert wird
        if (!preloadedVideos.current[src]) {
          preloadedVideos.current[src] = true;
          // Separates metadata-Element um Seitenverhältnis vorab zu kennen
          const meta = document.createElement("video");
          meta.preload = "metadata";
          meta.muted = true;
          meta.playsInline = true;
          meta.onloadedmetadata = () => {
            if (meta.videoWidth && meta.videoHeight) {
              preloadedDims.current[src] = {
                w: meta.videoWidth,
                h: meta.videoHeight,
              };
            }
          };
          meta.src = src;
          fetch(src, { cache: "force-cache" }).catch(() => {
            const v = document.createElement("video");
            v.preload = "auto";
            v.muted = true;
            v.playsInline = true;
            v.src = src;
            v.load();
          });
        }
      } else {
        if (!preloadedDims.current[src]) {
          const img = new window.Image();
          img.onload = () => {
            preloadedDims.current[src] = {
              w: img.naturalWidth,
              h: img.naturalHeight,
            };
          };
          img.src = src;
        }
      }
    });
  }, [activeLeft, activeRight]);

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

  const safeLeftIndex = leftIndex % activeLeft.length;
  const safeRightIndex = rightIndex % activeRight.length;

  // splitY aus vorgeladenem Cache setzen wenn das Bild wechselt
  useEffect(() => {
    if (!isMobile || !wrapperRef.current) return;
    const dims = preloadedDims.current[activeLeft[safeLeftIndex]];
    if (!dims) return;
    upperDimsRef.current = dims;
    const { w, h } = dims;
    if (!w || !h) return;
    const ww = wrapperRef.current.offsetWidth;
    const wh = wrapperRef.current.offsetHeight;
    const displayedH = ww * (h / w);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSplitY(displayedH >= wh / 2 ? null : Math.round(displayedH));
  }, [safeLeftIndex, isMobile, activeLeft]);

  const effectiveSplitY = isMobile ? splitY : null;
  const upperPanelStyle =
    effectiveSplitY !== null ? { height: `${effectiveSplitY}px` } : {};
  const lowerPanelStyle =
    effectiveSplitY !== null
      ? {
          top: `${effectiveSplitY}px`,
          bottom: "auto",
          height: `calc(100% - ${effectiveSplitY}px)`,
        }
      : {};

  return (
    <Wrapper ref={wrapperRef} onClick={handleClick}>
      <Panel style={upperPanelStyle}>
        <MediaItem
          src={activeLeft[safeLeftIndex]}
          videoRef={leftVideoRef}
          onPlay={() => handleVideoStart("left")}
          onEnded={() => handleVideoEnd("left")}
          priority={safeLeftIndex === 0}
          isMobile={isMobile}
          mobileContain
          onNaturalDims={isMobile ? handleUpperNaturalDims : undefined}
        />
      </Panel>
      <Panel style={lowerPanelStyle}>
        <MediaItem
          src={activeRight[safeRightIndex]}
          videoRef={rightVideoRef}
          onPlay={() => handleVideoStart("right")}
          onEnded={() => handleVideoEnd("right")}
          priority={safeRightIndex === 0}
          isMobile={isMobile}
          mobileContain
        />
      </Panel>
    </Wrapper>
  );
}
