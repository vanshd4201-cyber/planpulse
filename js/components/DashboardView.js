// Dashboard Overview View Component

window.DashboardView = function DashboardView({
  event,
  onNavigateTab,
  onOpenEditEvent,
  darkMode
}) {
  const [aiInsight, setAiInsight] = React.useState(null);
  const [loadingAi, setLoadingAi] = React.useState(false);

  // Calculate metrics
  const targetBudget = Number(event.targetBudget) || 0;
  const totalActual = (event.budgetItems || []).reduce((acc, b) => acc + (Number(b.actual) || 0), 0);
  const totalEst = (event.budgetItems || []).reduce((acc, b) => acc + (Number(b.estimated) || 0), 0);
  const budgetSpentPct = targetBudget > 0 ? Math.min(100, Math.round((totalActual / targetBudget) * 100)) : 0;
  const remainingBudget = targetBudget - totalActual;

  const milestones = (event.timelineItems || []).filter(t => t.type === "milestone");
  const completedMilestones = milestones.filter(t => t.completed).length;
  const milestonePct = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  const dayOfItems = (event.timelineItems || []).filter(t => t.type === "dayof");

  const totalVendors = (event.vendors || []).length;
  const hiredVendors = (event.vendors || []).filter(v => v.status === "Hired").length;

  const guests = event.guests || [];
  const confirmedGuests = guests.filter(g => g.status === "Attending");
  const confirmedHeadcount = confirmedGuests.reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0);
  const tables = event.tables || [];
  const seatedGuestsCount = confirmedGuests.filter(g => g.tableId && tables.some(t => t.id === g.tableId)).length;
  const seatingPct = confirmedGuests.length > 0 ? Math.round((seatedGuestsCount / confirmedGuests.length) * 100) : 0;

  // Days countdown calculation
  const calculateDaysLeft = () => {
    if (!event.date) return 0;
    const target = new Date(event.date);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft();

  const handleFetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const advice = await window.GeminiService.getBudgetAdvice(event);
      setAiInsight(advice);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  return React.createElement(
    "div",
    { className: "space-y-6" },

    // Hero Event Banner
    React.createElement(
      "div",
      {
        className: "relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-panel shadow-2xl"
      },
      // Pure subtle crystal ambient highlights
      React.createElement("div", {
        className: "absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"
      }),
      React.createElement("div", {
        className: "absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"
      }),

      React.createElement(
        "div",
        { className: "relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6" },
        React.createElement(
          "div",
          { className: "space-y-2 max-w-2xl" },
          React.createElement(
            "div",
            { className: "flex items-center gap-2.5 flex-wrap" },
            React.createElement(
              "span",
              {
                className: "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/10 text-white border border-white/20 shadow-sm"
              },
              event.type
            ),
            React.createElement(
              "span",
              { className: "text-xs font-medium text-slate-300 flex items-center gap-1.5 glass-pill px-2.5 py-1 rounded-full" },
              React.createElement(window.Icons.Calendar, { className: "w-3.5 h-3.5 text-slate-300" }),
              event.date || "Date not set",
              event.time && ` • ${event.time}`
            ),
            React.createElement(
              "span",
              {
                onClick: () => onNavigateTab("guests"),
                className: "text-xs font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer glass-pill px-2.5 py-1 rounded-full hover:border-white/40 transition-colors"
              },
              React.createElement(window.Icons.Users, { className: "w-3.5 h-3.5 text-slate-300" }),
              guests.length > 0
                ? `${confirmedHeadcount} Confirmed / ${event.guestCount || 0} Target`
                : `${event.guestCount || 0} Expected Guests`
            )
          ),
          React.createElement(
            "h1",
            { className: "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gradient" },
            event.name
          ),
          React.createElement(
            "p",
            { className: "text-sm text-slate-300 flex items-center gap-1.5 pt-1" },
            React.createElement(window.Icons.MapPin, { className: "w-4 h-4 text-slate-300 flex-shrink-0" }),
            event.location || "Location not set"
          ),
          event.notes && React.createElement(
            "p",
            { className: "text-xs sm:text-sm text-slate-300 italic pt-1 leading-relaxed" },
            `"${event.notes}"`
          )
        ),

        // Countdown & Quick Edit
        React.createElement(
          "div",
          { className: "flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 flex-shrink-0" },
          React.createElement(
            "div",
            {
              className: "px-5 py-3 rounded-2xl glass-panel text-center shadow-lg border border-white/20"
            },
            React.createElement(
              "div",
              { className: "text-3xl font-black text-gradient" },
              daysLeft > 0 ? daysLeft : daysLeft === 0 ? "Today! 🎉" : "Past Event"
            ),
            React.createElement(
              "div",
              { className: "text-[11px] uppercase tracking-wider font-semibold text-slate-300" },
              daysLeft > 0 ? "Days to Event" : daysLeft === 0 ? "Happening Today" : "Event Completed"
            )
          ),
          React.createElement(
            "button",
            {
              onClick: onOpenEditEvent,
              className: "px-4 py-2 rounded-xl text-xs font-semibold glass-pill flex items-center gap-1.5 transition-all hover:scale-105 text-slate-200"
            },
            React.createElement(window.Icons.Edit3, { className: "w-3.5 h-3.5" }),
            "Edit Details"
          )
        )
      )
    ),

    // 4 Core Stat Cards
    React.createElement(
      "div",
      { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },

      // Stat 1: Budget Health
      React.createElement(
        "div",
        {
          onClick: () => onNavigateTab("budget"),
          className: "p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer"
        },
        React.createElement(
          "div",
          { className: "flex items-center justify-between mb-2" },
          React.createElement("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400" }, "Total Budget"),
          React.createElement(
            "div",
            { className: "w-9 h-9 rounded-xl badge-cyan flex items-center justify-center" },
            React.createElement(window.Icons.DollarSign, { className: "w-4 h-4 text-cyan-200" })
          )
        ),
        React.createElement("div", { className: "text-2xl font-black text-slate-100" }, `${event.currency || "$"}${targetBudget.toLocaleString()}`),
        React.createElement(
          "div",
          { className: "mt-3 space-y-1.5" },
          React.createElement(
            "div",
            { className: "flex justify-between text-xs text-slate-300" },
            React.createElement("span", null, `Spent: ${event.currency || "$"}${totalActual.toLocaleString()}`),
            React.createElement("span", { className: "font-bold text-white" }, `${budgetSpentPct}%`)
          ),
          React.createElement(
            "div",
            { className: "w-full h-2 rounded-full bg-white/10 overflow-hidden" },
            React.createElement("div", {
              className: "h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500",
              style: { width: `${budgetSpentPct}%` }
            })
          )
        )
      ),

      // Stat 2: Remaining Runway
      React.createElement(
        "div",
        {
          onClick: () => onNavigateTab("budget"),
          className: "p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer"
        },
        React.createElement(
          "div",
          { className: "flex items-center justify-between mb-2" },
          React.createElement("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400" }, "Remaining Funds"),
          React.createElement(
            "div",
            { className: "w-9 h-9 rounded-xl badge-emerald flex items-center justify-center" },
            React.createElement(window.Icons.TrendingUp, { className: "w-4 h-4 text-emerald-200" })
          )
        ),
        React.createElement(
          "div",
          { className: "text-2xl font-black text-slate-100" },
          `${event.currency || "$"}${remainingBudget.toLocaleString()}`
        ),
        React.createElement(
          "div",
          { className: "mt-3 text-xs text-slate-300" },
          remainingBudget >= 0
            ? `${event.currency || "$"}${totalEst.toLocaleString()} estimated across all items`
            : "⚠️ Over target budget limit!"
        )
      ),

      // Stat 3: Milestone Checklist
      React.createElement(
        "div",
        {
          onClick: () => onNavigateTab("timeline"),
          className: "p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer"
        },
        React.createElement(
          "div",
          { className: "flex items-center justify-between mb-2" },
          React.createElement("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400" }, "Milestones"),
          React.createElement(
            "div",
            { className: "w-9 h-9 rounded-xl badge-violet flex items-center justify-center" },
            React.createElement(window.Icons.CheckCircle2, { className: "w-4 h-4 text-purple-200" })
          )
        ),
        React.createElement("div", { className: "text-2xl font-black text-slate-100" }, `${completedMilestones} / ${milestones.length}`),
        React.createElement(
          "div",
          { className: "mt-3 space-y-1.5" },
          React.createElement(
            "div",
            { className: "flex justify-between text-xs text-slate-300" },
            React.createElement("span", null, `${milestonePct}% Completed`),
            React.createElement("span", { className: "font-semibold text-slate-300" }, `${milestones.length - completedMilestones} pending`)
          ),
          React.createElement(
            "div",
            { className: "w-full h-2 rounded-full bg-white/10 overflow-hidden" },
            React.createElement("div", {
              className: "h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500",
              style: { width: `${milestonePct}%` }
            })
          )
        )
      ),

      // Stat 4: Vendor Coverage
      React.createElement(
        "div",
        {
          onClick: () => onNavigateTab("vendors"),
          className: "p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer"
        },
        React.createElement(
          "div",
          { className: "flex items-center justify-between mb-2" },
          React.createElement("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400" }, "Vendors Hired"),
          React.createElement(
            "div",
            { className: "w-9 h-9 rounded-xl badge-pink flex items-center justify-center" },
            React.createElement(window.Icons.Building2, { className: "w-4 h-4 text-pink-200" })
          )
        ),
        React.createElement("div", { className: "text-2xl font-black text-slate-100" }, `${hiredVendors} / ${totalVendors}`),
        React.createElement(
          "div",
          { className: "mt-3 text-xs text-slate-300" },
          `${totalVendors - hiredVendors} vendors in quoting / research`
        )
      )
    ),

    // Seating & Floor Plan Summary Banner
    React.createElement(
      "div",
      {
        className: "p-4 sm:p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg cursor-pointer",
        onClick: () => onNavigateTab("seating")
      },
      React.createElement(
        "div",
        { className: "flex items-center gap-3.5" },
        React.createElement(
          "div",
          { className: "w-10 h-10 rounded-xl badge-amber flex items-center justify-center" },
          React.createElement(window.Icons.LayoutGrid, { className: "w-5 h-5 text-amber-200" })
        ),
        React.createElement(
          "div",
          null,
          React.createElement("div", { className: "text-sm font-bold text-white flex items-center gap-2" },
            React.createElement("span", null, "Interactive Table & Seating Chart"),
            React.createElement("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/10 text-slate-300 border border-white/15" }, `${tables.length} Tables`)
          ),
          React.createElement("div", { className: "text-xs text-slate-400 mt-0.5" },
            `${seatedGuestsCount} of ${confirmedGuests.length} confirmed guests assigned to tables (${seatingPct}% seated)`
          )
        )
      ),
      React.createElement(
        "button",
        {
          onClick: (e) => { e.stopPropagation(); onNavigateTab("seating"); },
          className: "px-4 py-2 rounded-xl text-xs font-bold glass-pill text-white hover:bg-white/20 flex items-center gap-1.5 transition-all whitespace-nowrap"
        },
        React.createElement("span", null, "Open Seating Chart"),
        React.createElement("span", null, "→")
      )
    ),

    // GenAI Event Insights & Quick Financial Health Card
    React.createElement(
      "div",
      {
        className: "rounded-3xl p-6 sm:p-8 glass-panel shadow-xl"
      },
      React.createElement(
        "div",
        { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10" },
        React.createElement(
          "div",
          { className: "flex items-center gap-3" },
          React.createElement(
            "div",
            { className: "w-10 h-10 rounded-2xl glass-pill flex items-center justify-center text-white border border-white/20 shadow-md" },
            React.createElement(window.Icons.Lightbulb, { className: "w-5 h-5 text-white" })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("h3", { className: "font-bold text-base text-slate-100" }, "GenAI Event Strategist & Insights"),
            React.createElement("p", { className: "text-xs text-slate-400" }, "Instant AI audit for budget efficiency, vendor risks, and run-of-show timing")
          )
        ),
        React.createElement(
          "button",
          {
            onClick: handleFetchAiInsights,
            disabled: loadingAi,
            className: "px-4 py-2 rounded-xl text-xs font-bold glass-btn-primary flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
          },
          React.createElement(window.Icons.Sparkles, { className: `w-4 h-4 ${loadingAi ? "animate-spin" : ""}` }),
          loadingAi ? "Analyzing Event..." : "Run AI Health Check"
        )
      ),

      aiInsight ? React.createElement(
        "div",
        { className: "mt-5 space-y-4 animate-in fade-in duration-300" },
        React.createElement(
          "div",
          { className: "p-4 rounded-2xl glass-panel text-sm leading-relaxed" },
          React.createElement("span", { className: "font-bold text-white" }, "Health Summary: "),
          aiInsight.summary
        ),
        React.createElement(
          "div",
          { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
          React.createElement(
            "div",
            { className: "p-4 rounded-2xl glass-panel" },
            React.createElement("div", { className: "text-xs font-bold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5" },
              React.createElement(window.Icons.Check, { className: "w-4 h-4 text-white" }),
              "Top Cost-Saving Levers"
            ),
            React.createElement(
              "ul",
              { className: "text-xs space-y-2 text-slate-300" },
              (aiInsight.costSavingTips || []).map((tip, idx) =>
                React.createElement("li", { key: idx, className: "flex items-start gap-2" },
                  React.createElement("span", { className: "text-white font-bold" }, "•"),
                  React.createElement("span", null, tip)
                )
              )
            )
          ),
          React.createElement(
            "div",
            { className: "p-4 rounded-2xl glass-panel" },
            React.createElement("div", { className: "text-xs font-bold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5" },
              React.createElement(window.Icons.AlertCircle, { className: "w-4 h-4 text-white" }),
              "Watch Out For Hidden Fees"
            ),
            React.createElement(
              "ul",
              { className: "text-xs space-y-2 text-slate-300" },
              (aiInsight.hiddenFeesWarning || []).map((warning, idx) =>
                React.createElement("li", { key: idx, className: "flex items-start gap-2" },
                  React.createElement("span", { className: "text-white font-bold" }, "•"),
                  React.createElement("span", null, warning)
                )
              )
            )
          )
        )
      ) : React.createElement(
        "div",
        { className: "mt-4 text-xs text-slate-400 italic text-center py-4" },
        "Click 'Run AI Health Check' to generate live budgeting strategies, vendor contract safeguards, and hidden fee warnings for your event."
      )
    ),

    // Split View: Urgent Milestones & Day-of Preview
    React.createElement(
      "div",
      { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },

      // Left: Upcoming Milestones
      React.createElement(
        "div",
        {
          className: "rounded-3xl p-6 glass-panel"
        },
        React.createElement(
          "div",
          { className: "flex items-center justify-between mb-4 pb-2 border-b border-white/10" },
          React.createElement("h3", { className: "font-bold text-base flex items-center gap-2 text-slate-100" },
            React.createElement(window.Icons.CheckCircle2, { className: "w-4 h-4 text-purple-400" }),
            "Next Checklist Milestones"
          ),
          React.createElement(
            "button",
            {
              onClick: () => onNavigateTab("timeline"),
              className: "text-xs font-semibold text-purple-400 hover:text-purple-300"
            },
            "View Timeline →"
          )
        ),
        milestones.length === 0 ? React.createElement(
          "p",
          { className: "text-xs text-slate-400 py-4 text-center" },
          "No milestones created yet."
        ) : React.createElement(
          "div",
          { className: "space-y-2.5" },
          milestones.slice(0, 4).map((m) =>
            React.createElement(
              "div",
              {
                key: m.id,
                className: `p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  m.completed
                    ? "opacity-60 bg-emerald-500/10 border-emerald-500/20"
                    : "glass-panel"
                }`
              },
              React.createElement(
                "div",
                { className: "flex items-center gap-3 truncate" },
                React.createElement(
                  "span",
                  { className: `w-5 h-5 rounded-full flex items-center justify-center text-xs ${m.completed ? "bg-emerald-500 text-white" : "border border-slate-400 text-transparent"}` },
                  m.completed && React.createElement(window.Icons.Check, { className: "w-3 h-3" })
                ),
                React.createElement(
                  "div",
                  { className: "truncate" },
                  React.createElement("div", { className: `text-xs font-semibold truncate ${m.completed ? "line-through text-slate-400" : "text-slate-200"}` }, m.title),
                  React.createElement("div", { className: "text-[10px] text-slate-400" }, `Due: ${m.deadline || "TBD"} • ${m.category || "General"}`)
                )
              ),
              React.createElement(
                "span",
                { className: `text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${m.completed ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}` },
                m.completed ? "Done" : "Pending"
              )
            )
          )
        )
      ),

      // Right: Day-of Run of Show Preview
      React.createElement(
        "div",
        {
          className: "rounded-3xl p-6 glass-panel"
        },
        React.createElement(
          "div",
          { className: "flex items-center justify-between mb-4 pb-2 border-b border-white/10" },
          React.createElement("h3", { className: "font-bold text-base flex items-center gap-2 text-slate-100" },
            React.createElement(window.Icons.Clock, { className: "w-4 h-4 text-pink-400" }),
            "Day-of Run of Show Preview"
          ),
          React.createElement(
            "button",
            {
              onClick: () => onNavigateTab("timeline"),
              className: "text-xs font-semibold text-pink-400 hover:text-pink-300"
            },
            "Manage Run of Show →"
          )
        ),
        dayOfItems.length === 0 ? React.createElement(
          "p",
          { className: "text-xs text-slate-400 py-4 text-center" },
          "No day-of schedule entered yet."
        ) : React.createElement(
          "div",
          { className: "space-y-2.5" },
          dayOfItems.slice(0, 4).map((d) =>
            React.createElement(
              "div",
              {
                key: d.id,
                className: "p-3 rounded-2xl glass-panel flex items-center justify-between gap-3"
              },
              React.createElement(
                "div",
                { className: "flex items-center gap-3 truncate" },
                React.createElement(
                  "div",
                  { className: "px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-300 font-mono text-xs font-bold border border-pink-500/30 whitespace-nowrap" },
                  d.time
                ),
                React.createElement(
                  "div",
                  { className: "truncate" },
                  React.createElement("div", { className: "text-xs font-semibold truncate text-slate-200" }, d.title),
                  React.createElement("div", { className: "text-[10px] text-slate-400" }, `Lead: ${d.lead || "Unassigned"}`)
                )
              )
            )
          )
        )
      )
    )
  );
};
