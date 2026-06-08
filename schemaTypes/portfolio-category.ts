import { defineField } from "sanity";

const portfolioCategory = {
  name: "portfolio-category",
  title: "Portfolio Category",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "index",
      title: "Index",
      type: "number",
      description: "Sort order (lower shows first)",
    }),

    defineField({
      name: "gallery",
      title: "Gallery",
      description:
        "The gallery this category links to. Its images are used for the category's cover and the category links through to it.",
      type: "reference",
      to: [{ type: "gallery" }],
    }),

    defineField({
      name: "subItems",
      title: "Sub-items",
      description:
        "Optional nested entries, each linking to a gallery. When present, this category becomes an expandable group in the menu.",
      type: "array",
      of: [
        {
          type: "object",
          name: "subItem",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "gallery",
              title: "Gallery",
              type: "reference",
              to: [{ type: "gallery" }],
            }),
          ],
          preview: {
            select: { title: "name", galleryName: "gallery.name" },
            prepare({
              title,
              galleryName,
            }: {
              title?: string;
              galleryName?: string;
            }) {
              return {
                title: title || "Untitled",
                subtitle: galleryName ? `→ ${galleryName}` : "No gallery linked",
              };
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: { title: "name", index: "index", galleryName: "gallery.name" },
    prepare({
      title,
      index,
      galleryName,
    }: {
      title?: string;
      index?: number;
      galleryName?: string;
    }) {
      return {
        title: title || "Untitled category",
        subtitle: galleryName
          ? `→ ${galleryName}`
          : index != null
            ? `Index: ${index} · no gallery linked`
            : "No gallery linked",
      };
    },
  },
};

export default portfolioCategory;
