export interface DeliveryAreaConfig {
  name: string;
  postcode: string;
  charge: number;
}

export interface DeliveryTypeConfig {
  id: "standard" | "sameday" | "fixed" | "night" | "midnight";
  name: string;
  charge: number;
  timeWindow: string;
}

export interface DeliverySettings {
  areas: DeliveryAreaConfig[];
  types: DeliveryTypeConfig[];
}

export const DEFAULT_AREAS: DeliveryAreaConfig[] = [
  // ── East Pune ─────────────────────────────────────────────────────────────
  { name: "Hadapsar", postcode: "411028", charge: 0 },
  { name: "Magarpatta", postcode: "411013", charge: 0 },
  { name: "Kharadi", postcode: "411014", charge: 0 },
  { name: "Wagholi", postcode: "412207", charge: 0 },
  { name: "Viman Nagar", postcode: "411006", charge: 0 },
  { name: "Kalyani Nagar", postcode: "411006", charge: 0 },
  { name: "Koregaon Park", postcode: "411001", charge: 0 },
  { name: "Yerawada", postcode: "411006", charge: 0 },
  { name: "Mundhwa", postcode: "411036", charge: 0 },
  { name: "Manjari", postcode: "412307", charge: 0 },
  { name: "Fursungi", postcode: "412308", charge: 0 },
  { name: "Keshav Nagar", postcode: "411036", charge: 0 },
  { name: "Phursungi", postcode: "412308", charge: 0 },
  { name: "Undri", postcode: "411060", charge: 0 },
  { name: "Mohammed Wadi", postcode: "411060", charge: 0 },
  // ── Central Pune ──────────────────────────────────────────────────────────
  { name: "Camp", postcode: "411001", charge: 0 },
  { name: "Bund Garden", postcode: "411001", charge: 0 },
  { name: "Shivajinagar", postcode: "411005", charge: 0 },
  { name: "Deccan Gymkhana", postcode: "411004", charge: 0 },
  { name: "Erandwane", postcode: "411004", charge: 0 },
  { name: "Swargate", postcode: "411042", charge: 0 },
  // ── South Pune ────────────────────────────────────────────────────────────
  { name: "Wanowrie", postcode: "411040", charge: 0 },
  { name: "NIBM Road", postcode: "411048", charge: 0 },
  { name: "Kondhwa", postcode: "411048", charge: 0 },
  { name: "Bibwewadi", postcode: "411037", charge: 0 },
  { name: "Market Yard", postcode: "411037", charge: 0 },
  { name: "Dhankawadi", postcode: "411043", charge: 0 },
  { name: "Katraj", postcode: "411046", charge: 0 },
  { name: "Narhe", postcode: "411041", charge: 0 },
  { name: "Ambegaon", postcode: "411046", charge: 0 },
  { name: "Sinhagad Road", postcode: "411041", charge: 0 },
  { name: "Nanded City", postcode: "411041", charge: 0 },
  // ── West Pune ─────────────────────────────────────────────────────────────
  { name: "Karve Nagar", postcode: "411052", charge: 0 },
  { name: "Kothrud", postcode: "411038", charge: 0 },
  { name: "Warje", postcode: "411052", charge: 0 },
  { name: "Bavdhan", postcode: "411021", charge: 0 },
  // ── North-West Pune ───────────────────────────────────────────────────────
  { name: "Baner", postcode: "411045", charge: 0 },
  { name: "Balewadi", postcode: "411045", charge: 0 },
  { name: "Aundh", postcode: "411007", charge: 0 },
  { name: "Pashan", postcode: "411021", charge: 0 },
  { name: "Sus", postcode: "411021", charge: 0 },
  { name: "Hinjawadi", postcode: "411057", charge: 0 },
  { name: "Mahalunge", postcode: "412115", charge: 0 },
  { name: "Punawale", postcode: "411033", charge: 0 },
  { name: "Ravet", postcode: "412101", charge: 0 },
  { name: "Tathawade", postcode: "411033", charge: 0 },
  { name: "Wakad", postcode: "411057", charge: 0 },
  // ── Pimpri-Chinchwad (PCMC) ───────────────────────────────────────────────
  { name: "Thergaon", postcode: "411033", charge: 0 },
  { name: "Kalewadi", postcode: "411033", charge: 0 },
  { name: "Sangvi", postcode: "411027", charge: 0 },
  { name: "Pimple Saudagar", postcode: "411027", charge: 0 },
  { name: "Pimple Gurav", postcode: "411061", charge: 0 },
  { name: "Pimple Nilakh", postcode: "411027", charge: 0 },
  { name: "Chinchwad", postcode: "411033", charge: 0 },
  { name: "Pimpri", postcode: "411018", charge: 0 },
  { name: "Akurdi", postcode: "411035", charge: 0 },
  { name: "Nigdi", postcode: "411044", charge: 0 },
  { name: "Pradhikaran", postcode: "411044", charge: 0 },
  { name: "Bhosari", postcode: "411026", charge: 0 },
  { name: "Moshi", postcode: "412105", charge: 0 },
  { name: "Charholi", postcode: "412105", charge: 0 },
  { name: "Dighi", postcode: "411015", charge: 0 },
  // ── North Pune ────────────────────────────────────────────────────────────
  { name: "Lohegaon", postcode: "411032", charge: 0 },
  { name: "Vishrantwadi", postcode: "411015", charge: 0 },
  // ── Other ─────────────────────────────────────────────────────────────────
  { name: "Other Area (Contact Us)", postcode: "000000", charge: 0 },
];

export const DEFAULT_TYPES: DeliveryTypeConfig[] = [
  { id: "standard", name: "Standard Delivery", charge: 0, timeWindow: "10 AM - 8 PM" },
  { id: "sameday", name: "Same Day Delivery", charge: 99, timeWindow: "Within 4 hours" },
  { id: "fixed", name: "Fixed Time Delivery", charge: 149, timeWindow: "Select Time" },
  { id: "night", name: "Night Delivery", charge: 100, timeWindow: "8 PM - 11 PM" },
  { id: "midnight", name: "Midnight Delivery", charge: 249, timeWindow: "11 PM - 12 AM" }
];

export function getDeliverySettings(): DeliverySettings {
  try {
    const saved = localStorage.getItem("sajawat_delivery_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.types)) {
        // Always use the canonical DEFAULT_AREAS (free delivery everywhere).
        // This overwrites any stale per-area charges stored in localStorage.
        const types = [...parsed.types];
        DEFAULT_TYPES.forEach((defType) => {
          if (!types.some((t) => t.id === defType.id)) {
            types.push(defType);
          }
        });
        return { areas: DEFAULT_AREAS, types };
      }
    }
  } catch (e) {
    console.error("Error loading delivery settings", e);
  }

  // Fallback to defaults
  const defaults: DeliverySettings = { areas: DEFAULT_AREAS, types: DEFAULT_TYPES };
  saveDeliverySettings(defaults);
  return defaults;
}

export function saveDeliverySettings(settings: DeliverySettings): void {
  try {
    localStorage.setItem("sajawat_delivery_settings", JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving delivery settings", e);
  }
}
