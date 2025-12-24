export const NEIGHBORHOODS: Record<string, string[]> = {
    "Miami": [
        "Brickell", "Coconut Grove", "Wynwood", "Design District", 
        "Edgewater", "Little Havana", "Downtown Miami", "Midtown", "Coral Way"
    ],
    "Miami Beach": [
        "South Beach", "Mid-Beach", "North Beach", "South of Fifth (SoFi)", 
        "Sunset Islands", "Venetian Islands", "Fisher Island"
    ],
    "Fort Lauderdale": [
        "Las Olas", "Victoria Park", "Harbor Beach", "Galt Mile", 
        "Rio Vista", "Colee Hammock", "Coral Ridge"
    ],
    "Coral Gables": [
        "Gables Estates", "Old Cutler", "University of Miami Area", 
        "Cocoplum", "Deering Bay"
    ],
    "Boca Raton": [
        "Mizner Park", "Royal Palm Yacht Club", "Boca West", 
        "Woodfield Country Club", "The Sanctuary"
    ],
    "Hollywood": [
        "Hollywood Beach", "Emerald Hills", "Hollywood Lakes", "Hillcrest"
    ],
    "West Palm Beach": [
        "Downtown West Palm", "El Cid", "Flamingo Park", "Grandview Heights"
    ],
    "Delray Beach": [
        "Pineapple Grove", "Lake Ida", "Tropic Isle"
    ],
    "Boynton Beach": [
        "Hunter's Run", "Valencia Reserve"
    ],
    "Jupiter": [
        "Abacoa", "Admiral's Cove", "Jupiter Island"
    ]
};

// Fallback for cities not explicitly listed
export const GENERIC_NEIGHBORHOODS = [
    "Downtown", "Residential Districts", "Commercial Zones", "Waterfront Areas"
];
