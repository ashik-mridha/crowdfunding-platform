"use client";

import { useState } from "react";
import Link from "next/link";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useReducedMotion } from "framer-motion";
import { buttonVariants } from "@heroui/react";
import { Pause, Play } from "lucide-react";
import { HERO_SLIDES } from "@/lib/homeContent";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function Hero() {
  const reduce = useReducedMotion();
  const [swiper, setSwiper] = useState(null);
  const [playing, setPlaying] = useState(true);

  function togglePlay() {
    if (!swiper) return;
    if (playing) swiper.autoplay.stop();
    else swiper.autoplay.start();
    setPlaying(!playing);
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured messages"
      className="hero-swiper relative bg-navy"
    >
      <Swiper
        key={String(Boolean(reduce))}
        modules={[Autoplay, Navigation, Pagination, A11y]}
        onSwiper={setSwiper}
        loop
        speed={700}
        autoplay={reduce ? false : { delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation
        a11y={{
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          paginationBulletMessage: "Go to slide {{index}}",
        }}
        className="h-[560px] sm:h-[600px] lg:h-[640px]"
      >
        {HERO_SLIDES.map((s, i) => (
          <SwiperSlide key={s.id}>
            <div className="relative flex h-full items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt=""
                className="absolute inset-0 size-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/20"
                aria-hidden="true"
              />
              <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 sm:px-14">
                <div className="max-w-2xl space-y-5 text-white">
                  <p className="text-sm font-semibold uppercase tracking-widest text-accent">{s.eyebrow}</p>
                  <h2 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                    {s.title}
                  </h2>
                  <p className="max-w-xl text-base text-white/85 sm:text-lg">{s.subtitle}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      href={s.cta.href}
                      className={`${buttonVariants({ variant: "primary", size: "lg" })} min-h-12`}
                    >
                      {s.cta.label}
                    </Link>
                    <a
                      href={s.secondary.href}
                      className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-6 text-base font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {s.secondary.label}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause slideshow" : "Play slideshow"}
        className="absolute bottom-4 right-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {playing ? (
          <Pause className="size-5" aria-hidden="true" />
        ) : (
          <Play className="size-5" aria-hidden="true" />
        )}
      </button>
    </section>
  );
}
