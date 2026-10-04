"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

import type { IProjectMedia } from "~/types";

interface ProjectMediaCarouselProps {
  media: IProjectMedia[];
  title: string;
  size?: "card" | "modal";
}

export default function ProjectMediaCarousel({
  media,
  title,
  size = "card",
}: ProjectMediaCarouselProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  if (media.length === 0) return null;

  const slideClass = size === "card" ? "h-40" : "h-64 sm:h-96";
  const stopVideos = (swiper: SwiperInstance) => {
    swiper.el.querySelectorAll("video").forEach((video) => video.pause());
    setPlayingIndex(null);
  };

  return (
    <div
      className="project-swiper relative overflow-hidden bg-muted"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Swiper
        modules={[Pagination, A11y]}
        pagination={media.length > 1 ? { clickable: true } : false}
        onSlideChange={stopVideos}
        a11y={{ containerMessage: `${title} media gallery` }}
        className="w-full"
      >
        {media.map((item, index) => (
          <SwiperSlide key={`${item.src}-${index}`}>
            <div className={`relative w-full ${slideClass}`}>
              {item.type === "image" && (
                <Image
                  fill
                  sizes={size === "card" ? "(max-width: 640px) 100vw, 350px" : "(max-width: 768px) 100vw, 768px"}
                  src={item.src}
                  alt={item.alt}
                  className="object-cover"
                />
              )}
              {item.type === "video" && (
                <video
                  src={item.src}
                  controls
                  preload="none"
                  playsInline
                  aria-label={item.alt}
                  className="h-full w-full bg-black object-contain"
                />
              )}
              {item.type === "youtube" &&
                (playingIndex === index ? (
                  <iframe
                    src={item.src}
                    title={item.alt}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlayingIndex(index)}
                    className="group relative flex h-full w-full items-center justify-center bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`Play ${title} video`}
                  >
                    {item.poster && (
                      <Image
                        fill
                        sizes={size === "card" ? "(max-width: 640px) 100vw, 350px" : "(max-width: 768px) 100vw, 768px"}
                        src={item.poster}
                        alt=""
                        className="object-cover opacity-75 transition-opacity group-hover:opacity-90"
                      />
                    )}
                    <span className="relative rounded-full bg-background/80 p-3 text-foreground shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
                      <Play className="size-5 fill-current" />
                    </span>
                  </button>
                ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
