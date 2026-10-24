// LocalStorage and Data Management Service

const STORAGE_KEYS = {
  EVENTS: "planpulse_events_data_v1",
  ACTIVE_ID: "planpulse_active_event_id_v1",
  GEMINI_KEY: "planpulse_gemini_api_key_v1",
  GEMINI_MODEL: "planpulse_gemini_model_v1",
  DARK_MODE: "planpulse_dark_mode_v1"
};

window.StorageService = {
  getEvents() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaults = window.DEFAULT_EVENTS || [];
          return parsed.map(ev => {
            const defaultMatch = defaults.find(d => d.id === ev.id);
            return {
              ...ev,
              tables: Array.isArray(ev.tables) && ev.tables.length > 0 ? ev.tables : (defaultMatch?.tables || ev.tables || []),
              guests: Array.isArray(ev.guests) && ev.guests.length > 0 ? ev.guests : (defaultMatch?.guests || ev.guests || [])
            };
          });
        }
      }
    } catch (e) {
      console.warn("Error reading events from localStorage, falling back to defaults", e);
    }
    // Seed defaults
    const defaults = window.DEFAULT_EVENTS || [];
    this.saveEvents(defaults);
    return defaults;
  },

  saveEvents(events) {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error("Failed to save events to localStorage", e);
    }
  },

  getActiveEventId() {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    if (stored) return stored;
    const events = this.getEvents();
    return events.length > 0 ? events[0].id : "";
  },

  setActiveEventId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
  },

  getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || "";
  },

  setApiKey(key) {
    if (key) {
      localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
    }
  },

  getModel() {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_MODEL) || "gemini-2.0-flash";
  },

  setModel(model) {
    localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, model);
  },

  getDarkMode() {
    const val = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return val !== null ? JSON.parse(val) : true; // Default dark glassmorphic mode
  },

  setDarkMode(isDark) {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDark));
  },

  exportJSON() {
    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      events: this.getEvents()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `planpulse-events-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data && Array.isArray(data.events)) {
        this.saveEvents(data.events);
        if (data.events[0]) {
          this.setActiveEventId(data.events[0].id);
        }
        return true;
      }
    } catch (e) {
      console.error("Failed to parse import JSON", e);
    }
    return false;
  },

  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    return this.getEvents();
  }
};
