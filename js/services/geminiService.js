// Hybrid GenAI Service: Live Google Gemini API with smart offline fallback

window.GeminiService = {
  async callGemini(systemPrompt, userPrompt) {
    const apiKey = window.StorageService.getApiKey();
    const model = window.StorageService.getModel() || "gemini-2.0-flash";

    if (!apiKey) {
      console.log("No Gemini API key provided; using built-in high fidelity offline AI simulator.");
      return null;
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n\nIMPORTANT: Return ONLY valid, raw JSON (no markdown formatting, no code fences \`\`\`json) adhering to the requested schema.\n\nUser Request: ${userPrompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2500,
        responseMimeType: "application/json"
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error status: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Empty response received from Gemini.");

      // Clean up in case fenced markdown is returned
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn("Gemini API call failed or encountered error. Switching to smart offline generator.", err);
      throw err;
    }
  },

  // 1. One-Click Magic Event Generator
  async generateFullEventPlan({ prompt, eventType = "wedding", targetBudget = 10000, guestCount = 80, currency = "$" }) {
    const systemPrompt = `You are PlanPulse, an elite event planner AI. Generate a comprehensive, realistic event plan in JSON.
Schema:
{
  "name": "Event Name",
  "type": "${eventType}",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "City or Venue description",
  "targetBudget": number,
  "guestCount": number,
  "currency": "${currency}",
  "notes": "Short theme and vision description",
  "themeColor": "from-purple-500 to-indigo-600",
  "budgetItems": [
    { "id": "b1", "category": "Venue", "title": "...", "estimated": number, "actual": 0, "paid": "Unpaid", "vendor": "..." }
  ],
  "timelineItems": [
    { "id": "t1", "type": "milestone", "title": "...", "deadline": "YYYY-MM-DD", "completed": false, "category": "..." },
    { "id": "t2", "type": "dayof", "time": "10:00 AM", "title": "...", "lead": "...", "notes": "..." }
  ],
  "vendors": [
    { "id": "v1", "category": "Venue", "name": "...", "contact": "...", "phone": "...", "email": "...", "status": "Researching", "quote": number, "contractSigned": false, "rating": 5, "notes": "..." }
  ],
  "ideas": [
    { "id": "i1", "category": "Theme & Decor", "title": "...", "description": "...", "tags": ["Tag1", "Tag2"] }
  ]
}`;

    const userPrompt = `Create a complete event plan for: "${prompt}". Event Type: ${eventType}, Target Budget: ${currency}${targetBudget}, Expected Guests: ${guestCount}.`;

    try {
      const result = await this.callGemini(systemPrompt, userPrompt);
      if (result && result.name && Array.isArray(result.budgetItems)) {
        result.id = `evt-${Date.now()}`;
        return result;
      }
    } catch (e) {
      // Fallback
    }

    // Instant High-Quality Offline Fallback Generator
    return this.mockGenerateFullEventPlan({ prompt, eventType, targetBudget, guestCount, currency });
  },

  mockGenerateFullEventPlan({ prompt, eventType, targetBudget, guestCount, currency }) {
    const cleanPrompt = prompt || `${eventType.toUpperCase()} Celebration`;
    const numBudget = Number(targetBudget) || 12000;
    const numGuests = Number(guestCount) || 75;

    // Default dates in next 3 months
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 75);
    const dateStr = eventDate.toISOString().slice(0, 10);

    let themeColors = "from-rose-500 to-amber-500";
    let budgetCategories = [];
    let milestones = [];
    let dayOfSchedule = [];
    let vendors = [];
    let ideas = [];

    if (eventType === "wedding") {
      themeColors = "from-rose-500 to-amber-500";
      budgetCategories = [
        { cat: "Venue & Ceremony", pct: 0.35, vendor: "Grand Botanical Conservatory" },
        { cat: "Catering & Bar", pct: 0.30, vendor: "Savory & Saffron Catering" },
        { cat: "Photography & Video", pct: 0.12, vendor: "Evergreen Cinema & Photo" },
        { cat: "Decor & Floral Design", pct: 0.10, vendor: "Wildflower Haven Studios" },
        { cat: "Live Music & DJ", pct: 0.08, vendor: "Harmony Sound Collective" },
        { cat: "Stationery & Favors", pct: 0.05, vendor: "Velvet Press Paperie" }
      ];
      milestones = [
        { title: "Finalize Contract with Ceremony Venue", daysBefore: 60, cat: "Venue" },
        { title: "Send Formal Save-the-Dates & Digital RSVPs", daysBefore: 45, cat: "Guests" },
        { title: "Schedule Catering Tasting & Signature Drink Pairing", daysBefore: 30, cat: "Catering" },
        { title: "Confirm Final Floral Arrangements & Seating Layout", daysBefore: 15, cat: "Decor" },
        { title: "Dress Rehearsal & Vendor Run-of-Show Alignment", daysBefore: 2, cat: "Logistics" }
      ];
      dayOfSchedule = [
        { time: "10:30 AM", title: "Hair, Makeup & Wedding Party Welcome Toast", lead: "Lead Stylist", notes: "Bridal suite with fresh pastries and coffee" },
        { time: "01:30 PM", title: "Couple First-Look & Golden Light Portraits", lead: "Lead Photographer", notes: "Garden promenade and courtyard arches" },
        { time: "03:30 PM", title: "Guest Arrival & Pre-Ceremony String Quartet", lead: "Usher Team", notes: "Welcome iced berry tea service" },
        { time: "04:00 PM", title: "Ceremony & Exchange of Vows", lead: "Officiant", notes: "Rose petal aisle toss on exit" },
        { time: "05:00 PM", title: "Cocktail Hour & Passed Hors d'oeuvres", lead: "Banquet Captain", notes: "Lawn games & oyster bar" },
        { time: "06:30 PM", title: "Grand Reception Entrance & Plated Dinner", lead: "MC / Coordinator", notes: "Welcome speeches and toasts" },
        { time: "08:30 PM", title: "First Dance, Cake Cutting & Dancefloor Open", lead: "DJ", notes: "Late night slider snacks at 10 PM" }
      ];
      vendors = [
        { category: "Venue", name: "Grand Botanical Conservatory", contact: "Claire Sinclair", phone: "+1 (555) 302-8841", email: "claire@botanicalconservatory.org", status: "Contacted", quote: Math.round(numBudget * 0.35), contractSigned: false, rating: 5, notes: "Includes climate-controlled greenhouse and private terrace." },
        { category: "Catering", name: "Savory & Saffron Catering", contact: "Chef Luca", phone: "+1 (555) 491-0022", email: "luca@savorycatering.com", status: "Researching", quote: Math.round(numBudget * 0.30), contractSigned: false, rating: 5, notes: "Specialized in seasonal multi-course plated dinners." },
        { category: "Photography", name: "Evergreen Cinema & Photo", contact: "Hannah Reed", phone: "+1 (555) 773-1920", email: "hannah@evergreencinema.com", status: "Quoted", quote: Math.round(numBudget * 0.12), contractSigned: false, rating: 5, notes: "Full drone footage, 2 camera operators, 10-hour coverage." }
      ];
      ideas = [
        { category: "Theme & Decor", title: "Enchanted Greenhouse Romance", description: "Cascading wisteria chandeliers, vintage brass candlesticks, velvet emerald runners, and potted rosemary plant favors that guests can plant at home.", tags: ["Botanical", "Warm Glow", "Eco-chic"] },
        { category: "Signature Drinks", title: "'Botanical Bloom' & 'Smoked Cedar'", description: "His & Hers cocktails: Gin with lavender cordial and sparkling prosecco paired with oak-smoked bourbon and spiced blood orange bitters.", tags: ["Custom Cocktails", "Artisan Bar"] },
        { category: "Interactive Guest Experience", title: "Retro Vinyl Request Lounge", description: "A crate of classic vinyl records curated by the couple where guests can thumb through albums, write a personal message on the sleeve, and request tracks from the DJ.", tags: ["Vinyl", "Guestbook", "Music"] }
      ];
    } else if (eventType === "birthday") {
      themeColors = "from-cyan-500 to-fuchsia-500";
      budgetCategories = [
        { cat: "Venue & Space Rental", pct: 0.30, vendor: "Skyline Lounge Studio" },
        { cat: "Gourmet Bites & Bar", pct: 0.35, vendor: "Urban Fusion Street Bites" },
        { cat: "Entertainment & DJ", pct: 0.15, vendor: "Pulse Beats Entertainment" },
        { cat: "Lighting & Thematic FX", pct: 0.10, vendor: "Neon Prism Lighting" },
        { cat: "Custom Cake & Sweets", pct: 0.10, vendor: "Sweet Artistry Bakery" }
      ];
      milestones = [
        { title: "Lock in Party Loft or Venue Space", daysBefore: 30, cat: "Venue" },
        { title: "Deploy Digital Invites with RSVP & Song Request Poll", daysBefore: 20, cat: "Invitations" },
        { title: "Order Custom Cake & Personalized Decor Accents", daysBefore: 12, cat: "Decor" },
        { title: "Finalize DJ Playlist and Surprise Milestone Moments", daysBefore: 4, cat: "Entertainment" }
      ];
      dayOfSchedule = [
        { time: "05:00 PM", title: "Venue Access, Sound Check & Lighting Setup", lead: "Event Host", notes: "Test projection mapping and party lights" },
        { time: "07:30 PM", title: "Guests Arrive & Signature Welcome Drinks", lead: "Bartender", notes: "Finger foods & upbeat playlist" },
        { time: "09:00 PM", title: "Milestone Roast, Surprise Video & Toasts", lead: "Best Friend", notes: "Curated 5-minute photo reel" },
        { time: "09:45 PM", title: "Custom Cake Cut with Confetti Pop", lead: "Host Team", notes: "Sparkler candles" },
        { time: "10:15 PM", title: "High-Energy DJ Dance Set", lead: "DJ Pulse", notes: "Late night gourmet mini tacos" }
      ];
      vendors = [
        { category: "Venue", name: "Skyline Lounge Studio", contact: "Marcus King", phone: "+1 (555) 882-9901", email: "rentals@skylinelounge.com", status: "Hired", quote: Math.round(numBudget * 0.30), contractSigned: true, rating: 5, notes: "Panoramic city views with built-in surround sound." },
        { category: "Catering", name: "Urban Fusion Street Bites", contact: "Chef Zoe", phone: "+1 (555) 662-4411", email: "zoe@urbanfusionbites.com", status: "Contacted", quote: Math.round(numBudget * 0.35), contractSigned: false, rating: 4, notes: "Interactive bao bun and slider stations." }
      ];
      ideas = [
        { category: "Theme & Aesthetics", title: "Glow & Neon Speakeasy", description: "Dim ambient violet lighting, UV reflective custom drink stirrers, retro polaroid station with metallic ink markers, and personalized neon photo sign.", tags: ["Neon", "Retro Modern", "Vibrant"] },
        { category: "Interactive Game", title: "Timeline Trivia Battle", description: "Smart interactive smartphone trivia game where guests compete to guess funny milestones, early photos, and quirky trivia about the birthday star.", tags: ["Trivia", "Smart Games", "Prizes"] }
      ];
    } else if (eventType === "community") {
      themeColors = "from-amber-500 to-emerald-600";
      budgetCategories = [
        { cat: "Stage, Audio & Power", pct: 0.30, vendor: "Community Sound & Rigging" },
        { cat: "City Permits, Security & EMT", pct: 0.25, vendor: "Municipal Safety Dept" },
        { cat: "Sanitation & Eco Waste", pct: 0.15, vendor: "GreenCycle Event Services" },
        { cat: "Community Activities & Workshops", pct: 0.15, vendor: "Local Artisans Guild" },
        { cat: "Signage, Badges & Marketing", pct: 0.15, vendor: "Civic Print Hub" }
      ];
      milestones = [
        { title: "Permit Approvals & Municipal Safety Sign-off", daysBefore: 60, cat: "Permits" },
        { title: "Call for Local Food Vendors & Artisan Stalls", daysBefore: 40, cat: "Vendors" },
        { title: "Volunteer Drive & Shift Assignments", daysBefore: 20, cat: "Volunteers" },
        { title: "Stage Delivery & Sound Equipment Walkthrough", daysBefore: 1, cat: "Production" }
      ];
      dayOfSchedule = [
        { time: "07:30 AM", title: "Volunteer Briefing & Stall Layout Distribution", lead: "Lead Coordinator", notes: "Safety kits & t-shirt distribution" },
        { time: "10:00 AM", title: "Gates Open & Opening Community Ceremony", lead: "City Mayor / Host", notes: "Local brass band fanfare" },
        { time: "12:00 PM", title: "Interactive Craft Stations & Food Village Live", lead: "Activity Leads", notes: "Kid zone and face painting active" },
        { time: "03:30 PM", title: "Community Talent Showcase & Awards", lead: "Stage MC", notes: "Local band lineup" },
        { time: "06:00 PM", title: "Closing Ceremony & Clean-Up Commences", lead: "Green Volunteers", notes: "Zero-waste sorting check" }
      ];
      vendors = [
        { category: "Stage & AV", name: "Community Sound & Rigging", contact: "Dan Cooper", phone: "+1 (555) 431-2911", email: "dan@communitysound.org", status: "Hired", quote: Math.round(numBudget * 0.30), contractSigned: true, rating: 5, notes: "Outdoor weatherized speakers and diesel generator." },
        { category: "Safety", name: "Municipal Safety Services", contact: "Captain Vance", phone: "+1 (555) 776-8800", email: "safety@civic.gov", status: "Hired", quote: Math.round(numBudget * 0.25), contractSigned: true, rating: 5, notes: "On-site first aid tent and fire marshal review." }
      ];
      ideas = [
        { category: "Community Art", title: "Collaborative Mural Wall", description: "A giant wooden canvas partitioned into 100 numbered tiles where attendees of all ages paint their piece of the city's future, later installed at city hall.", tags: ["Civic Art", "All Ages", "Collaborative"] },
        { category: "Sustainability", title: "Zero-Waste Cup Deposit Scheme", description: "Custom reusable commemorative stainless steel cups: guests pay $2 deposit, use it at all beverage stalls, and either take it home as a souvenir or return for their deposit.", tags: ["Eco Friendly", "Zero Waste", "Souvenir"] }
      ];
    } else {
      // Corporate
      themeColors = "from-blue-600 to-indigo-700";
      budgetCategories = [
        { cat: "Convention Center / Venue", pct: 0.40, vendor: "Grand Plaza Convention Hub" },
        { cat: "AV, Live Broadcast & LED Walls", pct: 0.25, vendor: "Starlight Pro Broadcast" },
        { cat: "Executive Catering & Coffee", pct: 0.20, vendor: "Metropolitan Culinary" },
        { cat: "Smart Badges & Event App", pct: 0.08, vendor: "NFC Connect Tech" },
        { cat: "Speaker Hospitality & Swag", pct: 0.07, vendor: "Apex Premium Merch" }
      ];
      milestones = [
        { title: "Confirm Keynote Lineup & Abstract Submissions", daysBefore: 60, cat: "Program" },
        { title: "Sponsor Package Sign-offs & Booth Allocation", daysBefore: 30, cat: "Sponsors" },
        { title: "Broadcast Technical Rehearsal & Remote Mic Check", daysBefore: 3, cat: "Production" }
      ];
      dayOfSchedule = [
        { time: "08:00 AM", title: "Registration Desk Opens & Barista Breakfast", lead: "Welcome Team", notes: "Badge printing stations" },
        { time: "09:15 AM", title: "Welcome Address & Keynote Presentation", lead: "Conference Chair", notes: "Main Auditorium LED Wall" },
        { time: "12:30 PM", title: "Networking Lunch & Interactive Tech Pavilion", lead: "Banquet Lead", notes: "Exhibition Hall" },
        { time: "04:30 PM", title: "Closing Executive Fireside Chat & Cocktails", lead: "Founding Partner", notes: "VIP Lounge" }
      ];
      vendors = [
        { category: "Venue", name: "Grand Plaza Convention Hub", contact: "Arthur Davis", phone: "+1 (555) 991-4455", email: "events@grandplazahub.com", status: "Hired", quote: Math.round(numBudget * 0.40), contractSigned: true, rating: 5, notes: "Includes fiber optic live streaming backbone." }
      ];
      ideas = [
        { category: "Smart Networking", title: "AI-Powered Peer Match Speed Sessions", description: "Delegates receive push notifications during coffee breaks matching them with 3 executives solving matching organizational challenges for 7-minute laser chats.", tags: ["Networking", "AI Matching", "Executive"] }
      ];
    }

    const budgetItems = budgetCategories.map((b, idx) => ({
      id: `b-${Date.now()}-${idx}`,
      category: b.cat,
      title: `${b.cat} for ${numGuests} guests`,
      estimated: Math.round(numBudget * b.pct),
      actual: idx === 0 ? Math.round(numBudget * b.pct * 0.95) : 0,
      paid: idx === 0 ? "Deposit Paid" : "Unpaid",
      vendor: b.vendor
    }));

    const timelineItems = [
      ...milestones.map((m, idx) => {
        const d = new Date(eventDate);
        d.setDate(d.getDate() - m.daysBefore);
        return {
          id: `tm-${Date.now()}-${idx}`,
          type: "milestone",
          title: m.title,
          deadline: d.toISOString().slice(0, 10),
          completed: idx === 0,
          category: m.cat
        };
      }),
      ...dayOfSchedule.map((s, idx) => ({
        id: `td-${Date.now()}-${idx}`,
        type: "dayof",
        time: s.time,
        title: s.title,
        lead: s.lead,
        notes: s.notes
      }))
    ];

    const finalVendors = vendors.map((v, idx) => ({
      id: `v-${Date.now()}-${idx}`,
      ...v
    }));

    const finalIdeas = ideas.map((i, idx) => ({
      id: `id-${Date.now()}-${idx}`,
      ...i
    }));

    return {
      id: `evt-${Date.now()}`,
      name: cleanPrompt.length > 40 ? cleanPrompt.slice(0, 40) + "..." : cleanPrompt,
      type: eventType,
      date: dateStr,
      time: "16:00",
      location: "Prime City Venue & Gardens",
      guestCount: numGuests,
      targetBudget: numBudget,
      currency: currency,
      notes: `Generated by PlanPulse GenAI for "${prompt}". Tailored for ${numGuests} attendees with a target budget of ${currency}${numBudget.toLocaleString()}.`,
      themeColor: themeColors,
      budgetItems,
      timelineItems,
      vendors: finalVendors,
      ideas: finalIdeas,
      guests: [
        { id: `g-${Date.now()}-1`, name: "Alex Morgan", group: "VIP", status: "Attending", plusOne: true, plusOneName: "Taylor Morgan", dietary: "None", email: "alex@example.com", phone: "+1 555-0101" },
        { id: `g-${Date.now()}-2`, name: "Jordan Lee", group: "Family", status: "Attending", plusOne: false, plusOneName: "", dietary: "Vegetarian", email: "jordan@example.com", phone: "+1 555-0102" },
        { id: `g-${Date.now()}-3`, name: "Casey Brooks", group: "Friends", status: "Pending", plusOne: true, plusOneName: "Guest", dietary: "Gluten-Free", email: "casey@example.com", phone: "+1 555-0103" },
        { id: `g-${Date.now()}-4`, name: "Morgan Rivera", group: "Friends", status: "Pending", plusOne: false, plusOneName: "", dietary: "None", email: "morgan@example.com", phone: "+1 555-0104" }
      ]
    };
  },

  // 2. AI Budget Advisor
  async getBudgetAdvice(event) {
    const totalEst = event.budgetItems.reduce((acc, i) => acc + (Number(i.estimated) || 0), 0);
    const totalAct = event.budgetItems.reduce((acc, i) => acc + (Number(i.actual) || 0), 0);
    const diff = event.targetBudget - totalAct;

    const systemPrompt = `You are a savvy event financial strategist. Provide actionable, high-impact budget insights in JSON format.
Schema:
{
  "summary": "Overall budget health assessment",
  "costSavingTips": ["Tip 1 with estimated savings", "Tip 2", "Tip 3"],
  "hiddenFeesWarning": ["Hidden fee 1", "Hidden fee 2"],
  "negotiationTip": "Specific negotiation tactic for vendors"
}`;

    const userPrompt = `Event: ${event.name} (${event.type}), Target Budget: ${event.currency}${event.targetBudget}, Total Estimated: ${event.currency}${totalEst}, Total Actual so far: ${event.currency}${totalAct}, Guests: ${event.guestCount}. Existing items: ${event.budgetItems.map(b => `${b.category}: ${event.currency}${b.estimated}`).join(", ")}`;

    try {
      const res = await this.callGemini(systemPrompt, userPrompt);
      if (res && res.summary) return res;
    } catch (e) {
      // Fallback
    }

    return {
      summary: diff >= 0 
        ? `Your budget is in strong shape! You currently have ${event.currency}${diff.toLocaleString()} buffer remaining under your ${event.currency}${event.targetBudget.toLocaleString()} ceiling.`
        : `Caution: You are currently projected ${event.currency}${Math.abs(diff).toLocaleString()} over your target ceiling. Immediate adjustments are recommended.`,
      costSavingTips: [
        `Bundle sound, lighting, and DJ with one production vendor to negotiate a 10-15% package discount.`,
        `Switch from a formal multi-course plated dinner to curated artisan food stations or heavy cocktail tapas to trim catering costs by up to 20%.`,
        `Choose in-season local foliage and dramatic candle groupings over out-of-season imported flowers to save $400-$800 on decor.`
      ],
      hiddenFeesWarning: [
        `Look out for vendor service charges (often 20-24%), cake cutting fees ($2-$5/slice), and corkage fees ($15-$30/bottle).`,
        `Account for required overtime load-out rates if the venue requires tear-down completed before midnight.`
      ],
      negotiationTip: `Offer to pay the remaining balance via electronic bank transfer (ACH/wire) rather than credit card to ask the vendor to pass along their 3% merchant processing savings to you.`
    };
  },

  // 3. AI Vendor Interview & Checklist Assistant
  async getVendorInterviewQuestions(category, eventType) {
    const systemPrompt = `You are an expert event manager. Return 4 critical interview questions and red flags to watch for when vetting an event vendor in JSON.
Schema:
{
  "category": "${category}",
  "mustAskQuestions": ["Question 1", "Question 2", "Question 3", "Question 4"],
  "redFlags": ["Red flag 1", "Red flag 2"],
  "contractCheck": "One critical clause to ensure is in the contract"
}`;

    try {
      const res = await this.callGemini(systemPrompt, `Category: ${category}, Event Type: ${eventType}`);
      if (res && res.mustAskQuestions) return res;
    } catch (e) {
      // Fallback
    }

    const fallbacks = {
      Venue: {
        mustAskQuestions: [
          "What is the exact curfew for amplified music, and what are the teardown overtime penalties per 30 minutes?",
          "Are we locked into an exclusive preferred vendor list, or can we bring our own licensed and insured caterer/DJ?",
          "What is the exact backup rain/inclement weather plan, and when is the hard decision deadline on event day?",
          "How many dedicated venue staff and security guards will be physically present during the event?"
        ],
        redFlags: [
          "Vague noise restriction rules that could shut down your party early.",
          "Hidden mandatory cleanup fees not disclosed in initial quoting."
        ],
        contractCheck: "Ensure the contract clearly specifies access hours for vendor setup and post-event teardown."
      },
      Catering: {
        mustAskQuestions: [
          "Is a full private menu tasting included prior to signing or deposit?",
          "How do you handle severe allergies (celiac gluten-free, nut allergies) and last-minute dietary substitutions?",
          "What is the exact staffing ratio (servers to guests), and are staff gratuities and setup hours included in the quote?",
          "Do you supply all required table linens, flatware, water goblets, and barware, or must those be rented separately?"
        ],
        redFlags: [
          "No commercial kitchen liability insurance or food safety certifications.",
          "Catering contracts that leave alcohol liability ambiguous."
        ],
        contractCheck: "Look for the headcount guarantee deadline (usually 14 days before the event) and minimum spend threshold."
      },
      Photography: {
        mustAskQuestions: [
          "Will you personally photograph our event, or will associate shooters be assigned?",
          "What is the turnaround time for preview sneak peeks and the final edited high-res digital gallery?",
          "What backup cameras, lenses, and dual-slot memory card protocols do you use to prevent data loss?",
          "Do we receive full non-commercial print release rights to download and print our photos anywhere?"
        ],
        redFlags: [
          "Photographers without full-day dual-camera equipment backup.",
          "Unclear image delivery timelines exceeding 12 weeks."
        ],
        contractCheck: "Ensure replacement shooter coverage clause in the rare event of photographer illness or emergency."
      }
    };

    return fallbacks[category] || {
      mustAskQuestions: [
        `What experience do you have with similar ${eventType} events of our size?`,
        `What happens in the event of an emergency where your primary team member cannot attend?`,
        `What are your exact payment milestone terms and cancellation/rescheduling policies?`,
        `Are all necessary taxes, delivery fees, and tips included in this quote?`
      ],
      redFlags: [
        "Unwillingness to provide references or recent client testimonials.",
        "Refusal to provide certificates of general liability insurance."
      ],
      contractCheck: "Verify exact arrival, soundcheck, and strike times are written into the agreement."
    };
  },

  // 4. Creative Idea Studio Generator
  async generateCreativeStudioIdeas(eventType, themePrompt, guestCount, tone = "playful") {
    const systemPrompt = `You are an award-winning creative event experience designer. Generate ultra-creative, personalized ideas in JSON.
Schema:
{
  "themeConcept": {
    "title": "Creative theme name",
    "palette": ["Hex or Color Name 1", "Color Name 2", "Color Name 3"],
    "visualVibe": "2-3 sentences describing the atmosphere, lighting, and textures"
  },
  "interactiveActivities": [
    { "title": "Activity 1", "description": "How it works and why guests love it" },
    { "title": "Activity 2", "description": "..." }
  ],
  "foodAndDrink": [
    { "name": "Signature Item 1", "type": "Cocktail/Appetizer", "description": "..." },
    { "name": "Signature Item 2", "type": "Dessert/Bite", "description": "..." }
  ],
  "invitationCopy": {
    "headline": "Punchy header",
    "bodyText": "Engaging invitation copy tailored to the theme",
    "callToAction": "RSVP instructions"
  }
}`;

    const userPrompt = `Event Type: ${eventType}, Theme/Prompt: ${themePrompt}, Guests: ${guestCount}, Tone: ${tone}`;

    try {
      const res = await this.callGemini(systemPrompt, userPrompt);
      if (res && res.themeConcept) return res;
    } catch (e) {
      // Fallback
    }

    // High quality offline fallback
    return {
      themeConcept: {
        title: themePrompt ? `${themePrompt} Extravaganza` : `Golden Hour Modern Bohemian`,
        palette: ["Terracotta Rust", "Warm Amber", "Sage Eucalyptus", "Champagne Gold"],
        visualVibe: `An intoxicating mix of warm incandescent Edison filaments, natural wood grain, textured linen drapes, and organic lush greenery creating an intimate yet festive sanctuary.`
      },
      interactiveActivities: [
        {
          title: "The Golden Memory Capsule",
          description: "Guests write brief predictions, funny stories, or advice on retro postcards and drop them into a locked wooden lockbox to be opened by the hosts on their 5-year anniversary or next milestone."
        },
        {
          title: "Live Acoustic Story Jam",
          description: "An intimate 20-minute acoustic fireside circle where guests can shout out their favorite shared memories while musicians improvise funny mini-tunes."
        }
      ],
      foodAndDrink: [
        {
          name: "The Velvet Twilight Spritz",
          type: "Signature Cocktail",
          description: "Crisp prosecco, blackberry reduction, elderflower liqueur, garnished with a smoking sprig of organic rosemary."
        },
        {
          name: "Truffled Brioche Crostini with Fig Jam",
          type: "Passed Hors d'oeuvre",
          description: "Warm artisanal brioche rounds topped with creamy whipped chèvre, caramelized mission fig, and micro-arugula."
        }
      ],
      invitationCopy: {
        headline: "You're Invited to Something Extraordinary ✨",
        bodyText: `Join us for an unforgettable celebration of laughter, connection, and great memories. We've curated delicious bites, vibrant music, and a night designed just for our favorite people.`,
        callToAction: "Please RSVP by the deadline so we can save your glass and seat at the table!"
      }
    };
  },

  // 5. GenAI Smart Seating & Table Strategist
  async generateSeatingArrangement(event, tables = [], guests = []) {
    const attendingGuests = (guests || []).filter(g => g.status === "Attending");
    if (tables.length === 0 || attendingGuests.length === 0) {
      return {
        assignments: {},
        rationale: ["Add at least one table and attending guests to generate an AI seating chart."],
        cateringNotes: [],
        vibeTips: ["Keep family near the center and place energetic friend groups near the dance floor."]
      };
    }

    const systemPrompt = `You are PlanPulse AI Seating Strategist. Given an event, available tables with capacities, and a list of attending guests with group affinities, plus-ones, and dietary restrictions, return a balanced seating arrangement JSON.
Schema:
{
  "assignments": {
    "guestId1": "tableIdA",
    "guestId2": "tableIdB"
  },
  "rationale": [
    "Table 1: Description of who was grouped here and why",
    "Table 2: Description of group dynamics and comfort"
  ],
  "cateringNotes": [
    "Specific dietary warning for table X (e.g., severe allergy flags for kitchen)"
  ],
  "vibeTips": [
    "Host tip regarding acoustics, flow, or speeches"
  ]
}`;

    const tablesSummary = tables.map(t => ({ id: t.id, name: t.name, capacity: t.capacity, shape: t.shape, notes: t.notes }));
    const guestsSummary = attendingGuests.map(g => ({ id: g.id, name: g.name, group: g.group, plusOne: g.plusOne, dietary: g.dietary }));

    const userPrompt = `Event: "${event.name}" (${event.type || "event"}).
Tables: ${JSON.stringify(tablesSummary)}
Attending Guests: ${JSON.stringify(guestsSummary)}`;

    try {
      const res = await this.callGemini(systemPrompt, userPrompt);
      if (res && res.assignments && typeof res.assignments === "object") {
        return res;
      }
    } catch (e) {
      // Fallback to intelligent local algorithm
    }

    // Intelligent Offline Seating Algorithm
    const assignments = {};
    const tableCapacities = {};
    tables.forEach(t => { tableCapacities[t.id] = t.capacity || 8; });
    const currentTableOccupancy = {};
    tables.forEach(t => { currentTableOccupancy[t.id] = 0; });

    // Group guests by group affinity (e.g. Bridal Party, Family, Friends)
    const grouped = {};
    attendingGuests.forEach(g => {
      const grp = g.group || "General";
      if (!grouped[grp]) grouped[grp] = [];
      grouped[grp].push(g);
    });

    // Sort tables by capacity descending
    const sortedTables = [...tables].sort((a, b) => (b.capacity || 8) - (a.capacity || 8));

    // Distribute groups across tables
    let currentTableIdx = 0;
    Object.keys(grouped).forEach(grpKey => {
      const guestList = grouped[grpKey];
      guestList.forEach(guest => {
        const headcount = 1 + (guest.plusOne ? 1 : 0);
        let assigned = false;

        // Try current table
        for (let i = 0; i < sortedTables.length; i++) {
          const table = sortedTables[(currentTableIdx + i) % sortedTables.length];
          const cap = tableCapacities[table.id];
          const currentOcc = currentTableOccupancy[table.id];
          if (currentOcc + headcount <= cap) {
            assignments[guest.id] = table.id;
            currentTableOccupancy[table.id] += headcount;
            assigned = true;
            break;
          }
        }

        // If all tables at capacity, assign to least full table anyway
        if (!assigned && sortedTables.length > 0) {
          const leastFull = [...sortedTables].sort((a, b) => (currentTableOccupancy[a.id] || 0) - (currentTableOccupancy[b.id] || 0))[0];
          assignments[guest.id] = leastFull.id;
          currentTableOccupancy[leastFull.id] += headcount;
        }
      });
      currentTableIdx = (currentTableIdx + 1) % sortedTables.length;
    });

    // Compile catering notes and rationale
    const cateringNotes = [];
    const dietaryGuests = attendingGuests.filter(g => g.dietary && g.dietary !== "None");
    dietaryGuests.forEach(g => {
      const tblId = assignments[g.id];
      const tbl = tables.find(t => t.id === tblId);
      if (tbl) {
        cateringNotes.push(`${g.name} (${g.dietary}) seated at ${tbl.name}. Ensure kitchen delivers dedicated meal plate.`);
      }
    });

    const rationale = tables.map(tbl => {
      const seatedHere = attendingGuests.filter(g => assignments[g.id] === tbl.id);
      const groupsHere = Array.from(new Set(seatedHere.map(g => g.group || "Guests")));
      return `${tbl.name}: Harmonized ${seatedHere.length} guests (${groupsHere.join(", ") || "General"}) based on social affinities.`;
    });

    const vibeTips = [
      "Keep high-energy friend groups near the dance floor and speakers so elders enjoy easier conversation.",
      "Ensure servers have direct line-of-sight to tables with designated dietary requirements.",
      "Keep 1-2 spare seats unassigned for unexpected plus-ones or last-minute VIP shifts."
    ];

    return {
      assignments,
      rationale,
      cateringNotes: cateringNotes.length > 0 ? cateringNotes : ["All confirmed guests have standard meal selections."],
      vibeTips
    };
  }
};
