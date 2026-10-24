// Vendor Checklist & Management Component

window.VendorsView = function VendorsView({
  event,
  onUpdateEvent,
  darkMode
}) {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedStatus, setSelectedStatus] = React.useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingVendor, setEditingVendor] = React.useState(null);

  // AI Interview modal
  const [interviewVendor, setInterviewVendor] = React.useState(null);
  const [interviewQnA, setInterviewQnA] = React.useState(null);
  const [loadingInterview, setLoadingInterview] = React.useState(false);

  // Form states
  const [formCategory, setFormCategory] = React.useState("Venue");
  const [formName, setFormName] = React.useState("");
  const [formContact, setFormContact] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formStatus, setFormStatus] = React.useState("Researching");
  const [formQuote, setFormQuote] = React.useState("");
  const [formContractSigned, setFormContractSigned] = React.useState(false);
  const [formRating, setFormRating] = React.useState(5);
  const [formNotes, setFormNotes] = React.useState("");

  const vendors = event.vendors || [];
  const currency = event.currency || "$";

  const categories = ["All", ...Array.from(new Set(vendors.map(v => v.category || "General")))];

  const filteredVendors = vendors.filter(v => {
    const matchCat = selectedCategory === "All" || v.category === selectedCategory;
    const matchStatus = selectedStatus === "All" || v.status === selectedStatus;
    return matchCat && matchStatus;
  });

  const openAddModal = () => {
    setEditingVendor(null);
    setFormCategory("Venue");
    setFormName("");
    setFormContact("");
    setFormPhone("");
    setFormEmail("");
    setFormStatus("Researching");
    setFormQuote("");
    setFormContractSigned(false);
    setFormRating(5);
    setFormNotes("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    setFormCategory(vendor.category);
    setFormName(vendor.name);
    setFormContact(vendor.contact || "");
    setFormPhone(vendor.phone || "");
    setFormEmail(vendor.email || "");
    setFormStatus(vendor.status || "Researching");
    setFormQuote(vendor.quote || "");
    setFormContractSigned(!!vendor.contractSigned);
    setFormRating(vendor.rating || 5);
    setFormNotes(vendor.notes || "");
    setIsAddModalOpen(true);
  };

  const handleSaveVendor = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let updated;
    if (editingVendor) {
      updated = vendors.map(v =>
        v.id === editingVendor.id
          ? {
              ...v,
              category: formCategory.trim(),
              name: formName.trim(),
              contact: formContact.trim(),
              phone: formPhone.trim(),
              email: formEmail.trim(),
              status: formStatus,
              quote: Number(formQuote) || 0,
              contractSigned: formContractSigned,
              rating: Number(formRating) || 5,
              notes: formNotes.trim()
            }
          : v
      );
    } else {
      const newV = {
        id: `v-${Date.now()}`,
        category: formCategory.trim(),
        name: formName.trim(),
        contact: formContact.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        status: formStatus,
        quote: Number(formQuote) || 0,
        contractSigned: formContractSigned,
        rating: Number(formRating) || 5,
        notes: formNotes.trim()
      };
      updated = [...vendors, newV];
    }

    onUpdateEvent({ ...event, vendors: updated });
    setIsAddModalOpen(false);
  };

  const handleDeleteVendor = (id) => {
    if (confirm("Delete this vendor record?")) {
      const updated = vendors.filter(v => v.id !== id);
      onUpdateEvent({ ...event, vendors: updated });
    }
  };

  const handleQuickStatusChange = (vendor, newStatus) => {
    const updated = vendors.map(v => v.id === vendor.id ? { ...v, status: newStatus } : v);
    onUpdateEvent({ ...event, vendors: updated });
  };

  const handleLaunchInterviewAI = async (vendor) => {
    setInterviewVendor(vendor);
    setLoadingInterview(true);
    setInterviewQnA(null);
    try {
      const qna = await window.GeminiService.getVendorInterviewQuestions(vendor.category, event.type);
      setInterviewQnA(qna);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInterview(false);
    }
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
        React.createElement("h2", { className: "text-2xl font-black text-gradient" }, "Vendor Directory & Checklist"),
        React.createElement("p", { className: "text-xs text-slate-400" }, "Manage contracts, quotes, contacts, and prepare with AI-powered interview questions")
      ),
      React.createElement(
        "button",
        {
          onClick: openAddModal,
          className: "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95 transition-all self-start sm:self-auto"
        },
        React.createElement(window.Icons.Plus, { className: "w-4 h-4" }),
        "Add Vendor"
      )
    ),

    // Filter Bars
    React.createElement(
      "div",
      { className: "flex flex-wrap items-center justify-between gap-3" },
      // Category pills
      React.createElement(
        "div",
        { className: "flex items-center gap-2 overflow-x-auto pb-1" },
        React.createElement("span", { className: "text-xs font-medium text-slate-400 mr-1" }, "Category:"),
        categories.map(cat =>
          React.createElement(
            "button",
            {
              key: cat,
              onClick: () => setSelectedCategory(cat),
              className: `px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/25 border border-white/20"
                  : "glass-pill text-slate-300 hover:text-white"
              }`
            },
            cat
          )
        )
      ),

      // Status pills
      React.createElement(
        "div",
        { className: "flex items-center gap-2" },
        React.createElement("span", { className: "text-xs font-medium text-slate-400" }, "Status:"),
        ["All", "Hired", "Quoted", "Contacted", "Researching"].map(st =>
          React.createElement(
            "button",
            {
              key: st,
              onClick: () => setSelectedStatus(st),
              className: `px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                selectedStatus === st ? "bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40" : "text-slate-400 hover:text-slate-200"
              }`
            },
            st
          )
        )
      )
    ),

    // Vendor Grid
    React.createElement(
      "div",
      { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" },
      filteredVendors.length === 0 ? React.createElement(
        "div",
        { className: "col-span-full p-10 rounded-3xl glass-panel text-center text-xs text-slate-400" },
        "No vendors found matching this filter."
      ) : filteredVendors.map((vendor) =>
        React.createElement(
          "div",
          {
            key: vendor.id,
            className: "p-6 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between"
          },
          React.createElement(
            "div",
            { className: "space-y-3" },
            // Top Row: Category + Quick Status dropdown
            React.createElement(
              "div",
              { className: "flex items-center justify-between gap-2" },
              React.createElement(
                "span",
                { className: "text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20" },
                vendor.category
              ),
              React.createElement(
                "select",
                {
                  value: vendor.status,
                  onChange: (e) => handleQuickStatusChange(vendor, e.target.value),
                  className: `text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border focus:outline-none cursor-pointer ${
                    vendor.status === "Hired"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : vendor.status === "Quoted"
                      ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                      : vendor.status === "Contacted"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      : "bg-slate-700/50 text-slate-300 border-slate-600"
                  }`
                },
                React.createElement("option", { value: "Researching" }, "Researching"),
                React.createElement("option", { value: "Contacted" }, "Contacted"),
                React.createElement("option", { value: "Quoted" }, "Quoted"),
                React.createElement("option", { value: "Hired" }, "Hired"),
                React.createElement("option", { value: "Rejected" }, "Rejected")
              )
            ),

            // Vendor Name & Quote
            React.createElement(
              "div",
              null,
              React.createElement("h3", { className: "text-base font-bold text-slate-100" }, vendor.name),
              React.createElement(
                "div",
                { className: "text-xs font-semibold text-emerald-400 mt-0.5" },
                vendor.quote ? `Quote: ${currency}${Number(vendor.quote).toLocaleString()}` : "Quote pending"
              )
            ),

            // Contact Info
            React.createElement(
              "div",
              { className: "text-xs space-y-1 text-slate-300 pt-1" },
              vendor.contact && React.createElement("div", { className: "text-slate-400" }, `Contact: ${vendor.contact}`),
              vendor.phone && React.createElement(
                "a",
                { href: `tel:${vendor.phone}`, className: "flex items-center gap-1.5 text-slate-400 hover:text-purple-400 transition-colors" },
                React.createElement(window.Icons.Phone, { className: "w-3 h-3" }),
                vendor.phone
              ),
              vendor.email && React.createElement(
                "a",
                { href: `mailto:${vendor.email}`, className: "flex items-center gap-1.5 text-slate-400 hover:text-purple-400 transition-colors" },
                React.createElement(window.Icons.Mail, { className: "w-3 h-3" }),
                vendor.email
              )
            ),

            // Notes
            vendor.notes && React.createElement(
              "p",
              { className: "text-[11px] text-slate-400 bg-slate-800/30 p-2 rounded-lg italic" },
              vendor.notes
            ),

            // Contract Status Badge
            React.createElement(
              "div",
              { className: "flex items-center gap-1.5 text-[11px]" },
              React.createElement(
                "span",
                { className: `w-2 h-2 rounded-full ${vendor.contractSigned ? "bg-emerald-400" : "bg-amber-400"}` }
              ),
              React.createElement(
                "span",
                { className: "text-slate-400 font-medium" },
                vendor.contractSigned ? "Contract Signed & Filed" : "Contract Pending"
              )
            )
          ),

          // Bottom Bar Actions
          React.createElement(
            "div",
            { className: "mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2" },
            // AI Interview Button
            React.createElement(
              "button",
              {
                onClick: () => handleLaunchInterviewAI(vendor),
                className: "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
              },
              React.createElement(window.Icons.Sparkles, { className: "w-3.5 h-3.5 text-amber-400" }),
              "AI Interview Questions"
            ),
            // Edit & Delete
            React.createElement(
              "div",
              { className: "flex items-center gap-1" },
              React.createElement(
                "button",
                {
                  onClick: () => openEditModal(vendor),
                  className: "p-1.5 rounded-lg text-slate-400 hover:text-purple-400 transition-colors"
                },
                React.createElement(window.Icons.Edit3, { className: "w-3.5 h-3.5" })
              ),
              React.createElement(
                "button",
                {
                  onClick: () => handleDeleteVendor(vendor.id),
                  className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                },
                React.createElement(window.Icons.Trash2, { className: "w-3.5 h-3.5" })
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
          className: "w-full max-w-lg rounded-3xl p-6 sm:p-8 glass-modal shadow-2xl max-h-[90vh] overflow-y-auto text-white"
        },
        React.createElement("h3", { className: "text-lg font-bold mb-4 text-gradient" }, editingVendor ? "Edit Vendor Details" : "Add New Vendor Record"),
        React.createElement(
          "form",
          { onSubmit: handleSaveVendor, className: "space-y-4" },
          React.createElement(
            "div",
            { className: "grid grid-cols-2 gap-3" },
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Vendor Name *"),
              React.createElement("input", {
                type: "text",
                required: true,
                value: formName,
                onChange: (e) => setFormName(e.target.value),
                placeholder: "e.g., Villa Bella Vista",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Category"),
              React.createElement("input", {
                type: "text",
                value: formCategory,
                onChange: (e) => setFormCategory(e.target.value),
                placeholder: "Venue, Catering, Photo...",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            )
          ),
          React.createElement(
            "div",
            { className: "grid grid-cols-3 gap-3" },
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Contact Person"),
              React.createElement("input", {
                type: "text",
                value: formContact,
                onChange: (e) => setFormContact(e.target.value),
                placeholder: "Elena",
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
            ),
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Email"),
              React.createElement("input", {
                type: "email",
                value: formEmail,
                onChange: (e) => setFormEmail(e.target.value),
                placeholder: "vendor@...",
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
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, `Quote / Cost (${currency})`),
              React.createElement("input", {
                type: "number",
                value: formQuote,
                onChange: (e) => setFormQuote(e.target.value),
                placeholder: "0",
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Status"),
              React.createElement(
                "select",
                {
                  value: formStatus,
                  onChange: (e) => setFormStatus(e.target.value),
                  className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
                },
                React.createElement("option", { value: "Researching" }, "Researching"),
                React.createElement("option", { value: "Contacted" }, "Contacted"),
                React.createElement("option", { value: "Quoted" }, "Quoted"),
                React.createElement("option", { value: "Hired" }, "Hired"),
                React.createElement("option", { value: "Rejected" }, "Rejected")
              )
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center gap-2 pt-1" },
            React.createElement("input", {
              type: "checkbox",
              id: "contractCheck",
              checked: formContractSigned,
              onChange: (e) => setFormContractSigned(e.target.checked),
              className: "w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            }),
            React.createElement("label", { htmlFor: "contractCheck", className: "text-xs font-medium cursor-pointer text-slate-300" }, "Contract has been reviewed and signed")
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Notes / Inclusions"),
            React.createElement("textarea", {
              rows: 2,
              value: formNotes,
              onChange: (e) => setFormNotes(e.target.value),
              placeholder: "Packages included, deposit terms, cancellation policies...",
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            })
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
              editingVendor ? "Save Changes" : "Save Vendor"
            )
          )
        )
      )
    ),

    // AI Vendor Interview Questions Modal
    interviewVendor && React.createElement(
      "div",
      { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" },
      React.createElement(
        "div",
        {
          className: "w-full max-w-xl rounded-3xl p-6 sm:p-8 glass-modal shadow-2xl max-h-[90vh] overflow-y-auto text-white"
        },
        React.createElement(
          "div",
          { className: "flex items-center justify-between pb-4 border-b border-slate-700/50" },
          React.createElement(
            "div",
            null,
            React.createElement("h3", { className: "text-lg font-bold flex items-center gap-2" },
              React.createElement(window.Icons.Sparkles, { className: "w-5 h-5 text-amber-400" }),
              `AI Vetting Assistant: ${interviewVendor.category}`
            ),
            React.createElement("p", { className: "text-xs text-slate-400" }, `Interview checklist & contract safeguards for ${interviewVendor.name}`)
          ),
          React.createElement(
            "button",
            { onClick: () => setInterviewVendor(null), className: "text-slate-400 hover:text-white" },
            "✕"
          )
        ),

        loadingInterview ? React.createElement(
          "div",
          { className: "py-16 text-center space-y-3" },
          React.createElement(window.Icons.Sparkles, { className: "w-8 h-8 text-purple-400 mx-auto animate-spin" }),
          React.createElement("p", { className: "text-sm text-slate-300 font-medium" }, `Generating tailored questions for ${interviewVendor.category} vendors...`)
        ) : interviewQnA ? React.createElement(
          "div",
          { className: "mt-6 space-y-5" },
          React.createElement(
            "div",
            { className: "space-y-2" },
            React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5" },
              React.createElement(window.Icons.Check, { className: "w-4 h-4" }),
              "Critical Questions You Must Ask"
            ),
            React.createElement(
              "div",
              { className: "space-y-2" },
              (interviewQnA.mustAskQuestions || []).map((q, idx) =>
                React.createElement(
                  "div",
                  { key: idx, className: `p-3 rounded-xl border text-xs leading-relaxed ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}` },
                  React.createElement("span", { className: "font-bold text-purple-400 mr-2" }, `Q${idx + 1}:`),
                  q
                )
              )
            )
          ),
          React.createElement(
            "div",
            { className: "p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5" },
            React.createElement("div", { className: "font-bold text-amber-400 flex items-center gap-1" },
              React.createElement(window.Icons.AlertCircle, { className: "w-4 h-4" }),
              "Red Flags to Watch For"
            ),
            React.createElement(
              "ul",
              { className: "space-y-1 text-slate-300" },
              (interviewQnA.redFlags || []).map((flag, idx) =>
                React.createElement("li", { key: idx, className: "flex items-start gap-1.5" },
                  React.createElement("span", { className: "text-amber-400" }, "•"),
                  React.createElement("span", null, flag)
                )
              )
            )
          ),
          React.createElement(
            "div",
            { className: "p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs leading-relaxed" },
            React.createElement("span", { className: "font-bold text-indigo-400" }, "Essential Contract Clause: "),
            interviewQnA.contractCheck
          ),
          React.createElement(
            "div",
            { className: "pt-2 flex justify-end" },
            React.createElement(
              "button",
              {
                onClick: () => setInterviewVendor(null),
                className: "px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white"
              },
              "Done"
            )
          )
        ) : null
      )
    )
  );
};
