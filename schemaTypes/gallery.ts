import { defineField } from "sanity";

const gallery = {
  name: "gallery",
  title: "Gallery",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug (URL identifier)",
      type: "slug",
      description: "URL-friendly identifier for accessing this gallery",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "gap",
      title: "Gap Between Images",
      type: "number",
      description: "Space between images in pixels",
      initialValue: 30,
      validation: (rule) => rule.required().min(0),
    }),

    defineField({
      name: "columns",
      title: "Columns Layout",
      description: "Define columns with images and relative widths",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "weight",
              title: "Width Weight",
              type: "number",
              description:
                "Relative width of this column (e.g., 1, 2, 1.5). Width = weight / total weights",
              validation: (rule) => rule.required().positive(),
              initialValue: 1,
            }),

            defineField({
              name: "photos",
              title: "Content",
              description:
                "Images and/or text. Drag & drop multiple images at once; expand an image for an optional description. Add a Text block for standalone text. Leave the column empty to use it as a spacer.",
              type: "array",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  // Extra fields on the image type itself — keeps bulk
                  // multi-file drag & drop working (wrapping in an object
                  // would disable it).
                  fields: [
                    {
                      name: "description",
                      title: "Description",
                      // Portable Text rich text (bold, italic, lists, links…)
                      type: "array",
                      of: [{ type: "block" }],
                    },
                  ],
                },
                {
                  type: "object",
                  name: "textBlock",
                  title: "Text",
                  fields: [
                    {
                      name: "text",
                      title: "Text",
                      type: "array",
                      of: [{ type: "block" }],
                    },
                  ],
                  preview: {
                    select: { blocks: "text" },
                    prepare({ blocks }: { blocks?: Array<Record<string, any>> }) {
                      const text = (blocks || [])
                        .filter((b) => b._type === "block")
                        .map((b) =>
                          ((b.children as Array<{ text?: string }>) || [])
                            .map((c) => c.text || "")
                            .join(""),
                        )
                        .join(" ")
                        .trim();
                      const truncated =
                        text.length > 60 ? `${text.slice(0, 60)}…` : text;
                      return {
                        title: truncated || "Empty text",
                        subtitle: "Text",
                      };
                    },
                  },
                },
              ],
              // No min validation — empty columns are allowed (spacers).
            }),
          ],
          preview: {
            select: {
              weight: "weight",
              count: "photos.length",
            },
            prepare({
              weight,
              count,
            }: {
              weight?: number;
              count?: number;
            }) {
              return {
                title: `Column (weight: ${weight || 1})`,
                subtitle: count ? `${count} photos` : "No photos",
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],

  preview: {
    select: { title: "name", columns: "columns" },
    prepare({
      title,
      columns,
    }: {
      title?: string;
      columns?: Array<{ photos?: Array<unknown> }>;
    }) {
      const totalPhotos = columns?.reduce(
        (sum, col) => sum + (col.photos?.length || 0),
        0,
      ) || 0;
      return {
        title: title || "Untitled gallery",
        subtitle: `${columns?.length || 0} columns, ${totalPhotos} photos`,
      };
    },
  },
};

export default gallery;
