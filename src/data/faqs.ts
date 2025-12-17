export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

export const faqs: FAQ[] = [
    {
        id: "1",
        question: "How quickly can you respond to electrical emergencies?",
        answer: "We offer true 24/7 emergency electrical service throughout Miami-Dade and Broward counties. Our average response time is under 60 minutes for emergency calls. When you have a power outage, sparking outlet, burning smell, or any other urgent electrical issue, call us immediately at (786) 833-9211 and we'll dispatch a licensed electrician to your location right away.",
        category: "Emergency Services"
    },
    {
        id: "2",
        question: "Do you offer free estimates?",
        answer: "Yes! We provide free, no-obligation estimates for all electrical projects including panel upgrades, rewiring, generator installations, EV charger setups, lighting installations, and more. For emergency repairs, we'll provide an upfront diagnosis and quote before beginning any work. Contact us to schedule your free estimate - we'll assess your needs and provide transparent pricing with no hidden fees.",
        category: "Pricing"
    },
    {
        id: "3",
        question: "What areas do you serve in South Florida?",
        answer: "We proudly serve all of Miami-Dade and Broward counties including Miami, Fort Lauderdale, Miami Beach, Coral Springs, Pembroke Pines, Hollywood, Miramar, Hialeah, Homestead, Boca Raton, Pompano Beach, West Palm Beach, and surrounding areas. Our service radius covers approximately 60 miles from our main dispatch center, ensuring prompt response times throughout South Florida.",
        category: "Service Areas"
    },
    {
        id: "4",
        question: "Are you licensed and insured?",
        answer: "Absolutely. Solomon Electric is fully licensed by the State of Florida (License #EC13012345) and maintains comprehensive liability insurance and workers' compensation coverage. All our electricians are certified, background-checked, and undergo continuous education to stay current with the latest electrical codes and technologies. We're also NFPA 70® (National Electrical Code) compliant on all installations.",
        category: "Credentials"
    },
    {
        id: "5",
        question: "What types of electrical problems do you fix?",
        answer: "We handle all residential, commercial, and industrial electrical issues including: tripped breakers, dead outlets, flickering lights, burning smells, sparking switches, power outages, electrical panel problems, wiring issues, GFCI/AFCI trips, overloaded circuits, faulty fixtures, and more. Our electricians use advanced diagnostic equipment to quickly identify problems and implement lasting solutions. No job is too big or small.",
        category: "Services"
    },
    {
        id: "6",
        question: "How long does a typical electrical service call take?",
        answer: "Service times vary based on the complexity of the work. Simple repairs like outlet replacements or switch installations typically take 30-60 minutes. More complex jobs like panel upgrades (4-8 hours), whole-home rewiring (3-5 days), or generator installations (1-2 days) require more time. During your free estimate, we'll provide a detailed timeline for your specific project and work efficiently to minimize disruption to your home or business.",
        category: "Timeline"
    }
];
