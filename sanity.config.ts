import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "alponte",
  title: "Al Ponte — Studio",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Hotel")
              .id("hotel")
              .child(
                S.editor()
                  .id("hotel")
                  .schemaType("hotel")
                  .documentId("hotel"),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "hotel",
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
