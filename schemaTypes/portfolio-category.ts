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
      name: "photos",
      title: "Photos",
      description: "Images shown in the gallery / zoom view",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],

  preview: {
    select: { title: "name", index: "index" },
    prepare({ title, index }: { title?: string; index?: number }) {
      return {
        title: title || "Untitled category",
        subtitle: index != null ? `Index: ${index}` : undefined,
      };
    },
  },
};

export default portfolioCategory;
