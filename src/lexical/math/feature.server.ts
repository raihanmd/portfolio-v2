import { createNode, createServerFeature } from "@payloadcms/richtext-lexical";
import { MathNode } from "./math-node";

export const MathFeature = createServerFeature({
  key: "math",
  feature: {
    ClientFeature: "/src/lexical/math/feature.client#MathFeatureClient",
    nodes: [createNode({ node: MathNode })],
  },
});
