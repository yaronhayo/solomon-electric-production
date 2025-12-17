export interface Review {
    id: string;
    author: string;
    rating: 5 | 4 | 3 | 2 | 1;
    text: string;
    date: string;
    service?: string;
}

export const reviews: Review[] = [
    {
        id: "1",
        author: "Michael Rodriguez",
        rating: 5,
        text: "Incredible service! Solomon Electric came out at 2 AM for an emergency panel issue. The electrician was professional, fixed everything quickly, and explained exactly what went wrong. Can't recommend them enough for 24/7 reliability.",
        date: "2024-12-10",
        service: "Emergency Repair"
    },
    {
        id: "2",
        author: "Jennifer Martinez",
        rating: 5,
        text: "We had a Tesla Wall Connector installed and the team was fantastic. They assessed our electrical panel, recommended an upgrade to handle the load, and completed everything in one day. Very knowledgeable about EV charging requirements.",
        date: "2024-12-08",
        service: "EV Charging Installation"
    },
    {
        id: "3",
        author: "David Chen",
        rating: 5,
        text: "Best electrical company in Miami! They upgraded our entire smart home system - from lighting to security. The technicians were on time, clean, and took the time to show us how everything worked. Worth every penny.",
        date: "2024-12-05",
        service: "Smart Home Integration"
    },
    {
        id: "4",
        author: "Sarah Thompson",
        rating: 5,
        text: "Our commercial property needed a complete electrical panel modernization. Solomon Electric handled the project professionally, worked around our business hours, and finished ahead of schedule. Zero downtime for our operations. Highly recommended!",
        date: "2024-12-03",
        service: "Panel Upgrade"
    },
    {
        id: "5",
        author: "Carlos Ramirez",
        rating: 5,
        text: "Had multiple ceiling fans installed throughout our new home. The installation was flawless - perfectly balanced, quiet operation, and they even helped us pick the right models for each room. True professionals.",
        date: "2024-11-28",
        service: "Ceiling Fan Installation"
    },
    {
        id: "6",
        author: "Lisa Park",
        rating: 5,
        text: "Emergency generator installation saved us during the last hurricane. Solomon Electric sized everything perfectly, installed the automatic transfer switch, and tested it thoroughly. Peace of mind knowing we'll never lose power again!",
        date: "2024-11-25",
        service: "Generator Installation"
    },
    {
        id: "7",
        author: "Robert Williams",
        rating: 5,
        text: "Fantastic experience with our whole-home LED retrofit. They replaced every light in our commercial building and we're already seeing 60% lower electric bills. The lighting quality is better too. Great ROI!",
        date: "2024-11-20",
        service: "LED Retrofit"
    },
    {
        id: "8",
        author: "Amanda Foster",
        rating: 5,
        text: "We needed landscape lighting for our property and Solomon Electric designed something beautiful. The outdoor lighting highlights our landscaping perfectly and makes our home so much more inviting at night. Absolutely love it!",
        date: "2024-11-15",
        service: "Lighting Design"
    },
    {
        id: "9",
        author: "James Peterson",
        rating: 5,
        text: "Old home rewiring project - they were amazing! Replaced all the old knob-and-tube wiring, brought everything up to code, and were respectful of our home throughout the process. Very fair pricing for such extensive work.",
        date: "2024-11-12",
        service: "Rewiring & Code Compliance"
    },
    {
        id: "10",
        author: "Maria Gonzalez",
        rating: 5,
        text: "Fire safety system installation for our restaurant. They installed fire alarms, emergency lighting, and integrated everything with our sprinkler system. Passed inspection on the first try. Very thorough and professional team.",
        date: "2024-11-08",
        service: "Fire Safety Systems"
    },
    {
        id: "11",
        author: "Thomas Anderson",
        rating: 5,
        text: "Preventive maintenance contract has been excellent. They come quarterly, check everything, and catch small issues before they become big problems. Our commercial facility has had zero electrical downtime since signing up.",
        date: "2024-11-05",
        service: "Preventive Maintenance"
    },
    {
        id: "12",
        author: "Emily Rodriguez",
        rating: 5,
        text: "Needed urgent electrical diagnostics for flickering lights throughout our office. They found a loose connection in the main panel that could have been dangerous. Fast response, expert troubleshooting, and fair pricing. Will use again!",
        date: "2024-11-01",
        service: "Electrical Repair"
    }
];
