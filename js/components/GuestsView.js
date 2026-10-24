// Interactive Guest List & RSVP Tracker Component

window.GuestsView = function GuestsView({
  event,
  onUpdateEvent,
  darkMode,
  onNavigateTab
}) {
  const [selectedStatus, setSelectedStatus] = React.useState("All");
  const [selectedGroup, setSelectedGroup] = React.useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingGuest, setEditingGuest] = React.useState(null);

  // AI Reminder Modal
  const [isAiReminderOpen, setIsAiReminderOpen] = React.useState(false);
  const [reminderTone, setReminderTone] = React.useState("friendly");
  const [reminderCopy, setReminderCopy] = React.useState("");
  const [copiedReminder, setCopiedReminder] = React.useState(false);

  // Form states
  const [formName, setFormName] = React.useState("");
  const [formGroup, setFormGroup] = React.useState("Friends");
  const [formStatus, setFormStatus] = React.useState("Pending");
  const [formPlusOne, setFormPlusOne] = React.useState(false);
  const [formPlusOneName, setFormPlusOneName] = React.useState("");
  const [formDietary, setFormDietary] = React.useState("None");
  const [formTableId, setFormTableId] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");

  const guests = event.guests || [];
  const tables = event.tables || [];

  // Calculations
  const totalGuests = guests.length;
  const attendingGuests = guests.filter(g => g.status === "Attending");
  const totalAttendingHeadcount = attendingGuests.reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0);
  const pendingGuests = guests.filter(g => g.status === "Pending");
  const declinedGuests = guests.filter(g => g.status === "Declined");
  const attendanceRate = totalGuests > 0 ? Math.round((attendingGuests.length / totalGuests) * 100) : 0;

  // Dietary Breakdown
  const dietaryStats = React.useMemo(() => {
    const counts = {};
    attendingGuests.forEach(g => {
      const d = g.dietary || "None";
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts);
  }, [attendingGuests]);

  // Unique groups
  const groups = ["All", ...Array.from(new Set(guests.map(g => g.group || "General")))];

  // Filtered list
  const filteredGuests = guests.filter(g => {
    const matchStatus = selectedStatus === "All" || g.status === selectedStatus;
    const matchGroup = selectedGroup === "All" || g.group === selectedGroup;
    return matchStatus && matchGroup;
  });

  const openAddModal = () => {
    setEditingGuest(null);
    setFormName("");
    setFormGroup("Friends");
    setFormStatus("Pending");
    setFormPlusOne(false);
    setFormPlusOneName("");
    setFormDietary("None");
    setFormTableId("");
    setFormEmail("");
    setFormPhone("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setFormName(guest.name);
    setFormGroup(guest.group || "Friends");
    setFormStatus(guest.status || "Pending");
    setFormPlusOne(!!guest.plusOne);
    setFormPlusOneName(guest.plusOneName || "");
    setFormDietary(guest.dietary || "None");
    setFormTableId(guest.tableId || "");
    setFormEmail(guest.email || "");
    setFormPhone(guest.phone || "");
    setIsAddModalOpen(true);
  };

  const handleSaveGuest = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let updated;
    if (editingGuest) {
      updated = guests.map(g =>
        g.id === editingGuest.id
          ? {
              ...g,
              name: formName.trim(),
              group: formGroup.trim(),
              status: formStatus,
              plusOne: formPlusOne,
              plusOneName: formPlusOne ? formPlusOneName.trim() : "",
              dietary: formDietary.trim(),
              tableId: formTableId || null,
              email: formEmail.trim(),
              phone: formPhone.trim()
            }
          : g
      );
    } else {
      const newG = {
        id: `g-${Date.now()}`,
        name: formName.trim(),
        group: formGroup.trim(),
        status: formStatus,
        plusOne: formPlusOne,
        plusOneName: formPlusOne ? formPlusOneName.trim() : "",
        dietary: formDietary.trim(),
        tableId: formTableId || null,
        email: formEmail.trim(),
        phone: formPhone.trim()
      };
      updated = [...guests, newG];
    }

    onUpdateEvent({ ...event, guests: updated });
    setIsAddModalOpen(false);
  };

  const handleDeleteGuest = (id) => {
    if (confirm("Remove this guest from the invitation list?")) {
      const updated = guests.filter(g => g.id !== id);
      onUpdateEvent({ ...event, guests: updated });
    }
  };

  const handleCycleStatus = (guest) => {
    const nextStatus = guest.status === "Pending" ? "Attending" : guest.status === "Attending" ? "Declined" : "Pending";
    const updated = guests.map(g => g.id === guest.id ? { ...g, status: nextStatus } : g);
    onUpdateEvent({ ...event, guests: updated });
    if (nextStatus === "Attending" && window.confetti) {
      window.confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
    }
  };

  const generateReminderDraft = () => {
    const eventName = event.name;
    const deadline = event.date || "the upcoming date";

    if (reminderTone === "urgent") {
      setReminderCopy(`Hi there! A quick heads up regarding ${eventName} on ${deadline}—our catering deadline is in 48 hours and we need to lock in the final headcount. Could you please let us know if you'll be able to join us? Hope to see you there! ✨`);
    } else if (reminderTone === "playful") {
      setReminderCopy(`Hey! We're putting the finishing touches on ${eventName} and saving a glass for you! 🥂 Let us know if you can make it by ${deadline} so we don't let anyone steal your seat!`);
    } else {
      setReminderCopy(`Hello! We are finalizing the arrangements for ${eventName} taking place on ${deadline}. Please let us know if you will be able to attend so we can confirm seating and dietary accommodations. Thank you!`);
    }
  };

  const handleCopyReminder = () => {
    navigator.clipboard.writeText(reminderCopy);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2000);
  };

  return React.createElement(
    "div",
    { className: "space-y-6" },

    // Header Controls
    React.createElement(
      "div",
      { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" },
      React.createElement(
        "div",
        null,
        React.createElement("h2", { className: "text-2xl font-black text-gradient" }, "Guest List & RSVP Tracker"),
        React.createElement("p", { className: "text-xs text-slate-400" }, "Track invitations, headcounts, dietary restrictions, and follow up with pending guests")
      ),
      React.createElement(
        "div",
        { className: "flex items-center gap-3" },
        React.createElement(
          "button",
          {
            onClick: () => onNavigateTab && onNavigateTab("seating"),
            className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold glass-pill text-white hover:bg-white/15 active:scale-95 transition-all shadow-md"
          },
          React.createElement(window.Icons.LayoutGrid, { className: "w-4 h-4 text-purple-400" }),
          "Seating Chart →"
        ),
        React.createElement(
          "button",
          {
            onClick: () => {
              generateReminderDraft();
              setIsAiReminderOpen(true);
            },
            className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md active:scale-95 transition-all"
          },
          React.createElement(window.Icons.Sparkles, { className: "w-4 h-4" }),
          "AI RSVP Reminders"
        ),
        React.createElement(
          "button",
          {
            onClick: openAddModal,
            className: "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold glass-btn-primary shadow-lg"
          },
          React.createElement(window.Icons.Plus, { className: "w-4 h-4" }),
          "Add Guest"
        )
      )
    ),

    // 4 High-level Metrics Cards
    React.createElement(
      "div",
      { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },

      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" }, "Total Confirmed Headcount"),
        React.createElement("div", { className: "text-2xl font-black text-emerald-400" }, totalAttendingHeadcount),
        React.createElement("div", { className: "text-xs text-slate-400 mt-2" },
          `${attendingGuests.length} primary + ${totalAttendingHeadcount - attendingGuests.length} plus-ones`
        )
      ),

      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" }, "Attendance Rate"),
        React.createElement("div", { className: "text-2xl font-black text-purple-400" }, `${attendanceRate}%`),
        React.createElement(
          "div",
          { className: "mt-2 flex items-center justify-between text-xs text-slate-400" },
          React.createElement("span", null, `${attendingGuests.length} / ${totalGuests} responded yes`),
          React.createElement("div", { className: "w-16 h-1.5 bg-white/10 rounded-full overflow-hidden" },
            React.createElement("div", { className: "h-full bg-purple-500 rounded-full", style: { width: `${attendanceRate}%` } })
          )
        )
      ),

      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" }, "Awaiting RSVP Response"),
        React.createElement("div", { className: "text-2xl font-black text-amber-400" }, pendingGuests.length),
        React.createElement("div", { className: "text-xs text-slate-400 mt-2" }, "Pending confirmation")
      ),

      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" }, "Declined Invitations"),
        React.createElement("div", { className: "text-2xl font-black text-slate-400" }, declinedGuests.length),
        React.createElement("div", { className: "text-xs text-slate-400 mt-2" }, "Unable to attend")
      )
    ),

    // Dietary Requirements Bar
    React.createElement(
      "div",
      { className: "p-6 rounded-3xl glass-panel shadow-lg" },
      React.createElement(
        "div",
        { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3" },
        React.createElement("h3", { className: "text-xs font-bold uppercase tracking-wider text-slate-400" }, "Catering & Dietary Requirements Summary"),
        React.createElement("span", { className: "text-[11px] text-purple-400 font-semibold" }, "Ready for caterer hand-off")
      ),
      React.createElement(
        "div",
        { className: "flex items-center gap-2 flex-wrap" },
        dietaryStats.length === 0 ? React.createElement(
          "span",
          { className: "text-xs text-slate-400 italic" },
          "No confirmed dietary restrictions recorded yet."
        ) : dietaryStats.map(([diet, count]) =>
          React.createElement(
            "div",
            { key: diet, className: "px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold flex items-center gap-2 text-slate-200" },
            React.createElement("span", null, diet),
            React.createElement("span", { className: "px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px]" }, count)
          )
        )
      )
    ),

    // Filter Controls
    React.createElement(
      "div",
      { className: "flex flex-wrap items-center justify-between gap-3 pt-1" },
      // Status pills
      React.createElement(
        "div",
        { className: "flex items-center gap-2" },
        React.createElement("span", { className: "text-xs font-medium text-slate-400" }, "Status:"),
        ["All", "Attending", "Pending", "Declined"].map(st =>
          React.createElement(
            "button",
            {
              key: st,
              onClick: () => setSelectedStatus(st),
              className: `px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/25 border border-white/20"
                  : "glass-pill text-slate-300 hover:text-white"
              }`
            },
            st
          )
        )
      ),

      // Group pills
      React.createElement(
        "div",
        { className: "flex items-center gap-2 overflow-x-auto" },
        React.createElement("span", { className: "text-xs font-medium text-slate-400" }, "Group:"),
        groups.map(grp =>
          React.createElement(
            "button",
            {
              key: grp,
              onClick: () => setSelectedGroup(grp),
              className: `px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                selectedGroup === grp
                  ? "bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`
            },
            grp
          )
        )
      )
    ),

    // Guest Table
    React.createElement(
      "div",
      { className: "rounded-3xl glass-panel overflow-hidden shadow-xl" },
      React.createElement(
        "div",
        { className: "overflow-x-auto" },
        React.createElement(
          "table",
          { className: "w-full text-left text-sm" },
          React.createElement(
            "thead",
            { className: "text-xs uppercase font-semibold text-slate-400 border-b border-white/10 bg-white/5" },
            React.createElement(
              "tr",
              null,
              React.createElement("th", { className: "px-6 py-3.5" }, "Guest Name"),
              React.createElement("th", { className: "px-6 py-3.5" }, "Group"),
              React.createElement("th", { className: "px-6 py-3.5" }, "RSVP Status"),
              React.createElement("th", { className: "px-6 py-3.5" }, "Plus-One"),
              React.createElement("th", { className: "px-6 py-3.5" }, "Table"),
              React.createElement("th", { className: "px-6 py-3.5" }, "Dietary"),
              React.createElement("th", { className: "px-6 py-3.5 text-right" }, "Actions")
            )
          ),
          React.createElement(
            "tbody",
            { className: "divide-y divide-white/5" },
            filteredGuests.length === 0 ? React.createElement(
              "tr",
              null,
              React.createElement("td", { colSpan: 7, className: "px-6 py-8 text-center text-xs text-slate-400" }, "No guests match your filter criteria.")
            ) : filteredGuests.map((guest) =>
              React.createElement(
                "tr",
                { key: guest.id, className: "transition-colors hover:bg-white/5" },
                // Name & Contact
                React.createElement(
                  "td",
                  { className: "px-6 py-4" },
                  React.createElement("div", { className: "font-semibold text-slate-100" }, guest.name),
                  (guest.email || guest.phone) && React.createElement(
                    "div",
                    { className: "text-xs text-slate-400" },
                    [guest.email, guest.phone].filter(Boolean).join(" • ")
                  )
                ),
                // Group
                React.createElement(
                  "td",
                  { className: "px-6 py-4" },
                  React.createElement(
                    "span",
                    { className: "px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25" },
                    guest.group || "General"
                  )
                ),
                // RSVP Status
                React.createElement(
                  "td",
                  { className: "px-6 py-4" },
                  React.createElement(
                    "button",
                    {
                      onClick: () => handleCycleStatus(guest),
                      title: "Click to cycle RSVP status",
                      className: `px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-transform active:scale-95 ${
                        guest.status === "Attending"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : guest.status === "Pending"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                      }`
                    },
                    guest.status
                  )
                ),
                // Plus-One
                React.createElement(
                  "td",
                  { className: "px-6 py-4 text-xs text-slate-300" },
                  guest.plusOne
                    ? React.createElement("div", null,
                        React.createElement("span", { className: "text-emerald-400 font-semibold" }, "+1 Included"),
                        guest.plusOneName && React.createElement("div", { className: "text-[11px] text-slate-400" }, `(${guest.plusOneName})`)
                      )
                    : React.createElement("span", { className: "text-slate-500" }, "Solo")
                ),
                // Table Assignment
                React.createElement(
                  "td",
                  { className: "px-6 py-4 text-xs" },
                  (() => {
                    const table = tables.find(t => t.id === guest.tableId);
                    if (guest.status !== "Attending") {
                      return React.createElement("span", { className: "text-slate-500 italic" }, "—");
                    }
                    if (table) {
                      return React.createElement(
                        "button",
                        {
                          onClick: () => onNavigateTab && onNavigateTab("seating"),
                          title: "Click to view in Seating Chart",
                          className: "px-2.5 py-1 rounded-lg glass-pill font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all text-xs"
                        },
                        React.createElement("span", null, "🍽️"),
                        React.createElement("span", { className: "truncate max-w-[120px]" }, table.name)
                      );
                    }
                    return React.createElement(
                      "button",
                      {
                        onClick: () => onNavigateTab && onNavigateTab("seating"),
                        title: "Click to assign in Seating Chart",
                        className: "px-2 py-0.5 rounded-lg text-amber-300/80 bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold hover:bg-amber-500/20 transition-all"
                      },
                      "Unassigned"
                    );
                  })()
                ),
                // Dietary
                React.createElement(
                  "td",
                  { className: "px-6 py-4 text-xs font-medium text-slate-300" },
                  guest.dietary && guest.dietary !== "None"
                    ? React.createElement("span", { className: "text-amber-400 font-semibold" }, guest.dietary)
                    : React.createElement("span", { className: "text-slate-500" }, "None")
                ),
                // Actions
                React.createElement(
                  "td",
                  { className: "px-6 py-4 text-right" },
                  React.createElement(
                    "div",
                    { className: "flex items-center justify-end gap-2" },
                    React.createElement(
                      "button",
                      {
                        onClick: () => openEditModal(guest),
                        className: "p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                      },
                      React.createElement(window.Icons.Edit3, { className: "w-4 h-4" })
                    ),
                    React.createElement(
                      "button",
                      {
                        onClick: () => handleDeleteGuest(guest.id),
                        className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      },
                      React.createElement(window.Icons.Trash2, { className: "w-4 h-4" })
                    )
                  )
                )
              )
            )
          )
        )
      )
    ),

    // Add / Edit Guest Modal
    isAddModalOpen && React.createElement(
      "div",
      { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" },
      React.createElement(
        "div",
        {
          className: "w-full max-w-md rounded-3xl p-6 glass-modal shadow-2xl text-white"
        },
        React.createElement("h3", { className: "text-lg font-bold mb-4 text-gradient" }, editingGuest ? "Edit Guest Record" : "Add Guest to Invitation List"),
        React.createElement(
          "form",
          { onSubmit: handleSaveGuest, className: "space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Guest Full Name *"),
            React.createElement("input", {
              type: "text",
              required: true,
              value: formName,
              onChange: (e) => setFormName(e.target.value),
              placeholder: "e.g., Samantha Miller",
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            })
          ),
          React.createElement(
            "div",
            { className: "grid grid-cols-2 gap-3" },
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Group / Circle"),
              React.createElement("input", {
                type: "text",
                value: formGroup,
                onChange: (e) => setFormGroup(e.target.value),
                placeholder: "Family, Friends, VIP...",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "RSVP Status"),
              React.createElement(
                "select",
                {
                  value: formStatus,
                  onChange: (e) => setFormStatus(e.target.value),
                  className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
                },
                React.createElement("option", { value: "Pending" }, "Pending"),
                React.createElement("option", { value: "Attending" }, "Attending"),
                React.createElement("option", { value: "Declined" }, "Declined")
              )
            )
          ),
          React.createElement(
            "div",
            { className: "p-3 rounded-2xl glass-panel space-y-2" },
            React.createElement(
              "div",
              { className: "flex items-center gap-2" },
              React.createElement("input", {
                type: "checkbox",
                id: "plusOneToggle",
                checked: formPlusOne,
                onChange: (e) => setFormPlusOne(e.target.checked),
                className: "w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              }),
              React.createElement("label", { htmlFor: "plusOneToggle", className: "text-xs font-semibold cursor-pointer text-slate-200" }, "Include Plus-One (+1)")
            ),
            formPlusOne && React.createElement("input", {
              type: "text",
              value: formPlusOneName,
              onChange: (e) => setFormPlusOneName(e.target.value),
              placeholder: "Plus-One Name (if known)",
              className: "w-full px-3 py-2 rounded-xl glass-input text-xs focus:outline-none"
            })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Dietary Restrictions"),
            React.createElement("input", {
              type: "text",
              value: formDietary,
              onChange: (e) => setFormDietary(e.target.value),
              placeholder: "None, Vegetarian, Vegan, Gluten-Free, Nut Allergy...",
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Table / Seating Assignment"),
            React.createElement(
              "select",
              {
                value: formTableId,
                onChange: (e) => setFormTableId(e.target.value),
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none cursor-pointer"
              },
              React.createElement("option", { value: "" }, "Unassigned / No Table"),
              tables.map(t =>
                React.createElement("option", { key: t.id, value: t.id, className: "bg-slate-900 text-slate-200" }, `${t.name} (${t.capacity || 8} seats)`)
              )
            )
          ),
          React.createElement(
            "div",
            { className: "grid grid-cols-2 gap-3" },
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Email"),
              React.createElement("input", {
                type: "email",
                value: formEmail,
                onChange: (e) => setFormEmail(e.target.value),
                placeholder: "guest@...",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Phone"),
              React.createElement("input", {
                type: "text",
                value: formPhone,
                onChange: (e) => setFormPhone(e.target.value),
                placeholder: "+1 555-...",
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
              editingGuest ? "Save Changes" : "Save Guest"
            )
          )
        )
      )
    ),

    // AI RSVP Reminder Modal
    isAiReminderOpen && React.createElement(
      "div",
      { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" },
      React.createElement(
        "div",
        {
          className: "w-full max-w-lg rounded-3xl p-6 sm:p-8 glass-modal shadow-2xl text-white"
        },
        React.createElement(
          "div",
          { className: "flex items-center justify-between pb-4 border-b border-white/10" },
          React.createElement(
            "div",
            { className: "flex items-center gap-3" },
            React.createElement(
              "div",
              { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-amber-500 flex items-center justify-center text-white border border-white/20 shadow-md shadow-amber-500/20" },
              React.createElement(window.Icons.Sparkles, { className: "w-5 h-5" })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("h3", { className: "text-lg font-bold text-gradient" }, "AI RSVP Reminder Copywriter"),
              React.createElement("p", { className: "text-xs text-slate-400" }, `Tailored for ${pendingGuests.length} pending guests`)
            )
          ),
          React.createElement("button", { onClick: () => setIsAiReminderOpen(false), className: "text-slate-400 hover:text-white" }, "✕")
        ),

        React.createElement(
          "div",
          { className: "mt-5 space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Message Tone"),
            React.createElement(
              "div",
              { className: "grid grid-cols-3 gap-2" },
              [
                { id: "friendly", label: "Warm & Friendly" },
                { id: "playful", label: "Playful & Casual" },
                { id: "urgent", label: "Countdown Deadline" }
              ].map(t =>
                React.createElement(
                  "button",
                  {
                    key: t.id,
                    onClick: () => {
                      setReminderTone(t.id);
                      // Trigger update
                      const eventName = event.name;
                      const deadline = event.date || "the upcoming date";
                      if (t.id === "urgent") {
                        setReminderCopy(`Hi there! A quick heads up regarding ${eventName} on ${deadline}—our catering deadline is in 48 hours and we need to lock in the final headcount. Could you please let us know if you'll be able to join us? Hope to see you there! ✨`);
                      } else if (t.id === "playful") {
                        setReminderCopy(`Hey! We're putting the finishing touches on ${eventName} and saving a glass for you! 🥂 Let us know if you can make it by ${deadline} so we don't let anyone steal your seat!`);
                      } else {
                        setReminderCopy(`Hello! We are finalizing the arrangements for ${eventName} taking place on ${deadline}. Please let us know if you will be able to attend so we can confirm seating and dietary accommodations. Thank you!`);
                      }
                    },
                    className: `py-2 rounded-xl text-xs font-semibold transition-all ${
                      reminderTone === t.id
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/25 border border-white/20"
                        : "glass-pill text-slate-300"
                    }`
                  },
                  t.label
                )
              )
            )
          ),

          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Drafted Message (WhatsApp, SMS, or Email)"),
            React.createElement("textarea", {
              rows: 4,
              value: reminderCopy,
              onChange: (e) => setReminderCopy(e.target.value),
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-xs leading-relaxed focus:outline-none"
            })
          ),

          React.createElement(
            "div",
            { className: "flex items-center justify-between pt-2" },
            React.createElement(
              "button",
              {
                onClick: handleCopyReminder,
                className: "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25 border border-white/20 active:scale-95 transition-all"
              },
              React.createElement(window.Icons.Copy, { className: "w-3.5 h-3.5" }),
              copiedReminder ? "Copied to Clipboard!" : "Copy Message"
            ),
            React.createElement(
              "button",
              {
                onClick: () => setIsAiReminderOpen(false),
                className: "px-4 py-2 rounded-xl text-xs font-semibold glass-pill text-slate-300"
              },
              "Close"
            )
          )
        )
      )
    )
  );
};
