import { StructureResolver } from "sanity/structure";
import { CogIcon, ImagesIcon, DocumentsIcon, CalendarIcon } from "@sanity/icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Settings - opens directly as singleton
      S.listItem()
        .title("Setări website")
        .id("setari-website")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("general-info")
            .documentId("general-info")
            .title("Setări website")
        ),

      S.divider(),

      // Availability - opens directly as singleton
      S.listItem()
        .title("Availability")
        .id("availability")
        .icon(CalendarIcon)
        .child(
          S.document()
            .schemaType("availability")
            .documentId("availability")
            .title("Availability")
        ),

      S.divider(),

      // Galleries
      S.listItem()
        .title("Galerii")
        .icon(ImagesIcon)
        .child(
          S.documentTypeList("gallery")
            .title("Galerii")
            .defaultOrdering([{ field: "name", direction: "asc" }])
        ),

      S.divider(),

      // Portfolio Categories
      S.listItem()
        .title("Categorii Portofoliu")
        .icon(DocumentsIcon)
        .child(
          S.documentTypeList("portfolio-category")
            .title("Categorii Portofoliu")
            .defaultOrdering([{ field: "index", direction: "asc" }])
        ),
    ]);
