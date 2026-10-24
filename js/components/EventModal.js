// Create & Edit Event Details Modal Component

window.EventModal = function EventModal({
  isOpen,
  onClose,
  onSave,
  eventToEdit,
  darkMode
}) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("wedding");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("16:00");
  const [location, setLocation] = React.useState("");
  const [guestCount, setGuestCount] = React.useState(80);
  const [targetBudget, setTargetBudget] = React.useState(15000);
  const [currency, setCurrency] = React.useState("$");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name || "");
      setType(eventToEdit.type || "wedding");
      setDate(eventToEdit.date || "");
      setTime(eventToEdit.time || "16:00");
      setLocation(eventToEdit.location || "");
      setGuestCount(eventToEdit.guestCount || 80);
      setTargetBudget(eventToEdit.targetBudget || 15000);
      setCurrency(eventToEdit.currency || "$");
      setNotes(eventToEdit.notes || "");
    } else {
      setName("");
      setType("wedding");
      setDate("");
      setTime("16:00");
      setLocation("");
      setGuestCount(80);
      setTargetBudget(15000);
      setCurrency("$");
      setNotes("");
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (eventToEdit) {
      onSave({
        ...eventToEdit,
        name: name.trim(),
        type,
        date,
        time,
        location: location.trim(),
        guestCount: Number(guestCount) || 0,
        targetBudget: Number(targetBudget) || 0,
        currency,
        notes: notes.trim()
      });
    } else {
      const newEvent = {
        id: `evt-${Date.now()}`,
        name: name.trim(),
        type,
        date,
        time,
        location: location.trim(),
        guestCount: Number(guestCount) || 0,
        targetBudget: Number(targetBudget) || 0,
        currency,
        notes: notes.trim(),
        themeColor: type === "wedding" ? "from-rose-500 to-amber-500" : type === "birthday" ? "from-cyan-500 to-fuchsia-500" : type === "community" ? "from-amber-500 to-emerald-600" : "from-blue-600 to-indigo-700",
        budgetItems: [],
        timelineItems: [],
        vendors: [],
        ideas: [],
        guests: []
      };
      onSave(newEvent);
    }
    onClose();
  };

  return React.createElement(
    "div",
    { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" },
    React.createElement(
      "div",
      {
        className: "w-full max-w-lg rounded-3xl p-6 sm:p-8 glass-modal shadow-2xl max-h-[90vh] overflow-y-auto text-white"
      },
      React.createElement(
        "div",
        { className: "flex items-center justify-between pb-4 border-b border-white/10" },
        React.createElement("h3", { className: "text-lg font-bold text-gradient" }, eventToEdit ? "Edit Event Details" : "Create New Custom Event"),
        React.createElement("button", { onClick: onClose, className: "text-slate-400 hover:text-white" }, "✕")
      ),

      React.createElement(
        "form",
        { onSubmit: handleSubmit, className: "mt-5 space-y-4" },
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Event Title *"),
          React.createElement("input", {
            type: "text",
            required: true,
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "e.g., Maya & Liam's Wedding Celebration",
            className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
          })
        ),
        React.createElement(
          "div",
          { className: "grid grid-cols-2 gap-3" },
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Event Type"),
            React.createElement(
              "select",
              {
                value: type,
                onChange: (e) => setType(e.target.value),
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
              },
              React.createElement("option", { value: "wedding" }, "Wedding"),
              React.createElement("option", { value: "birthday" }, "Birthday"),
              React.createElement("option", { value: "community" }, "Community Event"),
              React.createElement("option", { value: "corporate" }, "Corporate / Gala")
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Currency"),
            React.createElement(
              "select",
              {
                value: currency,
                onChange: (e) => setCurrency(e.target.value),
                className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
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
        React.createElement(
          "div",
          { className: "grid grid-cols-2 gap-3" },
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Event Date"),
            React.createElement("input", {
              type: "date",
              value: date,
              onChange: (e) => setDate(e.target.value),
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Start Time"),
            React.createElement("input", {
              type: "time",
              value: time,
              onChange: (e) => setTime(e.target.value),
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            })
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Location / Venue"),
          React.createElement("input", {
            type: "text",
            value: location,
            onChange: (e) => setLocation(e.target.value),
            placeholder: "e.g., Grand Hyatt Ballroom, Central Park, Home...",
            className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
          })
        ),
        React.createElement(
          "div",
          { className: "grid grid-cols-2 gap-3" },
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Target Budget"),
            React.createElement("input", {
              type: "number",
              value: targetBudget,
              onChange: (e) => setTargetBudget(e.target.value),
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Expected Guests"),
            React.createElement("input", {
              type: "number",
              value: guestCount,
              onChange: (e) => setGuestCount(e.target.value),
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            })
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Vision Notes"),
          React.createElement("textarea", {
            rows: 2,
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            placeholder: "Theme hints, vibe preferences, or priority goals...",
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
              onClick: onClose,
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
            eventToEdit ? "Save Changes" : "Create Event"
          )
        )
      )
    )
  );
};
