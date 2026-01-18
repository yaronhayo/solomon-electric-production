import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const HOST = "www.247electricianmiami.com";

/**
 * Fetch URLs from the local sitemap file after build
 */
function getSitemapUrls() {
    const sitemapPath = join(process.cwd(), 'dist', 'sitemap-0.xml');
    if (!existsSync(sitemapPath)) {
        console.log("⚠️  sitemap-0.xml not found in dist/. Falling back to manual list.");
        return null;
    }

    try {
        const content = readFileSync(sitemapPath, 'utf8');
        const urls = content.match(/<loc>(.*?)<\/loc>/g)
            .map(val => val.replace(/<\/?loc>/g, ''))
            .filter(url => url.includes(HOST));
        
        console.log(`\n📄 Found ${urls.length} URLs in sitemap-0.xml`);
        return urls;
    } catch (error) {
        console.error("❌ Error parsing sitemap:", error.message);
        return null;
    }
}

// Default list of high-priority URLs (fallback)
const priorityUrls = [
    "https://www.247electricianmiami.com/",
    "https://www.247electricianmiami.com/services/",
    "https://www.247electricianmiami.com/contact/",
    "https://www.247electricianmiami.com/book/"
];

async function submitToIndexNow(apiKey) {
    if (!apiKey) {
        console.error("\n❌ ERROR: IndexNow API key not provided.");
        console.log("\n📋 To get an API key:");
        console.log("   1. Visit https://www.indexnow.org/");
        console.log("   2. Generate a key (it's a random string like 'a1b2c3d4e5f6...')");
        console.log("   3. Create a file in /public/{key}.txt with the key as its content");
        console.log("   4. Run this script with: node scripts/submit-indexnow.js YOUR_KEY\n");
        process.exit(1);
    }

    // Try sitemap first, then fallback
    const urls = getSitemapUrls() || priorityUrls;

    try {
        console.log(`\n🚀 Submitting ${urls.length} URLs to IndexNow...\n`);

        const response = await fetch(INDEXNOW_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                host: HOST,
                key: apiKey,
                keyLocation: `https://${HOST}/${apiKey}.txt`,
                urlList: urls
            })
        });

        if (response.ok || response.status === 202) {
            console.log(`✅ Successfully submitted ${urls.length} URLs to IndexNow!`);
            console.log(`\n📊 Status: ${response.status} ${response.statusText}`);
            console.log("\n🔍 What happens next:");
            console.log("   • Search engines (Bing, Yandex, etc.) will be notified");
            console.log("   • Pages should be re-crawled within 24-48 hours");
        } else {
            const errorText = await response.text();
            console.error(`\n❌ IndexNow submission failed: ${response.status} ${response.statusText}`);
            console.error(`Response: ${errorText}\n`);
            process.exit(1);
        }
    } catch (error) {
        console.error(`\n❌ Error submitting to IndexNow: ${error.message}\n`);
        process.exit(1);
    }
}

// Get API key from command line argument
const apiKey = process.argv[2] || process.env.INDEXNOW_KEY;

// Run the submission
submitToIndexNow(apiKey);
