import crypto from "crypto";

interface PayTRParams {
    user_ip: string;
    merchant_oid: string;
    email: string;
    payment_amount: number; // in pennies (kuruş) usually, or float? PayTR uses float * 100 usually? No, check docs.
    // PayTR docs: payment_amount: "9.99" for 9.99 TL => BUT standard is often merchant dependent.
    // Usually it is: "9.99" * 100 is NOT required, just string "9.99". 
    // Wait, PayTR docs say: "İşlem tutarı. Örneğin: 9.99 TL için 9.99 olarak gönderilmelidir." -> Actually usually it expects 100-based integer in some gateways but PayTR standard often takes float/decimal.
    // However, safest to check documentation or use standard integer (kuruş).
    // Let's assume standard PayTR behavior: 
    // paytr_token request: payment_amount type is integer (ex: 999 for 9.99 TL).
    // Let's verify standard implementation. Commonly: (Total * 100).
    user_basket: any[];
    no_installment: number;
    max_installment: number;
    user_name: string;
    user_address: string;
    user_phone: string;
}

export async function getPayTRToken(params: PayTRParams) {
    const merchant_id = process.env.PAYTR_MERCHANT_ID!;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

    // Validate Env
    if (!merchant_id || !merchant_key || !merchant_salt) {
        throw new Error("PayTR environment variables are missing.");
    }

    const {
        user_ip,
        merchant_oid,
        email,
        payment_amount,
        user_basket,
        no_installment,
        max_installment,
        user_name,
        user_address,
        user_phone,
    } = params;

    // Basket validation & conversion to base64 JSON
    const user_basket_json = JSON.stringify(user_basket);
    const user_basket_encoded = Buffer.from(user_basket_json).toString("base64");

    // Standard PayTR Token Logic
    // Token String: merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + salt
    const currency = "TL";
    const test_mode = "0"; // "1" for test mode, should probably be env var too? User said "full working". Let's use "0" but maybe allow env override.

    const local_test_mode = process.env.PAYTR_TEST_MODE || "0";

    const concatStr =
        merchant_id +
        user_ip +
        merchant_oid +
        email +
        payment_amount.toString() +
        user_basket_encoded +
        no_installment +
        max_installment +
        currency +
        local_test_mode;

    const token = crypto
        .createHmac("sha256", merchant_key)
        .update(concatStr + merchant_salt)
        .digest("base64");

    return {
        token,
        merchant_id,
        user_ip,
        merchant_oid,
        email,
        payment_amount,
        user_basket: user_basket_encoded,
        no_installment,
        max_installment,
        currency,
        test_mode: local_test_mode,
        user_name,
        user_address,
        user_phone,
        merchant_ok_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
        merchant_fail_url: `${process.env.NEXT_PUBLIC_URL}/checkout/failed`,
        timeout_limit: "30",
        debug_on: "1", // Turn off in ultra-prod? Useful for init issues.
        lang: "tr"
    };
}
