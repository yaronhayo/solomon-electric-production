
import { getCollection } from 'astro:content';
import {
    CircuitBoard,
    Zap,
    Smartphone,
    Lightbulb,
    Fan,
    Siren,
    ClipboardCheck,
    ShieldAlert,
    Wrench,
    Cable
} from 'lucide-astro';

import panelUpgradeImg from '../assets/images/services/panel-work.png';
import emergencyImg from '../assets/images/services/emergency.png';
import wiringImg from '../assets/images/services/wiring.png';
import lightingImg from '../assets/images/services/lighting.png';
import evChargingImg from '../assets/images/services/ev-charging.png';
import commercialImg from '../assets/images/services/commercial.png';

export type ServiceCategory =
    | 'Electrical Panels & Power Systems'
    | 'Emergency Electrical Services'
    | 'EV Charging & Solar'
    | 'Outlets, Switches & Wiring'
    | 'Lighting & Smart Home'
    | 'Commercial & Inspections';

export const serviceCategories: ServiceCategory[] = [
    'Electrical Panels & Power Systems',
    'Emergency Electrical Services',
    'EV Charging & Solar',
    'Outlets, Switches & Wiring',
    'Lighting & Smart Home',
    'Commercial & Inspections'
];

export const categoryImages: Record<ServiceCategory, ImageMetadata> = {
    'Electrical Panels & Power Systems': panelUpgradeImg,
    'Emergency Electrical Services': emergencyImg,
    'EV Charging & Solar': evChargingImg,
    'Outlets, Switches & Wiring': wiringImg,
    'Lighting & Smart Home': lightingImg,
    'Commercial & Inspections': commercialImg
};

export const categoryDescriptions: Record<ServiceCategory, string> = {
    'Electrical Panels & Power Systems': 'Upgrade your electrical infrastructure with panel upgrades, generator installations, and whole-home surge protection. Our licensed electricians ensure your Miami home or business has the power capacity it needs—safely and up to code.',
    'Emergency Electrical Services': 'Electrical emergencies don\'t wait—and neither do we. Our team is available 24/7 for power outages, sparking outlets, burning smells, and storm damage repair throughout Miami-Dade and Broward counties.',
    'EV Charging & Solar': 'Future-proof your property with electric vehicle charging stations and solar panel integration. From home Level 2 chargers to commercial EV infrastructure, we handle permits, installation, and FPL coordination.',
    'Outlets, Switches & Wiring': 'From new outlet installation to whole-home rewiring, we handle all residential and commercial wiring needs. Includes outdoor outlets, GFCI protection, pool/spa wiring, and specialty installations.',
    'Lighting & Smart Home': 'Transform your space with modern lighting solutions and smart home automation. LED retrofits, recessed lighting, ceiling fans, smart switches, security cameras, and home theater wiring.',
    'Commercial & Inspections': 'Comprehensive commercial electrical services and code compliance inspections. Three-phase power, tenant build-outs, safety certifications, real estate inspections, and FPL coordination.'
};

type ImageMetadata = typeof panelUpgradeImg;

// Map string icon names from JSON to Lucide components
export const iconMap: Record<string, any> = {
    'CircuitBoard': CircuitBoard,
    'Zap': Zap,
    'Smartphone': Smartphone,
    'Lightbulb': Lightbulb,
    'Fan': Fan,
    'Siren': Siren,
    'ClipboardCheck': ClipboardCheck,
    'ShieldAlert': ShieldAlert,
    'Wrench': Wrench,
    'Cable': Cable,
    // Add legacy mappings
    'panelUpgradeIcon': CircuitBoard,
    'evChargerIcon': Zap,
    'smartHomeIcon': Smartphone,
    'generatorIcon': Zap,
    'lightingIcon': Lightbulb,
    'ceilingFanIcon': Fan,
    'emergencyPowerIcon': Siren,
    'ledRetrofitIcon': Lightbulb,
    'maintenanceIcon': ClipboardCheck,
    'fireSafetyIcon': ShieldAlert,
    'repairIcon': Wrench,
    'rewiringIcon': Cable
};

export const getServices = async () => {
    const services = await getCollection('services');
    const sorted = services.sort((a, b) => a.data.order - b.data.order);
    
    return sorted.map(s => ({
        ...s.data,
        icon: iconMap[s.data.icon] || Wrench, // Resolve string to component
        // slug property is in data
    }));
};

export const getFeaturedServices = async () => {
    // Return a curated list of services to cover different categories
    // Fallback strategy: Pick one service from major categories
    const categoriesToFeature: ServiceCategory[] = [
        'Electrical Panels & Power Systems',
        'Emergency Electrical Services',
        'EV Charging & Solar',
        'Outlets, Switches & Wiring',
        'Lighting & Smart Home',
        'Commercial & Inspections'
    ];

    const services = await getServices();
    
    return categoriesToFeature.map(cat => services.find(s => s.category === cat)!).filter(Boolean);
};

export const getCategoryInfo = async (category: ServiceCategory) => {
    // Find the first service in this category to use its icon and get a description
    const services = await getServices();
    const representativeService = services.find(s => s.category === category);
    
    // Icon is already resolved in getServices
    const iconComponent = representativeService?.icon || Wrench;

    return {
        name: category,
        icon: iconComponent,
        slug: category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/,/g, ''), // Simple slugify
        description: categoryDescriptions[category],
        image: categoryImages[category]
    };
};

/**
 * Helper to resolve the icon component for a service entry
 */
export const getServiceIcon = (serviceEntry: any) => {
    const iconName = serviceEntry.data.icon;
    return iconMap[iconName] || Wrench;
};
