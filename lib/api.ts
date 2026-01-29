import { CustomerInfo, APIResponse } from "@/types";

export const claimReward = async (data: CustomerInfo): Promise<APIResponse> => {
    const url = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (!url) {
        throw new Error("Missing NEXT_PUBLIC_APPS_SCRIPT_URL");
    }

    try {
        // GAS Web App requires 'no-cors' for simple HTML forms, but we need JSON response.
        // For local dev with CORS issues, we might mock it or use a proxy. 
        // However, GAS Web Apps *do* support CORS if deployed correctly as 'Anyone'.
        // We send payload as text/plain to avoid preflight OPTIONs if possible, or application/json.
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8", // Trick to avoid CORS preflight sometimes
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        return { status: 'error', error: 'Kết nối mạng không ổn định.' };
    }
};
