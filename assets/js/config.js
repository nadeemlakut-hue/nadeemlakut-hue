/*
 * Lakut Kashmir landing page settings — edit this one file.
 * Leave a value empty ("") to switch that feature off.
 */
window.LAKUT = {
  // Google Apps Script web-app URL that saves leads to a Google Sheet + emails you.
  // See google-apps-script/README.md. While empty, the form opens WhatsApp instead.
  sheetUrl: "",

  // Contact numbers (digits only for WhatsApp, with country code).
  whatsapp: "919541589391",
  phone: "+919131990355",
  phoneDisplay: "+91 91319 90355",

  // Google reviews (rating is shown only when filled in, e.g. "4.9").
  googleRating: "",
  googleReviewCount: 841,
  googlePlaceId: "ChIJUSAjZw4J4TgRH3Wl72_5TY4",

  // Tracking. Example: ga4 "G-XXXXXXX", adsId "AW-123456789", labels "AbCdEf123".
  ga4: "",
  adsId: "",
  adsLeadLabel: "",      // fired on thank-you.html after a form submit
  adsWhatsappLabel: "",  // fired on WhatsApp button clicks
  adsCallLabel: "",      // fired on call button clicks
  metaPixel: ""
};
