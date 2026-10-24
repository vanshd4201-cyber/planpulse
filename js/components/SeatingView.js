// Interactive Table & Seating Chart Planner Component (Crystal Glass UI)

window.SeatingView = function SeatingView({
  event,
  onUpdateEvent,
  darkMode,
  onNavigateTab
}) {
  const [shapeFilter, setShapeFilter] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isAddTableModalOpen, setIsAddTableModalOpen] = React.useState(false);
  const [editingTable, setEditingTable] = React.useState(null);

  // Form states for Add/Edit Table
  const [formName, setFormName] = React.useState("");
  const [formCapacity, setFormCapacity] = React.useState(8);
  const [formShape, setFormShape] = React.useState("round");
  const [formNotes, setFormNotes] = React.useState("");

  // AI Seating Strategist Modal state
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiResult, setAiResult] = React.useState(null);

  // Printable Catering & Seating Sheet Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = React.useState(false);
  const [copiedPrint, setCopiedPrint] = React.useState(false);

  // Unassigned Drawer search
  const [unassignedSearch, setUnassignedSearch] = React.useState("");

  const tables = event.tables || [];
  const guests = event.guests || [];
  const attendingGuests = guests.filter(g => g.status === "Attending");

  // Calculations
  const totalCapacity = tables.reduce((acc, t) => acc + (parseInt(t.capacity) || 0), 0);
  
  // Calculate seated headcount taking plus-ones into account
  const seatedGuests = attendingGuests.filter(g => g.tableId && tables.some(t => t.id === g.tableId));
  const seatedHeadcount = seatedGuests.reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0);
  
  const unassignedGuests = attendingGuests.filter(g => !g.tableId || !tables.some(t => t.id === g.tableId));
  const unassignedHeadcount = unassignedGuests.reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0);

  const totalAttendingHeadcount = attendingGuests.reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0);
  const seatingPercentage = totalAttendingHeadcount > 0 ? Math.min(100, Math.round((seatedHeadcount / totalAttendingHeadcount) * 100)) : 0;

  // Dietary Alerts
  const dietaryAlertCount = attendingGuests.filter(g => g.dietary && g.dietary !== "None").length;

  // Filtered tables
  const filteredTables = tables.filter(t => {
    const matchesShape = shapeFilter === "All" || t.shape === shapeFilter;
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      seatedGuests.some(g => g.tableId === t.id && g.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesShape && matchesSearch;
  });

  // Table Modal handlers
  const openAddTableModal = () => {
    setEditingTable(null);
    setFormName(`Table ${tables.length + 1}`);
    setFormCapacity(8);
    setFormShape("round");
    setFormNotes("");
    setIsAddTableModalOpen(true);
  };

  const openEditTableModal = (table) => {
    setEditingTable(table);
    setFormName(table.name);
    setFormCapacity(table.capacity || 8);
    setFormShape(table.shape || "round");
    setFormNotes(table.notes || "");
    setIsAddTableModalOpen(true);
  };

  const handleSaveTable = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let updatedTables;
    if (editingTable) {
      updatedTables = tables.map(t =>
        t.id === editingTable.id
          ? { ...t, name: formName.trim(), capacity: parseInt(formCapacity) || 8, shape: formShape, notes: formNotes.trim() }
          : t
      );
    } else {
      const newTable = {
        id: `tbl-${Date.now()}`,
        name: formName.trim(),
        capacity: parseInt(formCapacity) || 8,
        shape: formShape,
        notes: formNotes.trim()
      };
      updatedTables = [...tables, newTable];
    }

    onUpdateEvent({ ...event, tables: updatedTables });
    setIsAddTableModalOpen(false);
  };

  const handleDeleteTable = (tableId) => {
    if (!confirm("Are you sure you want to delete this table? Guests assigned to it will be unseated.")) return;
    const updatedTables = tables.filter(t => t.id !== tableId);
    // Unassign guests
    const updatedGuests = guests.map(g => g.tableId === tableId ? { ...g, tableId: null } : g);
    onUpdateEvent({ ...event, tables: updatedTables, guests: updatedGuests });
  };

  const handleClearTable = (tableId) => {
    const updatedGuests = guests.map(g => g.tableId === tableId ? { ...g, tableId: null } : g);
    onUpdateEvent({ ...event, guests: updatedGuests });
  };

  // Seat / Unseat guest
  const handleAssignGuestToTable = (guestId, tableId) => {
    const updatedGuests = guests.map(g => g.id === guestId ? { ...g, tableId: tableId || null } : g);
    onUpdateEvent({ ...event, guests: updatedGuests });
  };

  // Quick Auto-Seat Remaining
  const handleAutoSeatRemaining = () => {
    if (tables.length === 0 || unassignedGuests.length === 0) return;

    // Track table occupancy
    const tableOccupancy = {};
    tables.forEach(t => {
      const seatedHere = seatedGuests.filter(g => g.tableId === t.id);
      tableOccupancy[t.id] = seatedHere.reduce((sum, g) => sum + 1 + (g.plusOne ? 1 : 0), 0);
    });

    const updatedGuests = [...guests];
    unassignedGuests.forEach(guest => {
      const headcount = 1 + (guest.plusOne ? 1 : 0);
      // Find table with available room
      const availableTable = tables.find(t => (tableOccupancy[t.id] + headcount) <= (t.capacity || 8));
      if (availableTable) {
        const idx = updatedGuests.findIndex(g => g.id === guest.id);
        if (idx !== -1) {
          updatedGuests[idx] = { ...updatedGuests[idx], tableId: availableTable.id };
          tableOccupancy[availableTable.id] += headcount;
        }
      }
    });

    onUpdateEvent({ ...event, guests: updatedGuests });
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  // Run AI Seating Strategist
  const handleRunAiSeating = async () => {
    setIsAiModalOpen(true);
    setAiLoading(true);
    try {
      const result = await window.GeminiService.generateSeatingArrangement(event, tables, guests);
      setAiResult(result);
    } catch (e) {
      console.error("AI Seating Error", e);
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI Seating Plan
  const handleApplyAiSeating = () => {
    if (!aiResult || !aiResult.assignments) return;
    const assignments = aiResult.assignments;
    const updatedGuests = guests.map(g => {
      if (assignments[g.id]) {
        return { ...g, tableId: assignments[g.id] };
      }
      return g;
    });

    onUpdateEvent({ ...event, guests: updatedGuests });
    setIsAiModalOpen(false);

    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Helper for shape icon and badge
  const getShapeDetails = (shape) => {
    switch (shape) {
      case "sweetheart": return { label: "Sweetheart", icon: "💖", desc: "2 Seats" };
      case "rectangular": return { label: "Rectangular", icon: "▭", desc: "Long Table" };
      case "high-top": return { label: "High-Top", icon: "🍸", desc: "Cocktail Style" };
      case "booth": return { label: "Lounge Booth", icon: "🛋️", desc: "Cozy Seating" };
      case "round":
      default: return { label: "Round Table", icon: "⭕", desc: "Standard Banquet" };
    }
  };

  // Helper for dietary alert styling
  const getDietaryBadge = (diet) => {
    if (!diet || diet === "None") return null;
    let icon = "🥗";
    if (diet.toLowerCase().includes("nut") || diet.toLowerCase().includes("peanut")) icon = "⚠️";
    else if (diet.toLowerCase().includes("gluten")) icon = "🌾";
    else if (diet.toLowerCase().includes("vegan")) icon = "🌱";
    else if (diet.toLowerCase().includes("veg")) icon = "🥦";
    else if (diet.toLowerCase().includes("halal") || diet.toLowerCase().includes("kosher")) icon = "✨";

    return React.createElement(
      "span",
      { className: "px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1" },
      React.createElement("span", null, icon),
      React.createElement("span", null, diet)
    );
  };

  // Printable sheet text generator
  const generatePrintableText = () => {
    let out = `=======================================================\n`;
    out += `SEATING CHART & CATERING RUN SHEET: ${event.name.toUpperCase()}\n`;
    out += `Date: ${event.date || "TBD"} | Location: ${event.location || "TBD"}\n`;
    out += `Confirmed Guests: ${totalAttendingHeadcount} | Total Tables: ${tables.length}\n`;
    out += `=======================================================\n\n`;

    tables.forEach((tbl, idx) => {
      const seatedHere = attendingGuests.filter(g => g.tableId === tbl.id);
      const headcountHere = seatedHere.reduce((sum, g) => sum + 1 + (g.plusOne ? 1 : 0), 0);
      out += `TABLE ${idx + 1}: ${tbl.name.toUpperCase()} (${getShapeDetails(tbl.shape).label})\n`;
      out += `Capacity: ${tbl.capacity} | Seated Headcount: ${headcountHere}\n`;
      if (tbl.notes) out += `Location Notes: ${tbl.notes}\n`;
      out += `Guests Seated:\n`;
      if (seatedHere.length === 0) {
        out += `  (No guests assigned)\n`;
      } else {
        seatedHere.forEach(g => {
          let gLine = `  • ${g.name} [${g.group || "General"}]`;
          if (g.plusOne) gLine += ` (+1: ${g.plusOneName || "Partner"})`;
          if (g.dietary && g.dietary !== "None") gLine += ` -- DIETARY ALERT: ${g.dietary}`;
          out += gLine + "\n";
        });
      }
      out += `-------------------------------------------------------\n\n`;
    });

    if (unassignedGuests.length > 0) {
      out += `UNASSIGNED ATTENDING GUESTS (${unassignedGuests.length}):\n`;
      unassignedGuests.forEach(g => {
        out += `  • ${g.name} [${g.group || "General"}]${g.plusOne ? " (+1)" : ""}\n`;
      });
      out += `\n`;
    }

    return out;
  };

  const handleCopyPrintable = () => {
    navigator.clipboard.writeText(generatePrintableText());
    setCopiedPrint(true);
    setTimeout(() => setCopiedPrint(false), 2000);
  };

  const handleTriggerBrowserPrint = () => {
    window.print();
  };

  return React.createElement(
    "div",
    { className: "space-y-6 animate-in fade-in duration-200" },

    // Top Header & Actions
    React.createElement(
      "div",
      { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel shadow-2xl" },
      React.createElement(
        "div",
        { className: "space-y-1" },
        React.createElement(
          "div",
          { className: "flex items-center gap-2" },
          React.createElement("div", { className: "p-2 rounded-xl badge-cyan text-cyan-200" },
            React.createElement(window.Icons.LayoutGrid, { className: "w-5 h-5 text-cyan-200" })
          ),
          React.createElement("h2", { className: "text-2xl font-black tracking-tight text-gradient" }, "Table & Seating Chart Planner")
        ),
        React.createElement(
          "p",
          { className: "text-xs text-slate-400" },
          "Organize table arrangements, balance guest groups, monitor catering dietary requirements, and auto-seat with AI."
        )
      ),

      React.createElement(
        "div",
        { className: "flex items-center gap-2.5 flex-wrap" },
        // AI Seating Button
        React.createElement(
          "button",
          {
            onClick: handleRunAiSeating,
            className: "px-4 py-2 rounded-xl glass-btn-primary text-xs font-bold text-white flex items-center gap-2 transition-all shadow-lg"
          },
          React.createElement(window.Icons.Wand2, { className: "w-4 h-4 text-purple-200 animate-pulse" }),
          React.createElement("span", null, "AI Seating Strategist")
        ),

        // Print/Export Sheet Button
        React.createElement(
          "button",
          {
            onClick: () => setIsPrintModalOpen(true),
            className: "px-4 py-2 rounded-xl glass-pill text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all"
          },
          React.createElement(window.Icons.Printer, { className: "w-4 h-4 text-slate-300" }),
          React.createElement("span", null, "Export / Print Sheet")
        ),

        // Add Table Button
        React.createElement(
          "button",
          {
            onClick: openAddTableModal,
            className: "px-4 py-2 rounded-xl glass-btn-primary text-xs font-bold flex items-center gap-2 shadow-lg"
          },
          React.createElement(window.Icons.Plus, { className: "w-4 h-4 text-white" }),
          React.createElement("span", null, "Add Table")
        )
      )
    ),

    // Seating Metrics Cards
    React.createElement(
      "div",
      { className: "grid grid-cols-2 lg:grid-cols-4 gap-4" },

      // Metric 1: Tables & Capacity
      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" }, "Total Tables"),
        React.createElement("div", { className: "text-2xl font-black text-white" }, tables.length),
        React.createElement("div", { className: "text-xs text-slate-400 mt-2 flex items-center justify-between" },
          React.createElement("span", null, "Total Capacity:"),
          React.createElement("span", { className: "font-bold text-slate-200" }, `${totalCapacity} seats`)
        )
      ),

      // Metric 2: Seated Attending Guests
      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" }, "Seated Guests"),
        React.createElement(
          "div",
          { className: "text-2xl font-black text-emerald-400 flex items-baseline gap-2" },
          React.createElement("span", null, seatedHeadcount),
          React.createElement("span", { className: "text-xs font-semibold text-slate-400" }, `/ ${totalAttendingHeadcount} attending`)
        ),
        React.createElement(
          "div",
          { className: "w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden" },
          React.createElement("div", {
            className: "bg-emerald-400 h-full rounded-full transition-all duration-300",
            style: { width: `${seatingPercentage}%` }
          })
        )
      ),

      // Metric 3: Unassigned Guests
      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" }, "Awaiting Table"),
        React.createElement(
          "div",
          { className: `text-2xl font-black ${unassignedHeadcount > 0 ? "text-amber-400" : "text-slate-400"}` },
          unassignedHeadcount
        ),
        React.createElement("div", { className: "text-xs text-slate-400 mt-2 flex items-center justify-between" },
          React.createElement("span", null, unassignedHeadcount > 0 ? "Need seating" : "All attending seated!"),
          unassignedHeadcount > 0 && React.createElement(
            "button",
            {
              onClick: handleAutoSeatRemaining,
              className: "text-[11px] font-bold text-amber-300 hover:underline"
            },
            "Auto-Seat →"
          )
        )
      ),

      // Metric 4: Dietary Alerts Flagged
      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" }, "Catering Dietary Alerts"),
        React.createElement("div", { className: "text-2xl font-black text-rose-300" }, dietaryAlertCount),
        React.createElement("div", { className: "text-xs text-slate-400 mt-2" }, "Special meals identified")
      )
    ),

    // Main Content Split: Tables Grid (Left / 70%) & Unassigned Guests Drawer (Right / 30%)
    React.createElement(
      "div",
      { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" },

      // Left Column: Filter Bar & Tables Grid (col-span-8)
      React.createElement(
        "div",
        { className: "lg:col-span-8 space-y-4" },

        // Filter & Search Bar
        React.createElement(
          "div",
          { className: "p-4 rounded-2xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md" },
          
          // Shape pills
          React.createElement(
            "div",
            { className: "flex items-center gap-1.5 overflow-x-auto" },
            ["All", "round", "rectangular", "sweetheart", "high-top", "booth"].map(sh => {
              const label = sh === "All" ? "All Shapes" : getShapeDetails(sh).label;
              const isSel = shapeFilter === sh;
              return React.createElement(
                "button",
                {
                  key: sh,
                  onClick: () => setShapeFilter(sh),
                  className: `px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isSel
                      ? "bg-white/20 text-white shadow-md border border-white/30 backdrop-blur-md"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                },
                sh !== "All" && React.createElement("span", { className: "mr-1" }, getShapeDetails(sh).icon),
                label
              );
            })
          ),

          // Search input
          React.createElement(
            "div",
            { className: "relative min-w-[200px]" },
            React.createElement(window.Icons.Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
            React.createElement("input", {
              type: "text",
              placeholder: "Search table or guest...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full pl-8 pr-3 py-1.5 rounded-xl text-xs glass-input focus:outline-none"
            })
          )
        ),

        // Tables List
        filteredTables.length === 0 ? React.createElement(
          "div",
          { className: "p-12 rounded-3xl glass-panel text-center space-y-3" },
          React.createElement(window.Icons.Armchair, { className: "w-10 h-10 text-slate-500 mx-auto" }),
          React.createElement("h3", { className: "text-base font-bold text-slate-200" }, "No tables found"),
          React.createElement("p", { className: "text-xs text-slate-400 max-w-sm mx-auto" },
            tables.length === 0
              ? "You haven't created any tables yet. Click 'Add Table' above to set up your floor plan!"
              : "No tables matched your search or shape filter."
          ),
          tables.length === 0 && React.createElement(
            "button",
            {
              onClick: openAddTableModal,
              className: "mt-2 px-4 py-2 rounded-xl glass-btn-primary text-xs font-bold"
            },
            "+ Create First Table"
          )
        ) : React.createElement(
          "div",
          { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
          filteredTables.map(table => {
            const seatedHere = attendingGuests.filter(g => g.tableId === table.id);
            const headcount = seatedHere.reduce((sum, g) => sum + 1 + (g.plusOne ? 1 : 0), 0);
            const capacity = table.capacity || 8;
            const isFull = headcount >= capacity;
            const isOver = headcount > capacity;
            const shapeInfo = getShapeDetails(table.shape);

            return React.createElement(
              "div",
              {
                key: table.id,
                className: "p-5 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between space-y-4"
              },
              
              // Table Card Top
              React.createElement(
                "div",
                { className: "space-y-2" },
                React.createElement(
                  "div",
                  { className: "flex items-start justify-between gap-2" },
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "div",
                      { className: "flex items-center gap-2" },
                      React.createElement("span", { className: "text-base" }, shapeInfo.icon),
                      React.createElement("h3", { className: "font-black text-base text-slate-100 tracking-tight" }, table.name)
                    ),
                    React.createElement(
                      "div",
                      { className: "text-[11px] text-slate-400 mt-0.5" },
                      table.notes || shapeInfo.desc
                    )
                  ),

                  // Capacity badge
                  React.createElement(
                    "div",
                    {
                      className: `px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 border ${
                        isOver
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : isFull
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-white/10 text-slate-300 border-white/15"
                      }`
                    },
                    React.createElement("span", null, `${headcount}/${capacity}`),
                    React.createElement("span", { className: "text-[10px] font-medium text-slate-400" }, "seats")
                  )
                ),

                // Mini progress bar
                React.createElement(
                  "div",
                  { className: "w-full bg-white/10 rounded-full h-1 overflow-hidden" },
                  React.createElement("div", {
                    className: `h-full rounded-full transition-all ${
                      isOver ? "bg-rose-500" : isFull ? "bg-emerald-400" : "bg-white/40"
                    }`,
                    style: { width: `${Math.min(100, (headcount / capacity) * 100)}%` }
                  })
                )
              ),

              // Seated Guests List inside Table
              React.createElement(
                "div",
                { className: "space-y-1.5 min-h-[90px]" },
                React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1" }, "Assigned Guests:"),
                seatedHere.length === 0 ? React.createElement(
                  "div",
                  { className: "py-4 text-center border border-dashed border-white/15 rounded-2xl text-xs text-slate-500 italic" },
                  "No guests seated yet"
                ) : seatedHere.map((guest, idx) =>
                  React.createElement(
                    "div",
                    {
                      key: guest.id,
                      className: "p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 text-xs"
                    },
                    React.createElement(
                      "div",
                      { className: "flex items-center gap-2 truncate" },
                      React.createElement("span", { className: "text-[10px] font-bold text-slate-400 w-4" }, `#${idx + 1}`),
                      React.createElement(
                        "div",
                        { className: "truncate" },
                        React.createElement("div", { className: "font-semibold text-slate-200 truncate flex items-center gap-1.5" },
                          React.createElement("span", null, guest.name),
                          guest.plusOne && React.createElement("span", { className: "text-[10px] text-emerald-400 font-bold" }, "+1")
                        ),
                        React.createElement("div", { className: "text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5" },
                          React.createElement("span", null, guest.group || "General"),
                          guest.dietary && guest.dietary !== "None" && getDietaryBadge(guest.dietary)
                        )
                      )
                    ),

                    // Quick Unseat button
                    React.createElement(
                      "button",
                      {
                        onClick: () => handleAssignGuestToTable(guest.id, null),
                        title: "Remove from table",
                        className: "p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      },
                      React.createElement("span", { className: "text-xs font-bold" }, "✕")
                    )
                  )
                )
              ),

              // Table Card Footer Actions
              React.createElement(
                "div",
                { className: "pt-3 border-t border-white/10 flex items-center justify-between gap-2" },
                
                // Quick Seat Dropdown for unassigned guests
                React.createElement(
                  "div",
                  { className: "relative flex-1" },
                  unassignedGuests.length === 0 ? React.createElement(
                    "span",
                    { className: "text-[11px] text-slate-500 italic" },
                    "All guests seated"
                  ) : React.createElement(
                    "select",
                    {
                      onChange: (e) => {
                        if (e.target.value) {
                          handleAssignGuestToTable(e.target.value, table.id);
                          e.target.value = "";
                        }
                      },
                      defaultValue: "",
                      className: "w-full py-1 px-2 rounded-lg text-xs glass-input focus:outline-none cursor-pointer"
                    },
                    React.createElement("option", { value: "", disabled: true }, "+ Seat an unassigned guest..."),
                    unassignedGuests.map(ug =>
                      React.createElement(
                        "option",
                        { key: ug.id, value: ug.id, className: "bg-slate-900 text-slate-200" },
                        `${ug.name} (${ug.group || "Guest"})${ug.plusOne ? " [+1]" : ""}`
                      )
                    )
                  )
                ),

                // Table Edit & Delete
                React.createElement(
                  "div",
                  { className: "flex items-center gap-1" },
                  React.createElement(
                    "button",
                    {
                      onClick: () => openEditTableModal(table),
                      title: "Edit table configuration",
                      className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    },
                    React.createElement(window.Icons.Edit3, { className: "w-3.5 h-3.5" })
                  ),
                  seatedHere.length > 0 && React.createElement(
                    "button",
                    {
                      onClick: () => handleClearTable(table.id),
                      title: "Unseat all guests from this table",
                      className: "p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors text-[10px] font-bold"
                    },
                    "Clear"
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => handleDeleteTable(table.id),
                      title: "Delete table",
                      className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    },
                    React.createElement(window.Icons.Trash2, { className: "w-3.5 h-3.5" })
                  )
                )
              )
            );
          })
        )
      ),

      // Right Column: Unassigned Attending Guests Drawer (col-span-4)
      React.createElement(
        "div",
        { className: "lg:col-span-4 space-y-4" },
        React.createElement(
          "div",
          { className: "p-5 rounded-3xl glass-panel shadow-xl space-y-4" },
          
          React.createElement(
            "div",
            { className: "flex items-center justify-between" },
            React.createElement(
              "div",
              null,
              React.createElement("h3", { className: "font-black text-sm uppercase tracking-wider text-slate-200" }, "Unassigned Guests"),
              React.createElement("p", { className: "text-xs text-slate-400" }, `${unassignedHeadcount} awaiting table`)
            ),
            unassignedGuests.length > 0 && tables.length > 0 && React.createElement(
              "button",
              {
                onClick: handleAutoSeatRemaining,
                className: "px-2.5 py-1 rounded-xl glass-pill text-xs font-bold text-amber-300 hover:bg-white/15 transition-all"
              },
              "Auto-Seat All"
            )
          ),

          // Search unassigned
          unassignedGuests.length > 4 && React.createElement(
            "input",
            {
              type: "text",
              placeholder: "Filter unassigned...",
              value: unassignedSearch,
              onChange: (e) => setUnassignedSearch(e.target.value),
              className: "w-full px-3 py-1.5 rounded-xl text-xs glass-input focus:outline-none"
            }
          ),

          // List of Unassigned
          React.createElement(
            "div",
            { className: "space-y-2 max-h-[500px] overflow-y-auto pr-1" },
            unassignedGuests.length === 0 ? React.createElement(
              "div",
              { className: "py-8 text-center text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4" },
              React.createElement("div", { className: "font-bold text-sm mb-1" }, "🎉 Perfect Arrangement!"),
              React.createElement("div", { className: "text-emerald-300/80 text-[11px]" }, "Every confirmed attending guest is seated at a table.")
            ) : unassignedGuests
              .filter(ug => !unassignedSearch || ug.name.toLowerCase().includes(unassignedSearch.toLowerCase()))
              .map(guest =>
                React.createElement(
                  "div",
                  {
                    key: guest.id,
                    className: "p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2"
                  },
                  React.createElement(
                    "div",
                    { className: "flex items-start justify-between gap-2" },
                    React.createElement(
                      "div",
                      null,
                      React.createElement("div", { className: "font-bold text-xs text-slate-200" }, guest.name),
                      React.createElement("div", { className: "text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5" },
                        React.createElement("span", { className: "px-1.5 py-0.2 rounded bg-white/10 text-slate-300" }, guest.group || "Guest"),
                        guest.plusOne && React.createElement("span", { className: "text-emerald-400 font-semibold" }, "+1 Partner"),
                        guest.dietary && guest.dietary !== "None" && getDietaryBadge(guest.dietary)
                      )
                    )
                  ),

                  // Assign Table selector
                  React.createElement(
                    "div",
                    { className: "flex items-center gap-1.5" },
                    React.createElement("span", { className: "text-[10px] text-slate-400 whitespace-nowrap" }, "Seat at:"),
                    React.createElement(
                      "select",
                      {
                        onChange: (e) => {
                          if (e.target.value) {
                            handleAssignGuestToTable(guest.id, e.target.value);
                          }
                        },
                        defaultValue: "",
                        className: "flex-1 py-1 px-2 rounded-lg text-xs glass-input focus:outline-none cursor-pointer"
                      },
                      React.createElement("option", { value: "", disabled: true }, "Select Table..."),
                      tables.map(t => {
                        const seatedHere = seatedGuests.filter(g => g.tableId === t.id);
                        const count = seatedHere.reduce((sum, g) => sum + 1 + (g.plusOne ? 1 : 0), 0);
                        return React.createElement(
                          "option",
                          { key: t.id, value: t.id, className: "bg-slate-900 text-slate-200" },
                          `${t.name} (${count}/${t.capacity})`
                        );
                      })
                    )
                  )
                )
              )
          )
        ),

        // Quick Link to Guest List
        React.createElement(
          "div",
          { className: "p-4 rounded-2xl glass-panel text-center text-xs text-slate-400 space-y-2" },
          React.createElement("div", null, "Need to invite more guests or track pending RSVPs?"),
          React.createElement(
            "button",
            {
              onClick: () => onNavigateTab("guests"),
              className: "font-bold text-white hover:underline flex items-center justify-center gap-1.5 mx-auto"
            },
            React.createElement(window.Icons.Users, { className: "w-3.5 h-3.5 text-purple-400" }),
            React.createElement("span", null, "Switch to Guest List & RSVP →")
          )
        )
      )
    ),

    // Modal 1: Add / Edit Table Modal
    isAddTableModalOpen && React.createElement(
      "div",
      { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" },
      React.createElement(
        "div",
        { className: "w-full max-w-md rounded-3xl glass-modal p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150" },
        
        React.createElement(
          "div",
          { className: "flex items-center justify-between" },
          React.createElement("h3", { className: "text-lg font-black text-slate-100" }, editingTable ? "Edit Table Configuration" : "Add New Table"),
          React.createElement(
            "button",
            {
              onClick: () => setIsAddTableModalOpen(false),
              className: "p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
            },
            React.createElement("span", { className: "text-base font-bold" }, "✕")
          )
        ),

        React.createElement(
          "form",
          { onSubmit: handleSaveTable, className: "space-y-4" },

          // Table Name
          React.createElement(
            "div",
            { className: "space-y-1" },
            React.createElement("label", { className: "text-xs font-semibold text-slate-300" }, "Table Name / Number"),
            React.createElement("input", {
              type: "text",
              required: true,
              value: formName,
              onChange: (e) => setFormName(e.target.value),
              placeholder: "e.g. Table 5 (High School Friends)",
              className: "w-full px-3.5 py-2 rounded-xl text-sm glass-input focus:outline-none"
            })
          ),

          // Capacity & Shape
          React.createElement(
            "div",
            { className: "grid grid-cols-2 gap-3" },
            React.createElement(
              "div",
              { className: "space-y-1" },
              React.createElement("label", { className: "text-xs font-semibold text-slate-300" }, "Capacity (Seats)"),
              React.createElement("input", {
                type: "number",
                min: 1,
                max: 30,
                required: true,
                value: formCapacity,
                onChange: (e) => setFormCapacity(e.target.value),
                className: "w-full px-3.5 py-2 rounded-xl text-sm glass-input focus:outline-none"
              })
            ),
            React.createElement(
              "div",
              { className: "space-y-1" },
              React.createElement("label", { className: "text-xs font-semibold text-slate-300" }, "Table Shape"),
              React.createElement(
                "select",
                {
                  value: formShape,
                  onChange: (e) => setFormShape(e.target.value),
                  className: "w-full px-3 py-2 rounded-xl text-sm glass-input focus:outline-none cursor-pointer"
                },
                React.createElement("option", { value: "round", className: "bg-slate-900" }, "Round (⭕)"),
                React.createElement("option", { value: "rectangular", className: "bg-slate-900" }, "Rectangular (▭)"),
                React.createElement("option", { value: "sweetheart", className: "bg-slate-900" }, "Sweetheart (💖)"),
                React.createElement("option", { value: "high-top", className: "bg-slate-900" }, "High-Top (🍸)"),
                React.createElement("option", { value: "booth", className: "bg-slate-900" }, "Booth (🛋️)")
              )
            )
          ),

          // Location Notes
          React.createElement(
            "div",
            { className: "space-y-1" },
            React.createElement("label", { className: "text-xs font-semibold text-slate-300" }, "Location / Floor Notes"),
            React.createElement("input", {
              type: "text",
              value: formNotes,
              onChange: (e) => setFormNotes(e.target.value),
              placeholder: "e.g. Near dance floor, quiet corner, stage right",
              className: "w-full px-3.5 py-2 rounded-xl text-sm glass-input focus:outline-none"
            })
          ),

          // Submit & Cancel
          React.createElement(
            "div",
            { className: "flex items-center justify-end gap-2 pt-3" },
            React.createElement(
              "button",
              {
                type: "button",
                onClick: () => setIsAddTableModalOpen(false),
                className: "px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              },
              "Cancel"
            ),
            React.createElement(
              "button",
              {
                type: "submit",
                className: "px-5 py-2 rounded-xl glass-btn-primary text-xs font-bold shadow-lg"
              },
              editingTable ? "Save Changes" : "Create Table"
            )
          )
        )
      )
    ),

    // Modal 2: AI Seating Strategist Modal
    isAiModalOpen && React.createElement(
      "div",
      { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" },
      React.createElement(
        "div",
        { className: "w-full max-w-2xl rounded-3xl glass-modal p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto" },

        React.createElement(
          "div",
          { className: "flex items-center justify-between" },
          React.createElement(
            "div",
            { className: "flex items-center gap-2.5" },
            React.createElement("div", { className: "p-2 rounded-xl glass-pill text-purple-400" },
              React.createElement(window.Icons.Wand2, { className: "w-5 h-5 text-purple-400 animate-pulse" })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("h3", { className: "text-lg font-black text-slate-100" }, "AI Seating Strategist"),
              React.createElement("p", { className: "text-xs text-slate-400" }, "Optimizing group harmonies, acoustics, and catering safety")
            )
          ),
          React.createElement(
            "button",
            {
              onClick: () => setIsAiModalOpen(false),
              className: "p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
            },
            React.createElement("span", { className: "text-base font-bold" }, "✕")
          )
        ),

        aiLoading ? React.createElement(
          "div",
          { className: "py-16 text-center space-y-4" },
          React.createElement(window.Icons.Sparkles, { className: "w-10 h-10 text-purple-400 mx-auto animate-spin" }),
          React.createElement("div", { className: "font-bold text-slate-200 text-sm" }, "Synthesizing optimal seating layout..."),
          React.createElement("div", { className: "text-xs text-slate-400 max-w-xs mx-auto" }, "Balancing guest affinities, table capacities, and kitchen allergy alerts.")
        ) : aiResult ? React.createElement(
          "div",
          { className: "space-y-4" },

          // Rationale List
          React.createElement(
            "div",
            { className: "p-4 rounded-2xl glass-panel space-y-2" },
            React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-purple-300" }, "AI Seating Logic & Affinities:"),
            React.createElement(
              "ul",
              { className: "space-y-1.5 text-xs text-slate-300" },
              aiResult.rationale.map((r, i) =>
                React.createElement("li", { key: i, className: "flex items-start gap-2" },
                  React.createElement("span", { className: "text-purple-400" }, "•"),
                  React.createElement("span", null, r)
                )
              )
            )
          ),

          // Catering & Kitchen Notes
          aiResult.cateringNotes && aiResult.cateringNotes.length > 0 && React.createElement(
            "div",
            { className: "p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2" },
            React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5" },
              React.createElement("span", null, "⚠️"),
              React.createElement("span", null, "Banquet & Catering Safety Alerts:")
            ),
            React.createElement(
              "ul",
              { className: "space-y-1 text-xs text-amber-200/90" },
              aiResult.cateringNotes.map((cn, i) =>
                React.createElement("li", { key: i, className: "flex items-start gap-2" },
                  React.createElement("span", null, "→"),
                  React.createElement("span", null, cn)
                )
              )
            )
          ),

          // Vibe Tips
          aiResult.vibeTips && aiResult.vibeTips.length > 0 && React.createElement(
            "div",
            { className: "p-4 rounded-2xl glass-panel space-y-2" },
            React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-slate-400" }, "Event Experience & Flow Tips:"),
            React.createElement(
              "ul",
              { className: "space-y-1 text-xs text-slate-400" },
              aiResult.vibeTips.map((vt, i) =>
                React.createElement("li", { key: i, className: "flex items-start gap-2" },
                  React.createElement("span", null, "💡"),
                  React.createElement("span", null, vt)
                )
              )
            )
          ),

          // Modal Actions
          React.createElement(
            "div",
            { className: "flex items-center justify-end gap-3 pt-3" },
            React.createElement(
              "button",
              {
                onClick: () => setIsAiModalOpen(false),
                className: "px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              },
              "Dismiss"
            ),
            React.createElement(
              "button",
              {
                onClick: handleApplyAiSeating,
                className: "px-5 py-2.5 rounded-xl glass-btn-primary text-xs font-bold shadow-xl flex items-center gap-2"
              },
              React.createElement(window.Icons.Check, { className: "w-4 h-4 text-white" }),
              React.createElement("span", null, "Apply AI Seating Plan")
            )
          )
        ) : null
      )
    ),

    // Modal 3: Printable Catering & Seating Sheet Modal
    isPrintModalOpen && React.createElement(
      "div",
      { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" },
      React.createElement(
        "div",
        { className: "w-full max-w-3xl rounded-3xl glass-modal p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col" },

        // Header
        React.createElement(
          "div",
          { className: "flex items-center justify-between" },
          React.createElement(
            "div",
            null,
            React.createElement("h3", { className: "text-lg font-black text-slate-100" }, "Catering & Seating Run Sheet"),
            React.createElement("p", { className: "text-xs text-slate-400" }, "Formatted table-by-table summary for banquets and venue coordinators")
          ),
          React.createElement(
            "button",
            {
              onClick: () => setIsPrintModalOpen(false),
              className: "p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
            },
            React.createElement("span", { className: "text-base font-bold" }, "✕")
          )
        ),

        // Textarea Preview
        React.createElement(
          "div",
          { className: "flex-1 overflow-y-auto" },
          React.createElement("textarea", {
            readOnly: true,
            value: generatePrintableText(),
            rows: 16,
            className: "w-full p-4 rounded-2xl glass-input text-xs font-mono leading-relaxed focus:outline-none resize-none"
          })
        ),

        // Action Buttons
        React.createElement(
          "div",
          { className: "flex items-center justify-between pt-2 border-t border-white/10" },
          React.createElement(
            "div",
            { className: "text-[11px] text-slate-400" },
            "Ready for clipboard export or direct system printing."
          ),
          React.createElement(
            "div",
            { className: "flex items-center gap-2" },
            React.createElement(
              "button",
              {
                onClick: handleCopyPrintable,
                className: "px-4 py-2 rounded-xl glass-pill text-xs font-bold text-white hover:bg-white/15 flex items-center gap-1.5"
              },
              React.createElement(window.Icons.Copy, { className: "w-3.5 h-3.5" }),
              React.createElement("span", null, copiedPrint ? "Copied to Clipboard!" : "Copy Text")
            ),
            React.createElement(
              "button",
              {
                onClick: handleTriggerBrowserPrint,
                className: "px-5 py-2 rounded-xl glass-btn-primary text-xs font-bold shadow-lg flex items-center gap-1.5"
              },
              React.createElement(window.Icons.Printer, { className: "w-3.5 h-3.5 text-white" }),
              React.createElement("span", null, "Print Sheet")
            )
          )
        )
      )
    )
  );
};
