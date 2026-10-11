/**
 * Tech Indro Resend Email Service
 * High-performance email dispatch via Resend REST API (Vercel & Node compatible)
 */

const RESEND_API_URL = 'https://api.resend.com/emails';

async function sendEmail({ to, subject, html, text }) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.EMAIL_FROM || 'Tech Indro <onboarding@resend.dev>';

    if (!apiKey) {
        console.warn('[Resend] RESEND_API_KEY not configured in environment variables.');
        return { success: false, error: 'RESEND_API_KEY is missing' };
    }

    try {
        const response = await fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromAddress,
                to: Array.isArray(to) ? to : [to],
                subject,
                html,
                text: text || subject
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[Resend] Error sending email:', data);
            return { success: false, error: data.message || 'Failed to send email', details: data };
        }

        console.log(`[Resend] Email sent successfully to ${to} (ID: ${data.id})`);
        return { success: true, id: data.id };
    } catch (err) {
        console.error('[Resend] Network / Dispatch error:', err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Send branded OTP verification email
 */
async function sendOtpEmail(email, otp, studentName = 'Tech Indro Student') {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Tech Indro Verification Code</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0f17; color: #f1f5f9; margin: 0; padding: 24px; }
        .card { max-width: 500px; margin: 0 auto; background: #161b26; border: 1px solid #232936; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo-badge { display: inline-block; background: linear-gradient(135deg, #ff6b35, #f7931e); color: #fff; font-weight: 800; font-size: 14px; padding: 6px 14px; border-radius: 999px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
        h1 { font-size: 24px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 8px; }
        p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: #0f131c; border: 2px dashed #ff6b35; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #ff6b35; text-shadow: 0 0 20px rgba(255,107,53,0.3); }
        .expiry-note { font-size: 13px; color: #64748b; margin-top: 8px; margin-bottom: 0; }
        .footer { border-top: 1px solid #232936; padding-top: 20px; margin-top: 24px; font-size: 12px; color: #475569; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo-badge">TECH INDRO</div>
        <h1>Verification Code</h1>
        <p>Namaste <strong>${studentName}</strong>, use the one-time verification code below to securely access your Tech Indro account.</p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <p class="expiry-note">⏱ Valid for 5 minutes. Do not share this code.</p>
        </div>

        <p style="font-size: 13px; color: #64748b;">If you did not request this OTP, please ignore this email or reach out to our security team immediately.</p>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Tech Indro Academy. All rights reserved.<br>
          Empowering Next-Generation Forward Deployed Engineers.
        </div>
      </div>
    </body>
    </html>
    `;

    const textFallback = `Your Tech Indro verification code is: ${otp}\nValid for 5 minutes. Do not share this code with anyone.`;

    return await sendEmail({
        to: email,
        subject: `${otp} is your Tech Indro verification code`,
        html: htmlTemplate,
        text: textFallback
    });
}

module.exports = {
    sendEmail,
    sendOtpEmail
};
