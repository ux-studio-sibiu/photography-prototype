import { defineField, defineType } from "sanity";
import { AvailabilityInput } from "../sanity/components/availability-input";

const availability = defineType({
  name: "availability",
  title: "Availability",
  type: "document",

  components: {
    input: AvailabilityInput,
  },

  fields: [
    defineField({
      name: "days",
      title: "Days",
      description:
        "Per-day availability. A day is free unless it has a record marking it occupied. Notes can be attached to any day.",
      type: "array",
      of: [
        {
          type: "object",
          name: "day",
          fields: [
            defineField({
              name: "date",
              title: "Date",
              type: "date",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Occupied", value: "occupied" },
                  { title: "Free", value: "free" },
                ],
                layout: "radio",
              },
              initialValue: "occupied",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "note",
              title: "Note",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: {
              date: "date",
              status: "status",
              note: "note",
            },
            prepare({ date, status, note }) {
              return {
                title: `${date} — ${status || "occupied"}`,
                subtitle: note || undefined,
              };
            },
          },
        },
      ],
    }),
  ],
});

export default availability;
