# Creating a Social Media Campaign in DigiCRM — New User Guide + UX Review

**Walkthrough performed:** 2026-10-19 · tenant **ACME** (user *John Doe*, Admin) · built from an actual end-to-end run.
**Example campaign created:** *"Diwali Social Media Launch — Oct 2026"* (code `CMP-2026-0605`).

This document has two parts:

- **Part A — Step-by-step guide** for new users: create a campaign → set goals → compose the post → get approvals → schedule/post.
- **Part B — Issues, UX problems, and enhancement ideas** found during the run, ranked by impact.

---

## Part A — Step-by-step guide

### Where it lives
Everything starts under **Marketing → Campaigns** (left sidebar). Social posts themselves are written under **Marketing → Social**. The two are linked: a *Social post* campaign is a container that holds the goals, approvals and reporting, while the actual posts are composed in the Social composer and linked back to the campaign.

### The two things a Social campaign has to approve
A social campaign goes through **two independent approval tracks** — know both so nothing is left half-approved:

1. **Campaign lifecycle** (the container): `Draft → Review → Approved → Scheduled → Active → Completed`.
2. **Post review** (each individual post): `draft → in review → approved → scheduled → published`.

Approving the post does **not** auto-advance the campaign, and vice-versa.

---

### Step 1 — Create the campaign

1. Go to **Marketing → Campaigns** and click **+ New Campaign** (top-right). This opens a full-page wizard at `/campaigns/new`.
2. The wizard starts as **9 steps** but **collapses to 5** once you pick a *Social post* delivery (the audience/message steps don't apply to social).
3. **Step 1 · Basics**
   - **Campaign Name** (required) — e.g. `Diwali Social Media Launch — Oct 2026`.
   - **Description** — the goal and audience in one line (reviewers read this first).
   - **Team & reporting** (optional) — Department / Branch / Sales unit, used to group reports.
   - **Tags** (optional).
   - Click **Next**.

### Step 2 — Choose the delivery type

- Pick **Social post** (the other options are *Message* — email/SMS/WhatsApp — and *Ad*).
- The helper text explains it: *"Social and Ad campaigns publish posts… so those steps are skipped and you compose the posts afterwards."*
- The step counter drops to **Step 2 of 5**. Click **Next**.

### Step 3 — Purpose & Goals

- **Campaign Purpose** — tick every purpose that fits (Brand Awareness, Acquisition, Engagement, etc.). Reports group campaigns by these.
- **Campaign Goals** — this is where measurable targets go. Three ways to add one:
  - **From template…** dropdown (quick: Open rate, Click-through rate).
  - **+ Add goals** → opens the **Goal Library** picker (reusable published definitions).
  - **Custom goal** → full editor: Goal type (Metric / Rate / Formula KPI / Milestone / Count / Sum / …), **numerator ÷ denominator** (the metric list includes **Social impressions / engagements / reach / clicks**), target, baseline, weight, attention threshold, conversion window, attribution model, and **Primary goal** / **OKR key-result** linking.
  - For a social campaign, a good custom goal is e.g. **Social clicks ÷ Social reach**, target 5%.
  - Click **Create Goal** (it sits ~2 scrolls down in the editor).
- ⚠️ **Mark one goal as Primary** (the warning *"No primary goal — mark the one goal this campaign is judged on"* stays until you do). Goals are technically optional, but without one *nothing measures whether the campaign worked*.
- Click **Next**.

### Step 4 — Assets & Links (optional)

- Upload images/PDF/video (≤25 MB each) and create **UTM-tagged tracking links** you can drop into the post. Skip if you'll add them while writing. Click **Next**.

### Step 5 — Review & Create

- Skim the summary. The **Readiness check** lists blockers (must fix) and warnings (advice). A missing primary goal shows here as a non-blocking warning.
- Click **Create campaign**. The campaign is created as a **Draft** with an auto-generated code.
- *(If the page doesn't move you to the campaign on its own, open it from **Campaigns** — see Part B #1.)*

---

### Step 6 — Compose the social post

1. On the campaign's **Setup** tab, click **Open the Social composer →** (deep-links to `/marketing/social?compose=1&campaign=<id>`).
2. In **New post**:
   - **Brand** — pick the brand kit (applied to the preview).
   - **What are you posting?** — choose a post type (Text, Link, Images, Carousel, Video, Reel, Short, Story, PDF carousel, Long post, Thread, Poll, Reply, Quote, Repost). Each shows which networks support it.
   - **Post as** — select the account(s) (e.g. *DigiCRM LinkedIn*). Accounts that can't take the chosen type are greyed out.
   - **Campaign** — already filled in with your campaign (so links get its UTM and count as campaign touches).
   - **Text for <network>** — write the copy; **✨ Write with AI** / **✨ Repurpose with AI** are available, and a **Live preview** shows the rendered post.
   - **When to post** — set a **date and time** (required before review — see Part B #2). Optionally toggle **Repeat (evergreen)**.
   - Set an **Internal name** for easy searching.
3. Choose **Save draft**, **Schedule**, or **Send for review**.

### Step 7 — Get the post approved

1. Click **Send for review**. The post moves to **In review**.
2. On the post's row, click **Approval link** — it copies a **public approval URL** (`/approve/social/<token>`) to share with a reviewer.
3. The reviewer opens that link (no login needed), sees the post preview, enters their name, and clicks **Approve** or **Request changes** (a note is required to request changes). On approve they see *"Thanks — approved."*
4. Once approved, the post is **Scheduled** for the time you set and will publish automatically.
   - Other posting actions on a post row: **Schedule**, **Add to queue**, **Publish now**, **Unschedule**, **Delete**.

### Step 8 — Submit & approve the campaign

1. Back on the campaign **Setup** tab, click **Submit for Review**.
2. A **Campaign readiness** dialog validates every section. If there are only warnings, click **Acknowledge & continue**. The campaign moves to **Review** and **editing locks** (use **Withdraw to Draft** to make changes; goals can still be edited).
3. A **different user** approves it (maker-checker — the submitter *cannot* approve their own campaign). After approval it progresses to **Approved → Scheduled → Active → Completed**.

### Step 9 — Where to watch results

- **Campaign → Setup/Plan/History** tabs track status and changes.
- **Goals** show **weighted attainment** and can be re-evaluated (**Evaluate now**) or exported (**CSV**).
- **Marketing → Social Analytics** and the campaign's performance views track reach/engagement once posts publish.

> **Demo note:** in this environment the LinkedIn/X accounts show a **"● error"** connection state and Facebook/Instagram aren't keyed, so publishing is simulated rather than sent to the live networks.

---

## Part B — Issues, UX problems & enhancements found

Ranked roughly by user impact. Each was observed during the run above.

### Functional / bugs

**B1 — Wizard doesn't redirect after "Create campaign" (duplicate-creation risk).** `HIGH`
After clicking **Create campaign**, the `POST /campaigns` returned **201** and the detail-view chunks loaded, but the UI **stayed on "Review & Create" with an active Create button**. A user who doesn't notice will click again and create a **duplicate** campaign. → After a successful create, navigate straight to the new campaign's detail page (and disable the button during the request).

**B2 — "Send for review" fails silently-ish on a missing schedule.** `MEDIUM`
Sending a post for review without a time returns `422 { scheduled_at: "Pick when to post." }`. The only feedback is a small inline alert **below the fold**; there is **no toast** and the button just re-enables, so it looks like nothing happened. → Show a toast and scroll/focus the offending field. Also reconsider whether *review* should require the exact time up front (you often want sign-off before locking the slot).

**B3 — Campaign "Approve" is offered to the submitter, then dead-ends.** `MEDIUM`
Maker-checker is correctly enforced server-side (`403 AUTH_PERMISSION_DENIED`, *"Cannot approve a campaign you submitted…"*), but the **Approve** button is shown to the submitter anyway, producing a dead-end click + error. → Hide/disable **Approve** for the submitter and show *"needs a different approver."*

**B4 — Goals summary says "None yet" while a goal exists.** `MEDIUM`
On the campaign **Setup** tab the collapsed **Goals** row read *"None yet — add one to tell if it worked,"* but expanding it showed the real goal (*Social link clicks rate*, 0/1 required). The collapsed summary/count is stale. → Bind the summary to the actual goal count.

**B5 — Posts list intermittently renders empty while the API returns data.** `MEDIUM`
`GET /marketing/social/posts` returned **200** with ~16 posts, but the **Posts** tab rendered an empty area (and the Campaigns list briefly showed *"No campaigns yet"* before data arrived). This matches the known empty-state-before-skeleton flash. → Gate the empty state on *loaded-once*, not on *loading*.

**B6 — Slow campaign-detail load.** `MEDIUM`
The campaign detail page showed skeletons for ~6–8s on each visit (many sequential `GET`s: validate, content, assets, links, nurture, goals, compliance…). → Parallelize/batch the detail fetches or stream the Setup tab first.

**B7 — `localized_message` returns a raw i18n key.** `LOW`
The maker-checker error's `localized_message` was the literal key `error.campaigns.maker_checker_self_approval` (the plain `message` was fine). Any surface that prefers `localized_message` will show the raw key. → Ensure the key resolves, or fall back to `message`.

### Copy / content mismatches (social campaign, email-centric wording)

**B8 — "Recommended for this objective" recommends email.** `MEDIUM`
On the Purpose & Goals step, the recommendation panel suggested **Channels: email** and **Campaign type: A/B test** for a **Social post** campaign. → Make the recommendation adapt to the chosen delivery type.

**B9 — Goal library has no social-native templates.** `MEDIUM`
The **Add goals** library offered email/CRM goals (Email click rate, Attributed pipeline, Bookings made) — nothing social (Engagement rate, Reach, Impressions, Follower growth) — even though the **custom** goal metric list *does* include Social impressions/engagements/reach/clicks. → Ship social goal templates.

**B10 — CTR template pre-fills email events.** `MEDIUM`
Picking the "Click-through rate" template opened the editor with **numerator `email.clicked`** / **denominator `campaign.message.delivered`** — email events, wrong for a social post. → Seed the numerator/denominator from the campaign's delivery type.

**B11 — Goal "Channel scope" lists only messaging channels.** `MEDIUM`
The custom-goal **Channel scope** offered `email / sms / whatsapp / push / telegram` — **no social networks** for a social goal. → Add social channels (or hide the field when it doesn't apply).

**B12 — Contradictory helper text in the goal editor.** `MEDIUM`
The rate-goal helper read *"Shown as a %, so a 100% target is 0.25"* — self-contradictory and confusing about whether to type `5`, `0.05`, or `0.25`. → Clarify the unit and give one worked example.

**B13 — "the email" wording on a social Assets step.** `LOW`
Step 4 copy says *"images… you'll reference in **the email**"* on a social campaign. → Make the copy delivery-aware.

### UX friction

**B14 — Tall modals / clipped goals section.** `MEDIUM`
On a 1024×768 viewport the in-wizard **Campaign Goals** section is clipped and hard to scroll to, and the custom-goal editor's **Create Goal** button sits ~2 scrolls below the fold. → Cap modal height with a sticky footer action; make the goals section reachable.

**B15 — Stacked modals are confusing.** `MEDIUM`
The template dropdown, the **Goal Library** picker, and the **custom goal** editor can all be open at once (three layered surfaces). → One goal-adding surface at a time.

**B16 — "Manage the library →" leaves the whole wizard.** `MEDIUM`
That link inside the Add-goals modal navigates away from the entire Create-Campaign wizard (the draft is autosaved, but it's jarring and easy to hit by accident). → Open it in a new tab, or make it a clearly secondary action.

**B17 — Duplicate labels in Team dropdowns.** `LOW`
Department and Branch dropdowns contain indistinguishable duplicates (two **Sales**, two **Seychelles**). → De-dupe or disambiguate (append parent/region).

**B18 — "New Campaign" feels unresponsive.** `LOW`
The button navigates to a full-page wizard but with a visible delay and no immediate feedback, so it looks like the first click did nothing. → Add a loading state on click.

**B19 — Nav "Campaigns" badge vs. list.** `LOW`
The sidebar shows a **"9"** badge on *Campaigns* whose meaning is unclear next to the list/overview. → Clarify what the badge counts (e.g. pending approvals) or tooltip it.

### Enhancements

- **Relate the two approval tracks.** Surface post-approval status *on the campaign* (and campaign status on the post) so nothing is left half-approved (ties to B3/B8 flow).
- **Delivery-aware wizard.** Recommendations, goal templates, goal metrics, channel scope, and copy should all switch to "social" once *Social post* is chosen (B8–B13).
- **Suggest a default primary goal** for social (e.g. Engagement rate) and auto-mark it primary.
- **Autosave + resume** already works (the draft survived navigating away) — surface a "Resume draft" entry point on the Campaigns list so users can find it.

---

### Appendix — what was verified live
Login → Marketing/Campaigns → New Campaign wizard (9→5 steps) → Social post delivery → purposes + a custom social goal (*Social clicks ÷ Social reach*, target 5%) → Create (campaign `CMP-2026-0605`) → Social composer (LinkedIn, campaign auto-linked, scheduled 25/10/2026 10:00) → Send for review (422 on missing time, then success) → public approval link → **Approved** → campaign **Submit for Review** → **Review** (editing locked) → self-approve **blocked** by maker-checker.
