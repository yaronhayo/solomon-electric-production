
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
    'Electrical Panels & Power Systems': 'Ensure your property is hurricane-ready and code-compliant. Since 2008, we\'ve modernized 100A and 200A panels across Miami, providing the capacity needed for modern appliances and whole-home surge protection.',
    'Emergency Electrical Services': 'Sparking outlets, burning smells, or total blackouts? Our 24/7 rapid-response team is on call throughout Miami-Dade and Broward to keep your family safe from electrical fire hazards.',
    'EV Charging & Solar': 'Future-proof your South Florida home with Level 2 EV charging and solar-ready infrastructure. We handle the complex permitting and FPL coordination so you don\'t have to.',
    'Outlets, Switches & Wiring': 'From resolving flickering lights to whole-home rewiring, we eliminate the risks of aging electrical systems. We use commercial-grade components for residential reliability.',
    'Lighting & Smart Home': 'Enhance your security and efficiency with intelligent lighting. We specialize in LED retrofits and smart home integration that withstands the Florida humidity.',
    'Commercial & Inspections': 'Keep your business running and insurance-compliant. We provide comprehensive safety inspections, three-phase power solutions, and verified code certifications.'
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
