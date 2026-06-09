# 🌍 AI Footprint — *Where does your carbon really come from?*

> A friendly little calculator that lets you poke at the knobs of your own life and watch your carbon footprint rearrange itself in real time — with a special, slightly stubborn insistence on putting **AI usage** in its proper place in the pecking order.

**▶ Live site:** **https://lloydlentz.github.io/ai-footprint/**

---

## The one-sentence pitch

Everyone has a hunch about what's wrecking the planet on their behalf, and almost everyone's hunch is a little bit wrong. This tool exists to gently correct the hunch.

## The slightly-longer pitch

There is a popular and very modern flavor of climate guilt that goes something like: *"I asked a chatbot to rewrite my email three times this morning — am I personally melting a glacier?"*

It's a fair question, asked in good faith, and it deserves a real answer rather than a vibe. So this page does something almost rude in its simplicity: it puts a year of your AI habit on the **same chart**, in the **same units**, next to your car, your flights, your furnace, and your dinner — and lets the bars speak for themselves.

Spoiler, delivered with love: the bar for "a whole year of AI prompts" is the one you'll need a magnifying glass to find. A single transatlantic flight will tower over it like a redwood standing next to a blade of grass. This is **not** a free pass to ignore the topic — the page is careful to note that the global, data-center-scale story is genuinely large and growing. It's simply a plea to spend your worry where your worry actually moves the needle.

---

## What you can fiddle with

Drag, click, and toggle to your heart's content. Nothing is saved, nothing is judged, and the planet is not actually watching (the page is).

- 🚗 **Car travel** — miles per year, and whether you're piloting a thirsty pickup or a smug little EV.
- ✈️ **Air travel** — short hops vs. intercontinental hauls, with your estimated miles flown tallied for you.
- 🏠 **Home energy** — including the long-requested **dorm / apartment / house / large home** spectrum, because "the average household" is doing a lot of heavy lifting in most calculators and not everyone owns a furnace and a lawn.
- 🥗 **Diet** — from "meat with most meals" to full vegan, because what's on the plate matters more than most people expect.
- ♻️ **Waste & recycling** — how much of your trash actually gets a second life.
- 🤖 **AI usage** — prompts per day, and whether they're quick text questions or chunky image generations.
- ✅ **The good-intentions checklist** — compost the scraps, switch to a renewable electricity plan, bike the short trips, line-dry the laundry. Watch your total quietly shrink.

Everything is reported in **US units** — pounds, short tons, gallons, miles — and crowned with a **dial gauge** that shows where you land against the **US average (~17.6 tons)** and the **world average (~5.2 tons)**.

---

## How to read the gauge without spiraling

- **Green zone:** lovely, keep going.
- **Yellow zone:** you and most of your neighbors. Welcome.
- **Red zone:** usually it's the flights. It's almost always the flights.

The needle is honest but not unkind. Its job is information, not shame.

---

## A word on the numbers (the respectful part)

These estimates are **illustrative**, built from published average emission factors — not a forensic audit of your life. Your real footprint depends on your local electricity grid, who you share a roof with, how cold your winters get, and a hundred other things this page politely declines to interrogate.

Headline factors used:

- Typical passenger vehicle ≈ **400 g CO₂ / mile** (EPA)
- A modern ChatGPT-style query ≈ **0.3 Wh** and a few drops of water (Epoch AI; OpenAI)
- The world's data centers used roughly **415 TWh** in 2024 — about 1.5% of global electricity — and the IEA projects that could roughly double by 2030
- Diet figures drawn from commonly cited life-cycle studies (meat-heavy ≈ 3.3 t → vegan ≈ 1.5 t CO₂e/yr)

The categories here cover **transport, home energy, food, waste, and AI**. They deliberately leave out purchased goods, public services, and that one impulse buy you regret — so totals sit a bit below full per-capita figures. Full sources are linked at the bottom of the page itself.

---

## Running it yourself

It's one self-contained `index.html` file. No build step, no dependencies, no `node_modules` black hole. Two ways to run it:

1. **Just open it.** Double-click `index.html`. It works offline. That's the whole trick.
2. **Serve it locally**, if you prefer a proper URL:
   ```bash
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```

Want to tweak the assumptions? The two factors doing the most work — grid carbon intensity (`0.40 kg/kWh`) and energy per AI prompt (`0.3 Wh`) — live near the top of the `<script>` block, clearly labeled and waiting for your improvements.

---

## The takeaway, embroidered on a pillow

> Be curious about AI's footprint. Be **honest** about where the big numbers actually live.
> Then go ahead and ask the chatbot to rewrite that email a fourth time. It's fine. Truly.

---

*Built as part of a broader conversation about the environmental impact of AI. Numbers researched and cross-checked; whimsy included at no extra carbon cost.* 🌱
