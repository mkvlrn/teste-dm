import type { Configuration } from "lint-staged";

export default {
  "*.{ts,tsx}": ["biome check --no-errors-on-unmatched", "vitest related --bail=1"],
  "*.{json,jsonc}": ["biome check --no-errors-on-unmatched"],
} satisfies Configuration;
