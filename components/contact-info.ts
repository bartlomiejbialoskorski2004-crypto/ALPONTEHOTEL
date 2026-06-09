// Shared hotel contact constants — used by both the Contact section and the
// site Footer so the phone/email/maps details never diverge.

export const PHONE = "+41 91 605 24 92";
export const PHONE_HREF = "tel:+41916052492";
export const EMAIL = "gatti@al-ponte.ch";
export const EMAIL_HREF = `mailto:${EMAIL}`;

// Social — single source of truth for the footer icons.
export const INSTAGRAM = "https://www.instagram.com/alponterooms/";
// Full reservation link — every "Book Now" across the site points here.
export const BOOKING =
  "https://www.booking.com/hotel/ch/al-ponte-cademario.pl.html?aid=356980&label=gog235jc-10CAsoLEISYWwtcG9udGUtY2FkZW1hcmlvSAlYA2i2AYgBAZgBM7gBF8gBDNgBA-gBAfgBAYgCAagCAbgCgcG7zQbAAgHSAiQ5MzdkOWEyNS1lYzAxLTRlMDktOTk3MS1kYmI5NDlhYjNkMTfYAgHgAgE&sid=f4f5e2af4bd7f82ca308a0d803dbe03d&dest_id=900047906&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1773068437&srpvid=d9e46982927a096f&type=total&ucfs=1&chal_t=1774268846733&force_referer=";

// Short link to the Al Ponte place — opens the named pin in Google Maps.
export const MAPS_LINK = "https://maps.app.goo.gl/3M8a77hu2zk6tvhq5";

// Embedded map: query by name so the marker reads "Al Ponte", `t=k` for
// satellite imagery.
const MAPS_QUERY = "Al Ponte, Via Cantonale 61, 6936 Cademario";
export const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY,
)}&t=k&z=16&output=embed`;
