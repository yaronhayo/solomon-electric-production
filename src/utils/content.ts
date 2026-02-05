import { SITE_CONFIG } from "../config/site";

/**
 * Replaces placeholders in text with values from SITE_CONFIG
 * Supported placeholders:
 * {{LICENSE}} - Electrical license number
 * {{PHONE}} - Formatted phone number
 * {{EMAIL}} - Primary email address
 * {{FOUNDED_YEAR}} - Company founding year
 * {{YEARS_EXPERIENCE}} - Years of experience
 * {{COMPANY_NAME}} - Company name
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
 * Processes an array of FAQ items, replacing placeholders in question and answer
 */
export const processFaqs = (faqs: any[]) => {
    return (faqs || []).map(faq => ({
        ...faq,
        question: replacePlaceholder(faq.question || faq.data?.question),
        answer: replacePlaceholder(faq.answer || faq.data?.answer)
    }));
};
