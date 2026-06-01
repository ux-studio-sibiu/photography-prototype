import { defineField } from "sanity";

const generalInfo = {
  name: "general-info",
  title: "Setări website",
  type: "document",

  fields: [
    defineField({
      name: "coverTitle",
      title: "Titlu copertă",
      type: "string",
    }),

    defineField({
      name: "coverSubtitle",
      title: "Subtitlu copertă",
      type: "string",
    }),

    defineField({
      name: "coverImages",
      title: "Imagini copertă",
      description: "Imaginile din slider-ul de pe prima pagină",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
};

export default generalInfo;
