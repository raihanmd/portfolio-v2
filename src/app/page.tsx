import { Spotlight } from "./_components/ui/spotlight";
import { TypewriterEffect } from "./_components/ui/typewriter-effect";

export default function page() {
  const words = [
    {
      text: "Hello",
    },
    {
      text: "buddy,",
    },
    {
      text: "I'm",
    },
    {
      text: "Raihanmd.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative flex h-screen w-full overflow-hidden bg-background/[0.96] pt-32 antialiased">
      <Spotlight />
      <div className="mx-auto w-full max-w-6xl">
        <TypewriterEffect words={words} />
      </div>
    </div>
  );
}
