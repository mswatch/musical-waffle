import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * ScrollRevealBanner
 * Cinematic four-sided expansion reveal: image starts as a small centered
 * window inside a luxe gradient frame, then expands outward (top/right/bottom/left)
 * to fill the full container as the user scrolls.
 *
 * Performance: animates only a single clip-path + transform on one image.
 * Both properties are GPU-accelerated; we hint with `will-change`.
 * Respects prefers-reduced-motion by snapping straight to revealed state.
 */
export default function ScrollRevealBanner({
  image = "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=2000&q=85",
  alt = "Watches by M.S Campaign",
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.25"],
  });

  // Four-sided expansion — start as a small centered rectangle, end fully open.
  // Mobile gets a slightly less aggressive inset to keep the card visible on small screens.
  const insetY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, 0]);
  const insetX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [22, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], reduce ? [28, 28] : [20, 28]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.06, 1]);

  const clipPath = useTransform(
    [insetY, insetX, radius],
    ([y, x, r]) => `inset(${y}% ${x}% ${y}% ${x}% round ${r}px)`
  );

  return (
    <section
      ref={ref}
      data-testid="scroll-reveal-banner"
      className="mt-10 md:mt-16 px-3 md:px-8"
    >
      <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] aspect-[4/5] sm:aspect-[16/10] md:aspect-[16/8] luxe-gradient">
        {/* faint inner frame to echo the reference's empty surround */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 50%, transparent 30%, color-mix(in srgb, var(--bg) 25%, transparent) 100%)",
          }}
        />

        <motion.img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ clipPath, scale }}
        />

        {/* bottom contrast wash for legibility */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <div className="absolute left-6 md:left-12 bottom-6 md:bottom-12 right-6 md:right-12 flex items-end justify-between gap-6 pointer-events-none">
          <motion.div style={{ opacity: scrollYProgress }} className="pointer-events-auto">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/85 mb-2 md:mb-3">
              The Campaign
            </p>
            <h2 className="font-display text-white text-3xl sm:text-4xl md:text-6xl leading-[0.95] max-w-2xl">
              Upgrade<br className="sm:hidden" />
              <span className="opacity-90"> your wrist game.</span>
            </h2>
          </motion.div>
          <a
            href="/collections/luxury"
            data-testid="scroll-reveal-cta"
            className="pointer-events-auto hidden sm:inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-sm font-medium tracking-wide hover:bg-white/90 transition"
          >
            Shop Now
          </a>
        </div>
      </div>

      <a
        href="/collections/luxury"
        className="sm:hidden mt-4 inline-flex items-center justify-center w-full px-6 py-3.5 rounded-full text-sm font-medium"
        data-testid="scroll-reveal-cta-mobile"
        style={{ background: "var(--text)", color: "var(--bg)" }}
      >
        Shop the Campaign
      </a>
    </section>
  );
}
