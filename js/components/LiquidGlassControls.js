// Floating In-App Liquid Glass Customizer Widget

window.LiquidGlassControls = function LiquidGlassControls() {
  const [isOpen, setIsOpen] = React.useState(false);

  // Settings State with LocalStorage persistence
  const [blur, setBlur] = React.useState(28);
  const [opacity, setOpacity] = React.useState(42);
  const [motionSpeed, setMotionSpeed] = React.useState("normal"); // frozen, calm, normal, surge
  const [activeTheme, setActiveTheme] = React.useState("visionos"); // visionos, oceanic, sunset, chrome

  // Themes palette definitions
  const THEMES = {
    visionos: {
      name: "VisionOS Luxe",
      icon: "🔮",
      orb1: "radial-gradient(circle, rgba(168, 85, 247, VAR_OPACITY) 0%, rgba(139, 92, 246, calc(VAR_OPACITY * 0.7)) 50%, transparent 100%)",
      orb2: "radial-gradient(circle, rgba(6, 182, 212, VAR_OPACITY) 0%, rgba(56, 189, 248, calc(VAR_OPACITY * 0.75)) 50%, transparent 100%)",
      orb3: "radial-gradient(circle, rgba(236, 72, 153, calc(VAR_OPACITY * 0.9)) 0%, rgba(217, 70, 239, calc(VAR_OPACITY * 0.65)) 50%, transparent 100%)",
      orb4: "radial-gradient(circle, rgba(16, 185, 129, calc(VAR_OPACITY * 0.8)) 0%, rgba(20, 184, 166, calc(VAR_OPACITY * 0.55)) 50%, transparent 100%)",
      orb5: "radial-gradient(circle, rgba(245, 158, 11, calc(VAR_OPACITY * 0.7)) 0%, rgba(251, 146, 60, calc(VAR_OPACITY * 0.45)) 50%, transparent 80%)"
    },
    oceanic: {
      name: "Deep Oceanic",
      icon: "🌊",
      orb1: "radial-gradient(circle, rgba(6, 182, 212, VAR_OPACITY) 0%, rgba(14, 116, 144, calc(VAR_OPACITY * 0.8)) 60%, transparent 100%)",
      orb2: "radial-gradient(circle, rgba(14, 165, 233, VAR_OPACITY) 0%, rgba(3, 105, 161, calc(VAR_OPACITY * 0.7)) 65%, transparent 100%)",
      orb3: "radial-gradient(circle, rgba(20, 184, 166, calc(VAR_OPACITY * 0.9)) 0%, rgba(15, 118, 110, calc(VAR_OPACITY * 0.6)) 60%, transparent 100%)",
      orb4: "radial-gradient(circle, rgba(59, 130, 246, calc(VAR_OPACITY * 0.8)) 0%, rgba(30, 64, 175, calc(VAR_OPACITY * 0.6)) 60%, transparent 100%)",
      orb5: "radial-gradient(circle, rgba(56, 189, 248, calc(VAR_OPACITY * 0.6)) 0%, transparent 70%)"
    },
    sunset: {
      name: "Sunset Velvet",
      icon: "🌸",
      orb1: "radial-gradient(circle, rgba(244, 63, 94, VAR_OPACITY) 0%, rgba(190, 18, 60, calc(VAR_OPACITY * 0.7)) 60%, transparent 100%)",
      orb2: "radial-gradient(circle, rgba(249, 115, 22, VAR_OPACITY) 0%, rgba(194, 65, 12, calc(VAR_OPACITY * 0.7)) 65%, transparent 100%)",
      orb3: "radial-gradient(circle, rgba(217, 70, 239, calc(VAR_OPACITY * 0.8)) 0%, rgba(162, 28, 175, calc(VAR_OPACITY * 0.6)) 60%, transparent 100%)",
      orb4: "radial-gradient(circle, rgba(251, 191, 36, calc(VAR_OPACITY * 0.7)) 0%, rgba(217, 119, 6, calc(VAR_OPACITY * 0.5)) 60%, transparent 100%)",
      orb5: "radial-gradient(circle, rgba(244, 114, 182, calc(VAR_OPACITY * 0.6)) 0%, transparent 70%)"
    },
    chrome: {
      name: "Molten Silver",
      icon: "🪙",
      orb1: "radial-gradient(circle, rgba(255, 255, 255, calc(VAR_OPACITY * 0.9)) 0%, rgba(148, 163, 184, calc(VAR_OPACITY * 0.6)) 60%, transparent 100%)",
      orb2: "radial-gradient(circle, rgba(203, 213, 225, calc(VAR_OPACITY * 0.8)) 0%, rgba(71, 85, 105, calc(VAR_OPACITY * 0.5)) 65%, transparent 100%)",
      orb3: "radial-gradient(circle, rgba(241, 245, 249, calc(VAR_OPACITY * 0.7)) 0%, rgba(100, 116, 139, calc(VAR_OPACITY * 0.4)) 60%, transparent 100%)",
      orb4: "radial-gradient(circle, rgba(226, 232, 240, calc(VAR_OPACITY * 0.6)) 0%, rgba(51, 65, 85, calc(VAR_OPACITY * 0.4)) 60%, transparent 100%)",
      orb5: "radial-gradient(circle, rgba(255, 255, 255, calc(VAR_OPACITY * 0.5)) 0%, transparent 70%)"
    }
  };

  // Load from LocalStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("planpulse_liquid_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.blur) setBlur(parsed.blur);
        if (parsed.opacity !== undefined) setOpacity(parsed.opacity);
        if (parsed.motionSpeed) setMotionSpeed(parsed.motionSpeed);
        if (parsed.activeTheme && THEMES[parsed.activeTheme]) setActiveTheme(parsed.activeTheme);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Apply custom styling dynamically to CSS Variables and DOM Orbs
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--glass-blur", `${blur}px`);

    const opFraction = (opacity / 100).toFixed(2);
    root.style.setProperty("--liquid-opacity", opFraction);

    // Speed / Animation play state
    const orbs = document.querySelectorAll(".liquid-orb");
    orbs.forEach(orb => {
      if (motionSpeed === "frozen") {
        orb.style.animationPlayState = "paused";
      } else {
        orb.style.animationPlayState = "running";
        let durationScale = 1;
        if (motionSpeed === "calm") durationScale = 1.8;
        if (motionSpeed === "surge") durationScale = 0.55;
        // Adjust individual orbs
        if (orb.classList.contains("orb-1")) orb.style.animationDuration = `${24 * durationScale}s, ${16 * durationScale}s`;
        if (orb.classList.contains("orb-2")) orb.style.animationDuration = `${28 * durationScale}s, ${20 * durationScale}s`;
        if (orb.classList.contains("orb-3")) orb.style.animationDuration = `${22 * durationScale}s, ${18 * durationScale}s`;
        if (orb.classList.contains("orb-4")) orb.style.animationDuration = `${30 * durationScale}s, ${22 * durationScale}s`;
      }

      // Apply theme backgrounds
      const th = THEMES[activeTheme] || THEMES.chromatic;
      const orb1 = document.querySelector(".orb-1");
      const orb2 = document.querySelector(".orb-2");
      const orb3 = document.querySelector(".orb-3");
      const orb4 = document.querySelector(".orb-4");
      const orb5 = document.querySelector(".orb-5");

      if (orb1 && th.orb1) orb1.style.background = th.orb1.replace(/VAR_OPACITY/g, opFraction);
      if (orb2 && th.orb2) orb2.style.background = th.orb2.replace(/VAR_OPACITY/g, opFraction);
      if (orb3 && th.orb3) orb3.style.background = th.orb3.replace(/VAR_OPACITY/g, opFraction);
      if (orb4 && th.orb4) orb4.style.background = th.orb4.replace(/VAR_OPACITY/g, opFraction);
      if (orb5 && th.orb5) orb5.style.background = th.orb5.replace(/VAR_OPACITY/g, opFraction);
    });

    // Save to LocalStorage
    try {
      localStorage.setItem("planpulse_liquid_settings", JSON.stringify({
        blur,
        opacity,
        motionSpeed,
        activeTheme
      }));
    } catch (e) {
      // ignore
    }
  }, [blur, opacity, motionSpeed, activeTheme]);

  const handleReset = () => {
    setBlur(28);
    setOpacity(42);
    setMotionSpeed("normal");
    setActiveTheme("visionos");
  };

  return React.createElement(
    "div",
    { className: "fixed bottom-5 left-5 z-50 print:hidden select-none" },

    // Floating Button Toggle
    !isOpen && React.createElement(
      "button",
      {
        onClick: () => setIsOpen(true),
        title: "Customize Liquid Glass UI",
        className: "px-3.5 py-2 rounded-2xl glass-pill font-bold text-xs text-white shadow-2xl flex items-center gap-2 border border-white/25 hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-2xl"
      },
      React.createElement(
        "div",
        { className: "w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-pulse" }
      ),
      React.createElement(window.Icons.Sliders, { className: "w-4 h-4 text-purple-300" }),
      React.createElement("span", { className: "text-slate-100 font-semibold hidden sm:inline" }, "Liquid Glass FX")
    ),

    // Expanded Controls Card
    isOpen && React.createElement(
      "div",
      {
        className: "w-80 sm:w-88 rounded-3xl glass-modal p-5 shadow-2xl border border-white/25 space-y-4 animate-in fade-in zoom-in-95 duration-200"
      },

      // Card Header
      React.createElement(
        "div",
        { className: "flex items-center justify-between pb-2 border-b border-white/10" },
        React.createElement(
          "div",
          { className: "flex items-center gap-2" },
          React.createElement(window.Icons.Sliders, { className: "w-4 h-4 text-purple-400" }),
          React.createElement("h4", { className: "font-black text-sm text-slate-100 tracking-tight" }, "Liquid Glass Customizer")
        ),
        React.createElement(
          "div",
          { className: "flex items-center gap-1.5" },
          React.createElement(
            "button",
            {
              onClick: handleReset,
              title: "Reset defaults",
              className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            },
            React.createElement(window.Icons.RotateCcw, { className: "w-3.5 h-3.5" })
          ),
          React.createElement(
            "button",
            {
              onClick: () => setIsOpen(false),
              className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold"
            },
            "✕"
          )
        )
      ),

      // Control 1: Glass Blur Intensity
      React.createElement(
        "div",
        { className: "space-y-1.5" },
        React.createElement(
          "div",
          { className: "flex justify-between text-xs font-semibold" },
          React.createElement("span", { className: "text-slate-300" }, "Glass Frosted Blur"),
          React.createElement("span", { className: "text-purple-300 font-mono" }, `${blur}px`)
        ),
        React.createElement("input", {
          type: "range",
          min: 10,
          max: 60,
          value: blur,
          onChange: (e) => setBlur(Number(e.target.value)),
          className: "w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
        }),
        React.createElement(
          "div",
          { className: "flex justify-between text-[10px] text-slate-500" },
          React.createElement("span", null, "Crisp Translucent"),
          React.createElement("span", null, "Ultra Frosted Liquid")
        )
      ),

      // Control 2: Caustic Glow Opacity
      React.createElement(
        "div",
        { className: "space-y-1.5" },
        React.createElement(
          "div",
          { className: "flex justify-between text-xs font-semibold" },
          React.createElement("span", { className: "text-slate-300" }, "Caustic Glow Brightness"),
          React.createElement("span", { className: "text-purple-300 font-mono" }, `${opacity}%`)
        ),
        React.createElement("input", {
          type: "range",
          min: 0,
          max: 55,
          value: opacity,
          onChange: (e) => setOpacity(Number(e.target.value)),
          className: "w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
        }),
        React.createElement(
          "div",
          { className: "flex justify-between text-[10px] text-slate-500" },
          React.createElement("span", null, "Subtle Crystal (0%)"),
          React.createElement("span", null, "Vibrant Fluid (55%)")
        )
      ),

      // Control 3: Fluid Motion Dynamics
      React.createElement(
        "div",
        { className: "space-y-1.5" },
        React.createElement("label", { className: "text-xs font-semibold text-slate-300 block" }, "Fluid Motion Dynamics"),
        React.createElement(
          "div",
          { className: "grid grid-cols-4 gap-1.5" },
          [
            { id: "frozen", label: "Frozen", icon: "❄️" },
            { id: "calm", label: "Calm", icon: "🌊" },
            { id: "normal", label: "Fluid", icon: "💫" },
            { id: "surge", label: "Surge", icon: "⚡" }
          ].map(s =>
            React.createElement(
              "button",
              {
                key: s.id,
                onClick: () => setMotionSpeed(s.id),
                className: `py-1.5 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 ${
                  motionSpeed === s.id
                    ? "bg-purple-600/40 text-purple-200 border border-purple-500/50 shadow-md"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`
              },
              React.createElement("span", { className: "text-xs" }, s.icon),
              React.createElement("span", null, s.label)
            )
          )
        )
      ),

      // Control 4: Fluid Color Themes
      React.createElement(
        "div",
        { className: "space-y-1.5 pt-1" },
        React.createElement("label", { className: "text-xs font-semibold text-slate-300 block" }, "Caustic Color Vibe"),
        React.createElement(
          "div",
          { className: "grid grid-cols-2 gap-1.5" },
          Object.keys(THEMES).map(k => {
            const th = THEMES[k];
            const isSel = activeTheme === k;
            return React.createElement(
              "button",
              {
                key: k,
                onClick: () => setActiveTheme(k),
                className: `px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 text-left ${
                  isSel
                    ? "bg-white/20 text-white border border-white/40 shadow-lg backdrop-blur-md"
                    : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                }`
              },
              React.createElement("span", { className: "text-sm" }, th.icon),
              React.createElement("span", { className: "truncate" }, th.name)
            );
          })
        )
      ),

      // Footer notice
      React.createElement(
        "div",
        { className: "pt-2 text-center text-[10px] text-slate-500 border-t border-white/10" },
        "Settings auto-save to browser local storage."
      )
    )
  );
};
