import { withPayload } from "@payloadcms/next/withPayload";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  outputFileTracingIncludes: {
    // undici/ws are dynamically required by Payload runtime and aren't
    // captured by the standalone tracer; without them the payload routes
    // crash with MODULE_NOT_FOUND at runtime. Keys are normalized app paths
    // (route groups stripped, app/ prefix kept).
    "/app/graphql": ["./node_modules/undici/**/*", "./node_modules/ws/**/*"],
    "/app/graphql-playground": ["./node_modules/undici/**/*", "./node_modules/ws/**/*"],
    "/app/api": ["./node_modules/undici/**/*", "./node_modules/ws/**/*"],
    "/app/admin": ["./node_modules/undici/**/*", "./node_modules/ws/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default withPayload(config);
