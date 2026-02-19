import { SITE_CONFIG } from "../config/site";
import { SERVICE_KEYWORDS } from "../config/keywords";

/**
 * Replaces placeholders in text with values from SITE_CONFIG
 */
export const replacePlaceholder = (text: string): string => {
    if (!text) return text;
    return text
        .replace(/\{\{LICENSE\}\}/g, SITE_CONFIG.credentials.license.number)
        .replace(/\{\{PHONE\}\}/g, SITE_CONFIG.contact.phone.formatted)
        .replace(/\{\{EMAIL\}\}/g, SITE_CONFIG.contact.email.primary)
        .replace(/\{\{FOUNDED_YEAR\}\}/g, SITE_CONFIG.company.foundedYear.toString())
        .replace(/\{\{YEARS_EXPERIENCE\}\}/g, SITE_CONFIG.credentials.yearsExperience.toString())
        .replace(/\{\{COMPANY_NAME\}\}/g, SITE_CONFIG.company.name);
};

/**
 * Programmatically highlights keywords for SEO and readability
 */
export const highlightKeywords = (text: string, additionalKeywords: string[] = []): string => {
    if (!text) return text;
    
    // Combine base registry with context-specific keywords (e.g., city name)
    const keywords = Array.from(new Set([...SERVICE_KEYWORDS, ...additionalKeywords]));
    
    // Escape keywords for regex and sort by length descending to match longer phrases first
    const escapedKeywords = keywords
        .filter(k => k.length > 2)
        .sort((a, b) => b.length - a.length)
        .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        
    if (escapedKeywords.length === 0) return text;

    // Use word boundaries \b to avoid highlighting parts of words
    // Use positive lookahead/lookbehind to avoid double-wrapping
    const pattern = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
    
    return text.replace(pattern, (match) => `<strong>${match}</strong>`);
};
