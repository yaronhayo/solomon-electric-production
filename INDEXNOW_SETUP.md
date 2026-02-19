# IndexNow Setup Guide

## Quick Start

### 1. Generate API Key

Visit [indexnow.org](https://www.indexnow.org/) and generate a key. It will be a random string like:

```
a1b2c3d4e5f6g7h8i9j0
```

### 2. Create Verification File

Create a text file in your `/public` folder:

**Filename**: `{your-key}.txt`  
**Content**: `{your-key}`  
**Example**: `/public/a1b2c3d4e5f6g7h8i9j0.txt`

### 3. Deploy

Upload this file to your Hostinger account so it's accessible at:
```
https://www.247electricianmiami.com/a1b2c3d4e5f6g7h8i9j0.txt
```

### 4. Submit URLs

```bash
node scripts/indexnow.js a1b2c3d4e5f6g7h8i9j0
```

## The 26 URLs to Fix

All these URLs are "crawled - not indexed" in Google Search Console:

1. `https://www.247electricianmiami.com/services/electric-vehicle-outlet-installation/plantation/`
2. `https://www.247electricianmiami.com/services/automatic-transfer-switch-installation/tamarac/`
3. `https://www.247electricianmiami.com/services/electrical-fire-hazard-investigation/hialeah/`
4. `https://www.247electricianmiami.com/services/computer-network-outlet-installation/sunrise/`
5. `https://www.247electricianmiami.com/services/home-electrical-inspection-certification/miami-beach/`
6. `https://www.247electricianmiami.com/services/electrical-wiring-updates-rewiring/delray-beach/`
7. `https://www.247electricianmiami.com/services/smart-switch-home-automation/hialeah/`
8. `https://www.247electricianmiami.com/services/emergency-power-system-design/hialeah/`
9. `https://www.247electricianmiami.com/services/home-theater-low-voltage-wiring/wellington/`
10. `https://www.247electricianmiami.com/services/home-theater-low-voltage-wiring/boca-raton/`
11. `https://www.247electricianmiami.com/services/home-electrical-inspection-certification/wellington/`
12. `https://www.247electricianmiami.com/services/electrical-fire-hazard-investigation/coconut-creek/`
13. `https://www.247electricianmiami.com/services/led-lighting-retrofit-conversion/coral-springs/`
14. `https://www.247electricianmiami.com/services/smart-lighting-installation/tamarac/`
15. `https://www.247electricianmiami.com/services/emergency-power-system-design/north-miami/`
16. `https://www.247electricianmiami.com/services/sauna-steam-room-electrical/coconut-creek/`
17. `https://www.247electricianmiami.com/services/electrical-fire-hazard-investigation/delray-beach/`
18. `https://www.247electricianmiami.com/services/pool-spa-wiring-inspection/north-miami/`
19. `https://www.247electricianmiami.com/services/three-phase-power-installation/pembroke-pines/`
20. `https://www.247electricianmiami.com/services/electrical-burning-smell-investigation/miami-gardens/`
21. `https://www.247electricianmiami.com/services/permit-application-inspection-coordination/lauderhill/`
22. `https://www.247electricianmiami.com/services/smart-thermostat-installation/boca-raton/`
23. `https://www.247electricianmiami.com/services/commercial-gfci-safety-compliance/fort-lauderdale/`
24. `https://www.247electricianmiami.com/services/new-outlet-installation-repair/boynton-beach/`
25. `https://www.247electricianmiami.com/services/motion-sensor-dimmer-installation/margate/`
26. `https://www.247electricianmiami.com/services/electrical-code-compliance-violation-repairs/miami-beach/`

## Manual GSC Request Priority

Since Google limits manual indexing requests to ~10-20 per day, prioritize these URLs:

### Day 1 (High Value Cities)
1. `electric-vehicle-outlet-installation/plantation`
2. `electrical-fire-hazard-investigation/hialeah`
3. `home-electrical-inspection-certification/miami-beach`
4. `electrical-wiring-updates-rewiring/delray-beach`
5. `home-theater-low-voltage-wiring/boca-raton`
6. `commercial-gfci-safety-compliance/fort-lauderdale`
7. `smart-thermostat-installation/boca-raton`
8. `three-phase-power-installation/pembroke-pines`
9. `electrical-code-compliance-violation-repairs/miami-beach`
10. `electrical-burning-smell-investigation/miami-gardens`

### Day 2 (Secondary Cities)
11. `automatic-transfer-switch-installation/tamarac`
12. `computer-network-outlet-installation/sunrise`
13. `smart-switch-home-automation/hialeah`
14. `emergency-power-system-design/hialeah`
15. `home-theater-low-voltage-wiring/wellington`
16. `home-electrical-inspection-certification/wellington`
17. `electrical-fire-hazard-investigation/coconut-creek`
18. `led-lighting-retrofit-conversion/coral-springs`
19. `smart-lighting-installation/tamarac`
20. `emergency-power-system-design/north-miami`

### Day 3 (Remaining)
21. `sauna-steam-room-electrical/coconut-creek`
22. `electrical-fire-hazard-investigation/delray-beach`
23. `pool-spa-wiring-inspection/north-miami`
24. `permit-application-inspection-coordination/lauderhill`
25. `new-outlet-installation-repair/boynton-beach`
26. `motion-sensor-dimmer-installation/margate`

## Verification Checklist

After rebuilding and deploying:

- [ ] All 1,701 service+location pages display seoContent sections
- [ ] Sitemap includes `<lastmod>` tags for service+location pages
- [ ] Schema markup includes new properties (url, image, offers)
- [ ] Internal links working (city name → service area page)
- [ ] IndexNow verification file accessible at `/{key}.txt`
- [ ] IndexNow submission successful (202 status)
- [ ] GSC manual indexing requests submitted (10-20/day)
- [ ] Monitoring GSC coverage report daily

## Expected Timeline

| Day | Action |
|-----|--------|
| **Today** | Deploy updated site |
| **Today** | Submit to IndexNow |
| **Day 1-3** | Submit 26 URLs via GSC (10/day) |
| **Day 7** | Check GSC for re-crawl activity |
| **Day 14** | Verify some pages moved to "Indexed" |
| **Day 30** | Expect most/all pages indexed |

## Contact Search Engines

If pages still not indexed after 30 days, consider:

1. **Google Search Console Forums**  
   Post specific URLs for community review

2. **Google's John Mueller**  
   Tag on Twitter/X about indexing issues

3. **Bing Webmaster Tools**  
   Submit directly via their URL submission tool
