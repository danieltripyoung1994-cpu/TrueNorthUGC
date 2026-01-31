import { sendBulkEmails } from './gmail.js';

const recipientEmails = [
  'juliecblaq@gmail.com',
  'ugcbyemilydc@gmail.com',
  'abikendra.tritz@gmail.com',
  'thecornthwaitecorner@gmail.com',
  '1ad2dd3tt@gmail.com',
  'kevin@pulselinemedia.com',
  'beaqs1989@gmail.com',
  'ridhi.khakhar@gmail.com',
  'jomarbaterina17@gmail.com',
  'chrisparkerugc@gmail.com',
  'zeyad@chatbase.co',
  'draicads@gmail.com'
];

const htmlBody = `<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="text-align: center; padding: 20px 0;">
<h1 style="color: #dc2626; margin-bottom: 10px;">TrueNorthUGC</h1>
<p style="color: #666; font-size: 14px;">Canada's Premier Creator Marketplace</p>
</div>
<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
<h2 style="color: #333;">Our Official Domain Is Now Live!</h2>
<p style="color: #444; line-height: 1.6;">Great news! <strong>TrueNorthUGC</strong> is now available at our official domain:</p>
<div style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
<a href="https://www.truenorthugc.com" style="color: white; font-size: 24px; font-weight: bold; text-decoration: none;">www.truenorthugc.com</a>
</div>
<p style="color: #444; line-height: 1.6;">Canada's premier marketplace connecting talented UGC creators with brands looking for authentic content is now easier to access than ever!</p>
<p style="color: #444; line-height: 1.6;">As a creator, you'll have access to:</p>
<ul style="color: #444; line-height: 2; padding-left: 20px;">
<li>Browse and apply to brand campaigns</li>
<li>Build your professional creator profile</li>
<li>Connect directly with Canadian brands</li>
<li>Secure payments through PayPal</li>
<li>Showcase your portfolio to potential clients</li>
</ul>
<p style="color: #444; line-height: 1.6;">Join our growing community of Canadian creators and start your UGC journey today!</p>
<div style="text-align: center; margin: 30px 0;">
<a href="https://www.truenorthugc.com" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Visit TrueNorthUGC.com</a>
</div>
<p style="color: #666; font-size: 14px; margin-top: 30px;">We look forward to seeing you on the platform!</p>
<p style="color: #444;">— The TrueNorthUGC Team</p>
<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px;">
<p style="color: #999; font-size: 12px; text-align: center;">Questions? Reply to this email or contact us at TrueNorthUGCcanada@gmail.com</p>
</body></html>`;

async function main() {
  try {
    console.log(`Sending invitation emails to ${recipientEmails.length} recipients...`);
    const results = await sendBulkEmails(
      recipientEmails,
      'TrueNorthUGC Official Domain Is Now Live - www.truenorthugc.com',
      htmlBody
    );
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);
    
    console.log(`\nResults: ${successful}/${recipientEmails.length} emails sent successfully`);
    
    if (failed.length > 0) {
      console.log('\nFailed emails:');
      failed.forEach(f => console.log(`  - ${f.email}: ${f.error}`));
    }
    
    console.log('\nDetailed results:');
    results.forEach(r => {
      console.log(`  ${r.success ? '✓' : '✗'} ${r.email}`);
    });
  } catch (error) {
    console.error('Failed to send emails:', error);
  }
}

main();
