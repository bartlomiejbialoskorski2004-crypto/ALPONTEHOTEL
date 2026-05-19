import { defineField, defineType } from "sanity";
import { supportedLocales } from "./localeString";

export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fields: supportedLocales.map((l) =>
    defineField({
      name: l.id,
      title: l.title,
      type: "text",
      rows: 3,
    }),
  ),
});
