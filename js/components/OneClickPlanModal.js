// One-Click AI Magic Event Generator Modal

window.OneClickPlanModal = function OneClickPlanModal({
  isOpen,
  onClose,
  onCreateEvent,
  darkMode
}) {
  const [prompt, setPrompt] = React.useState("");
  const [eventType, setEventType] = React.useState("wedding");
  const [targetBudget, setTargetBudget] = React.useState("15000");
  const [guestCount, setGuestCount] = React.useState("80");
  const [currency, setCurrency] = React.useState("$");
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    { type: "wedding", text: "Rustic chic barn wedding with candlelit long tables and bluegrass band", budget: "20000", guests: "100" },
    { type: "birthday", text: "Neon retro arcade 30th birthday with craft beer and VR stations", budget: "4000", guests: "40" },
    { type: "community", text: "Neighborhood summer food truck and outdoor cinema festival", budget: "8000", guests: "300" },
    { type: "corporate", text: "AI & Biotech founder summit with pitch stage and rooftop networking", budget: "30000", guests: "150" }
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const generatedEvent = await window.GeminiService.generateFullEventPlan({
        prompt: prompt.trim(),
        eventType,
        targetBudget: Number(targetBudget) || 10000,
        guestCount: Number(guestCount) || 50,
        currency
      });

      onCreateEvent(generatedEvent);
      if (window.confetti) {
        window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
      onClose();
    } catch (err) {
      console.error("Error generating plan", err);
      alert("Encountered an issue generating the plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyQuickPrompt = (qp) => {
    setPrompt(qp.text);
    setEventType(qp.type);
    setTargetBudget(qp.budget);
    setGuestCount(qp.guests);
  };

  return React.createElement(
    "div",
    { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" },
    React.createElement(
      "div",
      {
        className: "w-full max-w-2xl rounded-3xl p-6 sm:p-8 glass-modal shadow-2xl max-h-[90vh] overflow-y-auto text-white"
      },
      // Header
      React.createElement(
        "div",
        { className: "flex items-center justify-between pb-4 border-b border-white/10" },
        React.createElement(
          "div",
          { className: "flex items-center gap-3" },
          React.createElement(
            "div",
            { className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 border border-white/20" },
            React.createElement(window.Icons.Sparkles, { className: "w-5 h-5 animate-pulse" })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("h3", { className: "text-lg sm:text-xl font-black text-gradient" }, "One-Click AI Event Generator"),
            React.createElement("p", { className: "text-xs text-slate-400" }, "Enter your vision: AI automatically builds your budget, timeline, vendors & ideas!")
          )
        ),
        React.createElement(
          "button",
          { onClick: onClose, disabled: loading, className: "text-slate-400 hover:text-white p-1 text-base" },
          "✕"
        )
      ),

      // Form
      React.createElement(
        "form",
        { onSubmit: handleGenerate, className: "mt-6 space-y-5" },

        // Prompt input
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5" },
            "Describe Your Event Vision *"
          ),
          React.createElement("textarea", {
            rows: 3,
            required: true,
            value: prompt,
            onChange: (e) => setPrompt(e.target.value),
            placeholder: "e.g., 50-person retro neon birthday with arcade games on a $4,000 budget, or romantic cliffside wedding in October...",
            className: "w-full px-4 py-3 rounded-2xl glass-input text-sm focus:outline-none"
          })
        ),

        // Quick suggestions
        React.createElement(
          "div",
          { className: "space-y-1.5" },
          React.createElement("span", { className: "text-[11px] font-semibold text-slate-400" }, "Or pick a prompt starter:"),
          React.createElement(
            "div",
            { className: "grid grid-cols-1 sm:grid-cols-2 gap-2" },
            quickPrompts.map((qp, idx) =>
              React.createElement(
                "button",
                {
                  key: idx,
                  type: "button",
                  onClick: () => handleApplyQuickPrompt(qp),
                  className: "text-left p-3 rounded-2xl glass-pill transition-all hover:scale-[1.02] text-slate-300"
                },
                React.createElement("div", { className: "font-semibold text-purple-400 capitalize" }, qp.type),
                React.createElement("div", { className: "truncate text-[11px] text-slate-400" }, qp.text)
              )
            )
          )
        ),

        // Event parameters
        React.createElement(
          "div",
          { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2" },
          // Event Type
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-[11px] font-bold uppercase text-slate-400 mb-1" }, "Type"),
            React.createElement(
              "select",
              {
                value: eventType,
                onChange: (e) => setEventType(e.target.value),
                className: "w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold focus:outline-none"
              },
              React.createElement("option", { value: "wedding" }, "Wedding"),
              React.createElement("option", { value: "birthday" }, "Birthday"),
              React.createElement("option", { value: "community" }, "Community Event"),
              React.createElement("option", { value: "corporate" }, "Corporate / Gala")
            )
          ),
          // Target Budget
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-[11px] font-bold uppercase text-slate-400 mb-1" }, "Budget Target"),
            React.createElement("input", {
              type: "number",
              value: targetBudget,
              onChange: (e) => setTargetBudget(e.target.value),
              placeholder: "15000",
              className: "w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold focus:outline-none"
            })
          ),
          // Guest Count
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-[11px] font-bold uppercase text-slate-400 mb-1" }, "Guests"),
            React.createElement("input", {
              type: "number",
              value: guestCount,
              onChange: (e) => setGuestCount(e.target.value),
              placeholder: "80",
              className: "w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold focus:outline-none"
            })
          ),
          // Currency
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-[11px] font-bold uppercase text-slate-400 mb-1" }, "Currency"),
            React.createElement(
              "select",
              {
                value: currency,
                onChange: (e) => setCurrency(e.target.value),
                className: "w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold focus:outline-none"
              },
              React.createElement("option", { value: "$" }, "$ USD"),
              React.createElement("option", { value: "₹" }, "₹ INR"),
              React.createElement("option", { value: "€" }, "€ EUR"),
              React.createElement("option", { value: "£" }, "£ GBP"),
              React.createElement("option", { value: "C$" }, "C$ CAD"),
              React.createElement("option", { value: "A$" }, "A$ AUD")
            )
          )
        ),

        // Action Buttons
        React.createElement(
          "div",
          { className: "flex items-center justify-end gap-3 pt-4 border-t border-white/10" },
          React.createElement(
            "button",
            {
              type: "button",
              onClick: onClose,
              disabled: loading,
              className: "px-4 py-2 rounded-xl text-xs font-semibold glass-pill text-slate-300"
            },
            "Cancel"
          ),
          React.createElement(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-lg shadow-purple-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 border border-white/20"
            },
            React.createElement(window.Icons.Sparkles, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` }),
            loading ? "Building Your Master Plan..." : "Generate Magic Plan ✨"
          )
        )
      )
    )
  );
};
