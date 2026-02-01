import { sendBulkEmails } from './gmail.js';

const brandEmails = [
  { brand: 'Autumn Adeigbo', email: 'press@autumnadeigbo.com' },
  { brand: 'Beauty Bakerie', email: 'info@beautybakerie.com' },
  { brand: 'Home By Aree', email: 'beadsbyaree@gmail.com' },
  { brand: 'Black Girl Sunscreen', email: 'marketing@blackgirlsunscreen.com' },
  { brand: 'Briogeo', email: 'influencers@briogeohair.com' },
  { brand: 'Butter by Keba', email: 'team@butterbykeba.com' },
  { brand: 'CARA B Naturally', email: 'media@mycarab.com' },
  { brand: 'Expedition Subsahara', email: 'info@expeditionsubsahara.com' },
  { brand: 'Jungalow', email: 'support@jungalow.com' },
  { brand: 'Kazmaleje', email: 'partnerships@kazmaleje.com' },
  { brand: 'KNC Beauty', email: 'shop@kncbeauty.com' },
  { brand: 'Telfar', email: 'press@telfar.net' },
  { brand: 'Alaffia', email: 'press@alaiffia.com' },
  { brand: 'Hairbrella', email: 'hereforyou@hairbrella.com' },
  { brand: 'Girl + Hair', email: 'info@girlandhair.com' },
  { brand: 'Hair Rules', email: 'customerservice@hairrules.com' },
  { brand: 'Earths Nectar', email: 'contactus@earthsnectar.com' },
  { brand: 'Flora & Curl', email: 'ambassador@floracurl.com' },
  { brand: 'The PuffCuff', email: 'customerservice@thepuffcuff.com' },
  { brand: 'Livso', email: 'productinfo@livso.com' },
  { brand: 'Naturalicious', email: 'concierge@naturalicious.net' },
  { brand: 'Kaanas', email: 'press@kaanas.com' },
  { brand: 'Glossier', email: 'brand@glossier.com' },
  { brand: 'Beauty Counter', email: 'press@beautycounter.com' },
  { brand: 'Rituals', email: 'privacy@rituals.com' },
  { brand: 'Girlfriend', email: 'press@girlfriend.com' },
  { brand: 'Doen', email: 'connect@shopdoen.com' },
  { brand: 'Lemlem', email: 'shop@lemlem.com' },
  { brand: 'Universal Standard', email: 'pr@universalstandard.net' },
  { brand: 'Lunya', email: 'Happiness@lunya.co' },
  { brand: 'Small Packages', email: 'hello@smallpackages.co' },
  { brand: 'Summer Fridays', email: 'autumnpr@summerfridays.com' },
  { brand: 'KAI', email: 'careers@kaicollective.com' },
  { brand: 'House Of Aama', email: 'Info@houseofaama.com' },
  { brand: 'Honey Pot', email: 'influencers@thehoneypot.co' },
  { brand: 'Bliss', email: 'care@buyblissbrands.com' },
  { brand: 'BK Beauty', email: 'shop@bkbeauty.com' },
  { brand: 'Akola', email: 'partnerships@akola.co' },
  { brand: 'Averr Aglow', email: 'glowteam@averraglow.com' },
  { brand: 'Avre', email: 'marketing@avrelife.com' },
  { brand: 'Awe Inspired', email: 'info@aweinspired.com' },
  { brand: 'AYR', email: 'ayrheads@ayr.com' },
  { brand: 'Live Tinted', email: 'Social@livetinted.com' },
  { brand: 'Olive & June', email: 'hello@oliveandjune.com' },
  { brand: 'Lusters Pink', email: 'lusterspink@hos-pr.com' },
  { brand: 'Edenbodyworks', email: 'curlfriends@edenbodyworks.com' },
];

const htmlBody = `<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
<div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #dc2626; margin-bottom: 10px;">TrueNorthUGC</h1>
    <p style="color: #666; font-size: 14px;">Canada's Premier Creator Marketplace</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  
  <h2 style="color: #333; margin-bottom: 15px;">Partner With Authentic Canadian Creators</h2>
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">
    We're reaching out because we believe your brand would be a perfect fit for <strong>TrueNorthUGC</strong> — Canada's premier marketplace connecting brands with talented UGC (User-Generated Content) creators.
  </p>
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">
    Our platform makes it easy to find, collaborate with, and manage relationships with authentic Canadian content creators who can help bring your brand's story to life.
  </p>
  
  <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px;">Why Partner With TrueNorthUGC?</h3>
  
  <ul style="color: #444; line-height: 2; padding-left: 20px; font-size: 15px;">
    <li><strong>Vetted Canadian Creators</strong> — Access a curated network of talented UGC creators across Canada</li>
    <li><strong>Easy Campaign Management</strong> — Post campaigns, review applications, and manage collaborations in one place</li>
    <li><strong>Authentic Content</strong> — Get genuine, relatable content that resonates with your audience</li>
    <li><strong>Secure Payments</strong> — Built-in PayPal integration for seamless, secure transactions</li>
    <li><strong>Direct Communication</strong> — Message creators directly through our platform</li>
  </ul>
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">
    Join brands already leveraging the power of authentic UGC content to connect with Canadian consumers.
  </p>
  
  <div style="text-align: center; margin: 35px 0;">
    <a href="https://www.truenorthugc.com" style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); color: white; padding: 16px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Join TrueNorthUGC Today</a>
  </div>
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">
    We'd love to have you on the platform! If you have any questions, simply reply to this email and we'll be happy to help.
  </p>
  
  <p style="color: #444; margin-top: 25px;">
    Looking forward to partnering with you,<br/>
    <strong>The TrueNorthUGC Team</strong>
  </p>
</div>

<div style="text-align: center; padding: 20px;">
  <p style="color: #999; font-size: 12px;">
    Questions? Reply to this email or contact us at <a href="mailto:TrueNorthUGCcanada@gmail.com" style="color: #dc2626;">TrueNorthUGCcanada@gmail.com</a>
  </p>
  <p style="color: #999; font-size: 12px;">
    <a href="https://www.truenorthugc.com" style="color: #666;">www.truenorthugc.com</a>
  </p>
</div>
</body></html>`;

async function main() {
  const recipientEmails = brandEmails.map(b => b.email);
  
  try {
    console.log(`Sending brand invitation emails to ${recipientEmails.length} brands...`);
    console.log('');
    
    const results = await sendBulkEmails(
      recipientEmails,
      'Invitation to Partner with TrueNorthUGC — Canada\'s Premier Creator Marketplace',
      htmlBody
    );
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);
    
    console.log(`\n========================================`);
    console.log(`Results: ${successful}/${recipientEmails.length} emails sent successfully`);
    console.log(`========================================\n`);
    
    if (failed.length > 0) {
      console.log('Failed emails:');
      failed.forEach(f => {
        const brand = brandEmails.find(b => b.email === f.email)?.brand || 'Unknown';
        console.log(`  - ${brand} (${f.email}): ${f.error}`);
      });
      console.log('');
    }
    
    console.log('Detailed results:');
    results.forEach(r => {
      const brand = brandEmails.find(b => b.email === r.email)?.brand || 'Unknown';
      console.log(`  ${r.success ? '✓' : '✗'} ${brand} — ${r.email}`);
    });
  } catch (error) {
    console.error('Failed to send emails:', error);
  }
}

main();
