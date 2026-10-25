/*
 * Lakut Kashmir landing page settings — edit this one file.
 * Leave a value empty ("") to switch that feature off.
 */
window.LAKUT = {
  // Google Apps Script web-app URL that saves leads to a Google Sheet + emails you.
  // See google-apps-script/README.md. While empty, the form opens WhatsApp instead.
  sheetUrl: "https://script.google.com/macros/s/AKfycbxJVol83ZQLP0yKupNHMmYbOpBq6fKW__kk4ny6ELiVHY_KeJcrV5Tlo0AAfYBivDae1A/exec",

  // Contact numbers (digits only for WhatsApp, with country code).
  whatsapp: "919541589391",
  phone: "+919131990355",
  phoneDisplay: "+91 91319 90355",

  // Google reviews (rating is shown only when filled in, e.g. "4.9").
  googleRating: "4.7",
  googleReviewCount: 841,
  googlePlaceId: "ChIJUSAjZw4J4TgRH3Wl72_5TY4",

  // Tracking. Example: ga4 "G-XXXXXXX", adsId "AW-123456789", labels "AbCdEf123".
  ga4: "",
  adsId: "AW-11344635468",
  adsLeadLabel: "wzszCN-b4ewcEMzMxaEq",      // "Submit lead form"; fired on thank-you.html only after the lead is saved
  adsWhatsappLabel: "",  // fired on WhatsApp button clicks
  adsCallLabel: "",      // fired on call button clicks
  metaPixel: ""
};
