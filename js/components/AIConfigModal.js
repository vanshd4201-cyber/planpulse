// Gemini API Configuration Modal Component

window.AIConfigModal = function AIConfigModal({
  isOpen,
  onClose,
  onSave,
  darkMode
}) {
  const [apiKey, setApiKey] = React.useState("");
  const [model, setModel] = React.useState("gemini-2.0-flash");
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null);

  React.useEffect(() => {
    if (isOpen) {
      setApiKey(window.StorageService.getApiKey());
      setModel(window.StorageService.getModel());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: "Please enter an API key first." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say 'PlanPulse AI Ready' in 3 words." }] }]
        })
      });
      if (res.ok) {
        setTestResult({ success: true, message: "Connected successfully to Google Gemini Live API!" });
      } else {
        const data = await res.json().catch(() => ({}));
        setTestResult({ success: false, message: data.error?.message || `HTTP ${res.status} response from Google Gemini API.` });
      }
    } catch (err) {
      setTestResult({ success: false, message: `Connection failed: ${err.message}` });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    window.StorageService.setApiKey(apiKey.trim());
    window.StorageService.setModel(model);
    onSave();
    onClose();
  };

  const handleClearKey = () => {
    setApiKey("");
    window.StorageService.setApiKey("");
    setTestResult({ success: true, message: "Switched to built-in Smart Offline AI Simulator." });
  };

  return React.createElement(
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
            { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white border border-white/20 shadow-md shadow-purple-500/20" },
            React.createElement(window.Icons.Settings, { className: "w-5 h-5" })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("h3", { className: "text-lg font-bold text-gradient" }, "GenAI Intelligence Engine"),
            React.createElement("p", { className: "text-xs text-slate-400" }, "Live Gemini API or Built-in Offline Simulator")
          )
        ),
        React.createElement("button", { onClick: onClose, className: "text-slate-400 hover:text-white" }, "✕")
      ),

      React.createElement(
        "form",
        { onSubmit: handleSave, className: "mt-5 space-y-4" },

        // Status Card
        React.createElement(
          "div",
          { className: `p-4 rounded-2xl border ${apiKey ? "bg-emerald-500/15 border-emerald-500/30" : "bg-indigo-500/15 border-indigo-500/30"} backdrop-blur-md` },
          React.createElement("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider" },
            React.createElement("span", { className: `w-2.5 h-2.5 rounded-full ${apiKey ? "bg-emerald-400 animate-pulse" : "bg-indigo-400"}` }),
            apiKey ? React.createElement("span", { className: "text-emerald-400" }, "Live Google Gemini Mode Active") : React.createElement("span", { className: "text-indigo-400" }, "Smart Offline AI Simulator Active")
          ),
          React.createElement("p", { className: "text-xs text-slate-300 mt-1.5 leading-relaxed" },
            apiKey
              ? "All event generation, budget analysis, and idea studio prompts will query Google Gemini's live neural models."
              : "No API key? No problem! PlanPulse includes an instant, comprehensive algorithmic planning simulator that works 100% offline."
          )
        ),

        // Key Input
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" },
            "Google Gemini API Key (Optional)"
          ),
          React.createElement("input", {
            type: "password",
            value: apiKey,
            onChange: (e) => setApiKey(e.target.value),
            placeholder: "AIzaSy...",
            className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono focus:outline-none"
          }),
          React.createElement(
            "p",
            { className: "text-[11px] text-slate-400 mt-1 flex items-center justify-between" },
            React.createElement("span", null, "Stored locally in your browser. Never transmitted to 3rd-party servers."),
            React.createElement("a", {
              href: "https://aistudio.google.com/app/apikey",
              target: "_blank",
              rel: "noreferrer",
              className: "text-purple-400 hover:underline font-semibold"
            }, "Get free key ↗")
          )
        ),

        // Model Selector
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "block text-xs font-semibold uppercase text-slate-400 mb-1" }, "Gemini Model"),
          React.createElement(
            "select",
            {
              value: model,
              onChange: (e) => setModel(e.target.value),
              className: "w-full px-3.5 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            },
            React.createElement("option", { value: "gemini-2.0-flash" }, "gemini-2.0-flash (Fastest & Ultra-Smart)"),
            React.createElement("option", { value: "gemini-1.5-flash" }, "gemini-1.5-flash (Standard & Reliable)")
          )
        ),

        // Test Result Notice
        testResult && React.createElement(
          "div",
          { className: `p-3 rounded-xl border text-xs ${testResult.success ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-rose-500/15 border-rose-500/30 text-rose-300"}` },
          testResult.message
        ),

        // Action Buttons
        React.createElement(
          "div",
          { className: "flex items-center justify-between pt-3 border-t border-white/10" },
          React.createElement(
            "div",
            { className: "flex items-center gap-2" },
            React.createElement(
              "button",
              {
                type: "button",
                onClick: handleTestConnection,
                disabled: testing || !apiKey,
                className: "px-3 py-2 rounded-xl text-xs font-semibold glass-pill text-purple-300 hover:text-white disabled:opacity-40"
              },
              testing ? "Testing..." : "Test Connection"
            ),
            apiKey && React.createElement(
              "button",
              {
                type: "button",
                onClick: handleClearKey,
                className: "px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
              },
              "Clear Key"
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center gap-2" },
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
              "Save Settings"
            )
          )
        )
      )
    )
  );
};
