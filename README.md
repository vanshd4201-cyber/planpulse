# PlanPulse ✨ GenAI Event Planning Assistant

> 🌐 **Live Application Link**: [https://vanshd4201-cyber.github.io/planpulse/](https://vanshd4201-cyber.github.io/planpulse/)

PlanPulse is a modern, GenAI-powered planning suite designed to organize **Weddings**, **Birthdays**, **Community Gatherings**, and **Corporate Events** with intelligent budget optimization, master countdown timelines, day-of run-of-show itineraries, vendor vetting checklists, interactive table seating arrangements, and creative concept studios.

Built collaboratively through **vibe coding** with interactive customization.

---

## 🚀 Quick Start

### Option 1: Instant Browser Launch (Zero Install)
Simply double-click `index.html` or open it directly in Chrome, Edge, Safari, or Firefox.

### Option 2: Local HTTP Server (Recommended)
Run the bundled Python server:
```powershell
python server.py
```
Then open your browser to **[http://localhost:8000](http://localhost:8000)**.

---

## 🌟 Core Feature Suite

### 1. 🔮 One-Click AI Magic Event Planner
- Enter any natural language event prompt (e.g., *"Retro arcade 30th birthday for 45 guests with craft brews on a $4,000 budget"* or *"Romantic Tuscan garden wedding for 120 guests"*).
- The AI automatically calculates realistic category budget allocations, drafts the milestone countdown, creates the day-of run-of-show, suggests top vendor categories with realistic quotes, and brews tailored creative themes!

### 2. 💰 Intelligent Budget Planner & AI Advisor
- **High-level Financial Metrics**: Target Budget Ceiling, Total Estimated Costs, Actual Paid / Committed, and Real-Time Buffer / Runway.
- **Dynamic Category Allocation**: Visual distribution meters for Venue, Catering, Photo/Video, Decor, Entertainment, Logistics, and Contingency.
- **Payment Pipeline Tracking**: Toggle between `Unpaid`, `Deposit Paid`, and `Paid in Full`.
- **AI Budget Advisor**: Instant audit identifying the top 3 high-impact cost-saving opportunities, contract hidden-fee warnings, and vendor negotiation scripts.

### 3. ⏱️ Master Timeline & Day-of Run of Show
- **Dual Perspective Switcher**:
  - **Milestone Countdown**: Month-by-month and week-by-week deadlines leading up to the event with celebration confetti triggers.
  - **Day-of Run of Show / Itinerary**: Minute-by-minute execution schedule with assigned leads (MC, DJ, Coordinator, Banquet Lead) and operational cue notes.

### 4. 👥 Interactive Guest List & RSVP Tracker
- **Headcount & Attendance Metrics**: Tracks primary guests and plus-ones with instant percentage confirmation rate.
- **Dietary & Catering Breakdown**: Live counts for Vegetarian, Vegan, Gluten-Free, Nut Allergies, and custom dietary requests to hand directly to caterers.
- **AI RSVP Reminder Copywriter**: One-click generation of polite, friendly, or urgent reminder messages (for WhatsApp, SMS, or Email) with copy-to-clipboard.
- **Fast Status Cycling**: Instantly cycle guest RSVP status (`Pending` -> `Attending` -> `Declined`) with celebratory confetti.
- **Direct Seating Integration**: Live table assignment column with one-click links to the Seating Chart.

### 5. 🪑 Interactive Table & Seating Chart Planner
- **Visual Floor Layout**: Manage tables by shape (`Round ⭕`, `Rectangular ▭`, `Sweetheart 💖`, `High-Top 🍸`, `Lounge Booth 🛋️`), capacities, and location notes (e.g. "quiet patio", "stage right").
- **Live Seat Availability Meters**: Real-time progress indicators showing full tables, seats available, and over-capacity warnings.
- **Dietary Alerts Flagging**: Visual allergy tags (`🥦 Veg`, `🌾 Gluten-Free`, `⚠️ Nut Allergy`, `🌱 Vegan`) directly on seated guest cards for effortless banquet coordination.
- **Unassigned Guests Drawer**: Instant search and 1-click table assignment dropdown for attending guests awaiting seating.
- **AI Seating Strategist**: Algorithmic grouping of guests by social affinities, group relationships, and kitchen dietary safety protocols with one-click auto-application and celebration confetti.
- **Catering Run Sheet Export**: Formatted printable text sheet with copy-to-clipboard and direct `window.print()` support.

### 6. 📋 Vendor Directory & AI Interview Assistant
- Track vendors across Venue, Catering, Audio/Visual, Floral/Decor, Entertainment, Safety & Permits.
- **Vendor Pipeline Badges**: `Researching`, `Contacted`, `Quoted`, `Hired`, and `Rejected`.
- **AI Vetting Assistant**: One-click AI generation of 4 critical interview questions, red flags to look out for, and essential contract clauses for each specific vendor category before signing.

### 7. 🎨 GenAI Idea Studio & Creative Hub
- **Theme & Palette Generator**: Aesthetic moodboard concepts, lighting suggestions, and complementary color palettes.
- **Interactive Activities & Games**: Unique icebreaker games, ceremony traditions, and crowd engagement moments.
- **Signature Catering & Cocktails**: Craft cocktails, mocktails, and culinary pairings tailored to the theme.
- **Invitation Copywriter**: Ready-to-use invitation drafts (playful, elegant, or corporate) with one-click clipboard copying.
- **"Save to Event"**: Pin any brainstormed idea directly into your active event plan.

### 8. 🧠 Hybrid GenAI Engine (Live Gemini + Offline Simulator)
- **Live Google Gemini API**: Direct connection to `gemini-2.0-flash` or `gemini-1.5-flash` using your own Google AI Studio API key (stored securely only in your browser's LocalStorage).
- **Instant Offline AI Simulator**: No API key? No problem! PlanPulse contains a rich algorithmic event engine that generates deep, realistic event plans 100% offline.

### 9. 💾 Local Storage & Data Mobility
- Automatic real-time persistence across browser reloads.
- Full JSON **Export & Import** functionality to back up or share event plans.
- Instant reset to 4 curated starter templates (Wedding, Milestone Birthday, Community Harvest Festival, and Corporate Tech Summit).

---

## 🛠️ Tech Stack
- **Frontend**: React 18 (UMD, zero build step required)
- **Styling**: Tailwind CSS (CDN) + Fluid Chromatic Liquid Glass UI (refractive caustics, morphing liquid orbs, specular rim lighting)
- **Typography**: Plus Jakarta Sans & Outfit (Google Fonts)
- **Interactions & FX**: Canvas Confetti, Custom SVG Vector Iconography
- **Local Server**: Python 3 standard library (`http.server`)
