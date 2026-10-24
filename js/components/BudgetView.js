// Budget Planner & Financial Management View Component

window.BudgetView = function BudgetView({
  event,
  onUpdateEvent,
  darkMode
}) {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedStatus, setSelectedStatus] = React.useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = React.useState(false);
  const [aiAdvice, setAiAdvice] = React.useState(null);
  const [loadingAi, setLoadingAi] = React.useState(false);

  // Form state
  const [formCategory, setFormCategory] = React.useState("Venue");
  const [formTitle, setFormTitle] = React.useState("");
  const [formEstimated, setFormEstimated] = React.useState("");
  const [formActual, setFormActual] = React.useState("");
  const [formPaid, setFormPaid] = React.useState("Unpaid");
  const [formVendor, setFormVendor] = React.useState("");

  const budgetItems = event.budgetItems || [];
  const targetBudget = Number(event.targetBudget) || 0;
  const currency = event.currency || "$";

  // Calculations
  const totalEstimated = budgetItems.reduce((acc, i) => acc + (Number(i.estimated) || 0), 0);
  const totalActual = budgetItems.reduce((acc, i) => acc + (Number(i.actual) || 0), 0);
  const variance = targetBudget - totalActual;
  const pctSpent = targetBudget > 0 ? Math.min(100, Math.round((totalActual / targetBudget) * 100)) : 0;

  // Unique categories
  const categories = ["All", ...Array.from(new Set(budgetItems.map(i => i.category || "General")))];

  // Filtered items
  const filteredItems = budgetItems.filter(item => {
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchStatus = selectedStatus === "All" || item.paid === selectedStatus;
    return matchCat && matchStatus;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormCategory("Venue");
    setFormTitle("");
    setFormEstimated("");
    setFormActual("");
    setFormPaid("Unpaid");
    setFormVendor("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormTitle(item.title);
    setFormEstimated(item.estimated);
    setFormActual(item.actual);
    setFormPaid(item.paid);
    setFormVendor(item.vendor || "");
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    let updatedItems;
    if (editingItem) {
      updatedItems = budgetItems.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              category: formCategory,
              title: formTitle.trim(),
              estimated: Number(formEstimated) || 0,
              actual: Number(formActual) || 0,
              paid: formPaid,
              vendor: formVendor.trim()
            }
          : item
      );
    } else {
      const newItem = {
        id: `b-${Date.now()}`,
        category: formCategory,
        title: formTitle.trim(),
        estimated: Number(formEstimated) || 0,
        actual: Number(formActual) || 0,
        paid: formPaid,
        vendor: formVendor.trim()
      };
      updatedItems = [...budgetItems, newItem];
    }

    onUpdateEvent({ ...event, budgetItems: updatedItems });
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    if (confirm("Are you sure you want to delete this expense item?")) {
      const updatedItems = budgetItems.filter(item => item.id !== id);
      onUpdateEvent({ ...event, budgetItems: updatedItems });
    }
  };

  const handleTogglePaidStatus = (item) => {
    const nextStatus = item.paid === "Unpaid" ? "Deposit Paid" : item.paid === "Deposit Paid" ? "Paid in Full" : "Unpaid";
    const updatedItems = budgetItems.map(i => i.id === item.id ? { ...i, paid: nextStatus } : i);
    onUpdateEvent({ ...event, budgetItems: updatedItems });
  };

  const handleOpenAiAdvisor = async () => {
    setIsAiAdvisorOpen(true);
    if (!aiAdvice) {
      setLoadingAi(true);
      try {
        const advice = await window.GeminiService.getBudgetAdvice(event);
        setAiAdvice(advice);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAi(false);
      }
    }
  };

  // Group by category for visual distribution
  const categoryStats = React.useMemo(() => {
    const map = {};
    budgetItems.forEach(i => {
      const cat = i.category || "Other";
      if (!map[cat]) map[cat] = { est: 0, act: 0 };
      map[cat].est += Number(i.estimated) || 0;
      map[cat].act += Number(i.actual) || 0;
    });
    return Object.entries(map).map(([category, stats]) => ({
      category,
      ...stats,
      pctOfTarget: targetBudget > 0 ? Math.round((stats.est / targetBudget) * 100) : 0
    }));
  }, [budgetItems, targetBudget]);

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
        React.createElement("h2", { className: "text-2xl font-black text-gradient" }, "Budget & Expenses"),
        React.createElement("p", { className: "text-xs text-slate-400" }, "Track allocations, payments, vendor contracts, and AI savings recommendations")
      ),
      React.createElement(
        "div",
        { className: "flex items-center gap-3" },
        React.createElement(
          "button",
          {
            onClick: handleOpenAiAdvisor,
            className: "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md active:scale-95 transition-all"
          },
          React.createElement(window.Icons.Sparkles, { className: "w-4 h-4" }),
          "AI Budget Advisor"
        ),
        React.createElement(
          "button",
          {
            onClick: openAddModal,
            className: "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95 transition-all"
          },
          React.createElement(window.Icons.Plus, { className: "w-4 h-4" }),
          "Add Expense"
        )
      )
    ),

    // 4 High-level Financial Metrics
    React.createElement(
      "div",
      { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },
      
      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1" }, "Target Budget Limit"),
        React.createElement("div", { className: "text-2xl font-black text-slate-100" }, `${currency}${targetBudget.toLocaleString()}`),
        React.createElement("div", { className: "text-xs text-slate-400 mt-2" }, `Cap set for ${event.guestCount || 0} guests`)
      ),

      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1" }, "Total Estimated"),
        React.createElement("div", { className: "text-2xl font-black text-indigo-400" }, `${currency}${totalEstimated.toLocaleString()}`),
        React.createElement("div", { className: "text-xs text-slate-400 mt-2" }, `${budgetItems.length} planned items`)
      ),

      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1" }, "Actual Paid / Committed"),
        React.createElement("div", { className: "text-2xl font-black text-emerald-400" }, `${currency}${totalActual.toLocaleString()}`),
        React.createElement(
          "div",
          { className: "mt-2 flex items-center justify-between text-xs text-slate-400" },
          React.createElement("span", null, `${pctSpent}% spent`),
          React.createElement("div", { className: "w-20 h-1.5 bg-white/10 rounded-full overflow-hidden" },
            React.createElement("div", { className: "h-full bg-emerald-500 rounded-full", style: { width: `${pctSpent}%` } })
          )
        )
      ),

      React.createElement(
        "div",
        { className: "p-5 rounded-2xl glass-panel glass-panel-hover" },
        React.createElement("div", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1" }, "Available Buffer"),
        React.createElement("div", { className: `text-2xl font-black ${variance < 0 ? "text-rose-400" : "text-purple-400"}` },
          `${currency}${variance.toLocaleString()}`
        ),
        React.createElement("div", { className: "text-xs text-slate-400 mt-2" },
          variance >= 0 ? "Under target budget" : "⚠️ Exceeding planned target!"
        )
      )
    ),

    // Visual Category Distribution
    React.createElement(
      "div",
      { className: "p-6 rounded-3xl glass-panel shadow-lg" },
      React.createElement("h3", { className: "text-sm font-bold uppercase tracking-wider text-slate-400 mb-4" }, "Category Allocation Breakdown"),
      React.createElement(
        "div",
        { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" },
        categoryStats.map(stat =>
          React.createElement(
            "div",
            {
              key: stat.category,
              onClick: () => setSelectedCategory(selectedCategory === stat.category ? "All" : stat.category),
              className: `p-3 rounded-2xl cursor-pointer transition-all ${
                selectedCategory === stat.category
                  ? "bg-purple-600/30 border border-purple-500 shadow-md shadow-purple-500/20"
                  : "glass-pill hover:scale-105"
              }`
            },
            React.createElement("div", { className: "text-xs font-semibold truncate text-slate-200" }, stat.category),
            React.createElement("div", { className: "text-sm font-bold mt-1" }, `${currency}${stat.est.toLocaleString()}`),
            React.createElement("div", { className: "text-[10px] text-slate-400 mt-0.5" }, `${stat.pctOfTarget}% of budget`)
          )
        )
      )
    ),

    // Filters Bar
    React.createElement(
      "div",
      { className: "flex flex-wrap items-center justify-between gap-3 pt-2" },
      React.createElement(
        "div",
        { className: "flex items-center gap-2 overflow-x-auto pb-1" },
        React.createElement("span", { className: "text-xs font-medium text-slate-400 flex items-center gap-1 mr-1" }, "Category:"),
        categories.map(cat =>
          React.createElement(
            "button",
            {
              key: cat,
              onClick: () => setSelectedCategory(cat),
              className: `px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/25 border border-white/20"
                  : "glass-pill text-slate-300 hover:text-white"
              }`
            },
            cat
          )
        )
      ),

      React.createElement(
        "div",
        { className: "flex items-center gap-2" },
        React.createElement("span", { className: "text-xs font-medium text-slate-400" }, "Payment:"),
        ["All", "Unpaid", "Deposit Paid", "Paid in Full"].map(st =>
          React.createElement(
            "button",
            {
              key: st,
              onClick: () => setSelectedStatus(st),
              className: `px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                selectedStatus === st
                  ? "bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`
            },
            st
          )
        )
      )
    ),

    // Expenses Table / Cards
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
              React.createElement("th", { className: "px-6 py-3.5" }, "Item & Category"),
              React.createElement("th", { className: "px-6 py-3.5" }, "Vendor"),
              React.createElement("th", { className: "px-6 py-3.5" }, "Estimated"),
              React.createElement("th", { className: "px-6 py-3.5" }, "Actual"),
              React.createElement("th", { className: "px-6 py-3.5" }, "Status"),
              React.createElement("th", { className: "px-6 py-3.5 text-right" }, "Actions")
            )
          ),
          React.createElement(
            "tbody",
            { className: "divide-y divide-white/5" },
            filteredItems.length === 0 ? React.createElement(
              "tr",
              null,
              React.createElement("td", { colSpan: 6, className: "px-6 py-8 text-center text-xs text-slate-400" }, "No expense items match your filter criteria.")
            ) : filteredItems.map((item) =>
              React.createElement(
                "tr",
                { key: item.id, className: "transition-colors hover:bg-white/5" },
                // Item & Category
                React.createElement(
                  "td",
                  { className: "px-6 py-4" },
                  React.createElement("div", { className: "font-semibold text-slate-100" }, item.title),
                  React.createElement("div", { className: "text-xs text-purple-400 font-medium" }, item.category)
                ),
                // Vendor
                React.createElement(
                  "td",
                  { className: "px-6 py-4 text-xs text-slate-300" },
                  item.vendor || React.createElement("span", { className: "text-slate-500 italic" }, "Unassigned")
                ),
                // Estimated
                React.createElement(
                  "td",
                  { className: "px-6 py-4 font-mono text-xs text-slate-300" },
                  `${currency}${(Number(item.estimated) || 0).toLocaleString()}`
                ),
                // Actual
                React.createElement(
                  "td",
                  { className: "px-6 py-4 font-mono text-xs font-bold text-emerald-400" },
                  `${currency}${(Number(item.actual) || 0).toLocaleString()}`
                ),
                // Paid Status
                React.createElement(
                  "td",
                  { className: "px-6 py-4" },
                  React.createElement(
                    "button",
                    {
                      onClick: () => handleTogglePaidStatus(item),
                      title: "Click to cycle payment status",
                      className: `px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-transform active:scale-95 ${
                        item.paid === "Paid in Full"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : item.paid === "Deposit Paid"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                      }`
                    },
                    item.paid
                  )
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
                        onClick: () => openEditModal(item),
                        className: "p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                      },
                      React.createElement(window.Icons.Edit3, { className: "w-4 h-4" })
                    ),
                    React.createElement(
                      "button",
                      {
                        onClick: () => handleDeleteItem(item.id),
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

    // Add / Edit Modal
    isAddModalOpen && React.createElement(
      "div",
      { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" },
      React.createElement(
        "div",
        {
          className: "w-full max-w-md rounded-3xl p-6 glass-modal shadow-2xl text-white"
        },
        React.createElement(
          "h3",
          { className: "text-lg font-bold mb-4 text-gradient" },
          editingItem ? "Edit Expense Item" : "Add New Expense Item"
        ),
        React.createElement(
          "form",
          { onSubmit: handleSaveItem, className: "space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Item Title *"),
            React.createElement("input", {
              type: "text",
              required: true,
              value: formTitle,
              onChange: (e) => setFormTitle(e.target.value),
              placeholder: "e.g., Reception Dinner Catering (100 guests)",
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            })
          ),
          React.createElement(
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
                placeholder: "Venue, Catering...",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Vendor / Payee"),
              React.createElement("input", {
                type: "text",
                value: formVendor,
                onChange: (e) => setFormVendor(e.target.value),
                placeholder: "Vendor Name",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            )
          ),
          React.createElement(
            "div",
            { className: "grid grid-cols-2 gap-3" },
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, `Estimated (${currency})`),
              React.createElement("input", {
                type: "number",
                value: formEstimated,
                onChange: (e) => setFormEstimated(e.target.value),
                placeholder: "0",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, `Actual / Paid (${currency})`),
              React.createElement("input", {
                type: "number",
                value: formActual,
                onChange: (e) => setFormActual(e.target.value),
                placeholder: "0",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Payment Status"),
            React.createElement(
              "select",
              {
                value: formPaid,
                onChange: (e) => setFormPaid(e.target.value),
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              },
              React.createElement("option", { value: "Unpaid" }, "Unpaid"),
              React.createElement("option", { value: "Deposit Paid" }, "Deposit Paid"),
              React.createElement("option", { value: "Paid in Full" }, "Paid in Full")
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
              editingItem ? "Save Changes" : "Add Item"
            )
          )
        )
      )
    ),

    // AI Budget Advisor Modal
    isAiAdvisorOpen && React.createElement(
      "div",
      { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" },
      React.createElement(
        "div",
        {
          className: "w-full max-w-2xl rounded-3xl p-6 sm:p-8 glass-modal shadow-2xl max-h-[90vh] overflow-y-auto text-white"
        },
        React.createElement(
          "div",
          { className: "flex items-center justify-between pb-4 border-b border-white/10" },
          React.createElement(
            "div",
            { className: "flex items-center gap-3" },
            React.createElement(
              "div",
              { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white border border-white/20 shadow-md shadow-amber-500/20" },
              React.createElement(window.Icons.Sparkles, { className: "w-5 h-5" })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("h3", { className: "text-lg font-bold text-gradient" }, "AI Financial Advisor & Strategy"),
              React.createElement("p", { className: "text-xs text-slate-400" }, `Analysis for ${event.name}`)
            )
          ),
          React.createElement(
            "button",
            {
              onClick: () => setIsAiAdvisorOpen(false),
              className: "text-slate-400 hover:text-white p-1"
            },
            "✕"
          )
        ),

        loadingAi ? React.createElement(
          "div",
          { className: "py-16 text-center space-y-3" },
          React.createElement(window.Icons.Sparkles, { className: "w-8 h-8 text-purple-400 mx-auto animate-spin" }),
          React.createElement("p", { className: "text-sm text-slate-300 font-medium" }, "Running financial audit and calculating cost-saving opportunities...")
        ) : aiAdvice ? React.createElement(
          "div",
          { className: "mt-6 space-y-5" },
          React.createElement(
            "div",
            { className: "p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-sm leading-relaxed backdrop-blur-md" },
            React.createElement("div", { className: "font-bold text-purple-300 mb-1" }, "Executive Assessment"),
            aiAdvice.summary
          ),
          React.createElement(
            "div",
            { className: "space-y-2" },
            React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5" },
              React.createElement(window.Icons.Check, { className: "w-4 h-4" }),
              "High-Impact Cost Reduction Tactics"
            ),
            React.createElement(
              "div",
              { className: "space-y-2" },
              (aiAdvice.costSavingTips || []).map((tip, idx) =>
                React.createElement(
                  "div",
                  { key: idx, className: "p-3 rounded-2xl glass-panel text-xs leading-relaxed text-slate-200" },
                  tip
                )
              )
            )
          ),
          React.createElement(
            "div",
            { className: "space-y-2" },
            React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5" },
              React.createElement(window.Icons.AlertCircle, { className: "w-4 h-4" }),
              "Hidden Fees to Watch For in Vendor Contracts"
            ),
            React.createElement(
              "div",
              { className: "space-y-2" },
              (aiAdvice.hiddenFeesWarning || []).map((fee, idx) =>
                React.createElement(
                  "div",
                  { key: idx, className: "p-3 rounded-2xl glass-panel text-xs leading-relaxed text-slate-200" },
                  fee
                )
              )
            )
          ),
          React.createElement(
            "div",
            { className: "p-4 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-xs leading-relaxed backdrop-blur-md" },
            React.createElement("span", { className: "font-bold text-indigo-300" }, "Pro Negotiation Script: "),
            aiAdvice.negotiationTip
          ),
          React.createElement(
            "div",
            { className: "pt-2 flex justify-end" },
            React.createElement(
              "button",
              {
                onClick: () => setIsAiAdvisorOpen(false),
                className: "px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md"
              },
              "Close Insights"
            )
          )
        ) : null
      )
    )
  );
};
