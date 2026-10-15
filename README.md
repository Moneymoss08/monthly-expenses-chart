# Monthly Expenses Widget — setup

## What it is
A Scriptable widget that shows the monthly totals on the home screen
(monthly total, Bills, Family phones, Subscriptions, Gas, and next bill due).
Tapping the widget opens the full chart page. It cannot render the full chart
itself — iPhone widgets don't show web pages.

## Files
- `MonthlyExpensesWidget.js` — paste this into the Scriptable app.
- `expenses.json` — the numbers the widget reads. Published next to the chart
  page on GitHub Pages. Marlowe updates it with the monthly check.

## Setup (once the Pages site is live)
1. Install the free **Scriptable** app from the App Store.
2. In Scriptable, tap `+`, paste in `MonthlyExpensesWidget.js`, name it
   `MonthlyExpenses`.
3. Long-press the home screen → `+` → **Scriptable** → pick Small or Medium
   → choose the `MonthlyExpenses` script → Add Widget.
4. Tap the widget anytime to open the full chart.

## Notes
- The widget reads `expenses.json` from the Pages site. If the site is down
  or the phone is offline, it shows the last numbers it successfully loaded.
- iOS refreshes widgets on its own schedule, so numbers can lag a few hours
  after an update to `expenses.json`. This is normal.
- If the widget shows "Couldn't load numbers", check internet, then check
  that the Pages site is live.
