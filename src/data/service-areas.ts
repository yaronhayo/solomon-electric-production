/**
 * Service Areas Data
 * Centralized list of service areas
 */

export const SERVICE_AREAS = [
    "Boca Raton",
    "Boynton Beach",
    "Coconut Creek",
    "Coral Springs",
    "Deerfield",
    "Delray Beach",
    "Davie",
    "Fort Lauderdale",
    "Hialeah",
    "Homestead",
    "Hollywood",
    "Jupiter",
    "Lauderhill",
    "Margate",
    "Miami",
    "Miami Beach",
    "Miami Gardens",
    "Miramar",
    "North Miami",
    "Pembroke Pines",
    "Plantation",
    "Pompano Beach",
    "Sunrise",
    "Tamarac",
    "Wellington",
    "Weston",
    "West Palm Beach",
] as const;

export type ServiceArea = typeof SERVICE_AREAS[number];
