
export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.formData();
        const serviceType = data.get('serviceType');
        const serviceDetails = data.get('serviceDetails');
        const address = data.get('address');
        const aptUnit = data.get('aptUnit');
        const gateCode = data.get('gateCode');
        const urgency = data.get('urgency');
        const name = data.get('name');
        const phone = data.get('phone');
        const email = data.get('email');

        // TODO: Verify reCAPTCHA token here when key is provided

        // SMTP2GO Email Sending logic
        // const smtp2goKey = import.meta.env.SMTP2GO_API_KEY; 

        // Placeholder until keys are provided
        // This simulates a successful request for frontend development
        console.log('Form received:', {
            serviceType, address, name, phone
        });

        return new Response(
            JSON.stringify({
                message: 'Success! Your request has been received.',
            }),
            { status: 200 }
        );

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return new Response(
                JSON.stringify({
                    message: error.message,
                }),
                { status: 500 }
            );
        }
        return new Response(
            JSON.stringify({
                message: 'Unknown error',
            }),
            { status: 500 }
        );
    }
};
