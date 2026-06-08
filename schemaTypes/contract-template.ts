import { defineField, defineType } from "sanity";

/**
 * A reusable contract template.
 *
 * The boilerplate lives in `body` (Portable Text), where editors drop inline
 * `variable` markers wherever a value should be substituted — e.g. client
 * name or price. The `variables` array defines those markers (key, label,
 * type, default) and is what the standalone generator page uses to build its
 * fill-in form. At render time the PDF serializer swaps each marker for the
 * value entered on the page (falling back to the default, then to a
 * "{label}" placeholder).
 */
const contractTemplate = defineType({
  name: "contractTemplate",
  title: "Contract Template",
  type: "document",

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "variables", title: "Variables" },
    { name: "layout", title: "Layout" },
  ],

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "Internal description",
      description: "Only shown in the Studio / generator list — not printed.",
      type: "text",
      rows: 2,
      group: "content",
    }),

    defineField({
      name: "variables",
      title: "Variables",
      description:
        "The fields someone fills in when generating a contract. Each variable's Key is what you reference inside the body text.",
      type: "array",
      group: "variables",
      of: [
        {
          type: "object",
          name: "variable",
          fields: [
            defineField({
              name: "key",
              title: "Key",
              description:
                "Unique identifier used in the body (no spaces), e.g. clientName, price, eventDate.",
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-zA-Z0-9_]+$/, {
                    name: "alphanumeric / underscore",
                  }),
            }),
            defineField({
              name: "label",
              title: "Label",
              description: "Human-friendly label shown on the form.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              initialValue: "text",
              options: {
                list: [
                  { title: "Text", value: "text" },
                  { title: "Multiline text", value: "multiline" },
                  { title: "Number", value: "number" },
                  { title: "Currency", value: "currency" },
                  { title: "Date", value: "date" },
                ],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "defaultValue",
              title: "Default value",
              type: "string",
            }),
            defineField({
              name: "required",
              title: "Required",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "label", key: "key", type: "type" },
            prepare({
              title,
              key,
              type,
            }: {
              title?: string;
              key?: string;
              type?: string;
            }) {
              return {
                title: title || key || "Untitled variable",
                subtitle: `{${key || "?"}} · ${type || "text"}`,
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "body",
      title: "Contract body",
      description:
        "The contract text. Use the “Variable” inline marker (the {x} button in the editor toolbar's insert menu) to drop in a value defined above.",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
          // Inline objects that flow within the text.
          of: [
            {
              type: "object",
              name: "variable",
              title: "Variable",
              fields: [
                defineField({
                  name: "key",
                  title: "Variable key",
                  description:
                    "Must match a Key defined in the Variables tab.",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: { key: "key" },
                prepare({ key }: { key?: string }) {
                  return { title: `{${key || "?"}}` };
                },
              },
            },
          ],
        },
      ],
    }),

    defineField({
      name: "pageSize",
      title: "Page size",
      type: "string",
      group: "layout",
      initialValue: "A4",
      options: {
        list: [
          { title: "A4", value: "A4" },
          { title: "Letter", value: "LETTER" },
        ],
        layout: "radio",
      },
    }),

    defineField({
      name: "accentColor",
      title: "Accent colour",
      description: "Hex colour for headings and rules, e.g. #1a1a1a.",
      type: "string",
      group: "layout",
      initialValue: "#1a1a1a",
    }),

    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "layout",
    }),

    defineField({
      name: "headerText",
      title: "Header text",
      description: "Optional line printed at the top of every page.",
      type: "string",
      group: "layout",
    }),

    defineField({
      name: "footerText",
      title: "Footer text",
      description:
        "Optional line printed at the bottom of every page (page numbers are added automatically).",
      type: "string",
      group: "layout",
    }),
  ],

  preview: {
    select: { title: "title", subtitle: "description" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title || "Untitled template",
        subtitle: subtitle || "Contract template",
      };
    },
  },
});

export default contractTemplate;
