import { sendEmail } from './gmail.js';

const htmlBody = `<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="text-align: center; padding: 20px 0;">
<h1 style="color: #dc2626; margin-bottom: 10px;">TrueNorthUGC</h1>
<p style="color: #666; font-size: 14px;">Canada's Premier Creator Marketplace</p>
</div>
<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
<h2 style="color: #333;">We're Officially Live!</h2>
<p style="color: #444; line-height: 1.6;">We're thrilled to announce that <strong>TrueNorthUGC is now live</strong> and ready for creators and brands to officially start our journey of running campaigns together!</p>
<p style="color: #444; line-height: 1.6;">Whether you're a talented Canadian creator looking for brand collaborations, or a brand seeking authentic UGC content, TrueNorthUGC is your platform to connect, collaborate, and create.</p>
<div style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
<h3 style="color: white; margin: 0 0 15px 0;">What You Can Do Now:</h3>
<ul style="color: white; text-align: left; padding-left: 20px; line-height: 2;">
<li>Complete your creator or brand profile</li>
<li>Browse and apply to active campaigns</li>
<li>Connect with brands or creators directly</li>
<li>Secure payments through PayPal</li>
</ul>
</div>
<p style="color: #444; line-height: 1.6;">Log in now to explore the platform and start making connections!</p>
<div style="text-align: center; margin: 30px 0;">
<a href="https://truenorthugc.replit.app" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Visit TrueNorthUGC</a>
</div>
<p style="color: #666; font-size: 14px; margin-top: 30px;">Thank you for being part of our community!</p>
<p style="color: #444;">— The TrueNorthUGC Team</p>
<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px;">
<p style="color: #999; font-size: 12px; text-align: center;">You're receiving this email because you signed up for TrueNorthUGC.</p>
</body></html>`;

async function main() {
  try {
    console.log('Sending launch announcement email...');
    const result = await sendEmail(
      'danieltripyoung1994@icloud.com',
      'TrueNorthUGC is Now LIVE - Start Your UGC Journey!',
      htmlBody
    );
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

main();
