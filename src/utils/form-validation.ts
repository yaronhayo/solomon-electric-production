/**
 * Shared Form Utilities
 * Solomon Electric - Centralized for consistency between booking and contact forms
 */

/**
 * Capitalize name properly (handles McName, O'Brien, hyphenated names)
 */
export const capitalizeName = (name: string): string => {
    return name
        .toLowerCase()
        .split(/(\s+)/)
        .map((part) => {
            if (!part.trim()) return part;
            
            // Handle Mc prefix
            if (part.startsWith("mc") && part.length > 2) {
                return (
                    "Mc" + part.charAt(2).toUpperCase() + part.slice(3)
                );
            }
            
            // Handle Mac prefix
            if (part.startsWith("mac") && part.length > 3) {
                return (
                    "Mac" + part.charAt(3).toUpperCase() + part.slice(4)
                );
            }
            
            // Handle O' prefix
            if (part.startsWith("o'") && part.length > 2) {
                return (
                    "O'" + part.charAt(2).toUpperCase() + part.slice(3)
                );
            }
            
            // Standard capitalization
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join("")
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("-");
};

/**
 * Format US phone number as (XXX) XXX-XXXX
 */
export const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6)
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length <= 10)
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length === 11 && digits[0] === "1") {
        return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
    }
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

/**
 * Validate US phone number (10 or 11 digits)
 */
export const isValidUSPhone = (value: string): boolean => {
    const digits = value.replace(/\D/g, "");
    return (
        digits.length === 10 ||
        (digits.length === 11 && digits[0] === "1")
    );
};

/**
 * Validate basic email format
 */
export const isValidEmail = (email: string): boolean => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
