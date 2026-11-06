# Creating an Ad Campaign in DigiCRM — Runbook + UX Review

**Walkthrough performed:** 2026-10-19 · tenant **ACME** (user *John Doe*, Admin) · built from an actual end-to-end run.
**Example campaign created:** *"Diwali Paid Ads Push — Oct 2026"* (code `CMP-2026-0606`), with one LinkedIn ad draft *"Diwali Offer — LinkedIn Single Image"*.

Companion to **[Campaign-Social-Media-Guide.md](./Campaign-Social-Media-Guide.md)**. The campaign wizard and approval lifecycle are shared between Social and Ad campaigns; this runbook focuses on what's **different for Ads** and lists the issues found.

Two parts: **Part A — step-by-step runbook**, **Part B — issues & enhancements**.

---

## Part A — Step-by-step runbook

### Key differences from a Social campaign
- Delivery type is **Ad**; ads are composed in the **Ads composer** (`Marketing → Ads → Publish ads`), not the Social composer.
- Every ad is created **PAUSED**. *Nothing spends* until (1) a **second person approves** it and (2) you switch it on in the platform's own Ads Manager.
- There are **two approval tracks**, same as social: the **campaign lifecycle** (`Draft → Review → Approved → …`) and the **ad approval** (`draft → pending approval → approved/published-paused`). Both enforce **maker-checker** (you can't approve your own).

### Step 1 — Create the campaign
1. **Marketing → Campaigns → + New Campaign** → wizard at `/campaigns/new`.
2. **Step 1 · Basics** — Name (e.g. `Diwali Paid Ads Push — Oct 2026`), Description, optional Team/Tags. **Next**.
3. **Step 2 · Delivery** — choose **Ad** (*"Compose and publish ads (paused) to Meta, Google or LinkedIn"*). The wizard collapses from **9 steps to 5**. **Next**.

### Step 2 — Purpose & Goals
1. Tick the purposes that fit (e.g. **Sales Promotion**, **Acquisition**).
2. Add a goal — click **Custom goal**. For ads, pick an **ad metric**: the metric list includes **Ad impressions / Ad clicks / Ad conversions** (plus Web conversions, Attributed revenue, ROI %…).
   - Example: *Goal type* **Metric target**, *Metric* **Ad conversions**, *Success* **At least (≥)**, *Target* **50**.
   - ✅ Tick **Primary goal (used as the main success metric)** so the campaign passes readiness cleanly.
   - Click **Create Goal**.
3. **Next** through **Assets & Links** (optional) to **Review & Create**.

### Step 3 — Review & Create
- Confirm the summary (Purpose, Goal). With a primary goal set, the **Readiness check** reads *"Everything checks out."*
- Click **Create campaign** → the campaign is created as **Draft** (code auto-generated) and opens on its **Setup** page.

### Step 4 — Compose the ad
1. On the campaign **Setup** tab, click **Open the Ads composer →** (`/marketing/ads?tab=publish&campaign=<id>`).
2. **Pick a Publisher** — Meta Ads / Google Ads / LinkedIn Ads. *(On this server only LinkedIn has a connected account — see B-A4.)*
3. Fill the inline **New ad** form:
   - **Ad name**, **Account**, **Counts toward** (the campaign — pre-filled from the deep link; UTM/ROI attribution).
   - **Ad type** — Single image / Text ad / Lead gen.
   - **Objective** — Brand awareness / Website visits / Engagement / Lead generation / Website conversions.
   - **Budget** (min **10**, max **5,000** per draft) and **Budget period** (Daily / Total).
   - **Targeting** — saved audience, or LinkedIn fields (Locations, Job titles, Job functions, Seniorities, Company sizes, Industries).
   - **Creative** — Headline, Body text, Image URL, Destination link; optional Start date.
4. Click **Create draft**. The ad is saved as **draft**.
   - *If it doesn't appear in the list, reload and re-select the publisher — see B-A1.*

### Step 5 — Submit the ad for approval
- On the ad's row click **Submit for approval**. Status becomes **pending approval**; the row's actions change to **Approve & publish (paused)** and **Send back**.

### Step 6 — Approve & publish (second person)
- A **different user** opens the ad and clicks **Approve & publish (paused)**. (The submitter cannot — maker-checker; see B-A5.)
- On approval the ad is pushed to the platform **PAUSED**. **Nothing spends yet.**
- Finally, switch the ad **on** in the platform's own **Ads Manager** (Meta/LinkedIn). Spend starts only then.

### Step 7 — Campaign approval & results
- Back on the campaign, **Submit for Review** → readiness gate → **Review** (editing locks). A second user **Approves** it (maker-checker). Lifecycle then runs `Approved → Scheduled → Active → Completed`.
- Track spend/ROI under **Marketing → Ads** (Conversions tab) and the campaign's goal attainment.

> **Demo note:** on this server **Google Ads** and **Meta Ads** show *"Not set up on this server yet — an administrator adds the app keys first,"* and the **LinkedIn** demo account shows *"The account's connection was removed."* So you can compose and submit, but real publishing is simulated.

---

## Part B — Issues, UX problems & enhancements

### Ad-specific findings

**B-A1 — New ad draft not shown until reload.** `MEDIUM`
`POST /marketing/ads/drafts` returned **201** and the API's draft list returned the new ad, but the **Publish ads** table kept showing only the pre-existing ad. The new draft appeared only after a page reload **and** re-selecting the publisher. → Refresh the list from the create response (optimistic insert or refetch).

**B-A2 — Submit-for-approval doesn't update the row.** `MEDIUM`
`POST …/submit` returned **200**, but the ad row still showed **draft / Submit for approval** until a reload (then it correctly showed **pending approval / Approve & publish**). → Update the row from the submit response.

**B-A3 — Ads list is empty until a publisher is selected.** `MEDIUM`
On load the Publish-ads table reads *"No ads composed yet,"* even though ads exist; it only populates once you click a **Publisher** radio (the list is scoped to the selected publisher). This reads as "I have no ads." → Default to a publisher (or show all ads grouped) and don't show the empty state while a publisher is unselected.

**B-A4 — "Meta / Google / LinkedIn" promised, but none are actually usable here, and the copy contradicts itself.** `MEDIUM`
The delivery card says ads publish *"to Meta, Google or LinkedIn,"* the Publish-ads banner says *"Meta is supported first; Google and LinkedIn are coming,"* yet on this server **both Meta and Google show "Not set up"** and only a **LinkedIn** demo account exists (and it's in an error state). The three messages don't agree. → Reconcile the capability copy with what's actually connected; gray out/annotate publishers without an account.

**B-A5 — Self-approval is blocked (good) but the reason is hidden.** `MEDIUM`
Approving your own ad returns `403 AUTH_PERMISSION_DENIED` whose **`message`** is clear — *"The person who submitted an ad can't approve their own — a second approver is needed"* — but the UI toast shows the generic **`localized_message`** *"You don't have permission to perform this action."* (The **campaign** approval toast, by contrast, shows the clear `message`.) → Surface `message`, or localize it properly; be consistent with the campaign flow.

**B-A6 — "Approve & publish" is offered to the submitter, then dead-ends.** `MEDIUM`
Same pattern as the social/campaign flow: the submitter sees the **Approve & publish (paused)** button but is blocked on click. → Hide/disable it for the submitter and label it *"awaiting a second approver."*

**B-A7 — No live ad preview.** `LOW` *(enhancement)*
The social composer shows a rich per-network **live preview**; the ad composer is a plain form with no preview of the headline/body/image/CTA as it will appear on the platform. → Add an ad preview card.

**B-A8 — Budget guardrails are good but under-explained.** `LOW`
The composer shows *"Minimum budget: 10, Budget limit per ad: 5,000"* and the API enforces `max_budget_per_draft: 5000`. There is **no campaign-level budget** — budget lives only per-ad. → Note where the 5,000 cap comes from (per draft, not per campaign) and consider a campaign budget rollup.

### Findings shared with the Social flow (confirmed again for Ads)

**B-A9 — Objective recommendation still suggests email/SMS for an Ad campaign.** `MEDIUM`
On Purpose & Goals, the **"Recommended for this objective"** panel recommended **Channels: email, sms** and *"A/B the hook on email + SMS"* for an **Ad** campaign — identical to the mismatch seen on the social campaign. The recommendation is driven by **purpose only** and ignores the **delivery type**. → Make recommendations delivery-aware.

**B-A10 — "Email" secondary badge on an Ad campaign.** `LOW`
The campaign header shows **"Ad"** *and* **"Email"** badges (the social campaign likewise showed "Social post" + "Email"). The extra Email badge's meaning is unclear for an ad campaign. → Clarify or remove.

**B-A11 — Type shows "Regular Campaign" on Review.** `LOW`
The Review summary's **Type** is *"Regular Campaign"* and doesn't reflect the **Ad** delivery choice. → Surface the delivery type in the summary.

**B-A12 — Slow detail/module loads.** `MEDIUM`
The campaign detail and the Ads module both showed multi-second skeleton loads. → Parallelize/stream the initial fetches.

**B-A13 — Create-then-navigate timing (B1 from the social guide) is intermittent.** `INFO`
For this Ad campaign, **Create campaign** redirected to the detail page after ~3s; for the earlier social campaign it had **not** navigated at 2s (button re-enabled on the wizard, duplicate risk). So B1 is a **slow/intermittent redirect**, not a hard failure — the fix (redirect on success + keep the button disabled until navigation) still fully covers it.

### What works well (Ads)
- **Safe by default:** every ad is created **PAUSED**; nothing spends until a second person approves and you switch it on in the platform — clearly messaged.
- **Maker-checker** enforced on both the ad and the campaign (`allow_self_approve: false`).
- **Budget guardrails** (min 10, max 5,000/draft) enforced server-side and shown inline.
- **Ad-native goal metrics** exist (Ad impressions / clicks / conversions) — unlike the social goal *library*, the metric picker does cover ads.
- Setting a **primary goal** in the wizard yields a clean readiness check (*"Everything checks out"*).

---

### Appendix — what was verified live
Login → New Campaign wizard (9→5 steps) → **Ad** delivery → purposes (Sales Promotion, Acquisition) + primary goal **Ad conversions ≥ 50** → Create (`CMP-2026-0606`, redirected to detail) → Ads composer (LinkedIn publisher, campaign auto-linked, budget 5,000/daily, Website-conversions objective) → **Create draft** (201; not shown until reload) → **Submit for approval** (200 → *pending approval*) → self **Approve & publish** blocked by maker-checker (`403`, generic toast).
