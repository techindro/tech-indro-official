require('dotenv').config();
const { sendOtpEmail } = require('../src/services/email');

async function testEmail() {
    console.log('==================================================');
    console.log('       TECH INDRO RESEND EMAIL SERVICE TEST       ');
    console.log('==================================================');

    const testEmailTarget = process.argv[2] || 'shubhamkumarpatel45@gmail.com';
    console.log(`[1] Sending test OTP to: ${testEmailTarget}`);
    console.log(`[2] Using API Key: ${process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.slice(0, 8) + '...' : 'NOT FOUND'}`);

    const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await sendOtpEmail(testEmailTarget, testOtp, 'Shubham');

    console.log('\n[3] Dispatch Result:');
    console.log(result);

    if (result.success) {
        console.log(`\n✅ Email dispatched successfully! Message ID: ${result.id}`);
    } else {
        console.warn(`\n⚠️ Dispatch returned notice / error:`, result.error);
    }
}

testEmail().catch(err => {
    console.error('Fatal error during test:', err);
});
