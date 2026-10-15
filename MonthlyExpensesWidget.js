// Monthly Expenses Widget — Scriptable (iOS)
// Shows Money's monthly totals on the home screen. Tap the widget to open the full chart.
// Setup: paste this whole file into a new Scriptable script named "MonthlyExpenses",
// then add a Scriptable widget and pick that script. See README.md in this folder.

// CONFIG — update these two URLs if the repo name ever changes.
const DATA_URL = "https://moneymoss08.github.io/monthly-expenses-chart/expenses.json";
const CHART_URL = "https://moneymoss08.github.io/monthly-expenses-chart/";

// ---------- helpers ----------
function money(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
function shortDate(iso) {
  // "2026-10-27" -> "Oct 27"
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const parts = iso.split("-");
  return months[parseInt(parts[1], 10) - 1] + " " + parseInt(parts[2], 10);
}
function colorFor(name) {
  if (name === "Bills") return new Color("#0f766e");
  if (name === "Family phones") return new Color("#b45309");
  if (name === "Subscriptions") return new Color("#334155");
  if (name === "Gas") return new Color("#c2410c");
  return new Color("#6b7280");
}

// ---------- load data (fetch, fall back to last cached copy) ----------
const fm = FileManager.local();
const cachePath = fm.joinPath(fm.documentsDirectory(), "monthly-expenses-cache.json");
let data = null;
try {
  const req = new Request(DATA_URL);
  data = await req.loadJSON();
  fm.writeString(cachePath, JSON.stringify(data));
} catch (e) {
  if (fm.fileExists(cachePath)) {
    try { data = JSON.parse(fm.readString(cachePath)); } catch (_ignored) {}
  }
}

// ---------- build widget ----------
const widget = new ListWidget();
widget.url = CHART_URL;
widget.backgroundColor = Color.dynamic(new Color("#f7f3ec"), new Color("#121615"));

function addTitleRow(subtitle) {
  const row = widget.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  const title = row.addText("Monthly Expenses");
  title.font = Font.boldSystemFont(15);
  title.textColor = Color.dynamic(new Color("#1a1f1e"), new Color("#f3f4f1"));
  row.addSpacer();
  const sub = row.addText(subtitle);
  sub.font = Font.systemFont(11);
  sub.textColor = Color.dynamic(new Color("#6b7280"), new Color("#9ca3af"));
}

function addTotalRow(total) {
  const t = widget.addText(money(total));
  t.font = Font.boldSystemFont(30);
  t.textColor = Color.dynamic(new Color("#1a1f1e"), new Color("#f3f4f1"));
}

function addCategoryRow(cat) {
  const row = widget.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  const dot = row.addText("● ");
  dot.font = Font.systemFont(10);
  dot.textColor = colorFor(cat.name);
  const label = row.addText(cat.name);
  label.font = Font.systemFont(13);
  label.textColor = Color.dynamic(new Color("#1a1f1e"), new Color("#f3f4f1"));
  row.addSpacer();
  const amt = row.addText(money(cat.amount));
  amt.font = Font.boldSystemFont(13);
  amt.textColor = Color.dynamic(new Color("#1a1f1e"), new Color("#f3f4f1"));
}

function addNextDue(next) {
  const row = widget.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  const label = row.addText("Next due: ");
  label.font = Font.boldSystemFont(12);
  label.textColor = Color.dynamic(new Color("#1a1f1e"), new Color("#f3f4f1"));
  const value = row.addText(next.name + " " + money(next.amountDue) + " · " + shortDate(next.due));
  value.font = Font.systemFont(12);
  value.textColor = Color.dynamic(new Color("#1a1f1e"), new Color("#f3f4f1"));
}

if (!data) {
  // Offline and nothing cached yet.
  widget.addSpacer();
  const t = widget.addText("Monthly Expenses");
  t.font = Font.boldSystemFont(15);
  t.textColor = Color.dynamic(new Color("#1a1f1e"), new Color("#f3f4f1"));
  const e = widget.addText("Couldn't load numbers. Tap to open the chart.");
  e.font = Font.systemFont(12);
  e.textColor = Color.dynamic(new Color("#6b7280"), new Color("#9ca3af"));
  widget.addSpacer();
} else if (config.widgetFamily === "small") {
  addTitleRow("Updated " + (data.updated || ""));
  widget.addSpacer(6);
  addTotalRow(data.monthlyTotal);
  widget.addSpacer(6);
  addNextDue(data.nextDue);
  widget.addSpacer();
} else {
  // Medium (and large) layout: total + all categories + next due.
  addTitleRow("Updated " + (data.updated || ""));
  widget.addSpacer(4);
  addTotalRow(data.monthlyTotal);
  widget.addSpacer(8);
  for (const cat of data.categories) {
    addCategoryRow(cat);
  }
  widget.addSpacer(8);
  addNextDue(data.nextDue);
  widget.addSpacer();
}

// ---------- present ----------
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}
Script.complete();
