"use strict";

/* plan of customer*/
const PLAN = 500;


const KB = {

  welcome: {
    say: ["Hi, I'm your Internet Support assistant. What's happening with your internet?"],
    hint: "Tap one, or describe it in your own words",
    opts: [
      { label: "No internet at all", to: "lights",
        kw: ["no internet", "nothing", "offline", "dead", "down", "not working", "disconnected"] },
      { label: "Everything is slow", to: "speed",
        kw: ["slow", "buffering", "lag", "crawling", "streaming"] },
      { label: "Can't join my Wi-Fi", to: "ssid",
        kw: ["cant find", "can't find", "password", "won't connect", "wont connect", "not listed", "join wifi", "wifi"] }
    ]
  },

  /* branch A: no internet */
  lights: {
    say: ["Let's start at the router — one look tells us the most."],
    steps: ["Find the router.", "Look at the power light and the internet or globe light."],
    ask: "Which is closest to what you see?",
    opts: [
      { label: "All steady, no red", to: "cycle",
        kw: ["steady", "green", "normal", "fine", "white"] },
      { label: "Red or orange light", to: "outage", result: "fail",
        kw: ["red", "orange", "amber", "warning"] },
      { label: "No lights at all", to: "power", result: "fail",
        kw: ["no lights", "dark", "dead", "off"] }
    ]
  },

  power: {
    say: ["Before we call it a hardware fault, let's make sure it's actually getting power."],
    steps: [
      "Follow the power cable from the router to the wall socket.",
      "Unplug it, wait ten seconds, and plug it firmly back in.",
      "Watch the router for any lights coming on."
    ],
    ask: "Any lights now?",
    skipTo: "hardware",
    opts: [
      { label: "Yes, lights are on", to: "fixed",
        kw: ["yes", "lights", "on", "back", "working"] },
      { label: "Still nothing", to: "hardware", result: "fail",
        kw: ["no", "nothing", "still", "dead"] }
    ]
  },

  outage: {
    say: ["A fault light usually points upstream. Let me check the network before we take anything apart."],
    input: { placeholder: "Enter your postcode", button: "Check network", handler: "outage" }
  },

  outage_yes: {
    end: true,
    say: ["There's a confirmed incident in your area — nothing wrong at your end.",
          "Should be back within a few hours, and you'll get a text when it's fixed."]
  },

  cycle: {
    say: ["This clears about half of the faults we see, so it's worth doing properly rather than quickly."],
    steps: [
      "Unplug the router at the wall. Not the button — the plug.",
      "Wait a full thirty seconds.",
      "Plug it back in and give it two minutes to settle."
    ],
    ask: "How's it looking?",
    skipTo: "cable",
    opts: [
      { label: "That fixed it", to: "fixed",
        kw: ["fixed", "worked", "working", "yes", "back", "online"] },
      { label: "No change", to: "cable", result: "fail",
        kw: ["no", "nothing", "same", "still"] }
    ]
  },

  cable: {
    say: ["Then let's check the cabling — loose or split connections are next most common."],
    steps: [
      "Follow the cable from the wall socket to the router.",
      "Unplug and firmly reseat both ends.",
      "If there's a splitter, connect straight to the wall."
    ],
    ask: "Any change?",
    skipTo: "line",
    opts: [
      { label: "Back online", to: "fixed",
        kw: ["yes", "fixed", "back", "working"] },
      { label: "Still nothing", to: "line", result: "fail",
        kw: ["no", "nothing", "still"] }
    ]
  },

  /* branch B: slow */
  speed: {
    say: ["Let's get a number rather than a feeling.",
          "I can test your connection from here, or run speedtest.net yourself and type the download figure."],
    input: { placeholder: "Download speed in Mbps", button: "Log result", handler: "speed",
             quick: { label: "Run a quick test for me", handler: "quicktest" } }
  },

  wifi: {
    say: ["That's close to your plan speed, so the line is healthy. What you're feeling is coverage."],
    steps: [
      "Move the router off the floor and out of any cabinet.",
      "Keep it away from the TV, microwave and cordless phone.",
      "Try the network ending in -5G if you see one."
    ],
    ask: "How does it feel now?",
    skipTo: "line",
    opts: [
      { label: "Much better", to: "fixed",
        kw: ["better", "fixed", "yes", "working"] },
      { label: "No difference", to: "line", result: "fail",
        kw: ["no", "same", "still"] }
    ]
  },

  /* branch C: can't join Wi-Fi*/
  ssid: {
    say: ["Let's find out whether the network is being broadcast."],
    ask: "Can you see your network name in the Wi-Fi list?",
    opts: [
      { label: "Yes, password refused", to: "password",
        kw: ["yes", "password", "wrong", "rejected", "incorrect"] },
      { label: "No, it isn't listed", to: "radio", result: "fail",
        kw: ["no", "not listed", "hidden", "gone", "missing"] }
    ]
  },

  radio: {
    say: ["If the name isn't there, the radio is off or the router needs a restart."],
    steps: [
      "Check the Wi-Fi symbol is lit. If there's a Wi-Fi button, hold it for five seconds.",
      "Otherwise unplug the router for thirty seconds and wait two minutes."
    ],
    ask: "Is the network showing now?",
    opts: [
      { label: "Yes, I can see it", to: "password",
        kw: ["yes", "showing", "visible", "back"] },
      { label: "Still not showing", to: "hardware", result: "fail",
        kw: ["no", "still", "nothing"] }
    ]
  },

  password: {
    say: ["Wi-Fi passwords are case-sensitive and the printed key is easy to misread."],
    steps: [
      "Find the label on the underside of the router.",
      "Type the key exactly — watch for 0 vs O and 1 vs l.",
      "If the device saved an old password, Forget the network first, then rejoin."
    ],
    ask: "Did it accept it?",
    skipTo: "agent",
    opts: [
      { label: "I'm connected", to: "fixed",
        kw: ["yes", "connected", "worked", "in"] },
      { label: "Still rejected", to: "agent", result: "fail",
        kw: ["no", "rejected", "still"] }
    ]
  },

  /* endings */
  fixed: {
    end: true,
    say: ["Nice — glad that sorted it."],
    ask: "Anything else?",
    opts: [
      { label: "No, all good", to: "close", kw: ["no", "good", "great", "thanks"] },
      { label: "Actually, it's playing up again", to: "agent",
        kw: ["again", "broken", "back", "still"] }
    ]
  },

  close: { end: true, say: ["All done. Take care."] },

  hardware: { escalate: true, say: ["That looks like a hardware issue with the router itself."] },
  line:     { escalate: true, say: ["We've cleared everything at your end, so this looks like a line fault."] },
  agent:    { escalate: true, say: ["Of course."] }
};

/* keyword that isn't internet fault, route it to a agent instead of
   forcing the customer through the troubleshooting tree. */
const OUT_OF_SCOPE = /\b(bill|billing|invoice|charge|refund|cancel|contract|upgrade|plan|price|pricing)\b/i;


/* Shorthand: element by id, delay. */
const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));

/* Session state */
const s = {};

/* Clears the conversation and all state */
function reset() {
  Object.assign(s, { at: null, fails: 0, offered: false });
  $("stream").innerHTML = "";
  $("rail").innerHTML = "";
  go("welcome");
}

/* Render Chat */
function say(text, who, mod) {
  const row = document.createElement("div");
  row.className = "msg " + who;
  row.innerHTML = `<div class="av">${who === "you" ? "Y" : "S"}</div><div class="bub ${mod || ""}"></div>`;
  row.querySelector(".bub").textContent = text;
  $("stream").appendChild(row);
  scroll();
}

/* Renders a numbered "Try this" instruction card. */
function stepList(list) {
  const el = document.createElement("div");
  el.className = "steps";
  el.innerHTML = `<h4>Try this</h4><ol>${list.map(() => "<li></li>").join("")}</ol>`;
  el.querySelectorAll("li").forEach((li, i) => li.textContent = list[i]);
  $("stream").appendChild(el);
  scroll();
}

/* Shows or hides the typing indicator. */
function typing(on) {
  const old = $("typing");
  if (old) old.remove();
  if (!on) return;
  const row = document.createElement("div");
  row.id = "typing"; row.className = "msg bot";
  row.innerHTML = '<div class="av">S</div><div class="bub dots"><i></i><i></i><i></i></div>';
  $("stream").appendChild(row);
  scroll();
}

/* Keeps the newest message in the view */
function scroll() { $("stream").scrollTop = $("stream").scrollHeight; }

/* Actuin handler. */
function mkBtn(label, cls, fn) {
  const b = document.createElement("button");
  b.className = cls;
  b.textContent = label;
  b.onclick = fn;
  return b;
}


async function go(id) {
  const node = KB[id];
  if (!node) return;
  s.at = id;
  $("rail").innerHTML = "";

  typing(true);
  await wait(600);
  typing(false);
  (node.say || []).forEach(t => say(t, "bot"));
  if (node.steps) stepList(node.steps);
  if (node.ask) say(node.ask, "bot");

  if (node.escalate) return handover();
  if (node.input)    return renderInput(node);
  if (node.opts)     return renderReply(node);

  const wrap = document.createElement("div");
  wrap.className = "opts";
  wrap.appendChild(mkBtn("Start over", "opt go", reset));
  $("rail").appendChild(wrap);
}

/* Make Typing always allow instead of just button */
function renderReply(node) {
  const opts = node.opts.slice();
  if (node.skipTo) {
    opts.push({ label: "I've already tried this", to: node.skipTo, result: "fail", cls: "skip" });
  }

  const wrap = document.createElement("div");
  wrap.className = "opts";
  opts.forEach(o => wrap.appendChild(mkBtn(o.label, "opt " + (o.cls || ""), () => choose(o))));
  $("rail").appendChild(wrap);

  const form = document.createElement("div");
  form.className = "entry";
  const inp = document.createElement("input");
  inp.type = "text";
  inp.placeholder = node.hint || "Or type your answer";
  const submit = () => {
    const v = inp.value.trim();
    if (!v) return;
    inp.value = "";
    handleFreeText(v, node);
  };
  inp.onkeydown = e => { if (e.key === "Enter") submit(); };
  form.append(inp, mkBtn("Send", "opt", submit));
  $("rail").appendChild(form);
}

/* Routes a typed answer, to out of scope chat */
function handleFreeText(text, node) {
  say(text, "you");

  if (node === KB.welcome && OUT_OF_SCOPE.test(text)) {
    say("That sounds like a billing or account question rather than a fault.", "bot", "warn");
    return setTimeout(() => go("agent"), 800);
  }

  const t = " " + text.toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/ +/g, " ") + " ";
  const hits = node.opts.filter(o => o.kw && o.kw.some(k => t.includes(" " + k + " ")));

  if (hits.length === 0) {
    say("I couldn't match that. Try one of the options above, or describe it differently.", "bot", "warn");
    return;
  }

  if (hits.length > 1) {
    $("rail").innerHTML = "";
    say("A few things could fit. Which is closest?", "bot", "warn");
    const wrap = document.createElement("div");
    wrap.className = "opts";
    hits.forEach(o => wrap.appendChild(mkBtn(o.label, "opt", () => choose(o))));
    $("rail").appendChild(wrap);
    return;
  }

  choose(hits[0], true);
}

/* Applies a chosen option, echoes it as the user's message, counts failures, and moves on. After two failed
   steps it interrupts once to offer a person — framed as the customer's
   choice, and declining resumes exactly where they left off. */
async function choose(o, silent) {
  $("rail").innerHTML = "";
  if (!silent) say(o.label, "you");
  if (o.result === "fail") s.fails++;

  const target = KB[o.to] || {};
  if (s.fails >= 2 && !s.offered && !target.escalate && !target.end) {
    s.offered = true;
    typing(true); await wait(650); typing(false);
    say("We've ruled out the usual causes and this doesn't look like something we'll fix here.", "bot");
    say("I can keep going, or connect you with a person now. Your call.", "bot");
    return renderReply({
      opts: [
        { label: "Connect me now", to: "agent", cls: "warm",
          kw: ["connect", "person", "agent", "human", "yes", "now"] },
        { label: "Let's keep trying", to: o.to, cls: "skip",
          kw: ["keep", "try", "trying", "continue", "no"] }
      ]
    });
  }
  go(o.to);
}

/* Renders a structured input (postcode, speed figure) wired to a named
   handler. Deliberately a text box, not type="number": the browser would
   silently swallow bad entries, and the point is to catch them ourselves
   and explain what's wrong. On a validation error the handler leaves the
   form in place, so the customer can correct their entry without the
   node replaying. */
function renderInput(node) {
  if (node.input.quick) {
    const wrap = document.createElement("div");
    wrap.className = "opts";
    wrap.appendChild(mkBtn(node.input.quick.label, "opt go",
      () => HANDLERS[node.input.quick.handler]()));
    $("rail").appendChild(wrap);
  }

  const form = document.createElement("div");
  form.className = "entry";
  const inp = document.createElement("input");
  inp.type = "text";
  inp.placeholder = node.input.placeholder;
  const submit = () => HANDLERS[node.input.handler](inp.value.trim());
  inp.onkeydown = e => { if (e.key === "Enter") submit(); };
  form.append(inp, mkBtn(node.input.button, "opt", submit));
  $("rail").appendChild(form);
  if (!node.input.quick) inp.focus();
}

/* Handlers for structured inputs. Each rejection names the actual
   problem instead of a generic "I didn't understand". */
const HANDLERS = {

  /* Speed test: at or above 70% of the plan the line is healthy */
  speed(v) {
    const n = Number(v);
    const err =
      v === ""     ? "I need a number from the test." :
      !isFinite(n) ? "That's not a number." :
      n <= 0       ? "A speed test won't return zero or a negative number." :
      n > 2000     ? "That's higher than any home connection." : null;
    if (err) return say(err, "bot", "warn");

    say(n + " Mbps", "you");
    if (n / PLAN < 0.7) s.fails++;
    go(n / PLAN >= 0.7 ? "wifi" : "line");
  },

  /* Mock built in speed test. */
  async quicktest() {
    say("Run a quick test for me", "you");
    $("rail").innerHTML = "";
    typing(true); await wait(1600); typing(false);
    const n = 50 + Math.floor(Math.random() * 500);
    say("Test complete — you're getting " + n + " Mbps right now.", "bot");
    if (n / PLAN < 0.6) s.fails++;
    go(n / PLAN >= 0.6 ? "wifi" : "line");
  },

  /* For the demo: postcodes ending in an even digit have an active incident. */
  async outage(code) {
    if (!code || !/\d/.test(code)) {
      return say("I need a postcode.", "bot", "warn");
    }
    say(code, "you");
    typing(true); await wait(1000); typing(false);
    const hit = Number(code.replace(/\D/g, "").slice(-1)) % 2 === 0;
    go(hit ? "outage_yes" : "cycle");
  }
};

/* Ends the conversation on a handover. */
async function handover() {
  await wait(280);
  say("Connecting you now, someone will pick this up in a moment.", "bot");

  const wrap = document.createElement("div");
  wrap.className = "opts";
  wrap.appendChild(mkBtn("Start over", "opt", reset));
  $("rail").appendChild(wrap);
}

reset();
