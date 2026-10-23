# Save leads to Google Sheets + get an email for each one

Takes about 5 minutes and is free.

1. Open [sheets.new](https://sheets.new) and name the sheet **Lakut Kashmir – Leads**.
2. In the sheet, choose **Extensions → Apps Script**.
3. Delete the sample code, paste everything from `Code.gs` (this folder) and click **Save**.
4. Click **Deploy → New deployment** → gear icon → **Web app**.
   - Description: `Landing page leads`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, then **Authorize access** and allow it (Google shows a "not verified" warning for your own scripts: click *Advanced → Go to project*).
6. Copy the **Web app URL** (it ends in `/exec`).
7. Paste it into `assets/js/config.js` as `sheetUrl: "https://script.google.com/macros/s/.../exec"`, then commit and push.

Every enquiry now adds a row to the **Leads** tab (name, phone, a one-click WhatsApp link, month, travellers, package, and the Google Ads campaign/keyword it came from) and emails `nadeem.lakut@gmail.com`.

**If you edit `Code.gs` later:** Deploy → Manage deployments → pencil icon → Version: *New version* → Deploy. The URL stays the same.

While `sheetUrl` is empty, the form opens WhatsApp with the visitor's details already typed in, so no lead is lost.
