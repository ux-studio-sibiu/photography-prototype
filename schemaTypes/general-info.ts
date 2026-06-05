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

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .email()
          .error("Please enter a valid email address"),
    }),

    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "social",
      title: "Social media",
      description: "Leave a field empty to hide that link.",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
        }),
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
        }),
        defineField({
          name: "pinterest",
          title: "Pinterest",
          type: "url",
        }),
      ],
    }),
  ],
};

export default generalInfo;
