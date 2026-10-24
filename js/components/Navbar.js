// Navigation & Top Header Component

window.Navbar = function Navbar({
  events,
  activeEvent,
  onSelectEvent,
  onOpenNewEvent,
  onOpenAIConfig,
  onOpenOneClickPlan,
  darkMode,
  onToggleDarkMode,
  hasApiKey
}) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dataMenuOpen, setDataMenuOpen] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const getEventBadge = (type) => {
    switch (type) {
      case "wedding": return { icon: "Heart", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
      case "birthday": return { icon: "PartyPopper", color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20" };
      case "community": return { icon: "Users", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
      case "corporate": return { icon: "Briefcase", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
      default: return { icon: "Calendar", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
    }
  };

  const badge = activeEvent ? getEventBadge(activeEvent.type) : null;

  const handleExport = () => {
    window.StorageService.exportJSON();
    setDataMenuOpen(false);
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const ok = window.StorageService.importJSON(event.target.result);
      if (ok) {
        window.location.reload();
      } else {
        alert("Failed to parse event JSON file. Please check file format.");
      }
    };
    reader.readAsText(file);
    setDataMenuOpen(false);
  };

  return React.createElement(
    "header",
    {
      className: "sticky top-0 z-40 glass-nav transition-colors duration-200"
    },
    React.createElement(
      "div",
      { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4" },
      
      // Left: Logo & Event Switcher
      React.createElement(
        "div",
        { className: "flex items-center gap-4" },
        React.createElement(
          "div",
          { className: "flex items-center gap-2 cursor-pointer", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
          React.createElement(
            "div",
            { className: "w-10 h-10 rounded-2xl badge-violet flex items-center justify-center shadow-lg text-white" },
            React.createElement(window.Icons.Sparkles, { className: "w-5 h-5 text-purple-200" })
          ),
          React.createElement(
            "div",
            { className: "hidden sm:block" },
            React.createElement("div", { className: "font-black tracking-tight text-lg text-gradient" }, "PlanPulse"),
            React.createElement("div", { className: "text-[10px] tracking-wider uppercase font-extrabold text-purple-300 -mt-1" }, "VisionOS Luxe Glass")
          )
        ),

        // Event Selector Dropdown
        React.createElement(
          "div",
          { className: "relative" },
          React.createElement(
            "button",
            {
              onClick: () => setDropdownOpen(!dropdownOpen),
              className: "flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-pill text-sm font-semibold transition-all hover:scale-[1.02] text-slate-200"
            },
            React.createElement("span", { className: "w-2 h-2 rounded-full bg-white/70 shadow-sm" }),
            React.createElement("span", { className: "max-w-[140px] sm:max-w-[200px] truncate" }, activeEvent ? activeEvent.name : "Select Event"),
            React.createElement(window.Icons.ChevronDown, { className: "w-4 h-4 text-slate-400" })
          ),

          dropdownOpen && React.createElement(
            "div",
            {
              className: "absolute left-0 mt-2 w-72 rounded-2xl shadow-2xl glass-modal p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            },
            React.createElement(
              "div",
              { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5" },
              "My Events"
            ),
            React.createElement(
              "div",
              { className: "max-h-60 overflow-y-auto space-y-1" },
              events.map((evt) =>
                React.createElement(
                  "button",
                  {
                    key: evt.id,
                    onClick: () => {
                      onSelectEvent(evt.id);
                      setDropdownOpen(false);
                    },
                    className: `w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition-colors ${
                      evt.id === activeEvent?.id
                        ? "bg-white/15 text-white font-bold border border-white/20"
                        : "hover:bg-white/10 text-slate-300"
                    }`
                  },
                  React.createElement("div", { className: "truncate pr-2" }, evt.name),
                  React.createElement("span", { className: "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded glass-pill text-slate-300" }, evt.type)
                )
              )
            ),
            React.createElement("div", { className: "border-t my-1.5 border-white/10" }),
            React.createElement(
              "button",
              {
                onClick: () => {
                  setDropdownOpen(false);
                  onOpenNewEvent();
                },
                className: "w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 text-white hover:bg-white/10 font-semibold"
              },
              React.createElement(window.Icons.Plus, { className: "w-4 h-4" }),
              "Create Custom Event"
            )
          )
        )
      ),

      // Right: Action Buttons (One-Click AI Planner, AI Settings, Theme Toggle, Data backup)
      React.createElement(
        "div",
        { className: "flex items-center gap-2" },

        // One-Click Magic Event Planner button
        React.createElement(
          "button",
          {
            onClick: onOpenOneClickPlan,
            className: "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold glass-btn-primary text-white active:scale-95 transition-all"
          },
          React.createElement(window.Icons.Sparkles, { className: "w-4 h-4" }),
          React.createElement("span", { className: "hidden xs:inline" }, "AI Magic Planner")
        ),

        // AI Configuration Status & Button
        React.createElement(
          "button",
          {
            onClick: onOpenAIConfig,
            title: hasApiKey ? "Gemini Live API Active" : "Using Built-in Smart AI Engine (Click to add API key)",
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold glass-pill transition-all hover:scale-105 text-slate-200"
          },
          React.createElement("span", { className: `w-2 h-2 rounded-full ${hasApiKey ? "bg-white animate-pulse" : "bg-white/40"}` }),
          React.createElement("span", { className: "hidden md:inline" }, hasApiKey ? "Gemini API Active" : "Smart AI Simulator"),
          React.createElement(window.Icons.Settings, { className: "w-3.5 h-3.5 ml-0.5 opacity-80" })
        ),

        // Export/Import Dropdown
        React.createElement(
          "div",
          { className: "relative" },
          React.createElement(
            "button",
            {
              onClick: () => setDataMenuOpen(!dataMenuOpen),
              title: "Export or Import Plans",
              className: "p-2 rounded-xl glass-pill hover:scale-105 transition-all text-slate-300"
            },
            React.createElement(window.Icons.Download, { className: "w-4 h-4" })
          ),
          dataMenuOpen && React.createElement(
            "div",
            {
              className: "absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl glass-modal p-1.5 z-50 text-slate-200"
            },
            React.createElement(
              "button",
              {
                onClick: handleExport,
                className: "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 hover:bg-white/10"
              },
              React.createElement(window.Icons.Download, { className: "w-3.5 h-3.5" }),
              "Export All Plans (JSON)"
            ),
            React.createElement(
              "button",
              {
                onClick: () => fileInputRef.current?.click(),
                className: "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 hover:bg-white/10"
              },
              React.createElement(window.Icons.Plus, { className: "w-3.5 h-3.5" }),
              "Import Plans from File"
            ),
            React.createElement(
              "button",
              {
                onClick: () => {
                  if (confirm("Reset all events back to initial starter templates?")) {
                    window.StorageService.resetToDefaults();
                    window.location.reload();
                  }
                },
                className: "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 text-rose-400 hover:bg-rose-500/10"
              },
              React.createElement(window.Icons.Trash2, { className: "w-3.5 h-3.5" }),
              "Reset to Starter Demos"
            ),
            React.createElement("input", {
              type: "file",
              accept: ".json",
              ref: fileInputRef,
              style: { display: "none" },
              onChange: handleFileImport
            })
          )
        ),

        // Dark / Light Mode Toggle
        React.createElement(
          "button",
          {
            onClick: onToggleDarkMode,
            title: darkMode ? "Switch to Light Mode" : "Switch to Dark Mode",
            className: "p-2 rounded-xl glass-pill hover:scale-105 transition-all text-amber-400"
          },
          darkMode
            ? React.createElement(window.Icons.Sun, { className: "w-4 h-4" })
            : React.createElement(window.Icons.Moon, { className: "w-4 h-4" })
        )
      )
    )
  );
};
