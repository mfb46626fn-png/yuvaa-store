export interface SMSPayload {
    to: string;
    message: string;
}

export async function sendSMS({ to, message }: SMSPayload): Promise<boolean> {
    // START: Provider Configuration
    // In the future, you will switch here based on process.env.SMS_PROVIDER
    const provider = process.env.SMS_PROVIDER || "MOCK"; // 'NETGSM', 'TWILIO', 'MOCK'
    // END: Provider Configuration

    console.log(`[SMS-SERVICE] Preparing to send to ${to} via ${provider}`);

    try {
        if (provider === "NETGSM") {
            // TODO: Implement Netgsm API call
            // await fetch('https://api.netgsm.com.tr/...', { ... })
            console.log(`[NETGSM] Sending: "${message}" to ${to}`);
            return true;
        }

        if (provider === "TWILIO") {
            // TODO: Implement Twilio API call
            console.log(`[TWILIO] Sending: "${message}" to ${to}`);
            return true;
        }

        // Default: MOCK
        console.log(`--------------------------------------------------`);
        console.log(`📱 [MOCK SMS] To: ${to}`);
        console.log(`💬 Message: ${message}`);
        console.log(`--------------------------------------------------`);
        return true;

    } catch (error) {
        console.error("[SMS-SERVICE] Failed to send SMS:", error);
        return false;
    }
}
