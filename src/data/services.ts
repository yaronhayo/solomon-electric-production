// Service data with proper image imports
import {
    CircuitBoard as panelUpgradeIcon,
    Zap as evChargerIcon,
    Smartphone as smartHomeIcon,
    Zap as generatorIcon,
    Lightbulb as lightingIcon,
    Fan as ceilingFanIcon,
    Siren as emergencyPowerIcon,
    Lightbulb as ledRetrofitIcon,
    ClipboardCheck as maintenanceIcon,
    ShieldAlert as fireSafetyIcon,
    Wrench as repairIcon,
    Cable as rewiringIcon
} from 'lucide-astro';

import panelUpgradeImg from '../assets/images/categories/panel-upgrade.png';
import emergencyImg from '../assets/images/categories/emergency.png';
import wiringImg from '../assets/images/categories/wiring.png';
import lightingImg from '../assets/images/categories/lighting.png';
import smartHomeImg from '../assets/images/categories/smart-home.png';
import evChargingImg from '../assets/images/categories/ev-charging.png';
import generatorsImg from '../assets/images/categories/generators.png';
import outdoorImg from '../assets/images/categories/outdoor.png';
import commercialImg from '../assets/images/categories/commercial.png';
import inspectionImg from '../assets/images/categories/inspection.png';

// Service-specific images
import panelUpgrade200aImg from '../assets/images/services/panel_upgrade_200a_1765932120292.png';
import evChargerInstallImg from '../assets/images/services/ev_charger_installation_1765932135254.png';
import emergencyServiceImg from '../assets/images/services/emergency_repair_service_1765932148474.png';
import outletInstallImg from '../assets/images/services/outlet_installation_work_1765932163336.png';
import recessedLightingImg from '../assets/images/services/recessed_lighting_install_1765932176230.png';
import smartHomeImg2 from '../assets/images/services/smart_home_automation_1765932189867.png';
import generatorInstallImg from '../assets/images/services/standby_generator_install_1765932203516.png';
import ceilingFanImg from '../assets/images/services/ceiling_fan_installation_1765932217215.png';
import landscapeLightingImg from '../assets/images/services/landscape_outdoor_lighting_1765932257461.png';
import commercialPanelImg from '../assets/images/services/commercial_panel_upgrade_1765932272209.png';
import gfciOutletImg from '../assets/images/services/gfci_outlet_install_1765932285509.png';
import hotTubWiringImg from '../assets/images/services/hot_tub_wiring_1765932299670.png';
import inspectionWorkImg from '../assets/images/services/electrical_inspection_work_1765932314614.png';
import rewiringWorkImg from '../assets/images/services/rewiring_renovation_work_1765932328534.png';
import securityCameraImg from '../assets/images/services/security_camera_wiring_1765932341468.png';
import ledRetrofitImg from '../assets/images/services/led_retrofit_commercial_1765932356011.png';

export type ServiceCategory =
    | 'Panel & Electrical Upgrades'
    | 'Emergency & Rapid Response'
    | 'Outlets, Switches & Wiring'
    | 'Lighting & Fixtures'
    | 'Smart Home & Automation'
    | 'EV Charging & Green Energy'
    | 'Backup Power & Generators'
    | 'Specialty & Outdoor Services'
    | 'Commercial & Industrial'
    | 'Inspection & Code Compliance';

export interface Service {
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    icon: any;
    image?: any; // Service-specific hero image
    category: ServiceCategory;
    features: string[];
    relatedBlogPosts: string[];
    order: number;
}

export const serviceCategories: ServiceCategory[] = [
    'Panel & Electrical Upgrades',
    'Emergency & Rapid Response',
    'Outlets, Switches & Wiring',
    'Lighting & Fixtures',
    'Smart Home & Automation',
    'EV Charging & Green Energy',
    'Backup Power & Generators',
    'Specialty & Outdoor Services',
    'Commercial & Industrial',
    'Inspection & Code Compliance'
];

export const categoryImages = {
    'Panel & Electrical Upgrades': panelUpgradeImg,
    'Emergency & Rapid Response': emergencyImg,
    'Outlets, Switches & Wiring': wiringImg,
    'Lighting & Fixtures': lightingImg,
    'Smart Home & Automation': smartHomeImg,
    'EV Charging & Green Energy': evChargingImg,
    'Backup Power & Generators': generatorsImg,
    'Specialty & Outdoor Services': outdoorImg,
    'Commercial & Industrial': commercialImg,
    'Inspection & Code Compliance': inspectionImg
};

export const services: Service[] = [
    // PANEL & ELECTRICAL UPGRADES
    {
        name: 'Electrical Panel Upgrade (100A to 200A)',
        slug: 'electrical-panel-upgrade-100a-to-200a',
        description: 'Upgrade your home\'s electrical capacity to 200 Amps to support modern appliances, EV chargers, and AC units. We replace outdated panels with safe, code-compliant systems.',
        shortDescription: 'Increase capacity to 200A for modern home power needs',
        icon: panelUpgradeIcon,
        image: panelUpgrade200aImg,
        category: 'Panel & Electrical Upgrades',
        features: ['100A to 200A service upgrade', 'Permit handling and inspection', 'Code compliance check', 'Labeled circuit breakers'],
        relatedBlogPosts: [],
        order: 1
    },
    {
        name: 'Service Panel Replacement',
        slug: 'service-panel-replacement',
        description: 'Replace dangerous or obsolete electrical panels (like Federal Pacific or Zinsco) to prevent fire hazards and ensure reliable power distribution throughout your property.',
        shortDescription: 'Replace unsafe or obsolete panels for safety',
        icon: panelUpgradeIcon,
        image: panelUpgrade200aImg,
        category: 'Panel & Electrical Upgrades',
        features: ['Removal of hazardous panels', 'New main breaker installation', 'Grounding system update', 'Safety certification'],
        relatedBlogPosts: [],
        order: 2
    },
    {
        name: 'Panel Repair & Circuit Breaker Replacement',
        slug: 'panel-repair-circuit-breaker-replacement',
        description: 'Fix tripping breakers, buzzing panels, and loose connections. We diagnose and repair panel issues to restore stable power and prevent electrical fires.',
        shortDescription: 'Fix tripping breakers and faulty panel components',
        icon: repairIcon,
        image: panelUpgrade200aImg,
        category: 'Panel & Electrical Upgrades',
        features: ['Breaker replacement', 'Bus bar repair', 'Loose connection tightening', 'Load balancing'],
        relatedBlogPosts: [],
        order: 3
    },
    {
        name: 'Whole-Home Surge Protection',
        slug: 'whole-home-surge-protection',
        description: 'Protect all your electronics and appliances from power surges and lightning strikes with Type 1 and Type 2 whole-home surge protection installed directly at your panel.',
        shortDescription: 'Protect appliances from surges and lightning',
        icon: panelUpgradeIcon,
        image: panelUpgrade200aImg,
        category: 'Panel & Electrical Upgrades',
        features: ['Type 1 & Type 2 protection', 'Warranty coverage for devices', 'Lightning protection', 'Voltage spike defense'],
        relatedBlogPosts: [],
        order: 4
    },
    {
        name: 'Electrical Code Compliance & Violation Repairs',
        slug: 'electrical-code-compliance-violation-repairs',
        description: ' Correct electrical code violations found during inspections. We bring your system up to current NEC standards to satisfy insurance, sale requirements, or city citations.',
        shortDescription: 'Fix code violations and pass inspections',
        icon: rewiringIcon,
        image: rewiringWorkImg,
        category: 'Panel & Electrical Upgrades',
        features: ['Code violation corrections', 'Inspection report analysis', 'Permit closeouts', 'NEC compliance updates'],
        relatedBlogPosts: [],
        order: 5
    },
    {
        name: 'Electrical Safety Inspection & Certification',
        slug: 'electrical-safety-inspection-certification',
        description: 'Comprehensive electrical safety checkups for peace of mind. We identify potential hazards, fire risks, and efficiency issues in your electrical system.',
        shortDescription: 'Thorough safety audits and certification',
        icon: maintenanceIcon,
        image: inspectionWorkImg,
        category: 'Panel & Electrical Upgrades',
        features: ['Detailed safety report', 'Fire hazard identification', 'Grounding verification', 'Insurance certification'],
        relatedBlogPosts: [],
        order: 6
    },

    // EMERGENCY & RAPID RESPONSE
    {
        name: '24/7 Emergency Electrical Service',
        slug: '24-7-emergency-electrical-service',
        description: 'Immediate electrical repair services available 24/7/365. We respond fast to power outages, dangerous sparking, and critical electrical failures.',
        shortDescription: 'Round-the-clock emergency repairs',
        icon: repairIcon,
        image: emergencyServiceImg,
        category: 'Emergency & Rapid Response',
        features: ['60-minute response time', 'Available nights and weekends', 'Fully stocked trucks', ' Licensed pros on call'],
        relatedBlogPosts: [],
        order: 7
    },
    {
        name: 'Power Outage Emergency Response',
        slug: 'power-outage-emergency-response',
        description: 'Lost power? We troubleshoot and restore electricity quickly, whether the issue is a main breaker failure, utility connection problem, or internal wiring fault.',
        shortDescription: 'Restore lost power and fix outages fast',
        icon: emergencyPowerIcon,
        image: emergencyServiceImg,
        category: 'Emergency & Rapid Response',
        features: ['Main line troubleshooting', 'Temporary power solutions', 'Utility coordination', 'Fast diagnosis'],
        relatedBlogPosts: [],
        order: 8
    },
    {
        name: 'Electrical Fire Hazard Investigation',
        slug: 'electrical-fire-hazard-investigation',
        description: 'Expert investigation of potential fire hazards. If you see smoke, scorch marks, or feel heat from outlets, call us immediately for a safety assessment.',
        shortDescription: 'Identify and eliminate fire risks immediately',
        icon: fireSafetyIcon,
        image: emergencyServiceImg,
        category: 'Emergency & Rapid Response',
        features: ['Thermal imaging inspection', 'Wiring hazard detection', 'Overload identification', 'Burn mark analysis'],
        relatedBlogPosts: [],
        order: 9
    },
    {
        name: 'Sparking Outlet & Circuit Breaker Repair',
        slug: 'sparking-outlet-circuit-breaker-repair',
        description: 'Stop dangerous sparking immediately. We repair or replace arcing outlets, switches, and breakers to prevent fire and shock hazards.',
        shortDescription: 'Fix dangerous sparking and arcing',
        icon: repairIcon,
        image: panelUpgrade200aImg,
        category: 'Emergency & Rapid Response',
        features: ['Arc fault troubleshooting', 'Safe device replacement', 'Wiring check', 'Loose connection repair'],
        relatedBlogPosts: [],
        order: 10
    },
    {
        name: 'Electrical Burning Smell Investigation',
        slug: 'electrical-burning-smell-investigation',
        description: 'A fishy or burning plastic smell is a serious warning sign. We locate the source of overheating wiring or components and fix it before a fire starts.',
        shortDescription: 'Locate source of burning odors and fix',
        icon: fireSafetyIcon,
        image: emergencyServiceImg,
        category: 'Emergency & Rapid Response',
        features: ['Urgent source location', 'Overheating component replacement', 'Wire insulation check', 'Load testing'],
        relatedBlogPosts: [],
        order: 11
    },
    {
        name: 'Storm Damage Electrical Repair',
        slug: 'storm-damage-electrical-repair',
        description: 'Repair weather-damaged electrical systems. From lightning strikes to flooded outlets and damaged service risers, we restore safety after the storm.',
        shortDescription: 'Repair electrical damage from storms',
        icon: emergencyPowerIcon,
        image: emergencyServiceImg,
        category: 'Emergency & Rapid Response',
        features: ['Lightning damage repair', 'Flood damage assessment', 'Service mast repair', 'Emergency generator hookup'],
        relatedBlogPosts: [],
        order: 12
    },

    // OUTLETS, SWITCHES & WIRING
    {
        name: 'New Outlet Installation & Repair',
        slug: 'new-outlet-installation-repair',
        description: 'Install new outlets exactly where you need them. We add convenience outlets, USB receptacles, and repair loose or dead plugs throughout your home.',
        shortDescription: 'Add or fix outlets for better convenience',
        icon: repairIcon,
        image: outletInstallImg,
        category: 'Outlets, Switches & Wiring',
        features: ['USB outlet upgrades', 'New circuit runs', 'Child-proof outlets', 'Outdoor GFCI outlets'],
        relatedBlogPosts: [],
        order: 13
    },
    {
        name: '220/240V Outlet Installation',
        slug: '240v-outlet-installation',
        description: 'Dedicated high-voltage circuits for heavy appliances. We install 240V outlets for dryers, electric stoves, air conditioners, heating units, and welders.',
        shortDescription: 'Power dryers, stoves, and AC units',
        icon: repairIcon,
        image: outletInstallImg,
        category: 'Outlets, Switches & Wiring',
        features: ['Dryer & stove hookups', 'Dedicated heavy-duty circuits', 'AC disconnects', 'Welder outlets'],
        relatedBlogPosts: [],
        order: 14
    },
    {
        name: 'GFCI Outlet Installation & Repair',
        slug: 'gfci-outlet-installation-repair',
        description: 'Essential shock protection for wet areas. We install and test GFCI outlets in kitchens, bathrooms, garages, and outdoors to meet code and keep you safe.',
        shortDescription: 'Shock protection for kitchens and baths',
        icon: repairIcon,
        image: outletInstallImg,
        category: 'Outlets, Switches & Wiring',
        features: ['Kitchen & bath safety', 'Outdoor weather-resistant GFCIs', 'Troubleshooting tripping GFCIs', 'Code compliance'],
        relatedBlogPosts: [],
        order: 15
    },
    {
        name: 'Light Switch Installation & Replacement',
        slug: 'light-switch-installation-replacement',
        description: 'Upgrade your switches for style and function. We install dimmers, timers, smart switches, and replace broken or toggle switches with modern rockers.',
        shortDescription: 'Update switches, dimmers, and timers',
        icon: smartHomeIcon,
        image: outletInstallImg,
        category: 'Outlets, Switches & Wiring',
        features: ['Dimmer switch installation', 'Smart switch upgrades', '3-way switch wiring', 'Timer switches'],
        relatedBlogPosts: [],
        order: 16
    },
    {
        name: 'Electrical Wiring Updates & Rewiring',
        slug: 'electrical-wiring-updates-rewiring',
        description: 'Update old, unsafe wiring. We replace knob-and-tube, aluminum, or ungrounded wiring with modern copper cabling for safety and reliability.',
        shortDescription: 'Replace old or unsafe wiring systems',
        icon: rewiringIcon,
        image: rewiringWorkImg,
        category: 'Outlets, Switches & Wiring',
        features: ['Whole-house rewiring', 'Grounding updates', 'Aluminum wire remediation', 'Knob & tube removal'],
        relatedBlogPosts: [],
        order: 17
    },
    {
        name: 'Home Electrical System Upgrade',
        slug: 'home-electrical-system-upgrade',
        description: 'Comprehensive upgrades for older homes. We modernize your entire electrical infrastructure to handle today\'s technology and safety standards.',
        shortDescription: 'Modernize older home electrical systems',
        icon: panelUpgradeIcon,
        image: rewiringWorkImg,
        category: 'Outlets, Switches & Wiring',
        features: ['Capacity planning', 'Device upgrades', 'Safety modernization', 'Renovation wiring'],
        relatedBlogPosts: [],
        order: 18
    },

    // LIGHTING & FIXTURES
    {
        name: 'Indoor & Outdoor Lighting Installation',
        slug: 'indoor-outdoor-lighting-installation',
        description: 'Transform your property with expert lighting installation. We install chandeliers, pendants, sconces, and security lights to enhance beauty and safety.',
        shortDescription: 'Install beautiful fixtures inside and out',
        icon: lightingIcon,
        image: landscapeLightingImg,
        category: 'Lighting & Fixtures',
        features: ['Chandelier hanging', 'Sconce installation', 'Security floodlights', 'Pathway lighting'],
        relatedBlogPosts: [],
        order: 19
    },
    {
        name: 'Recessed Lighting Installation',
        slug: 'recessed-lighting-installation',
        description: 'Modern, sleek, and efficient. We design and install recessed "can" lights to brighten rooms evenly without cluttering your ceilings.',
        shortDescription: 'Sleek pot lights for modern illumination',
        icon: lightingIcon,
        image: recessedLightingImg,
        category: 'Lighting & Fixtures',
        features: ['Layout design', 'LED wafer lights', 'Dimmer integration', 'Kitchen & living room focus'],
        relatedBlogPosts: [],
        order: 20
    },
    {
        name: 'LED Lighting Retrofit & Conversion',
        slug: 'led-lighting-retrofit-conversion',
        description: 'Save energy and improve light quality. We convert old fluorescent or incandescent fixtures to long-lasting, energy-efficient LED technology.',
        shortDescription: 'Save energy with efficient LED upgrades',
        icon: ledRetrofitIcon,
        image: recessedLightingImg,
        category: 'Lighting & Fixtures',
        features: ['Energy bill reduction', 'Better color rendering', 'Long-lifespan fixtures', 'Ballast bypass'],
        relatedBlogPosts: [],
        order: 21
    },
    {
        name: 'Landscape & Outdoor Lighting',
        slug: 'landscape-outdoor-lighting',
        description: 'Highlight your home\'s best features. We install low-voltage landscape lighting, deck lights, and garden illumination for curb appeal and security.',
        shortDescription: 'Enhance curb appeal and security at night',
        icon: lightingIcon,
        image: landscapeLightingImg,
        category: 'Lighting & Fixtures',
        features: ['Low-voltage systems', 'Tree & garden up-lighting', 'Path & deck lighting', 'Automated timers'],
        relatedBlogPosts: [],
        order: 22
    },
    {
        name: 'Ceiling Fan & Light Fixture Installation',
        slug: 'ceiling-fan-light-fixture-installation',
        description: 'Stay cool and lit. We securely mount and wire ceiling fans and light fixtures, even on high ceilings, ensuring wobble-free operation.',
        shortDescription: 'Expert mounting for fans and lights',
        icon: ceilingFanIcon,
        image: ceilingFanImg,
        category: 'Lighting & Fixtures',
        features: ['Beam mounting', 'Remote control setup', 'High-ceiling installation', 'Fan balancing'],
        relatedBlogPosts: [],
        order: 23
    },
    {
        name: 'Motion-Sensor & Dimmer Installation',
        slug: 'motion-sensor-dimmer-installation',
        description: 'Add convenience and automation. We install motion sensors for security and hands-free lighting, and dimmers for perfect ambiance control.',
        shortDescription: 'Automated control and mood lighting',
        icon: smartHomeIcon,
        image: recessedLightingImg,
        category: 'Lighting & Fixtures',
        features: ['Occupancy sensors', 'Outdoor motion security', 'LED-compatible dimmers', 'Smart dimmers'],
        relatedBlogPosts: [],
        order: 24
    },

    // SMART HOME & AUTOMATION
    {
        name: 'Smart Thermostat Installation',
        slug: 'smart-thermostat-installation',
        description: 'Eco-friendly climate control. We install and wire smart thermostats like Nest and Ecobee (including C-wire) for efficient HVAC management.',
        shortDescription: 'Install Nest, Ecobee, and smart controls',
        icon: smartHomeIcon,
        image: smartHomeImg2,
        category: 'Smart Home & Automation',
        features: ['C-wire installation', 'System compatibility check', 'App setup assistance', 'Energy saving setup'],
        relatedBlogPosts: [],
        order: 25
    },
    {
        name: 'Smart Lighting Installation',
        slug: 'smart-lighting-installation',
        description: 'Control your lights from anywhere. We install systems like Philips Hue, Lutron Caséta, and others for app and voice-controlled lighting.',
        shortDescription: 'App and voice-controlled home lighting',
        icon: smartHomeIcon,
        image: smartHomeImg2,
        category: 'Smart Home & Automation',
        features: ['Lutron & Hue systems', 'Voice control setup', 'Scene programming', 'Bridge installation'],
        relatedBlogPosts: [],
        order: 26
    },
    {
        name: 'Smart Switch Installation & Home Automation',
        slug: 'smart-switch-home-automation',
        description: 'Automate your entire home. We replace standard switches with smart ones, allowing you to schedule and control devices remotely.',
        shortDescription: 'Automate switches for remote control',
        icon: smartHomeIcon,
        image: outletInstallImg,
        category: 'Smart Home & Automation',
        features: ['Whole-home automation hubs', 'Remote scheduling', 'Voice integration', 'Vacation mode setup'],
        relatedBlogPosts: [],
        order: 27
    },
    {
        name: 'Ring Doorbell & Security Camera Wiring',
        slug: 'ring-doorbell-security-camera-wiring',
        description: 'Constant power for your security. We run wires for video doorbells and security cameras so you never have to worry about changing batteries.',
        shortDescription: 'Hardwired power for continuous security',
        icon: smartHomeIcon,
        image: securityCameraImg,
        category: 'Smart Home & Automation',
        features: ['Doorbell transformer upgrades', 'Camera power runs', 'Floodlight cam installation', 'Clean wire hiding'],
        relatedBlogPosts: [],
        order: 28
    },
    {
        name: 'Home Theater & Low-Voltage Wiring',
        slug: 'home-theater-low-voltage-wiring',
        description: 'Clean, hidden wiring for entertainment. We install surround sound wiring, mount TVs with hidden cables, and handle AV data lines.',
        shortDescription: 'Hidden wiring for TVs and audio',
        icon: smartHomeIcon,
        image: securityCameraImg,
        category: 'Smart Home & Automation',
        features: ['In-wall cable concealment', 'Speaker wiring', 'Projector setup', 'TV mounting prep'],
        relatedBlogPosts: [],
        order: 29
    },
    {
        name: 'Computer Network Outlet Installation',
        slug: 'computer-network-outlet-installation',
        description: 'Reliable internet everywhere. We run Cat6 ethernet cables and install network jacks for fast, hardwired internet connections in any room.',
        shortDescription: 'Hardwired ethernet for fast internet',
        icon: smartHomeIcon,
        image: outletInstallImg,
        category: 'Smart Home & Automation',
        features: ['Cat6/Cat6a cabling', 'Data jack installation', 'Home office setup', 'Gaming network drops'],
        relatedBlogPosts: [],
        order: 30
    },

    // EV CHARGING & GREEN ENERGY
    {
        name: 'Level 2 EV Charger Installation (240V)',
        slug: 'level-2-ev-charger-installation',
        description: 'Charge faster at home. We install dedicated 240V circuits and Level 2 chargers for Tesla, Bolt, Mustang Mach-E, and all other EVs.',
        shortDescription: 'Fast home charging for all EV models',
        icon: evChargerIcon,
        image: evChargerInstallImg,
        category: 'EV Charging & Green Energy',
        features: ['Tesla Wall Connector', 'NEMA 14-50 outlets', 'Load calculation', 'Permitted installation'],
        relatedBlogPosts: [],
        order: 31
    },
    {
        name: 'Level 3 DC Fast Charger Installation',
        slug: 'level-3-dc-fast-charger-installation',
        description: 'Rapid charging for commercial use. We install high-power DC fast charging stations for businesses, fleets, and public charging networks.',
        shortDescription: 'Commercial rapid charging infrastructure',
        icon: evChargerIcon,
        image: panelUpgrade200aImg,
        category: 'EV Charging & Green Energy',
        features: ['High-voltage connections', 'Transformer upgrades', 'Commercial station setup', 'Networked chargers'],
        relatedBlogPosts: [],
        order: 32
    },
    {
        name: 'Electric Vehicle Outlet Installation',
        slug: 'electric-vehicle-outlet-installation',
        description: 'Simple, effective charging. We install heavy-duty 240V outlets (like NEMA 14-50) ready for your mobile EV charging cable.',
        shortDescription: 'Install 240V outlets for mobile chargers',
        icon: evChargerIcon,
        image: outletInstallImg,
        category: 'EV Charging & Green Energy',
        features: ['Cost-effective charging', 'Universal compatibility', 'Garage & driveway runs', 'Heavy-duty receptacles'],
        relatedBlogPosts: [],
        order: 33
    },
    {
        name: 'Home EV Charging System Setup',
        slug: 'home-ev-charging-system-setup',
        description: 'Complete charging solutions. We assess your home\'s power, recommend the best charger, and provide a turnkey installation including panel upgrades.',
        shortDescription: 'Turnkey home charging solutions',
        icon: evChargerIcon,
        image: panelUpgrade200aImg,
        category: 'EV Charging & Green Energy',
        features: ['Load management systems', 'Panel capacity upgrades', 'Smart charger setup', 'Rebate documentation'],
        relatedBlogPosts: [],
        order: 34
    },
    {
        name: 'Commercial EV Charging Infrastructure',
        slug: 'commercial-ev-charging-infrastructure',
        description: 'Power your employees and fleet. We design and build scalable EV charging banks for offices, apartments, parking lots, and fleets.',
        shortDescription: 'Charging stations for businesses and fleets',
        icon: evChargerIcon,
        image: panelUpgrade200aImg,
        category: 'EV Charging & Green Energy',
        features: ['Multi-unit installations', 'Payment system integration', 'Power sharing setups', 'Fleet charging'],
        relatedBlogPosts: [],
        order: 35
    },
    {
        name: 'Solar Panel Electrical Integration',
        slug: 'solar-panel-electrical-integration',
        description: 'Connect solar to your system. We handle the electrical side of solar setups, including inverter connections, battery storage integration, and main panel tie-ins.',
        shortDescription: 'Integrate solar power and battery storage',
        icon: panelUpgradeIcon,
        image: evChargerInstallImg,
        category: 'EV Charging & Green Energy',
        features: ['Inverter wiring', 'Battery backup integration', 'Grid-tie connections', 'Disconnect switches'],
        relatedBlogPosts: [],
        order: 36
    },

    // BACKUP POWER & GENERATORS
    {
        name: 'Home Standby Generator Installation',
        slug: 'home-standby-generator-installation',
        description: 'Automatic power during outages. We install permanent standby generators (Generac, Kohler) that kick on automatically when the grid fails.',
        shortDescription: 'Automatic backup power for the whole home',
        icon: generatorIcon,
        image: generatorInstallImg,
        category: 'Backup Power & Generators',
        features: ['Concrete pad pouring', 'Fuel line coordination', 'Automatic transfer switch', 'Whole-home coverage'],
        relatedBlogPosts: [],
        order: 37
    },
    {
        name: 'Generator Maintenance & Service',
        slug: 'generator-maintenance-service',
        description: 'Keep your generator ready. We provide annual maintenance, oil changes, battery testing, and load bank testing to ensure it runs when you need it.',
        shortDescription: 'Routine service to ensure reliability',
        icon: maintenanceIcon,
        image: generatorInstallImg,
        category: 'Backup Power & Generators',
        features: ['Annual tune-ups', 'Battery replacement', 'Load bank testing', 'Oil & filter changes'],
        relatedBlogPosts: [],
        order: 38
    },
    {
        name: 'Portable Generator Hookup',
        slug: 'portable-generator-hookup',
        description: 'Safely use your portable generator. We install manual transfer switches and generator inlet boxes (interlocks) so you can power your house safely without extension cords.',
        shortDescription: 'Safe transfer switches for portable units',
        icon: generatorIcon,
        image: generatorInstallImg,
        category: 'Backup Power & Generators',
        features: ['Interlock kit installation', 'Inlet box wiring', 'Manual transfer switches', 'Cord provision'],
        relatedBlogPosts: [],
        order: 39
    },
    {
        name: 'Automatic Transfer Switch Installation',
        slug: 'automatic-transfer-switch-installation',
        description: 'Seamless power switching. We install automatic transfer switches (ATS) that detect outages and switch your home to generator power instantly.',
        shortDescription: 'Instantly switch to backup power',
        icon: generatorIcon,
        image: outletInstallImg,
        category: 'Backup Power & Generators',
        features: ['Seamless transition', 'Utility isolation', 'Safety compliance', 'Circuit priority setup'],
        relatedBlogPosts: [],
        order: 40
    },
    {
        name: 'Generator Sizing & Load Analysis',
        slug: 'generator-sizing-load-analysis',
        description: 'Get the right size. We perform detailed load calculations to determine exactly what size generator you need to run your essential life support or whole home.',
        shortDescription: 'Calculate the perfect generator size',
        icon: maintenanceIcon,
        image: generatorInstallImg,
        category: 'Backup Power & Generators',
        features: ['Power usage audit', 'Start-up load calculation', 'Fuel requirement estimation', 'Cost-benefit analysis'],
        relatedBlogPosts: [],
        order: 41
    },
    {
        name: 'Emergency Power System Design',
        slug: 'emergency-power-system-design',
        description: 'Custom resilient power. We design complex backup solutions involving generators, batteries, and solar to ensure your critical systems never go down.',
        shortDescription: 'Custom resilient power solutions',
        icon: emergencyPowerIcon,
        image: emergencyServiceImg,
        category: 'Backup Power & Generators',
        features: ['Redundant systems', 'Battery + Generator hybrid', 'Critical load segmentation', 'Disaster planning'],
        relatedBlogPosts: [],
        order: 42
    },

    // SPECIALTY & OUTDOOR SERVICES
    {
        name: 'Hot Tub & Spa Electrical Installation',
        slug: 'hot-tub-spa-installation',
        description: 'Power your relaxation. We wire hot tubs, spas, and jacuzzis, installing the necessary heavy-duty disconnects and GFCI protection for safety.',
        shortDescription: 'Safe wiring for hot tubs and spas',
        icon: repairIcon,
        image: hotTubWiringImg,
        category: 'Specialty & Outdoor Services',
        features: ['50A/60A dedicated circuits', 'Emergency disconnects', 'Waterproof wiring', 'Bonding & grounding'],
        relatedBlogPosts: [],
        order: 43
    },
    {
        name: 'Pool & Spa Wiring & Inspection',
        slug: 'pool-spa-wiring-inspection',
        description: 'Safe swimming. We wire pool pumps, heaters, and lights, and inspect existing setups to prevent dangerous stray voltage and shock hazards.',
        shortDescription: 'Pool pumps, heaters, and safety checks',
        icon: maintenanceIcon,
        image: hotTubWiringImg,
        category: 'Specialty & Outdoor Services',
        features: ['Pump & heater wiring', 'Underwater lighting', 'Equipotential bonding', 'Pool panel installation'],
        relatedBlogPosts: [],
        order: 44
    },
    {
        name: 'Sauna & Steam Room Electrical',
        slug: 'sauna-steam-room-electrical',
        description: 'Heat up safely. We provide specialized wiring for electric saunas and steam generators, handling the high heat and moisture requirements.',
        shortDescription: 'Wiring for saunas and steam rooms',
        icon: repairIcon,
        image: hotTubWiringImg,
        category: 'Specialty & Outdoor Services',
        features: ['Heat-resistant wiring', 'Steam generator hookups', 'Control panel install', 'Safety cutoffs'],
        relatedBlogPosts: [],
        order: 45
    },
    {
        name: 'Holiday Lighting Installation & Removal',
        slug: 'holiday-lighting-installation-removal',
        description: 'Festive and bright. We provide professional holiday lighting setup, ensuring safe connections and beautiful displays without overloading your circuits.',
        shortDescription: 'Professional holiday light setup',
        icon: lightingIcon,
        image: landscapeLightingImg,
        category: 'Specialty & Outdoor Services',
        features: ['Custom design', 'Safe electrical distribution', 'Timer automation', 'Post-season removal'],
        relatedBlogPosts: [],
        order: 46
    },
    {
        name: 'Outdoor Waterproof Outlet Installation',
        slug: 'outdoor-waterproof-outlet-installation',
        description: 'Power outdoors, rain or shine. We install durable, weather-rated outlets and "in-use" covers for gardens, patios, and exterior walls.',
        shortDescription: 'Weather-rated outlets for outdoors',
        icon: repairIcon,
        image: outletInstallImg,
        category: 'Specialty & Outdoor Services',
        features: ['Weatherproof covers', 'GFCI protection', 'Garden power points', 'Patio heater power'],
        relatedBlogPosts: [],
        order: 47
    },
    {
        name: 'Dock & Marina Electrical Services',
        slug: 'dock-marina-electrical-services',
        description: 'Marine-grade electrical. We install shore power pedestals, dock lighting, and boat lift wiring, following strict codes for water safety.',
        shortDescription: 'Shore power and dock lighting',
        icon: emergencyPowerIcon,
        image: hotTubWiringImg,
        category: 'Specialty & Outdoor Services',
        features: ['Shore power pedestals', 'Boat lift motors', 'Marine lighting', 'Stray voltage testing'],
        relatedBlogPosts: [],
        order: 48
    },

    // COMMERCIAL & INDUSTRIAL
    {
        name: 'Commercial Panel Installation & Upgrades',
        slug: 'commercial-panel-installation-upgrades',
        description: 'Power your business. We install high-capacity 3-phase panels and distribution boards for offices, retail spaces, and industrial facilities.',
        shortDescription: 'High-capacity panels for business',
        icon: panelUpgradeIcon,
        image: commercialPanelImg,
        category: 'Commercial & Industrial',
        features: ['3-phase panelboards', 'Main distribution frames', 'Subpanel expansion', 'Circuit mapping'],
        relatedBlogPosts: [],
        order: 49
    },
    {
        name: 'Tenant Build-Out Electrical Work',
        slug: 'tenant-build-out-electrical-work',
        description: 'Customize your space. We handle complete electrical build-outs for new retail, office, or restaurant tenants, from rough-in to final trim.',
        shortDescription: 'Electrical for new lease spaces',
        icon: rewiringIcon,
        image: commercialPanelImg,
        category: 'Commercial & Industrial',
        features: ['Office layout wiring', 'Retail lighting display', 'Data cabling', 'Permit management'],
        relatedBlogPosts: [],
        order: 50
    },
    {
        name: 'Commercial LED Lighting Retrofit',
        slug: 'commercial-led-lighting-retrofit',
        description: 'Cut overhead costs. Upgrade warehouse, office, or parking lot lighting to LED to reduce energy consumption and maintenance costs significantly.',
        shortDescription: 'LED upgrades for offices and warehouses',
        icon: ledRetrofitIcon,
        image: recessedLightingImg,
        category: 'Commercial & Industrial',
        features: ['High-bay lighting', 'Office trotters', 'Motion control', 'Energy rebate assistance'],
        relatedBlogPosts: [],
        order: 51
    },
    {
        name: 'High-Voltage Electrical Services',
        slug: 'high-voltage-electrical-services',
        description: 'Heavy industrial power. We install and maintain high-voltage equipment, transformers, and switchgear for industrial applications.',
        shortDescription: 'Industrial transformers and switchgear',
        icon: emergencyPowerIcon,
        image: commercialPanelImg,
        category: 'Commercial & Industrial',
        features: ['Transformer installation', 'Switchgear maintenance', 'High-voltage termination', 'Power distribution'],
        relatedBlogPosts: [],
        order: 52
    },
    {
        name: 'Three-Phase Power Installation',
        slug: 'three-phase-power-installation',
        description: 'Efficient motor power. We install and balance 3-phase power systems for industrial motors, HVAC units, and heavy machinery.',
        shortDescription: 'Power for industrial motors and HVAC',
        icon: panelUpgradeIcon,
        image: commercialPanelImg,
        category: 'Commercial & Industrial',
        features: ['Motor controls', 'Phase balancing', 'Soft starts', 'Variable Frequency Drives (VFD)'],
        relatedBlogPosts: [],
        order: 53
    },
    {
        name: 'Commercial GFCI & Safety Compliance',
        slug: 'commercial-gfci-safety-compliance',
        description: 'Keep workers safe. We install required GFCI protection and safety disconnects in commercial kitchens, bathrooms, and work areas.',
        shortDescription: 'Workplace electrical safety compliance',
        icon: fireSafetyIcon,
        image: gfciOutletImg,
        category: 'Commercial & Industrial',
        features: ['Kitchen safety power', 'Bathrooms & wet locations', 'OSHA compliance', 'Safety audits'],
        relatedBlogPosts: [],
        order: 54
    },
    {
        name: 'Parking Lot & Security Lighting',
        slug: 'parking-lot-security-lighting',
        description: 'Bright and safe exteriors. We install and repair pole lights, wall packs, and security lighting for parking lots and building perimeters.',
        shortDescription: 'Pole lights and perimeter security',
        icon: lightingIcon,
        image: landscapeLightingImg,
        category: 'Commercial & Industrial',
        features: ['Pole light bucket truck service', 'LED area lighting', 'Photocell control', 'Security floodlights'],
        relatedBlogPosts: [],
        order: 55
    },
    {
        name: 'Exit & Emergency Lighting Systems',
        slug: 'exit-emergency-lighting-systems',
        description: 'Mandatory safety lighting. We install, test, and repair illuminated exit signs and emergency backup lights to meet fire codes.',
        shortDescription: 'Code-compliant exit and backup lights',
        icon: fireSafetyIcon,
        image: emergencyServiceImg,
        category: 'Commercial & Industrial',
        features: ['90-minute burn testing', 'Battery replacement', 'Exit sign installation', 'Code inspection'],
        relatedBlogPosts: [],
        order: 56
    },

    // INSPECTION & CODE COMPLIANCE
    {
        name: 'Home Electrical Inspection & Certification',
        slug: 'home-electrical-inspection-certification',
        description: 'Know your home\'s health. A complete audit of your electrical system to identify hazards, wear, and code issues.',
        shortDescription: 'Full system health and safety check',
        icon: maintenanceIcon,
        image: inspectionWorkImg,
        category: 'Inspection & Code Compliance',
        features: ['Panel interior check', 'Grounding test', 'Outlet polarity check', 'Written report'],
        relatedBlogPosts: [],
        order: 57
    },
    {
        name: 'Pre-Purchase Electrical Inspection',
        slug: 'pre-purchase-electrical-inspection',
        description: 'Buy with confidence. We inspect the electrical system of homes you\'re considering buying so you aren\'t surprised by expensive repair bills later.',
        shortDescription: 'Inspect before you buy a new home',
        icon: maintenanceIcon,
        image: inspectionWorkImg,
        category: 'Inspection & Code Compliance',
        features: ['Buyer advisory', 'Repair cost estimation', 'Major hazard check', 'Negotiation leverage reports'],
        relatedBlogPosts: [],
        order: 58
    },
    {
        name: 'Electrical Code Compliance Audit',
        slug: 'electrical-code-compliance-audit',
        description: 'Pass your inspections. We review your property against current local and NEC codes to find and fix violations before the city inspector does.',
        shortDescription: 'Find and fix code violations',
        icon: rewiringIcon,
        image: rewiringWorkImg,
        category: 'Inspection & Code Compliance',
        features: ['NEC code verification', 'Violation correction plan', 'City inspection prep', 'Safety updates'],
        relatedBlogPosts: [],
        order: 59
    },
    {
        name: 'Electrical Safety Inspection',
        slug: 'electrical-safety-inspection',
        description: 'Focus on safety. We specifically look for fire hazards, shock risks, and dangerous DIY wiring to keep your family or tenants safe.',
        shortDescription: 'Identify fire and shock hazards',
        icon: fireSafetyIcon,
        image: inspectionWorkImg,
        category: 'Inspection & Code Compliance',
        features: ['Thermal scanning', 'Wiring age assessment', 'Smoke detector check', 'Hazard elimination'],
        relatedBlogPosts: [],
        order: 60
    },
    {
        name: 'Real Estate Inspection Services',
        slug: 'real-estate-inspection-services',
        description: 'For agents and sellers. Fast troubleshooting and repair estimates for issues flagged in home inspection reports to keep closings on track.',
        shortDescription: 'Fast repairs for closing deals',
        icon: maintenanceIcon,
        image: inspectionWorkImg,
        category: 'Inspection & Code Compliance',
        features: ['Inspection objection resolution', 'Quick estimates', 'Licensed certifications', 'Closing deadline priority'],
        relatedBlogPosts: [],
        order: 61
    },
    {
        name: 'Insurance Electrical Inspection',
        slug: 'insurance-electrical-inspection',
        description: ' satisfy your insurer. We provide the "4-point" or electrical system certifications often required by insurance companies for older homes.',
        shortDescription: 'Certifications for insurance policies',
        icon: maintenanceIcon,
        image: inspectionWorkImg,
        category: 'Inspection & Code Compliance',
        features: ['4-point inspection assist', 'Aluminum wire letters', 'Amp service verification', 'Insurability reports'],
        relatedBlogPosts: [],
        order: 62
    },
    {
        name: 'Permit Application & Inspection Coordination',
        slug: 'permit-application-inspection-coordination',
        description: 'We handle the paperwork. We pull all necessary electrical permits and meet the city inspectors so you don\'t have to worry about red tape.',
        shortDescription: 'We handle permits and city inspections',
        icon: rewiringIcon,
        image: inspectionWorkImg,
        category: 'Inspection & Code Compliance',
        features: ['Permit filing', 'Drawing submission', 'Inspector scheduling', 'Final sign-off'],
        relatedBlogPosts: [],
        order: 63
    }
];

export const getFeaturedServices = () => {
    // Return a curated list of services to cover different categories
    // Fallback strategy: Pick one service from major categories
    const categoriesToFeature: ServiceCategory[] = [
        'Panel & Electrical Upgrades',
        'Emergency & Rapid Response',
        'EV Charging & Green Energy',
        'Backup Power & Generators',
        'Lighting & Fixtures',
        'Smart Home & Automation'
    ];

    return categoriesToFeature.map(cat => services.find(s => s.category === cat)!).filter(Boolean);
};

export const getCategoryInfo = (category: ServiceCategory) => {
    // Find the first service in this category to use its icon and get a description
    const representativeService = services.find(s => s.category === category);
    return {
        name: category,
        icon: representativeService?.icon,
        slug: category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/,/g, ''), // Simple slugify
        description: `Complete ${category.toLowerCase()} solutions for your home and business.`,
        image: categoryImages[category]
    };
};
