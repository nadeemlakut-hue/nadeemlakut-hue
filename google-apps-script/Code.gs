/**
 * Lakut Kashmir — landing page leads → Google Sheet + email alert.
 * Setup steps are in google-apps-script/README.md.
 */
var NOTIFY_EMAIL = "nadeem.lakut@gmail.com";
var SHEET_NAME = "Leads";
var COLUMNS = ["Received", "Name", "Phone", "WhatsApp link", "Travel month", "Travellers", "Package", "Form",
               "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "Page", "Status"];

function doPost(e) {
  var p = (e && e.parameter) || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet_();
    var phone = clean_(p.phone, 20);
    var digits = phone.replace(/\D/g, "");
    sheet.appendRow([
      new Date(),
      clean_(p.name, 80),
      phone,
      digits ? "https://wa.me/" + digits : "",
      clean_(p.month, 40),
      clean_(p.travellers, 10),
      clean_(p["package"], 80),
      clean_(p.form, 20),
      clean_(p.utm_source, 100), clean_(p.utm_medium, 100), clean_(p.utm_campaign, 150),
      clean_(p.utm_term, 150), clean_(p.utm_content, 150),
      clean_(p.gclid, 200), clean_(p.gbraid, 200), clean_(p.wbraid, 200),
      clean_(p.page, 200),
      "New"
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New Kashmir lead: " + clean_(p.name, 80) + " – " + clean_(p["package"], 80),
        htmlBody:
          "<h2>New enquiry from the landing page</h2>" +
          "<p><b>Name:</b> " + esc_(p.name) + "<br><b>Phone:</b> " + esc_(phone) +
          "<br><b>Travel month:</b> " + esc_(p.month) + "<br><b>Travellers:</b> " + esc_(p.travellers) +
          "<br><b>Package:</b> " + esc_(p["package"]) + "<br><b>Campaign:</b> " + esc_(p.utm_campaign || "-") +
          " / " + esc_(p.utm_term || "-") + "</p>" +
          (digits ? '<p><a href="https://wa.me/' + digits + '" style="background:#25d366;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Reply on WhatsApp</a></p>' : "")
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold").setBackground("#122620").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Strip leading = + - @ so a lead can never inject a spreadsheet formula.
function clean_(v, max) {
  return String(v || "").replace(/^[=+\-@\s]+/, "").slice(0, max || 100);
}

function esc_(v) {
  return String(v || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
}
