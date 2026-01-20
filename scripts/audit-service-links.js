
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

async function auditLinks() {
    console.log('--- Starting Deep Internal Link Audit ---');
    
    // 1. Get List of Services and Cities
    const services = fs.readdirSync(path.join(distDir, 'services')).filter(f => fs.statSync(path.join(distDir, 'services', f)).isDirectory());
    const serviceAreas = fs.readdirSync(path.join(distDir, 'service-areas')).filter(f => fs.statSync(path.join(distDir, 'service-areas', f)).isDirectory());
    
    console.log(`Found ${services.length} services and ${serviceAreas.length} service areas.`);
    
    const report = {
        servicePages: [],
        intersectionPages: [],
        brokenLinks: []
    };

    function checkLink(link, source) {
        // Normalize link to file system path
        // Example: /services/my-service/my-city#fragment -> dist/services/my-service/my-city/index.html
        let cleanLink = link.split('#')[0].split('?')[0];
        
        // If it's just a fragment or empty link after cleaning, ignore
        if (!cleanLink || cleanLink === '/' || cleanLink.startsWith('#')) return true;

        let relativePath = cleanLink;
        if (relativePath.startsWith('/')) relativePath = relativePath.substring(1);
        
        // Remove trailing slash if present
        if (relativePath.endsWith('/')) relativePath = relativePath.slice(0, -1);

        const filePath = path.join(distDir, relativePath, 'index.html');
        if (!fs.existsSync(filePath)) {
            report.brokenLinks.push({ link, source });
            return false;
        }
        return true;
    }

    // 2. Audit Service Category Pages (/services/[service]/index.html)
    console.log('\n--- Auditing Service Category Pages ---');
    for (const service of services) {
        const filePath = path.join(distDir, 'services', service, 'index.html');
        if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, 'utf8');
            
            // 2a. Check City links (/services/[service]/[city])
            const cityPattern = new RegExp(`/services/${service}/[^/"]+`, 'g');
            const cityMatches = html.match(cityPattern) || [];
            const uniqueCities = new Set();
            
            for (const link of cityMatches) {
                if (checkLink(link, `/services/${service}`)) {
                    uniqueCities.add(link.split('/').pop());
                }
            }
            
            if (uniqueCities.size < serviceAreas.length) {
                report.servicePages.push({
                    service,
                    found: uniqueCities.size,
                    missing: serviceAreas.length - uniqueCities.size
                });
            }

            // 2b. Check Related Services links (/services/[other-service])
            const relatedPattern = /href="\/services\/([^/"]+)"/g;
            let match;
            while ((match = relatedPattern.exec(html)) !== null) {
                const link = `/services/${match[1]}`;
                // Avoid checking the service itself or intersection pages in this regex
                if (match[1] !== service && !match[1].includes('/') && !match[1].includes('#')) {
                    checkLink(link, `/services/${service}`);
                }
            }
        }
    }

    // 3. Audit Intersection Pages (/services/[service]/[city]/index.html)
    console.log('\n--- Auditing Intersection Pages (Sample) ---');
    let totalIntersections = 0;
    let intersectionsWithFewLinks = 0;

    for (const service of services) {
        const servicePath = path.join(distDir, 'services', service);
        const cities = fs.readdirSync(servicePath).filter(f => fs.statSync(path.join(servicePath, f)).isDirectory());
        
        for (const city of cities) {
            totalIntersections++;
            const filePath = path.join(servicePath, city, 'index.html');
            if (fs.existsSync(filePath)) {
                const html = fs.readFileSync(filePath, 'utf8');
                
                // 3a. Check other city links
                const pattern = new RegExp(`/services/${service}/[^/"]+`, 'g');
                const matches = html.match(pattern) || [];
                const uniqueCities = new Set();
                
                for (const link of matches) {
                    const linkedCity = link.split('/').pop();
                    if (linkedCity !== city) {
                        if (checkLink(link, `/services/${service}/${city}`)) {
                            uniqueCities.add(linkedCity);
                        }
                    } else {
                        // Self link might exist (e.g. in footer), also check it
                        checkLink(link, `/services/${service}/${city}`);
                    }
                }
                
                if (uniqueCities.size < serviceAreas.length - 1) {
                    intersectionsWithFewLinks++;
                }

                // 3b. Check related service links in this city (/services/[other-service]/[city])
                const relServPattern = new RegExp(`/services/([^/"]+)/${city}`, 'g');
                let rsMatch;
                while ((rsMatch = relServPattern.exec(html)) !== null) {
                    const link = rsMatch[0];
                    if (rsMatch[1] !== service) {
                        checkLink(link, `/services/${service}/${city}`);
                    }
                }
            }
        }
    }

    console.log(`Total intersection pages checked: ${totalIntersections}`);
    console.log(`Intersections with broken/missing all-city links: ${intersectionsWithFewLinks}`);

    if (report.brokenLinks.length > 0) {
        console.log('\n❌ BROKEN LINKS FOUND:');
        report.brokenLinks.slice(0, 20).forEach(b => console.log(`- ${b.link} (found in ${b.source})`));
        if (report.brokenLinks.length > 20) console.log(`... and ${report.brokenLinks.length - 20} more.`);
    } else {
        console.log('\n✅ NO BROKEN LINKS FOUND in analyzed pages.');
    }

    if (report.servicePages.length > 0) {
        console.log('\n⚠️ Service Category Pages with missing city links:');
        report.servicePages.forEach(p => console.log(`- ${p.service}: Found ${p.found}/${serviceAreas.length}`));
    } else {
        console.log('\n✅ All Service Category Pages link to all cities.');
    }

    // Special check for the user's example
    const examplePath = path.join(distDir, 'services/home-ev-charging-system-setup/miami-beach/index.html');
    if (fs.existsSync(examplePath)) {
        const html = fs.readFileSync(examplePath, 'utf8');
        const pattern = new RegExp(`/services/home-ev-charging-system-setup/[^/"]+`, 'g');
        const matches = html.match(pattern) || [];
        const citiesLinked = new Set(matches.map(m => m.split('/').pop()));
        console.log(`\n🔍 Example Check: /services/home-ev-charging-system-setup/miami-beach/`);
        console.log(`Cities linked: ${citiesLinked.size} (including self)`);
        console.log('Cities found:', Array.from(citiesLinked));
    }
}

auditLinks().catch(console.error);
