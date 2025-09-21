import { defineConfig } from "@prisma/config";

export default defineConfig({
  migrations: {
    seed: "ts-node --project tsconfig.seed.json prisma/seed.ts",
  },
});
