// Shared hotel contact constants — used by both the Contact section and the
// site Footer so the phone/email/maps details never diverge.

export const PHONE = "+41 91 605 24 92";
export const PHONE_HREF = "tel:+41916052492";
export const EMAIL = "gatti@al-ponte.ch";
export const EMAIL_HREF = `mailto:${EMAIL}`;

// Social — single source of truth for the footer icons.
export const INSTAGRAM = "https://www.instagram.com/alponterooms/";
export const BOOKING =
  "https://www.booking.com/hotel/ch/al-ponte-cademario.pl.html";

// Short link to the Al Ponte place — opens the named pin in Google Maps.
export const MAPS_LINK = "https://maps.app.goo.gl/3M8a77hu2zk6tvhq5";

// Embedded map: query by name so the marker reads "Al Ponte", `t=k` for
// satellite imagery.
const MAPS_QUERY = "Al Ponte, Via Cantonale 61, 6936 Cademario";
export const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY,
)}&t=k&z=16&output=embed`;
