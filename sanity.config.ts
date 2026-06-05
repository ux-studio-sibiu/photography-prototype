// sanity.config.ts

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./sanity/desk";

export default defineConfig({
  name: "default",
  title: "photography",

  projectId: "dt64fsks",
  dataset: "production",
  basePath: "/studio",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (prev) =>
      prev.filter((template) => template.id !== "availability"),
  },
});
