import { defineField, defineType } from "sanity";

export const hotel = defineType({
  name: "hotel",
  title: "Hotel",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localeString",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "localeText",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      validation: (r) =>
        r.email().error("Please provide a valid e-mail address."),
    }),
    defineField({
      name: "mapsUrl",
      title: "Google Maps URL",
      type: "url",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking URL (Book Now button)",
      description:
        "Optional. If empty, the Book Now button scrolls to the contact section.",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "name.it", subtitle: "name.en" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Hotel",
      subtitle: subtitle || "",
    }),
  },
});
