// GenAI Creative Hub & Idea Studio Component

window.IdeaStudioView = function IdeaStudioView({
  event,
  onUpdateEvent,
  darkMode
}) {
  const [prompt, setPrompt] = React.useState("");
  const [tone, setTone] = React.useState("playful & festive");
  const [loading, setLoading] = React.useState(false);
  const [generatedStudio, setGeneratedStudio] = React.useState(null);
  const [copiedInvite, setCopiedInvite] = React.useState(false);

  const savedIdeas = event.ideas || [];

  const handleGenerate = async (customPrompt) => {
    const finalPrompt = customPrompt || prompt;
    setLoading(true);
    try {
      const result = await window.GeminiService.generateCreativeStudioIdeas(
        event.type,
        finalPrompt,
        event.guestCount,
        tone
      );
      setGeneratedStudio(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToEvent = (title, category, description, tags = []) => {
    const newIdea = {
      id: `i-${Date.now()}`,
      category,
      title,
      description,
      tags
    };
    onUpdateEvent({ ...event, ideas: [...savedIdeas, newIdea] });
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleDeleteSavedIdea = (id) => {
    const updated = savedIdeas.filter(i => i.id !== id);
    onUpdateEvent({ ...event, ideas: updated });
  };

  const handleCopyInvite = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  // Quick Inspiration Presets
  const presets = {
    wedding: ["Tuscan Vineyard Sunset", "Minimalist Modern Black Tie", "Enchanted Fairy Forest", "Boho Coastal Breezes"],
    birthday: ["Neon Cyberpunk Synthwave", "Speakeasy 1920s Gatsby", "Retro 90s Arcade Bash", "Tropical Tiki Oasis"],
    community: ["Harvest Lantern Flotilla", "Eco-Friendly Street Food Fair", "Makers & Artisans Carnival", "Neighborhood Block Party"],
    corporate: ["Next-Gen AI Founder Summit", "Executive Rooftop Mixer", "Sustainable Future Forum", "Interactive Hackathon Showcase"]
  }[event.type] || ["Modern Elegant Gathering", "High-Energy Festival", "Creative Storytelling Evening"];

  return React.createElement(
    "div",
    { className: "space-y-8" },

    // Header & Studio Banner
    React.createElement(
      "div",
      {
        className: "p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden shadow-2xl"
      },
      React.createElement(
        "div",
        { className: "max-w-2xl space-y-2 relative z-10" },
        React.createElement("div", { className: "flex items-center gap-2" },
          React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30" },
            "GenAI Idea Studio"
          )
        ),
        React.createElement("h2", { className: "text-2xl sm:text-3xl font-black text-gradient" },
          "Brainstorm Themes, Activities & Cocktails"
        ),
        React.createElement("p", { className: "text-xs sm:text-sm text-slate-300" },
          `Generate personalized sensory concepts, icebreaker games, and bespoke invitation copy for ${event.name}.`
        )
      ),

      // Prompt Input Form
      React.createElement(
        "div",
        { className: "mt-6 relative z-10 flex flex-col sm:flex-row gap-3" },
        React.createElement("input", {
          type: "text",
          value: prompt,
          onChange: (e) => setPrompt(e.target.value),
          placeholder: "e.g., Rustic candlelit barn with wildflower accents and cozy cider bar...",
          className: "flex-1 px-4 py-3 rounded-2xl glass-input text-sm focus:outline-none"
        }),
        React.createElement(
          "select",
          {
            value: tone,
            onChange: (e) => setTone(e.target.value),
            className: "px-3.5 py-3 rounded-2xl glass-input text-xs font-semibold focus:outline-none"
          },
          React.createElement("option", { value: "playful & festive" }, "Playful & Festive"),
          React.createElement("option", { value: "elegant & luxury" }, "Elegant & Luxury"),
          React.createElement("option", { value: "intimate & heartfelt" }, "Intimate & Heartfelt"),
          React.createElement("option", { value: "bold & high-energy" }, "Bold & High-Energy"),
          React.createElement("option", { value: "corporate & sophisticated" }, "Corporate & Polished")
        ),
        React.createElement(
          "button",
          {
            onClick: () => handleGenerate(),
            disabled: loading,
            className: "px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-lg shadow-purple-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-white/20"
          },
          React.createElement(window.Icons.Sparkles, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` }),
          loading ? "Brainstorming..." : "Generate Magic"
        )
      ),

      // Preset Inspiration Badges
      React.createElement(
        "div",
        { className: "mt-4 flex items-center gap-2 flex-wrap" },
        React.createElement("span", { className: "text-[11px] text-slate-400 font-semibold" }, "Inspiration Presets:"),
        presets.map((p, idx) =>
          React.createElement(
            "button",
            {
              key: idx,
              onClick: () => {
                setPrompt(p);
                handleGenerate(p);
              },
              className: "text-[11px] font-medium px-2.5 py-1 rounded-full glass-pill text-slate-300 hover:scale-105 transition-all"
            },
            `✨ ${p}`
          )
        )
      )
    ),

    // Active AI Generated Studio Output
    generatedStudio && React.createElement(
      "div",
      { className: "space-y-6 animate-in fade-in duration-300" },
      React.createElement("h3", { className: "text-lg font-bold text-slate-100 flex items-center gap-2 text-gradient" },
        React.createElement(window.Icons.Sparkles, { className: "w-5 h-5 text-amber-400" }),
        "Freshly Brewed Creative Concepts"
      ),

      React.createElement(
        "div",
        { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },

        // Card 1: Theme Concept & Palette
        React.createElement(
          "div",
          { className: "p-6 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between" },
          React.createElement(
            "div",
            { className: "space-y-4" },
            React.createElement(
              "div",
              { className: "flex items-center justify-between" },
              React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-purple-400" }, "Theme & Aesthetic Palette"),
              React.createElement(
                "button",
                {
                  onClick: () => handleSaveToEvent(
                    generatedStudio.themeConcept.title,
                    "Theme & Decor",
                    generatedStudio.themeConcept.visualVibe,
                    generatedStudio.themeConcept.palette
                  ),
                  className: "text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1"
                },
                React.createElement(window.Icons.Plus, { className: "w-3.5 h-3.5" }),
                "Save to Event"
              )
            ),
            React.createElement("h4", { className: "text-xl font-bold text-slate-100" }, generatedStudio.themeConcept.title),
            React.createElement("p", { className: "text-xs text-slate-300 leading-relaxed" }, generatedStudio.themeConcept.visualVibe),
            // Color chips
            React.createElement(
              "div",
              { className: "pt-2 flex items-center gap-2 flex-wrap" },
              (generatedStudio.themeConcept.palette || []).map((col, idx) =>
                React.createElement(
                  "div",
                  { key: idx, className: "flex items-center gap-2 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-200" },
                  React.createElement("span", { className: `w-3 h-3 rounded-full ${idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-rose-400" : idx === 2 ? "bg-emerald-400" : "bg-purple-400"}` }),
                  col
                )
              )
            )
          )
        ),

        // Card 2: Invitation Copywriter
        React.createElement(
          "div",
          { className: "p-6 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between" },
          React.createElement(
            "div",
            { className: "space-y-3" },
            React.createElement(
              "div",
              { className: "flex items-center justify-between" },
              React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-pink-400" }, "Invitation Copywriter"),
              React.createElement(
                "button",
                {
                  onClick: () => handleCopyInvite(`${generatedStudio.invitationCopy.headline}\n\n${generatedStudio.invitationCopy.bodyText}\n\n${generatedStudio.invitationCopy.callToAction}`),
                  className: "text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1.5"
                },
                React.createElement(window.Icons.Copy, { className: "w-3.5 h-3.5" }),
                copiedInvite ? "Copied!" : "Copy Text"
              )
            ),
            React.createElement("h4", { className: "text-base font-bold text-slate-100" }, generatedStudio.invitationCopy.headline),
            React.createElement("p", { className: "text-xs text-slate-200 leading-relaxed italic glass-panel p-3.5 rounded-2xl" },
              `"${generatedStudio.invitationCopy.bodyText}"`
            ),
            React.createElement("div", { className: "text-xs text-purple-300 font-semibold" }, generatedStudio.invitationCopy.callToAction)
          )
        ),

        // Card 3: Interactive Entertainment & Activities
        React.createElement(
          "div",
          { className: "p-6 rounded-3xl glass-panel shadow-lg" },
          React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 block" }, "Interactive Entertainment & Games"),
          React.createElement(
            "div",
            { className: "space-y-4" },
            (generatedStudio.interactiveActivities || []).map((act, idx) =>
              React.createElement(
                "div",
                { key: idx, className: "p-3.5 rounded-2xl glass-panel space-y-1.5" },
                React.createElement(
                  "div",
                  { className: "flex items-center justify-between" },
                  React.createElement("h5", { className: "text-sm font-bold text-slate-100" }, act.title),
                  React.createElement(
                    "button",
                    {
                      onClick: () => handleSaveToEvent(act.title, "Activities", act.description, ["Activity", "Interactive"]),
                      className: "text-[11px] text-purple-300 hover:text-purple-200 font-medium"
                    },
                    "+ Save"
                  )
                ),
                React.createElement("p", { className: "text-xs text-slate-300 leading-relaxed" }, act.description)
              )
            )
          )
        ),

        // Card 4: Signature Food & Drinks
        React.createElement(
          "div",
          { className: "p-6 rounded-3xl glass-panel shadow-lg" },
          React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 block" }, "Signature Catering & Cocktails"),
          React.createElement(
            "div",
            { className: "space-y-4" },
            (generatedStudio.foodAndDrink || []).map((food, idx) =>
              React.createElement(
                "div",
                { key: idx, className: "p-3.5 rounded-2xl glass-panel space-y-1.5" },
                React.createElement(
                  "div",
                  { className: "flex items-center justify-between" },
                  React.createElement(
                    "div",
                    null,
                    React.createElement("h5", { className: "text-sm font-bold text-slate-100" }, food.name),
                    React.createElement("span", { className: "text-[10px] uppercase font-bold text-emerald-400" }, food.type)
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => handleSaveToEvent(food.name, "Food & Drinks", food.description, [food.type, "Catering"]),
                      className: "text-[11px] text-purple-300 hover:text-purple-200 font-medium"
                    },
                    "+ Save"
                  )
                ),
                React.createElement("p", { className: "text-xs text-slate-300 leading-relaxed" }, food.description)
              )
            )
          )
        )
      )
    ),

    // Saved Ideas for this Event
    React.createElement(
      "div",
      { className: "space-y-4 pt-4" },
      React.createElement(
        "div",
        { className: "flex items-center justify-between" },
        React.createElement("h3", { className: "text-lg font-bold text-slate-100 flex items-center gap-2" },
          React.createElement(window.Icons.Lightbulb, { className: "w-5 h-5 text-purple-400" }),
          `Saved Event Ideas (${savedIdeas.length})`
        ),
        React.createElement("span", { className: "text-xs text-slate-400" }, "Concepts pinned to this event")
      ),
      savedIdeas.length === 0 ? React.createElement(
        "div",
        { className: "p-8 rounded-3xl glass-panel text-center text-xs text-slate-400" },
        "No ideas saved yet. Generate creative ideas above and click '+ Save to Event' to pin them!"
      ) : React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
        savedIdeas.map((idea) =>
          React.createElement(
            "div",
            {
              key: idea.id,
              className: "p-5 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between gap-3"
            },
            React.createElement(
              "div",
              { className: "space-y-2" },
              React.createElement(
                "div",
                { className: "flex items-center justify-between" },
                React.createElement(
                  "span",
                  { className: "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25" },
                  idea.category || "General"
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => handleDeleteSavedIdea(idea.id),
                    className: "text-slate-400 hover:text-rose-400 p-1"
                  },
                  React.createElement(window.Icons.Trash2, { className: "w-3.5 h-3.5" })
                )
              ),
              React.createElement("h4", { className: "text-sm font-bold text-slate-100" }, idea.title),
              React.createElement("p", { className: "text-xs text-slate-300 leading-relaxed" }, idea.description)
            ),
            idea.tags && idea.tags.length > 0 && React.createElement(
              "div",
              { className: "flex items-center gap-1.5 flex-wrap pt-1" },
              idea.tags.map((tag, tIdx) =>
                React.createElement(
                  "span",
                  { key: tIdx, className: "text-[10px] px-2 py-0.5 rounded-full glass-pill text-slate-300" },
                  `#${tag}`
                )
              )
            )
          )
        )
      )
    )
  );
};
