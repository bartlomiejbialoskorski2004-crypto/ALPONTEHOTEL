import { defineField, defineType } from "sanity";

export const supportedLocales = [
  { id: "it", title: "Italiano" },
  { id: "en", title: "English" },
  { id: "pl", title: "Polski" },
  { id: "fr", title: "Français" },
  { id: "de", title: "Deutsch" },
] as const;

export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  fields: supportedLocales.map((l) =>
    defineField({
      name: l.id,
      title: l.title,
      type: "string",
    }),
  ),
});
