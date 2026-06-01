"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import StickerPeel from "./StickerPeel";

// Background slideshow. Drop the matching files in /public.
// Sanity-managed gallery can replace this list in a later iteration.
const SLIDES = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"];
const SLIDE_INTERVAL = 6000;

export default function Hero() {
  const t = useTranslations("hero");
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || SLIDES.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  // Scroll-linked parallax / scale / fade for the photo layer. Maps the
  // first viewport-height of scroll onto a gentle y / scale / opacity
  // shift so the hero feels alive as the user moves down the page.
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(0);
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const heroY = useTransform(scrollY, [0, vh || 800], [0, -(vh || 800) * 0.35]);
  const heroScale = useTransform(scrollY, [0, vh || 800], [1, 1.12]);
  const heroOpacity = useTransform(scrollY, [0, vh || 800], [1, 0.55]);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        aria-hidden
        style={
          reduceMotion
            ? undefined
            : { y: heroY, scale: heroScale, opacity: heroOpacity }
        }
      >
        {SLIDES.map((src, i) => (
          <motion.div
            key={src}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />

      {/* Peelable AP monogram sticker — sits over the hero photos but
          outside the parallax wrapper so it stays put while the photos
          drift. Draggable within the hero section bounds. */}
      <StickerPeel
        imageSrc="/logo.png"
        width={170}
        rotate={-12}
        peelBackHoverPct={25}
        peelBackActivePct={45}
        shadowIntensity={0.5}
        lightingIntensity={0.15}
        initialPosition={{ x: 60, y: 140 }}
        className="z-20"
      />

      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        {SLIDES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${t("scrollHint")} ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index
                ? "w-8 bg-paper"
                : "w-1.5 bg-paper/50 hover:bg-paper/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
