const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, TableOfContents, LevelFormat,
  ExternalHyperlink } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: "059669" })] });
}
function heading2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 }, children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: "1E293B" })] });
}
function heading3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 120 }, children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: "334155" })] });
}
function para(text, opts = {}) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, size: 22, font: "Arial", ...opts })] });
}
function bullet(text, ref = "bullets", level = 0) {
  return new Paragraph({ numbering: { reference: ref, level }, spacing: { after: 60 }, children: [new TextRun({ text, size: 22, font: "Arial" })] });
}
function numbered(text, ref = "numbers", level = 0) {
  return new Paragraph({ numbering: { reference: ref, level }, spacing: { after: 60 }, children: [new TextRun({ text, size: 22, font: "Arial" })] });
}
function code(text) {
  return new Paragraph({ spacing: { after: 60 }, indent: { left: 360 }, children: [new TextRun({ text, size: 20, font: "Consolas", color: "1E293B" })] });
}
function codeBlock(lines) {
  return lines.map(l => code(l));
}
function tableRow(cells, isHeader = false) {
  return new TableRow({
    children: cells.map((text, i) => new TableCell({
      borders,
      width: { size: Math.floor(9360 / cells.length), type: WidthType.DXA },
      margins: cellMargins,
      shading: isHeader ? { fill: "059669", type: ShadingType.CLEAR } : undefined,
      children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Arial", bold: isHeader, color: isHeader ? "FFFFFF" : "334155" })] })]
    }))
  });
}
function simpleTable(headers, rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: headers.map(() => Math.floor(9360 / headers.length)),
    rows: [
      tableRow(headers, true),
      ...rows.map(r => tableRow(r))
    ]
  });
}
function spacer() { return new Paragraph({ spacing: { after: 200 }, children: [] }); }

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 32, bold: true, font: "Arial", color: "059669" }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 26, bold: true, font: "Arial", color: "1E293B" }, paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 22, bold: true, font: "Arial", color: "334155" }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }, { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers4", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers5", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers6", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "checklist", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2610", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // ── Title Page ──
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        spacer(), spacer(), spacer(), spacer(), spacer(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "DigiDelight", size: 56, bold: true, font: "Arial", color: "059669" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Calendar Integration Setup Guide", size: 40, bold: true, font: "Arial", color: "1E293B" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "Platform Configuration Instructions for Google, Microsoft, Zoom & Apple Calendar", size: 24, font: "Arial", color: "64748B" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "059669", space: 1 } }, children: [] }),
        spacer(),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Version 1.0 \u2014 April 2026", size: 22, font: "Arial", color: "94A3B8" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Confidential \u2014 For Administrator Use Only", size: 20, font: "Arial", color: "94A3B8", italics: true })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // ── TOC + Content ──
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "DigiDelight Calendar Integration Guide", size: 18, font: "Arial", color: "94A3B8" })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", size: 18, font: "Arial", color: "94A3B8" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: "94A3B8" })] })] }) },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Table of Contents", size: 32, bold: true, color: "059669" })] }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 1. Overview ──
        heading1("1. Overview"),
        para("DigiDelight supports calendar integrations that enable automatic availability checking, scheduling, and meeting link generation. By connecting external calendar providers, users can:"),
        bullet("Sync calendar events to prevent double-bookings"),
        bullet("Automatically check availability when visitors request meetings"),
        bullet("Generate video conferencing links (Zoom, Google Meet, Teams)"),
        bullet("Two-way sync: events created in DigiDelight appear in the user\u2019s calendar and vice versa"),
        spacer(),
        para("Each provider requires registering an OAuth application in the provider\u2019s developer console. This guide walks through the setup for each supported provider.", { italics: true, color: "64748B" }),
        spacer(),
        simpleTable(
          ["Provider", "Type", "Status", "Auth Method"],
          [
            ["Google Calendar", "Calendar + Meet", "Active", "OAuth 2.0"],
            ["Microsoft Outlook", "Calendar + Teams", "Active", "OAuth 2.0"],
            ["Zoom", "Conferencing", "Coming Soon", "OAuth 2.0"],
            ["Apple iCloud", "Calendar", "Coming Soon", "CalDAV (App Password)"],
            ["Microsoft Exchange", "Calendar (On-Prem)", "Coming Soon", "EWS"],
          ]
        ),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 2. Google Calendar ──
        heading1("2. Google Calendar Setup"),
        para("Google Calendar integration uses Google\u2019s OAuth 2.0 flow to connect user calendars. It provides full read/write access to events, availability checking, and optional Google Meet integration."),
        spacer(),

        heading2("2.1 Create a Google Cloud Project"),
        numbered("Go to https://console.cloud.google.com", "numbers"),
        numbered("Click \u201CNew Project\u201D at the top of the page", "numbers"),
        numbered("Enter project name: \u201CDigiDelight Calendar\u201D", "numbers"),
        numbered("Select an organization (if applicable) and click \u201CCreate\u201D", "numbers"),
        numbered("Select the newly created project from the project dropdown", "numbers"),
        spacer(),

        heading2("2.2 Enable Required APIs"),
        numbered("Navigate to APIs & Services \u2192 Library", "numbers2"),
        numbered("Search for \u201CGoogle Calendar API\u201D and click \u201CEnable\u201D", "numbers2"),
        numbered("Search for \u201CGoogle People API\u201D and click \u201CEnable\u201D (needed for contact information)", "numbers2"),
        para("Both APIs must be enabled for the integration to work properly.", { italics: true, color: "64748B" }),
        spacer(),

        heading2("2.3 Configure OAuth Consent Screen"),
        numbered("Go to APIs & Services \u2192 OAuth consent screen", "numbers3"),
        numbered("Select \u201CExternal\u201D user type (or \u201CInternal\u201D for Google Workspace orgs)", "numbers3"),
        numbered("Fill in the required fields:", "numbers3"),
        bullet("App name: \u201CDigiDelight\u201D"),
        bullet("User support email: your support email"),
        bullet("Developer contact email: your dev email"),
        numbered("Click \u201CAdd or Remove Scopes\u201D and add:", "numbers3"),
        code("https://www.googleapis.com/auth/calendar"),
        code("https://www.googleapis.com/auth/calendar.events"),
        code("https://www.googleapis.com/auth/calendar.readonly"),
        numbered("If your app is in \u201CTesting\u201D mode, add test user email addresses", "numbers3"),
        numbered("Click \u201CSave and Continue\u201D through all steps", "numbers3"),
        spacer(),

        heading2("2.4 Create OAuth Client ID"),
        numbered("Go to APIs & Services \u2192 Credentials", "numbers4"),
        numbered("Click \u201CCreate Credentials\u201D \u2192 \u201COAuth client ID\u201D", "numbers4"),
        numbered("Select Application type: \u201CWeb application\u201D", "numbers4"),
        numbered("Name: \u201CDigiDelight Calendar Integration\u201D", "numbers4"),
        numbered("Under \u201CAuthorized redirect URIs\u201D, add:", "numbers4"),
        code("https://your-domain.com/api/v1/calendar/oauth/callback"),
        numbered("Click \u201CCreate\u201D", "numbers4"),
        numbered("Copy and securely store the Client ID and Client Secret", "numbers4"),
        spacer(),
        para("\u26A0\uFE0F Important: The redirect URI must match exactly, including the protocol (https) and path. No trailing slash.", { bold: true, color: "D97706" }),
        spacer(),

        heading2("2.5 Configure in DigiDelight"),
        para("Run the following SQL to configure the provider credentials:"),
        ...codeBlock([
          "UPDATE cal_providers SET",
          "  oauth_client_id = 'YOUR_GOOGLE_CLIENT_ID',",
          "  oauth_client_secret = 'YOUR_GOOGLE_CLIENT_SECRET',",
          "  oauth_authorize_url = 'https://accounts.google.com/o/oauth2/v2/auth',",
          "  oauth_token_url = 'https://oauth2.googleapis.com/token',",
          "  oauth_scopes_json = '[",
          "    \"https://www.googleapis.com/auth/calendar\",",
          "    \"https://www.googleapis.com/auth/calendar.events\"",
          "  ]',",
          "  redirect_uri = 'https://your-domain.com/api/v1/calendar/oauth/callback',",
          "  status = 'active'",
          "WHERE provider_key = 'google_calendar';",
        ]),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 3. Microsoft Outlook ──
        heading1("3. Microsoft Outlook / Office 365 Setup"),
        para("Microsoft Outlook integration uses Microsoft Identity Platform (Azure AD) for OAuth 2.0 authentication. It supports both personal Microsoft accounts and organizational (Office 365) accounts."),
        spacer(),

        heading2("3.1 Register an Azure AD Application"),
        numbered("Go to https://portal.azure.com", "numbers"),
        numbered("Navigate to Azure Active Directory \u2192 App registrations", "numbers"),
        numbered("Click \u201CNew registration\u201D", "numbers"),
        numbered("Fill in:", "numbers"),
        bullet("Name: \u201CDigiDelight Calendar Integration\u201D"),
        bullet("Supported account types: \u201CAccounts in any organizational directory and personal Microsoft accounts\u201D"),
        bullet("Redirect URI: Web \u2192 https://your-domain.com/api/v1/calendar/oauth/callback"),
        numbered("Click \u201CRegister\u201D", "numbers"),
        spacer(),

        heading2("3.2 Configure API Permissions"),
        numbered("In your app registration, go to \u201CAPI permissions\u201D", "numbers2"),
        numbered("Click \u201CAdd a permission\u201D \u2192 \u201CMicrosoft Graph\u201D", "numbers2"),
        numbered("Select \u201CDelegated permissions\u201D", "numbers2"),
        numbered("Add these permissions:", "numbers2"),
        bullet("Calendars.ReadWrite"),
        bullet("Calendars.Read"),
        bullet("User.Read"),
        bullet("offline_access"),
        numbered("Click \u201CGrant admin consent for [your org]\u201D if you\u2019re an admin", "numbers2"),
        spacer(),

        heading2("3.3 Create a Client Secret"),
        numbered("Go to Certificates & secrets \u2192 \u201CNew client secret\u201D", "numbers3"),
        numbered("Description: \u201CDigiDelight Production\u201D, Expiry: 24 months", "numbers3"),
        numbered("Click \u201CAdd\u201D and immediately copy the Value (it won\u2019t be shown again)", "numbers3"),
        spacer(),
        para("\u26A0\uFE0F Critical: Copy the secret value immediately after creation. It cannot be retrieved later.", { bold: true, color: "DC2626" }),
        spacer(),

        heading2("3.4 Note Application IDs"),
        bullet("Application (client) ID: found on the app\u2019s Overview page"),
        bullet("Directory (tenant) ID: found on the Overview page"),
        para("For multi-tenant apps, use \u201Ccommon\u201D as the tenant ID in the OAuth URLs.", { italics: true, color: "64748B" }),
        spacer(),

        heading2("3.5 Configure in DigiDelight"),
        ...codeBlock([
          "UPDATE cal_providers SET",
          "  oauth_client_id = 'YOUR_AZURE_APPLICATION_ID',",
          "  oauth_client_secret = 'YOUR_AZURE_CLIENT_SECRET',",
          "  oauth_authorize_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',",
          "  oauth_token_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token',",
          "  oauth_scopes_json = '[",
          "    \"Calendars.ReadWrite\",",
          "    \"User.Read\",",
          "    \"offline_access\"",
          "  ]',",
          "  redirect_uri = 'https://your-domain.com/api/v1/calendar/oauth/callback',",
          "  status = 'active'",
          "WHERE provider_key = 'microsoft_outlook';",
        ]),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 4. Zoom ──
        heading1("4. Zoom Setup"),
        para("Zoom integration provides automatic meeting link generation for scheduled events. When a booking is confirmed, DigiDelight creates a Zoom meeting and includes the join link."),
        spacer(),

        heading2("4.1 Create Zoom Marketplace App"),
        numbered("Go to https://marketplace.zoom.us \u2192 Develop \u2192 Build App", "numbers5"),
        numbered("Choose \u201COAuth\u201D app type", "numbers5"),
        numbered("App name: \u201CDigiDelight Scheduling\u201D", "numbers5"),
        numbered("Select app type: \u201CUser-managed app\u201D", "numbers5"),
        spacer(),

        heading2("4.2 Configure OAuth Settings"),
        numbered("Set Redirect URL: https://your-domain.com/api/v1/calendar/oauth/callback", "numbers6"),
        numbered("Add required scopes:", "numbers6"),
        bullet("meeting:write \u2014 Create meetings"),
        bullet("meeting:read \u2014 Read meeting details"),
        bullet("user:read \u2014 Read user profile"),
        numbered("Note the Client ID and Client Secret from the App Credentials page", "numbers6"),
        spacer(),

        heading2("4.3 Configure in DigiDelight"),
        ...codeBlock([
          "UPDATE cal_providers SET",
          "  oauth_client_id = 'YOUR_ZOOM_CLIENT_ID',",
          "  oauth_client_secret = 'YOUR_ZOOM_CLIENT_SECRET',",
          "  oauth_authorize_url = 'https://zoom.us/oauth/authorize',",
          "  oauth_token_url = 'https://zoom.us/oauth/token',",
          "  oauth_scopes_json = '[\"meeting:write\", \"meeting:read\", \"user:read\"]',",
          "  redirect_uri = 'https://your-domain.com/api/v1/calendar/oauth/callback',",
          "  status = 'active'",
          "WHERE provider_key = 'zoom_calendar';",
        ]),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 5. Apple ──
        heading1("5. Apple iCloud Calendar (CalDAV)"),
        para("Apple iCloud Calendar uses the CalDAV protocol instead of OAuth. Users provide their Apple ID and an app-specific password to connect."),
        spacer(),

        heading2("5.1 User Setup (Per-User)"),
        para("Each user who wants to connect Apple Calendar needs to:"),
        numbered("Go to https://appleid.apple.com \u2192 Sign-In and Security \u2192 App-Specific Passwords", "numbers"),
        numbered("Click \u201CGenerate an app-specific password\u201D", "numbers"),
        numbered("Label it \u201CDigiDelight Calendar\u201D", "numbers"),
        numbered("Copy the generated password", "numbers"),
        numbered("In DigiDelight, go to Calendar Integrations \u2192 Apple iCloud \u2192 Configure", "numbers"),
        numbered("Enter their Apple ID email and the app-specific password", "numbers"),
        spacer(),

        heading2("5.2 Platform Configuration"),
        para("The CalDAV server URL is pre-configured:"),
        code("CalDAV Server: https://caldav.icloud.com"),
        para("No OAuth credentials are needed for this provider. Set the status when ready:", { italics: true, color: "64748B" }),
        ...codeBlock(["UPDATE cal_providers SET status = 'active' WHERE provider_key = 'apple_icloud';"]),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 6. Environment Variables ──
        heading1("6. Environment Variables"),
        para("Add these environment variables to your .env file or Docker Compose configuration:"),
        spacer(),
        ...codeBlock([
          "# Google Calendar",
          "GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id",
          "GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret",
          "",
          "# Microsoft Outlook",
          "MICROSOFT_CALENDAR_CLIENT_ID=your_microsoft_application_id",
          "MICROSOFT_CALENDAR_CLIENT_SECRET=your_microsoft_client_secret",
          "MICROSOFT_CALENDAR_TENANT_ID=common",
          "",
          "# Zoom",
          "ZOOM_CLIENT_ID=your_zoom_client_id",
          "ZOOM_CLIENT_SECRET=your_zoom_client_secret",
          "",
          "# Shared",
          "CALENDAR_OAUTH_REDIRECT_URI=https://your-domain.com/api/v1/calendar/oauth/callback",
        ]),
        spacer(),
        para("\u26A0\uFE0F Never commit credentials to version control. Use environment variables or a secrets manager (e.g., HashiCorp Vault).", { bold: true, color: "D97706" }),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 7. Provider URL Reference ──
        heading1("7. Provider URL Reference"),
        para("Quick reference for OAuth URLs by provider:"),
        spacer(),
        simpleTable(
          ["Provider", "Authorize URL", "Token URL"],
          [
            ["Google", "accounts.google.com/o/oauth2/v2/auth", "oauth2.googleapis.com/token"],
            ["Microsoft", "login.microsoftonline.com/common/oauth2/v2.0/authorize", "login.microsoftonline.com/common/oauth2/v2.0/token"],
            ["Zoom", "zoom.us/oauth/authorize", "zoom.us/oauth/token"],
          ]
        ),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 8. Testing Checklist ──
        heading1("8. Testing Checklist"),
        para("Complete this checklist for each provider after configuration:"),
        spacer(),
        new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: [new TextRun({ text: "OAuth credentials created and stored securely", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: [new TextRun({ text: "Redirect URI matches exactly (protocol, domain, path)", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: [new TextRun({ text: "Required API permissions/scopes granted", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: [new TextRun({ text: "Provider status set to 'active' in cal_providers", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: [new TextRun({ text: "Test: Click Connect \u2192 redirects to provider login page", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: [new TextRun({ text: "Test: After login \u2192 redirected back with authorization code", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: [new TextRun({ text: "Test: Calendar list appears in Connected Accounts", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: [new TextRun({ text: "Test: Events sync correctly (both directions)", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "checklist", level: 0 }, children: [new TextRun({ text: "Test: Availability checking works for bookings", size: 22, font: "Arial" })] }),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 9. Troubleshooting ──
        heading1("9. Troubleshooting"),
        para("Common errors and their resolutions:"),
        spacer(),
        simpleTable(
          ["Error", "Cause", "Fix"],
          [
            ["INVALID_PROVIDER", "Provider key not found in cal_providers table", "Verify provider_key matches exactly"],
            ["PROVIDER_INACTIVE", "Provider status is not 'active'", "UPDATE cal_providers SET status='active'"],
            ["PROVIDER_NO_OAUTH", "Provider doesn't support OAuth", "Use CalDAV or manual configuration"],
            ["Missing client_id", "OAuth credentials not configured", "Set oauth_client_id in cal_providers"],
            ["redirect_uri_mismatch", "URI doesn't match provider config", "Ensure exact match in console and DB"],
            ["invalid_scope", "Wrong permissions requested", "Check scopes match provider console"],
            ["Token expired", "Refresh token failed", "User needs to reconnect via UI"],
            ["CORS error", "Cross-origin request blocked", "Check CORS config on API server"],
          ]
        ),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:/DigiDelight/docs/Calendar_Integration_Setup_Guide.docx", buffer);
  console.log("Document created: C:/DigiDelight/docs/Calendar_Integration_Setup_Guide.docx");
});
