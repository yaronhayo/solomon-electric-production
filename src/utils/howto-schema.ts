/**
 * HowTo Schema Generator
 * Creates structured HowTo schema for service guide pages
 * Targets featured snippets and voice search results
 */

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format (e.g., "PT30M" for 30 minutes)
  estimatedCost?: {
    value: string;
    currency: string;
  };
  tool?: string[];
  supply?: string[];
  url: string;
}

export function generateHowToSchema(props: HowToSchemaProps) {
  const {
    name,
    description,
    steps,
    totalTime,
    estimatedCost,
    tool,
    supply,
    url,
  } = props;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          "@type": "ImageObject",
          url: step.image,
        },
      }),
      ...(step.url && { url: step.url }),
    })),
    ...(totalTime && { totalTime }),
    ...(estimatedCost && {
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: estimatedCost.currency,
        value: estimatedCost.value,
      },
    }),
    ...(tool && {
      tool: tool.map((t) => ({
        "@type": "HowToTool",
        name: t,
      })),
    }),
    ...(supply && {
      supply: supply.map((s) => ({
        "@type": "HowToSupply",
        name: s,
      })),
    }),
  };

  return schema;
}

/**
 * Common HowTo guides for electrical services
 */
export const howToGuides = {
  panelUpgrade: {
    name: "How to Know If You Need an Electrical Panel Upgrade",
    description:
      "Learn the warning signs that indicate your home needs an electrical panel upgrade, from flickering lights to tripped breakers.",
    steps: [
      {
        name: "Check Your Current Panel Amperage",
        text: "Locate your main electrical panel (usually in garage, basement, or utility room). Look at the main breaker switch - it will show your current amperage (typically 60A, 100A, or 200A). Homes built before 1960 often have 60A panels, while modern homes need 200A.",
      },
      {
        name: "Count Your Circuit Breakers",
        text: "Count all the circuit breaker slots in your panel. If your panel is completely full with no room for additional circuits, or if you're using tandem breakers (two circuits in one slot), you likely need an upgrade.",
      },
      {
        name: "Assess Your Power Usage",
        text: "Add up the amperage requirements of major appliances: AC unit (20-50A), electric dryer (30A), electric range (40-50A), EV charger (40-50A). If your total approaches or exceeds your panel capacity, upgrade is needed.",
      },
      {
        name: "Look for Warning Signs",
        text: "Watch for these red flags: frequent breaker trips, flickering or dimming lights when appliances run, burning smell from panel, warm panel to the touch, rust or corrosion, or outdated fuse box instead of breakers.",
      },
      {
        name: "Schedule Professional Inspection",
        text: "Contact a licensed electrician for a comprehensive electrical panel inspection. They'll assess your current system, future needs (like EV chargers or home additions), and provide a detailed upgrade quote.",
      },
    ],
    totalTime: "PT10M", // 10 minutes to read guide
  },

  evCharger: {
    name: "How to Prepare for Level 2 EV Charger Installation",
    description:
      "Step-by-step guide to prepare your home for a Level 2 electric vehicle charging station installation.",
    steps: [
      {
        name: "Choose Installation Location",
        text: "Select a location within 20 feet of where you park your EV. Consider garage wall mounting or outdoor pedestal installation. Ensure the location is protected from weather if outdoors and has adequate clearance.",
      },
      {
        name: "Check Electrical Panel Capacity",
        text: "Level 2 chargers require a dedicated 240V circuit with 40-50 amp capacity. Check if your electrical panel has space for a new circuit breaker and sufficient overall capacity. You may need a panel upgrade if running 100A or less.",
      },
      {
        name: "Determine Charger Specifications",
        text: "Decide on charger power level: 32A (7.7kW) for overnight charging or 48A (11.5kW) for faster charging. Consider smart features like WiFi connectivity, scheduling, and load management if you have multiple EVs.",
      },
      {
        name: "Obtain Necessary Permits",
        text: "EV charger installation requires electrical permits in most Florida municipalities. A licensed electrician will handle permit applications and ensure code compliance including proper grounding and GFCI protection.",
      },
      {
        name: "Schedule Professional Installation",
        text: "Contact a licensed electrician experienced with EV charger installations. Installation typically takes 4-8 hours including running the circuit, mounting the charger, and final inspection. Expect 1-2 weeks for permit approval.",
      },
    ],
    totalTime: "PT8M",
    estimatedCost: {
      value: "800-2000",
      currency: "USD",
    },
  },

  gfciOutlets: {
    name: "How to Identify Areas Requiring GFCI Outlets",
    description:
      "Learn which areas of your home require GFCI (Ground Fault Circuit Interrupter) outlets for safety and code compliance.",
    steps: [
      {
        name: "Understand GFCI Requirements",
        text: "GFCI outlets protect against electrical shock in wet locations by detecting ground faults and cutting power in milliseconds. Florida electrical code requires GFCI protection in specific areas to prevent electrocution hazards.",
      },
      {
        name: "Check Kitchen Areas",
        text: "All kitchen countertop outlets must have GFCI protection. This includes outlets within 6 feet of the sink and all countertop surfaces. Under-sink outlets for garbage disposals and dishwashers also require GFCI.",
      },
      {
        name: "Inspect Bathroom Outlets",
        text: "Every outlet in bathrooms must be GFCI protected - no exceptions. This includes outlets near sinks, in shower areas, and outlets for exhaust fans. Replace any standard outlets with GFCI outlets.",
      },
      {
        name: "Review Outdoor and Pool Areas",
        text: "All outdoor outlets need GFCI protection, including those on patios, decks, porches, and garages. Pool equipment, hot tubs, and any outlets within 20 feet of water features require GFCI.",
      },
      {
        name: "Test GFCI Outlets Monthly",
        text: "Press the 'TEST' button on each GFCI outlet - power should cut off. Press 'RESET' to restore power. If the outlet doesn't trip when tested or won't reset, replace it immediately. This monthly test ensures proper protection.",
      },
    ],
    totalTime: "PT6M",
  },
};
