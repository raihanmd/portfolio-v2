import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import {
  BlocksFeature,
  CodeBlock,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Experiences } from "./src/collections/experiences";
import { ProjectMedia } from "./src/collections/project-media";
import { Projects } from "./src/collections/projects";
import { Tils } from "./src/collections/tils";
import { Users } from "./src/collections/users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const s3 = {
  endpoint: process.env.SUPABASE_S3_ENDPOINT,
  region: process.env.SUPABASE_S3_REGION,
  bucket: process.env.SUPABASE_S3_BUCKET,
  accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
  publicURL: process.env.SUPABASE_STORAGE_PUBLIC_URL,
};
const s3Enabled = Object.values(s3).every((value) => Boolean(value));
const publicMediaURL = s3.publicURL?.replace(/\/$/, "");

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Tils, Experiences, Projects, ProjectMedia],
  plugins: [
    s3Storage({
      enabled: s3Enabled,
      alwaysInsertFields: true,
      bucket: s3.bucket ?? "unconfigured-project-media",
      collections: {
        "project-media": {
          prefix: "projects",
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const segments = [prefix ?? "projects", filename].map(encodeURIComponent);
            return `${publicMediaURL}/${segments.join("/")}`;
          },
        },
      },
      config: {
        endpoint: s3.endpoint,
        region: s3.region ?? "us-east-1",
        forcePathStyle: true,
        credentials: {
          accessKeyId: s3.accessKeyId ?? "",
          secretAccessKey: s3.secretAccessKey ?? "",
        },
      },
    }),
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [CodeBlock()],
      }),
    ],
  }),
  upload: {
    limits: { fileSize: 100 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp",
  },
  secret: process.env.PAYLOAD_SECRET || "dev-secret",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
});
