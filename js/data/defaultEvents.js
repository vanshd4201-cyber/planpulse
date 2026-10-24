// Default Starter Events for Weddings, Birthdays, Community Events, and Corporate Gatherings

window.DEFAULT_EVENTS = [
  {
    id: "evt-wedding-01",
    name: "Aria & Julian's Romantic Garden Wedding",
    type: "wedding",
    date: "2026-11-20",
    time: "15:30",
    location: "Villa Bella Vista, Sonoma Valley",
    guestCount: 120,
    targetBudget: 28000,
    currency: "$",
    notes: "Outdoor ceremony under floral arch followed by evening glasshouse reception with live jazz quartet.",
    themeColor: "from-rose-500 to-amber-500",
    budgetItems: [
      { id: "b1", category: "Venue", title: "Glasshouse & Garden Rental", estimated: 8500, actual: 8200, paid: "Paid in Full", vendor: "Villa Bella Vista" },
      { id: "b2", category: "Catering", title: "Farm-to-Table Dinner (120 guests)", estimated: 9000, actual: 8800, paid: "Deposit Paid", vendor: "Artisan Culinary" },
      { id: "b3", category: "Photography", title: "Full-day Photo & Drone Video", estimated: 3200, actual: 3400, paid: "Deposit Paid", vendor: "Lumina Wedding Studio" },
      { id: "b4", category: "Decor & Floral", title: "Garden Arch, Bouquets & Centerpieces", estimated: 2800, actual: 2650, paid: "Deposit Paid", vendor: "Petal & Stem Floral" },
      { id: "b5", category: "Entertainment", title: "Live Acoustic Duo + Evening DJ", estimated: 2200, actual: 2000, paid: "Unpaid", vendor: "Groove Harmonic" },
      { id: "b6", category: "Attire & Rings", title: "Bridal Gown Alterations & Tuxedo", estimated: 1800, actual: 1650, paid: "Paid in Full", vendor: "Atelier Bridal" },
      { id: "b7", category: "Stationery", title: "Embossed Invitations & Wax Seals", estimated: 600, actual: 520, paid: "Paid in Full", vendor: "Paper & Script Co." },
      { id: "b8", category: "Contingency", title: "Weather Backup Tent & Heaters", estimated: 1500, actual: 0, paid: "Unpaid", vendor: "Valley Event Rentals" }
    ],
    timelineItems: [
      { id: "t1", type: "milestone", title: "Book Venue & Secure Ceremony Date", deadline: "2026-06-01", completed: true, category: "Venue" },
      { id: "t2", type: "milestone", title: "Send Formal Wedding Invitations & RSVPs", deadline: "2026-09-01", completed: true, category: "Guests" },
      { id: "t3", type: "milestone", title: "Finalize Menu Tasting & Signature Cocktails", deadline: "2026-10-15", completed: true, category: "Catering" },
      { id: "t4", type: "milestone", title: "Final Dress Fitting & Tuxedo Pick-up", deadline: "2026-11-05", completed: false, category: "Attire" },
      { id: "t5", type: "milestone", title: "Run-of-Show Rehearsal & Vendor Walkthrough", deadline: "2026-11-19", completed: false, category: "Logistics" },
      { id: "t6", type: "dayof", time: "11:00 AM", title: "Bridal Party Hair, Makeup & Mimosas", lead: "Maya (Maid of Honor)", notes: "Bridal Suite, 2nd floor" },
      { id: "t7", type: "dayof", time: "01:30 PM", title: "First Look Photos & Golden Hour Portraits", lead: "Lumina Studio", notes: "Olive Grove path" },
      { id: "t8", type: "dayof", time: "03:30 PM", title: "Ceremony Begins under Floral Arch", lead: "Officiant David", notes: "Acoustic strings prelude" },
      { id: "t9", type: "dayof", time: "04:30 PM", title: "Cocktail Hour & Passed Hors d'oeuvres", lead: "Artisan Culinary", notes: "Lawn games & prosecco bar" },
      { id: "t10", type: "dayof", time: "06:00 PM", title: "Dinner Reception & Heartfelt Toasts", lead: "MC / Julian", notes: "Three-course seated dinner" },
      { id: "t11", type: "dayof", time: "08:15 PM", title: "Cake Cutting & First Dance", lead: "Groove Harmonic DJ", notes: "Sparkler send-off prep" }
    ],
    vendors: [
      { id: "v1", category: "Venue", name: "Villa Bella Vista", contact: "Elena Rossi", phone: "+1 (707) 555-8291", email: "events@villabellavista.com", status: "Hired", quote: 8200, contractSigned: true, rating: 5, notes: "Includes bridal suite, tables, crossback chairs." },
      { id: "v2", category: "Catering", name: "Artisan Culinary Co.", contact: "Chef Marcus", phone: "+1 (707) 555-4309", email: "tastings@artisanculinary.com", status: "Hired", quote: 8800, contractSigned: true, rating: 5, notes: "All organic ingredients; 18 vegan/gluten-free options accounted for." },
      { id: "v3", category: "Photography", name: "Lumina Wedding Studio", contact: "Sarah Chen", phone: "+1 (415) 555-9124", email: "sarah@luminaphoto.io", status: "Hired", quote: 3400, contractSigned: true, rating: 5, notes: "8 hours coverage, 2 photographers + 4K drone footage." },
      { id: "v4", category: "Decor & Floral", name: "Petal & Stem Floral Design", contact: "Chloe Vance", phone: "+1 (415) 555-6621", email: "chloe@petalandstem.com", status: "Hired", quote: 2650, contractSigned: true, rating: 4, notes: "Eucalyptus garlands, blush peonies, champagne roses." },
      { id: "v5", category: "Entertainment", name: "Groove Harmonic Collective", contact: "Leo Sterling", phone: "+1 (510) 555-3810", email: "booking@grooveharmonic.com", status: "Quoted", quote: 2000, contractSigned: false, rating: 5, notes: "Acoustic duo for ceremony + 4-hour DJ party set." },
      { id: "v6", category: "Stationery", name: "Paper & Script Co.", contact: "Anna Belle", phone: "+1 (415) 555-1234", email: "hello@paperandscript.com", status: "Hired", quote: 520, contractSigned: true, rating: 4, notes: "Wax seals sent; seating chart banner remaining." }
    ],
    ideas: [
      {
        id: "i1",
        category: "Theme & Decor",
        title: "Tuscan Sunset Romance",
        description: "Terracotta warmth blended with sage green foliage, fairy-light ceiling inside the glasshouse, and personalized mini olive-oil bottles as guest favors.",
        tags: ["Garden", "Rustic Luxury", "Tuscan"]
      },
      {
        id: "i2",
        category: "Signature Drinks",
        title: "'His & Hers' Craft Cocktails",
        description: "'The Julian Old Fashioned' (Smoked bourbon, rosemary syrup, orange peel) & 'The Aria Spritz' (Elderflower liqueur, prosecco, fresh berries, mint).",
        tags: ["Cocktails", "Personalized", "Bar"]
      },
      {
        id: "i3",
        category: "Interactive Guest Experience",
        title: "Vintage Audio Guestbook",
        description: "A restored 1970s rotary telephone where guests pick up the receiver, hear a recorded voice prompt from the couple, and record intimate heartfelt messages.",
        tags: ["Audio", "Memories", "Interactive"]
      }
    ],
    tables: [
      { id: "tbl-w1", name: "Table 1 (Sweetheart Table)", capacity: 2, shape: "sweetheart", notes: "Center stage, Aria & Julian" },
      { id: "tbl-w2", name: "Table 2 (Bridal Party)", capacity: 8, shape: "rectangular", notes: "Near dance floor & speeches podium" },
      { id: "tbl-w3", name: "Table 3 (Rossi Family & Elders)", capacity: 8, shape: "round", notes: "Garden patio side, quiet zone" },
      { id: "tbl-w4", name: "Table 4 (College Friends)", capacity: 8, shape: "round", notes: "Center glasshouse hall, high energy" }
    ],
    guests: [
      { id: "g1", name: "Sophia Rossi", group: "Family", status: "Attending", plusOne: true, plusOneName: "Marco Rossi", dietary: "Vegetarian", email: "sophia@example.com", phone: "+1 555-1011", tableId: "tbl-w3" },
      { id: "g2", name: "David Vance", group: "Bridal Party", status: "Attending", plusOne: false, plusOneName: "", dietary: "Gluten-Free", email: "david@example.com", phone: "+1 555-1012", tableId: "tbl-w2" },
      { id: "g3", name: "Elena Chen", group: "Bridal Party", status: "Attending", plusOne: true, plusOneName: "Lucas Chen", dietary: "None", email: "elena@example.com", phone: "+1 555-1013", tableId: "tbl-w2" },
      { id: "g4", name: "Marcus Sterling", group: "Friends", status: "Pending", plusOne: true, plusOneName: "Guest", dietary: "Vegan", email: "marcus@example.com", phone: "+1 555-1014", tableId: null },
      { id: "g5", name: "Chloe Bennett", group: "Friends", status: "Attending", plusOne: false, plusOneName: "", dietary: "Nut Allergy", email: "chloe@example.com", phone: "+1 555-1015", tableId: "tbl-w4" },
      { id: "g6", name: "Arthur Davis", group: "Family", status: "Declined", plusOne: false, plusOneName: "", dietary: "None", email: "arthur@example.com", phone: "+1 555-1016", tableId: null },
      { id: "g7", name: "Liam O'Connor", group: "Bridal Party", status: "Attending", plusOne: false, plusOneName: "", dietary: "None", email: "liam@example.com", phone: "+1 555-1017", tableId: "tbl-w2" },
      { id: "g8", name: "Amara Patel", group: "Friends", status: "Attending", plusOne: true, plusOneName: "Kunal Patel", dietary: "Vegetarian", email: "amara@example.com", phone: "+1 555-1018", tableId: "tbl-w4" }
    ]
  },
  {
    id: "evt-birthday-02",
    name: "Liam's 30th Cyberpunk Synthwave Bash",
    type: "birthday",
    date: "2026-12-05",
    time: "20:00",
    location: "The Neon Loft, Downtown Arts District",
    guestCount: 45,
    targetBudget: 4500,
    currency: "$",
    notes: "Retro-futuristic neon night with arcade tournament, custom synthwave playlist, and molecular cocktails.",
    themeColor: "from-cyan-500 to-fuchsia-500",
    budgetItems: [
      { id: "bb1", category: "Venue", title: "Industrial Loft Rental (6 Hours)", estimated: 1600, actual: 1500, paid: "Deposit Paid", vendor: "Neon Loft Arts" },
      { id: "bb2", category: "Entertainment", title: "Retro Arcade Cabinets & VR Station", estimated: 850, actual: 800, paid: "Deposit Paid", vendor: "Pixel Arcades Rental" },
      { id: "bb3", category: "Catering & Bar", title: "Glow Mocktail Bar & Gourmet Sliders", estimated: 1200, actual: 1350, paid: "Deposit Paid", vendor: "Electric Bite Catering" },
      { id: "bb4", category: "Decor & Lighting", title: "Custom Neon Signs & Laser Ambience", estimated: 600, actual: 550, paid: "Paid in Full", vendor: "GlowWave FX" },
      { id: "bb5", category: "Cake & Desserts", title: "Glitch-Art Multi-tier Black Velvet Cake", estimated: 250, actual: 280, paid: "Paid in Full", vendor: "FuturSweet Bakery" }
    ],
    timelineItems: [
      { id: "bt1", type: "milestone", title: "Lock Loft Venue & Security Deposit", deadline: "2026-10-25", completed: true, category: "Venue" },
      { id: "bt2", type: "milestone", title: "Send Animated Digital Invites via Discord/WhatsApp", deadline: "2026-11-10", completed: true, category: "Invitations" },
      { id: "bt3", type: "milestone", title: "Pick up Custom 3D Printed Party Favors", deadline: "2026-12-01", completed: false, category: "Favors" },
      { id: "bt4", type: "dayof", time: "05:00 PM", title: "Laser & Sound System Tuning", lead: "Sound Engineer Mike", notes: "Fog machine test" },
      { id: "bt5", type: "dayof", time: "08:00 PM", title: "Doors Open & Welcome Glow Drinks", lead: "Bartender Sam", notes: "UV reactive glassware" },
      { id: "bt6", type: "dayof", time: "09:30 PM", title: "Retro Street Fighter & Mario Kart Finals", lead: "Liam", notes: "Champion gets custom trophy" },
      { id: "bt7", type: "dayof", time: "11:00 PM", title: "Cake Cut with Glitch Lightshow", lead: "Host Team", notes: "Drop bass track" }
    ],
    vendors: [
      { id: "bv1", category: "Venue", name: "Neon Loft Arts", contact: "Kendra", phone: "+1 (310) 555-7788", email: "rentals@neonloft.com", status: "Hired", quote: 1500, contractSigned: true, rating: 5, notes: "Includes soundboard and dimmable RGB track lighting." },
      { id: "bv2", category: "Entertainment", name: "Pixel Arcades Rental", contact: "Dave", phone: "+1 (310) 555-9011", email: "dave@pixelarcades.com", status: "Hired", quote: 800, contractSigned: true, rating: 5, notes: "Delivering 3 upright cabinets + Mario Kart 8 setup." },
      { id: "bv3", category: "Catering", name: "Electric Bite Catering", contact: "Maya", phone: "+1 (310) 555-3211", email: "bites@electricbite.com", status: "Hired", quote: 1350, contractSigned: true, rating: 4, notes: "Glow drinks + sliders + truffle fry bar." }
    ],
    ideas: [
      {
        id: "bi1",
        category: "Theme & Aesthetics",
        title: "Outrun Cyberpunk Night",
        description: "Deep purples, neon cyan lasers, UV blacklights, holographic photo backdrop with chrome props, and Daft Punk / Kavinsky style soundscapes.",
        tags: ["Cyberpunk", "80s Synth", "Neon"]
      },
      {
        id: "bi2",
        category: "Party Game",
        title: "Secret Agent Trivia Quest",
        description: "QR codes hidden around the loft unlock trivia challenges about Liam's 20s. Winning team gets bragging rights and a retro synth keytar.",
        tags: ["Trivia", "Scavenger Hunt", "Interactive"]
      }
    ],
    tables: [
      { id: "tbl-b1", name: "VIP Synth Lounge Booth", capacity: 6, shape: "booth", notes: "Next to retro arcade cabinets" },
      { id: "tbl-b2", name: "High-Top Neon Station A", capacity: 6, shape: "high-top", notes: "Near molecular bar" },
      { id: "tbl-b3", name: "High-Top Neon Station B", capacity: 6, shape: "high-top", notes: "Near DJ and laser stage" }
    ],
    guests: [
      { id: "bg1", name: "Liam Vance", group: "Host / VIP", status: "Attending", plusOne: false, plusOneName: "", dietary: "None", email: "liam@synth.io", phone: "+1 555-4001", tableId: "tbl-b1" },
      { id: "bg2", name: "Samira Khan", group: "College Crew", status: "Attending", plusOne: true, plusOneName: "Tariq", dietary: "Vegetarian", email: "samira@synth.io", phone: "+1 555-4002", tableId: "tbl-b2" },
      { id: "bg3", name: "Nico Torres", group: "Arcade Team", status: "Attending", plusOne: false, plusOneName: "", dietary: "Gluten-Free", email: "nico@synth.io", phone: "+1 555-4003", tableId: "tbl-b1" },
      { id: "bg4", name: "Zoe Martinez", group: "College Crew", status: "Attending", plusOne: true, plusOneName: "Leo", dietary: "None", email: "zoe@synth.io", phone: "+1 555-4004", tableId: null }
    ]
  },
  {
    id: "evt-community-03",
    name: "Oakridge Harvest & Lantern Festival",
    type: "community",
    date: "2026-10-31",
    time: "14:00",
    location: "Oakridge Riverside Community Park",
    guestCount: 450,
    targetBudget: 12000,
    currency: "$",
    notes: "Free community celebration featuring local artisan booths, pumpkin carving, community lantern flotilla on the river, and live folk bands.",
    themeColor: "from-amber-500 to-emerald-600",
    budgetItems: [
      { id: "cb1", category: "Permits & Safety", title: "City Park Permit, Police & Paramedics", estimated: 2200, actual: 2100, paid: "Paid in Full", vendor: "City Parks & Rec" },
      { id: "cb2", category: "Stage & Sound", title: "Main Stage Sound & Generator Rental", estimated: 3500, actual: 3400, paid: "Deposit Paid", vendor: "Acoustic Valley Audio" },
      { id: "cb3", category: "Supplies & Lanterns", title: "Eco-friendly Floating Lanterns (500 units)", estimated: 1800, actual: 1650, paid: "Paid in Full", vendor: "EcoFloat Crafts" },
      { id: "cb4", category: "Sanitation", title: "Portable Restrooms & Recycling Stations", estimated: 1500, actual: 1450, paid: "Deposit Paid", vendor: "CleanEvent Solutions" },
      { id: "cb5", category: "Signage & Marketing", title: "Banners, Yard Signs & Social Ads", estimated: 1000, actual: 920, paid: "Paid in Full", vendor: "Oakridge QuickPrint" },
      { id: "cb6", category: "Artist Stipends", title: "4 Local Musical Acts Honorarium", estimated: 2000, actual: 2000, paid: "Unpaid", vendor: "Local Musicians Guild" }
    ],
    timelineItems: [
      { id: "ct1", type: "milestone", title: "Submit City Park & Sound Permits", deadline: "2026-08-01", completed: true, category: "Permits" },
      { id: "ct2", type: "milestone", title: "Recruit 35 Community Volunteers", deadline: "2026-10-15", completed: true, category: "Volunteers" },
      { id: "ct3", type: "milestone", title: "Vendor & Food Truck Stall Allocation", deadline: "2026-10-20", completed: true, category: "Vendors" },
      { id: "ct4", type: "dayof", time: "08:00 AM", title: "Volunteer Check-In & Stage Setup", lead: "Carlos (Lead Coordinator)", notes: "Main pavilion staging" },
      { id: "ct5", type: "dayof", time: "02:00 PM", title: "Gates Open & Artisan Craft Market Live", lead: "Market Committee", notes: "28 local craft vendors" },
      { id: "ct6", type: "dayof", time: "04:30 PM", title: "Giant Pumpkin Carving & Kids Costume Parade", lead: "Oakridge Youth Club", notes: "Prizes for 3 categories" },
      { id: "ct7", type: "dayof", time: "07:00 PM", title: "Lantern Lighting & River Flotilla Ceremony", lead: "River Conservation Team", notes: "Biodegradable rice-paper lanterns" }
    ],
    vendors: [
      { id: "cv1", category: "Permits & Safety", name: "City Parks & Recreation", contact: "Officer Miller", phone: "+1 (555) 234-5678", email: "parks@oakridge.gov", status: "Hired", quote: 2100, contractSigned: true, rating: 5, notes: "Permits approved; EMT squad stationed at North gate." },
      { id: "cv2", category: "Audio/Visual", name: "Acoustic Valley Audio", contact: "Jim Vance", phone: "+1 (555) 345-6789", email: "jim@acousticvalley.com", status: "Hired", quote: 3400, contractSigned: true, rating: 4, notes: "PA system for amphitheater + sound engineer for 8 hours." },
      { id: "cv3", category: "Sanitation", name: "CleanEvent Solutions", contact: "Rachel", phone: "+1 (555) 456-7890", email: "info@cleanevent.com", status: "Hired", quote: 1450, contractSigned: true, rating: 5, notes: "10 portable restrooms + 4 handwash stations + waste bins." }
    ],
    ideas: [
      {
        id: "ci1",
        category: "Community Engagement",
        title: "Wish Lantern Flotilla",
        description: "Community members write messages of hope and gratitude on biodegradable lotus lanterns, released onto the calm riverside pond at dusk under acoustic guitar melodies.",
        tags: ["Tradition", "Lanterns", "River"]
      },
      {
        id: "ci2",
        category: "Sponsorship & Monetization",
        title: "Local Business 'Taste of Oakridge' Passports",
        description: "Attendees buy a $15 passport stamp card; sampling small treats from 10 different local bakery and food truck stalls, funding next year's festival.",
        tags: ["Fundraising", "Food Trucks", "Local Business"]
      }
    ]
  },
  {
    id: "evt-corporate-04",
    name: "Apex AI Summit & Innovation Mixer",
    type: "corporate",
    date: "2026-11-15",
    time: "09:00",
    location: "Metropolitan Pavilion, Financial District",
    guestCount: 200,
    targetBudget: 35000,
    currency: "$",
    notes: "Executive technology conference bringing together founders, researchers, and venture capitalists for keynotes, workshops, and networking lounge.",
    themeColor: "from-blue-600 to-indigo-700",
    budgetItems: [
      { id: "cpb1", category: "Venue & Staging", title: "Pavilion Main Hall & Breakout Rooms", estimated: 15000, actual: 14500, paid: "Deposit Paid", vendor: "Metropolitan Pavilion" },
      { id: "cpb2", category: "AV & Live Stream", title: "Dual 4K LED Walls, Mics & Global Streaming", estimated: 8000, actual: 8200, paid: "Deposit Paid", vendor: "Broadcast Media Tech" },
      { id: "cpb3", category: "Catering & Coffee Bar", title: "Artisan Espresso Bar, Bento Lunches & Evening Wine", estimated: 6500, actual: 6100, paid: "Deposit Paid", vendor: "Executive Catering Group" },
      { id: "cpb4", category: "Badges & Swag", title: "NFC Smart Badges & Sustainable Tech Swag", estimated: 3000, actual: 2900, paid: "Paid in Full", vendor: "EcoBadge Pro" },
      { id: "cpb5", category: "Keynote Honorariums", title: "Travel & Hospitality for Guest Speakers", estimated: 2500, actual: 2300, paid: "Paid in Full", vendor: "Apex Foundation" }
    ],
    timelineItems: [
      { id: "cpt1", type: "milestone", title: "Confirm Keynote Speakers & Panel Topics", deadline: "2026-09-15", completed: true, category: "Program" },
      { id: "cpt2", type: "milestone", title: "Launch Early Bird Tickets & Sponsor Tiers", deadline: "2026-10-01", completed: true, category: "Ticketing" },
      { id: "cpt3", type: "milestone", title: "AV Rigging & Livestream Dry Run", deadline: "2026-11-14", completed: false, category: "Production" },
      { id: "cpt4", type: "dayof", time: "08:00 AM", title: "Registration Opens & Barista Coffee Service", lead: "Registration Team", notes: "Badge scanning at kiosks" },
      { id: "cpt5", type: "dayof", time: "09:30 AM", title: "Opening Keynote: The Agentic Revolution", lead: "Dr. Evelyn Vance", notes: "Main Stage LED Wall" },
      { id: "cpt6", type: "dayof", time: "12:30 PM", title: "Executive Networking Lunch & Demos", lead: "Catering Team", notes: "Exhibition Hall" },
      { id: "cpt7", type: "dayof", time: "05:00 PM", title: "Sunset VC & Founder Cocktail Mixer", lead: "Apex Leadership", notes: "Rooftop Terrace" }
    ],
    vendors: [
      { id: "cpv1", category: "Venue", name: "Metropolitan Pavilion", contact: "Jordan Cole", phone: "+1 (212) 555-0199", email: "sales@metpavilion.com", status: "Hired", quote: 14500, contractSigned: true, rating: 5, notes: "Full day buy-out including tech mezzanine." },
      { id: "cpv2", category: "AV & Production", name: "Broadcast Media Tech", contact: "Tyler King", phone: "+1 (212) 555-8841", email: "tyler@broadcastmedia.com", status: "Hired", quote: 8200, contractSigned: true, rating: 5, notes: "Redundant fiber internet line secured for 4K streaming." },
      { id: "cpv3", category: "Catering", name: "Executive Catering Group", contact: "Chef Andre", phone: "+1 (212) 555-6677", email: "events@executivedining.com", status: "Hired", quote: 6100, contractSigned: true, rating: 4, notes: "Specialized dietary bento boxes & espresso barista cart." }
    ],
    ideas: [
      {
        id: "cpi1",
        category: "Interactive Tech",
        title: "AI Networking Matchmaker Lounge",
        description: "Attendees scan NFC badges at the lounge bar to see their top 3 recommended peers based on shared AI research interests and complementary startup goals.",
        tags: ["Networking", "NFC", "AI Match"]
      },
      {
        id: "cpi2",
        category: "Speaker Engagement",
        title: "Live Audience Prompt Battle",
        description: "A 20-minute rapid-fire interactive session where audience members submit prompts via mobile web to generate live solutions for real-world business bottlenecks.",
        tags: ["Interactive", "Prompt Battle", "Live Demo"]
      }
    ]
  }
];
