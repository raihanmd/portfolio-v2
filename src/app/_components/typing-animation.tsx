"use client";

import { ReactTyped } from "react-typed";

export default function TypingAnimation() {
  return (
    <h1 className="flex flex-col text-3xl font-semibold sm:flex-row sm:gap-2">
      Hey buddy, I&apos;m
      <ReactTyped
        strings={["Raihanmd.", "Software Engineer.", "IT Enthusiast."]}
        typeSpeed={80}
        backSpeed={30}
        backDelay={1500}
        className="transition-none"
        cursorChar="_"
        smartBackspace
        loop
      />
    </h1>
  );
}
