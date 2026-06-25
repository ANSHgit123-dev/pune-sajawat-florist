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
  { name: "Hadapsar", postcode: "411028", charge: 50 },
  { name: "Magarpatta", postcode: "411013", charge: 50 },
  { name: "Kharadi", postcode: "411014", charge: 100 },
  { name: "Wagholi", postcode: "412207", charge: 150 },
  { name: "Koregaon Park", postcode: "411001", charge: 150 },
  { name: "Viman Nagar", postcode: "411006", charge: 100 },
  { name: "Hinjewadi", postcode: "411057", charge: 250 },
  { name: "Baner", postcode: "411045", charge: 200 },
  { name: "Aundh", postcode: "411007", charge: 200 },
  { name: "Other Areas (Contact Us)", postcode: "000000", charge: 0 }
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
      // Ensure basic shape is correct
      if (parsed && Array.isArray(parsed.areas) && Array.isArray(parsed.types)) {
        // Defensively merge any missing default delivery types
        const types = [...parsed.types];
        DEFAULT_TYPES.forEach((defType) => {
          if (!types.some((t) => t.id === defType.id)) {
            types.push(defType);
          }
        });
        parsed.types = types;
        return parsed;
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
