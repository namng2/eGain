Technical Support chatbot for a home ISP, Customer Service Chatbot.

No build step, no dependencies, no framework. Three plain files.

Double-click `index.html`. It runs directly from `file://` in any modern
browser.

**Alternative — serve it locally:**

```bash
python3 -m http.server 5500
```

Then open <http://localhost:5500>.


## Approach

I designed around one question: **when the bot can't fix it, can it at least
hand over cleanly instead of making the customer beg for a person?** Two
consequences that show up throughout the flow:

- Every step lets the customer type an answer *or* tap a button *or* say
  "I've already tried this" — so nothing they've already done gets asked
  twice.
- After two failed steps the bot volunteers a person, once, framed as a
  choice. Declining resumes exactly where they left off.

**Content-driven.** The whole conversation lives as one plain data object
(`KB`) at the top of `script.js`. The engine below it walks nodes, matches
keywords and validates numbers, but mentions routers or Wi-Fi nowhere. In a
real deployment support authors could reword steps without a code change —
that's the split eGain's knowledge products are built around, in miniature.

**Four handling of edge cases.** Off-topic phrasing ("cancel my contract")
is caught at the welcome step and routed straight to a person instead of
forced through a troubleshooting tree. Ambiguous input ("my wifi is down"
could be *No internet* or *Can't join Wi-Fi*) shows both candidates and
asks. Gibberish gets a helpful message with the buttons still available.
The speed-test box handles empty, non-numeric, zero, negative and
implausibly high values — each with a message that names the actual
problem.

**A built-in speed test.** The customer can tap "Run a quick test for me"
and the bot simulates the test with a random figure. Routes through the
same ≥60%-of-plan logic as a typed result. In production this would call a
diagnostics API; the flow above it stays identical.

**Ends where it should.** Escalations route to one of three destinations —
hardware, line fault, or an agent — each with its own reason, then the
chat ends. A "No lights at all" answer proves the router is dead before
raising a hardware ticket by trying a power reseat first.



## Screenshots Example


