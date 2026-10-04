export function getYouTubeVideoId(value: string): string | null {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    let id: string | undefined;

    if (host === "youtu.be" || host === "www.youtu.be") {
      id = url.pathname.split("/")[1];
    } else if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com" ||
      host === "www.youtube-nocookie.com"
    ) {
      id = url.pathname.startsWith("/embed/")
        ? url.pathname.split("/")[2]
        : url.pathname.startsWith("/shorts/")
          ? url.pathname.split("/")[2]
          : url.searchParams.get("v") ?? undefined;
    }

    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
