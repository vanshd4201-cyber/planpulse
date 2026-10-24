// Timeline & Run-of-Show Component

window.TimelineView = function TimelineView({
  event,
  onUpdateEvent,
  darkMode
}) {
  const [subView, setSubView] = React.useState("milestones"); // 'milestones' or 'dayof'
  const [filterStatus, setFilterStatus] = React.useState("All"); // 'All', 'Pending', 'Completed'
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);

  // Form states
  const [formTitle, setFormTitle] = React.useState("");
  const [formCategory, setFormCategory] = React.useState("General");
  const [formDeadline, setFormDeadline] = React.useState("");
  const [formTime, setFormTime] = React.useState("12:00 PM");
  const [formLead, setFormLead] = React.useState("");
  const [formNotes, setFormNotes] = React.useState("");

  const timelineItems = event.timelineItems || [];
  const milestones = timelineItems.filter(i => i.type === "milestone");
  const dayOfItems = timelineItems.filter(i => i.type === "dayof");

  // Sorted items
  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.deadline || "2099-01-01") - new Date(b.deadline || "2099-01-01"));
  const sortedDayOf = [...dayOfItems];

  const filteredMilestones = sortedMilestones.filter(m => {
    if (filterStatus === "Pending") return !m.completed;
    if (filterStatus === "Completed") return m.completed;
    return true;
  });

  const completedMilestones = milestones.filter(m => m.completed).length;
  const progressPct = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  const handleToggleMilestone = (item) => {
    const updated = timelineItems.map(i => {
      if (i.id === item.id) {
        const nextState = !i.completed;
        // If completing and all done, shoot confetti!
        if (nextState && window.confetti && completedMilestones + 1 === milestones.length) {
          window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        return { ...i, completed: nextState };
      }
      return i;
    });
    onUpdateEvent({ ...event, timelineItems: updated });
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormCategory("General");
    setFormDeadline(event.date || "");
    setFormTime("10:00 AM");
    setFormLead("");
    setFormNotes("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category || "General");
    setFormDeadline(item.deadline || "");
    setFormTime(item.time || "10:00 AM");
    setFormLead(item.lead || "");
    setFormNotes(item.notes || "");
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    let updatedItems;
    if (editingItem) {
      updatedItems = timelineItems.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              title: formTitle.trim(),
              category: formCategory.trim(),
              deadline: subView === "milestones" ? formDeadline : undefined,
              time: subView === "dayof" ? formTime : undefined,
              lead: subView === "dayof" ? formLead.trim() : undefined,
              notes: subView === "dayof" ? formNotes.trim() : undefined
            }
          : item
      );
    } else {
      const newItem = {
        id: `t-${Date.now()}`,
        type: subView === "milestones" ? "milestone" : "dayof",
        title: formTitle.trim(),
        category: formCategory.trim(),
        completed: false,
        deadline: subView === "milestones" ? formDeadline : undefined,
        time: subView === "dayof" ? formTime : undefined,
        lead: subView === "dayof" ? formLead.trim() : undefined,
        notes: subView === "dayof" ? formNotes.trim() : undefined
      };
      updatedItems = [...timelineItems, newItem];
    }

    onUpdateEvent({ ...event, timelineItems: updatedItems });
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    if (confirm("Delete this timeline entry?")) {
      const updated = timelineItems.filter(i => i.id !== id);
      onUpdateEvent({ ...event, timelineItems: updated });
    }
  };

  return React.createElement(
    "div",
    { className: "space-y-6" },

    // Header Controls & View Switcher
    React.createElement(
      "div",
      { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" },
      React.createElement(
        "div",
        null,
        React.createElement("h2", { className: "text-2xl font-black text-gradient" }, "Timeline & Master Schedule"),
        React.createElement("p", { className: "text-xs text-slate-400" }, "Track countdown preparation milestones and manage the day-of run-of-show")
      ),
      React.createElement(
        "div",
        { className: "flex items-center gap-3" },
        // View Toggle Pills
        React.createElement(
          "div",
          { className: `p-1 rounded-xl border flex items-center gap-1 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-slate-100 border-slate-200"}` },
          React.createElement(
            "button",
            {
              onClick: () => setSubView("milestones"),
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subView === "milestones"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`
            },
            `Milestones (${milestones.length})`
          ),
          React.createElement(
            "button",
            {
              onClick: () => setSubView("dayof"),
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subView === "dayof"
                  ? "bg-pink-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`
            },
            `Day-of Run of Show (${dayOfItems.length})`
          )
        ),
        React.createElement(
          "button",
          {
            onClick: openAddModal,
            className: "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95 transition-all"
          },
          React.createElement(window.Icons.Plus, { className: "w-4 h-4" }),
          subView === "milestones" ? "Add Milestone" : "Add Itinerary Step"
        )
      )
    ),

    // Subview 1: Milestones
    subView === "milestones" ? React.createElement(
      "div",
      { className: "space-y-4" },

      // Progress Banner
      React.createElement(
        "div",
        { className: "p-6 rounded-3xl glass-panel shadow-lg" },
        React.createElement(
          "div",
          { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3" },
          React.createElement(
            "div",
            null,
            React.createElement("div", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider" }, "Readiness Score"),
            React.createElement("div", { className: "text-xl font-bold text-slate-100" }, `${completedMilestones} of ${milestones.length} Milestones Accomplished`)
          ),
          // Filter pills
          React.createElement(
            "div",
            { className: "flex items-center gap-2" },
            ["All", "Pending", "Completed"].map(st =>
              React.createElement(
                "button",
                {
                  key: st,
                  onClick: () => setFilterStatus(st),
                  className: `px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    filterStatus === st ? "bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40 shadow-sm" : "glass-pill text-slate-300 hover:text-white"
                  }`
                },
                st
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "w-full h-2.5 rounded-full bg-white/10 overflow-hidden" },
          React.createElement("div", {
            className: "h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm",
            style: { width: `${progressPct}%` }
          })
        )
      ),

      // Milestones List
      React.createElement(
        "div",
        { className: "space-y-3" },
        filteredMilestones.length === 0 ? React.createElement(
          "div",
          { className: "p-8 rounded-3xl glass-panel text-center text-xs text-slate-400" },
          "No milestones found for this filter."
        ) : filteredMilestones.map((item) =>
          React.createElement(
            "div",
            {
              key: item.id,
              className: `p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                item.completed
                  ? "opacity-60 bg-emerald-500/10 border-emerald-500/20"
                  : "glass-panel glass-panel-hover"
              }`
            },
            // Left: Checkbox & Info
            React.createElement(
              "div",
              { className: "flex items-center gap-3.5 flex-1 min-w-0" },
              React.createElement(
                "button",
                {
                  onClick: () => handleToggleMilestone(item),
                  className: `w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    item.completed
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "border-2 border-white/20 hover:border-purple-400 text-transparent"
                  }`
                },
                React.createElement(window.Icons.Check, { className: "w-4 h-4 stroke-[3]" })
              ),
              React.createElement(
                "div",
                { className: "truncate" },
                React.createElement("div", { className: `text-sm font-semibold truncate ${item.completed ? "line-through text-slate-400" : "text-slate-100"}` }, item.title),
                React.createElement(
                  "div",
                  { className: "flex items-center gap-2 text-xs text-slate-400 mt-0.5" },
                  React.createElement("span", { className: "text-purple-400 font-medium" }, item.category || "General"),
                  React.createElement("span", null, "•"),
                  React.createElement("span", null, `Due: ${item.deadline || "TBD"}`)
                )
              )
            ),
            // Right: Actions
            React.createElement(
              "div",
              { className: "flex items-center gap-2 flex-shrink-0" },
              React.createElement(
                "button",
                {
                  onClick: () => openEditModal(item),
                  className: "p-1.5 rounded-lg text-slate-400 hover:text-purple-400 transition-colors"
                },
                React.createElement(window.Icons.Edit3, { className: "w-4 h-4" })
              ),
              React.createElement(
                "button",
                {
                  onClick: () => handleDeleteItem(item.id),
                  className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                },
                React.createElement(window.Icons.Trash2, { className: "w-4 h-4" })
              )
            )
          )
        )
      )
    ) : (
      // Subview 2: Day-of Run of Show
      React.createElement(
        "div",
        { className: "space-y-3" },
        sortedDayOf.length === 0 ? React.createElement(
          "div",
          { className: "p-8 rounded-3xl glass-panel text-center text-xs text-slate-400" },
          "No day-of itinerary items yet. Click 'Add Itinerary Step' to create the master run-of-show!"
        ) : sortedDayOf.map((item, idx) =>
          React.createElement(
            "div",
            {
              key: item.id,
              className: "p-4 sm:p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            },
            React.createElement(
              "div",
              { className: "flex items-start sm:items-center gap-4 flex-1" },
              // Time Badge
              React.createElement(
                "div",
                { className: "px-3 py-1.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-300 font-mono text-xs font-bold whitespace-nowrap shadow-sm" },
                item.time || "TBD"
              ),
              React.createElement(
                "div",
                { className: "space-y-1" },
                React.createElement("h4", { className: "text-sm font-bold text-slate-100" }, item.title),
                React.createElement(
                  "div",
                  { className: "flex items-center gap-3 text-xs text-slate-400 flex-wrap" },
                  React.createElement("span", { className: "text-purple-400 font-semibold" }, `Lead: ${item.lead || "Unassigned"}`),
                  item.notes && React.createElement("span", null, `• ${item.notes}`)
                )
              )
            ),
            React.createElement(
              "div",
              { className: "flex items-center gap-2 self-end sm:self-center" },
              React.createElement(
                "button",
                {
                  onClick: () => openEditModal(item),
                  className: "p-1.5 rounded-lg text-slate-400 hover:text-purple-400 transition-colors"
                },
                React.createElement(window.Icons.Edit3, { className: "w-4 h-4" })
              ),
              React.createElement(
                "button",
                {
                  onClick: () => handleDeleteItem(item.id),
                  className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                },
                React.createElement(window.Icons.Trash2, { className: "w-4 h-4" })
              )
            )
          )
        )
      )
    ),

    // Add / Edit Modal
    isAddModalOpen && React.createElement(
      "div",
      { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" },
      React.createElement(
        "div",
        {
          className: "w-full max-w-md rounded-3xl p-6 glass-modal shadow-2xl text-white"
        },
        React.createElement(
          "h3",
          { className: "text-lg font-bold mb-4 text-gradient" },
          editingItem
            ? `Edit ${subView === "milestones" ? "Milestone" : "Run-of-Show Item"}`
            : `Add ${subView === "milestones" ? "New Milestone" : "New Run-of-Show Item"}`
        ),
        React.createElement(
          "form",
          { onSubmit: handleSaveItem, className: "space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Title *"),
            React.createElement("input", {
              type: "text",
              required: true,
              value: formTitle,
              onChange: (e) => setFormTitle(e.target.value),
              placeholder: subView === "milestones" ? "e.g., Send out invitations" : "e.g., Cocktail Hour begins",
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            })
          ),
          subView === "milestones" ? React.createElement(
            "div",
            { className: "grid grid-cols-2 gap-3" },
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Category"),
              React.createElement("input", {
                type: "text",
                value: formCategory,
                onChange: (e) => setFormCategory(e.target.value),
                placeholder: "Venue, Guests...",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Target Deadline"),
              React.createElement("input", {
                type: "date",
                value: formDeadline,
                onChange: (e) => setFormDeadline(e.target.value),
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            )
          ) : React.createElement(
            "div",
            { className: "space-y-4" },
            React.createElement(
              "div",
              { className: "grid grid-cols-2 gap-3" },
              React.createElement(
                "div",
                null,
                React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Time *"),
                React.createElement("input", {
                  type: "text",
                  required: true,
                  value: formTime,
                  onChange: (e) => setFormTime(e.target.value),
                  placeholder: "e.g., 04:30 PM",
                  className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
                })
              ),
              React.createElement(
                "div",
                null,
                React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Assigned Lead"),
                React.createElement("input", {
                  type: "text",
                  value: formLead,
                  onChange: (e) => setFormLead(e.target.value),
                  placeholder: "e.g., MC / DJ / Coordinator",
                  className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
                })
              )
            ),
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Operational Notes"),
              React.createElement("textarea", {
                rows: 2,
                value: formNotes,
                onChange: (e) => setFormNotes(e.target.value),
                placeholder: "Location, equipment required, or cue instructions...",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center justify-end gap-3 pt-3" },
            React.createElement(
              "button",
              {
                type: "button",
                onClick: () => setIsAddModalOpen(false),
                className: "px-4 py-2 rounded-xl text-xs font-semibold glass-pill text-slate-300"
              },
              "Cancel"
            ),
            React.createElement(
              "button",
              {
                type: "submit",
                className: "px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-white/20 active:scale-95"
              },
              editingItem ? "Save Changes" : "Create Item"
            )
          )
        )
      )
    )
  );
};
