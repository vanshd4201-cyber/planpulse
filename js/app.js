// Root App Component for PlanPulse

function App() {
  const [events, setEvents] = React.useState([]);
  const [activeEventId, setActiveEventId] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("dashboard"); // dashboard, budget, timeline, vendors, ideas
  const [darkMode, setDarkMode] = React.useState(true);
  const [hasApiKey, setHasApiKey] = React.useState(false);

  // Modals
  const [isOneClickModalOpen, setIsOneClickModalOpen] = React.useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = React.useState(false);
  const [isAIConfigOpen, setIsAIConfigOpen] = React.useState(false);

  // Initialize data on mount
  React.useEffect(() => {
    const loadedEvents = window.StorageService.getEvents();
    const activeId = window.StorageService.getActiveEventId();
    const isDark = window.StorageService.getDarkMode();
    const key = window.StorageService.getApiKey();

    setEvents(loadedEvents);
    setActiveEventId(activeId && loadedEvents.some(e => e.id === activeId) ? activeId : (loadedEvents[0]?.id || ""));
    setDarkMode(isDark);
    setHasApiKey(!!key);
  }, []);

  // Update theme class on HTML element
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.StorageService.setDarkMode(darkMode);
  }, [darkMode]);

  const activeEvent = events.find(e => e.id === activeEventId) || events[0] || null;

  const handleSelectEvent = (id) => {
    setActiveEventId(id);
    window.StorageService.setActiveEventId(id);
  };

  const handleUpdateActiveEvent = (updated) => {
    const updatedEvents = events.map(e => e.id === updated.id ? updated : e);
    setEvents(updatedEvents);
    window.StorageService.saveEvents(updatedEvents);
  };

  const handleCreateNewEvent = (newEvent) => {
    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);
    setActiveEventId(newEvent.id);
    window.StorageService.saveEvents(updatedEvents);
    window.StorageService.setActiveEventId(newEvent.id);
    setActiveTab("dashboard");
  };

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleAISaved = () => {
    setHasApiKey(!!window.StorageService.getApiKey());
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: window.Icons.TrendingUp },
    { id: "budget", label: "Budget & Costs", icon: window.Icons.DollarSign, count: activeEvent?.budgetItems?.length },
    { id: "timeline", label: "Timeline & Schedule", icon: window.Icons.Clock, count: activeEvent?.timelineItems?.length },
    { id: "guests", label: "Guest List & RSVP", icon: window.Icons.Users, count: activeEvent?.guests?.length || 0 },
    { id: "seating", label: "Seating Chart", icon: window.Icons.LayoutGrid, count: activeEvent?.tables?.length || 0 },
    { id: "vendors", label: "Vendor Directory", icon: window.Icons.Building2, count: activeEvent?.vendors?.length },
    { id: "ideas", label: "GenAI Idea Studio", icon: window.Icons.Lightbulb, count: activeEvent?.ideas?.length }
  ];

  if (!activeEvent) {
    return React.createElement(
      "div",
      { className: "min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white" },
      React.createElement("div", { className: "text-center space-y-4" },
        React.createElement(window.Icons.Sparkles, { className: "w-10 h-10 text-purple-400 mx-auto animate-spin" }),
        React.createElement("h2", { className: "text-xl font-bold" }, "Loading PlanPulse Event Assistant...")
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: `min-h-screen flex flex-col transition-colors duration-200 bg-transparent ${
        darkMode ? "text-slate-100" : "text-slate-900"
      }`
    },

    // Top Navigation
    React.createElement(window.Navbar, {
      events,
      activeEvent,
      onSelectEvent: handleSelectEvent,
      onOpenNewEvent: () => setIsEventModalOpen(true),
      onOpenAIConfig: () => setIsAIConfigOpen(true),
      onOpenOneClickPlan: () => setIsOneClickModalOpen(true),
      darkMode,
      onToggleDarkMode: handleToggleDarkMode,
      hasApiKey
    }),

    // Main Content Container
    React.createElement(
      "main",
      { className: "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" },

      // Tab Navigation Bar
      React.createElement(
        "nav",
        {
          className: "p-1.5 rounded-2xl glass-panel flex items-center gap-1 overflow-x-auto shadow-lg"
        },
        tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return React.createElement(
            "button",
            {
              key: tab.id,
              onClick: () => setActiveTab(tab.id),
              className: `flex items-center justify-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 flex-1 ${
                isActive
                  ? "bg-white/20 text-white shadow-xl border border-white/35 backdrop-blur-xl scale-[1.02]"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`
            },
            React.createElement(tab.icon, { className: "w-4 h-4 text-white" }),
            React.createElement("span", null, tab.label),
            tab.count !== undefined && React.createElement(
              "span",
              {
                className: `text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/30 text-white" : "bg-white/10 text-slate-400"
                }`
              },
              tab.count
            )
          );
        })
      ),

      // Tab Views
      activeTab === "dashboard" && React.createElement(window.DashboardView, {
        event: activeEvent,
        onNavigateTab: (tabId) => setActiveTab(tabId),
        onOpenEditEvent: () => setIsEditEventModalOpen(true),
        darkMode
      }),

      activeTab === "budget" && React.createElement(window.BudgetView, {
        event: activeEvent,
        onUpdateEvent: handleUpdateActiveEvent,
        darkMode
      }),

      activeTab === "timeline" && React.createElement(window.TimelineView, {
        event: activeEvent,
        onUpdateEvent: handleUpdateActiveEvent,
        darkMode
      }),

      activeTab === "guests" && React.createElement(window.GuestsView, {
        event: activeEvent,
        onUpdateEvent: handleUpdateActiveEvent,
        onNavigateTab: (tabId) => setActiveTab(tabId),
        darkMode
      }),

      activeTab === "seating" && React.createElement(window.SeatingView, {
        event: activeEvent,
        onUpdateEvent: handleUpdateActiveEvent,
        onNavigateTab: (tabId) => setActiveTab(tabId),
        darkMode
      }),

      activeTab === "vendors" && React.createElement(window.VendorsView, {
        event: activeEvent,
        onUpdateEvent: handleUpdateActiveEvent,
        darkMode
      }),

      activeTab === "ideas" && React.createElement(window.IdeaStudioView, {
        event: activeEvent,
        onUpdateEvent: handleUpdateActiveEvent,
        darkMode
      })
    ),

    // Footer
    React.createElement(
      "footer",
      {
        className: "border-t py-6 text-center text-xs text-slate-400 glass-nav mt-auto"
      },
      React.createElement(
        "div",
        { className: "max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2" },
        React.createElement("div", { className: "flex items-center gap-1.5" },
          React.createElement("span", { className: "font-bold text-slate-200" }, "PlanPulse"),
          React.createElement("span", null, "• Fluid Liquid Glass UI")
        ),
        React.createElement("div", null, "Crafted with Vibe Coding • Weddings, Birthdays, Community & Corporate Events")
      )
    ),

    // Modals
    React.createElement(window.OneClickPlanModal, {
      isOpen: isOneClickModalOpen,
      onClose: () => setIsOneClickModalOpen(false),
      onCreateEvent: handleCreateNewEvent,
      darkMode
    }),

    React.createElement(window.EventModal, {
      isOpen: isEventModalOpen,
      onClose: () => setIsEventModalOpen(false),
      onSave: handleCreateNewEvent,
      eventToEdit: null,
      darkMode
    }),

    React.createElement(window.EventModal, {
      isOpen: isEditEventModalOpen,
      onClose: () => setIsEditEventModalOpen(false),
      onSave: handleUpdateActiveEvent,
      eventToEdit: activeEvent,
      darkMode
    }),

    React.createElement(window.AIConfigModal, {
      isOpen: isAIConfigOpen,
      onClose: () => setIsAIConfigOpen(false),
      onSave: handleAISaved,
      darkMode
    }),

    // Floating Liquid Glass Customizer
    React.createElement(window.LiquidGlassControls)
  );
}

// Mount React Root
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));
