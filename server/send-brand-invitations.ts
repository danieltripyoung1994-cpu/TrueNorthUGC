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
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">Hello,</p>
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">I hope you're doing well.</p>
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">
    I'm reaching out to introduce <strong>TrueNorthUGC</strong>, Canada's premier creator marketplace built to help brands connect directly with high-performing UGC creators who produce authentic, results-driven content.
  </p>
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">
    Our platform is designed for modern brands that want to launch campaigns faster, reduce agency costs, and work directly with talented creators who understand how to make content that converts on TikTok, Instagram, and other social platforms.
  </p>
  
  <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px;">Here's why brands are choosing TrueNorthUGC:</h3>
  
  <ul style="color: #444; line-height: 2; padding-left: 20px; font-size: 15px;">
    <li><strong>Vetted Creators</strong> – Access carefully selected creators who specialize in performance-focused, platform-native content.</li>
    <li><strong>Easy Campaign Management</strong> – Post briefs, manage deliverables, and oversee campaigns from one streamlined dashboard.</li>
    <li><strong>Authentic, High-Converting Content</strong> – Get relatable content that feels natural to audiences and drives engagement and sales.</li>
    <li><strong>Secure Payments</strong> – Structured and secure transactions that protect both brands and creators.</li>
    <li><strong>Direct Communication</strong> – Collaborate directly with creators for faster turnaround and clearer creative alignment.</li>
  </ul>
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">
    Whether you're launching a new product, scaling paid social performance, or building stronger brand engagement, TrueNorthUGC gives you direct access to creator talent and full control over your campaigns.
  </p>
  
  <div style="text-align: center; margin: 35px 0;">
    <a href="https://www.truenorthugc.com" style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); color: white; padding: 16px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Join TrueNorthUGC Today</a>
  </div>
  
  <p style="color: #444; line-height: 1.7; font-size: 15px;">
    If you'd like to discuss a potential campaign or see how the platform can support your marketing goals, simply reply to this email. I'd be happy to connect.
  </p>
  
  <p style="color: #444; margin-top: 25px;">
    Best regards,<br/>
    <strong>Daniel Young</strong><br/>
    Founder, TrueNorthUGC<br/>
    <a href="https://www.truenorthugc.com" style="color: #dc2626;">www.truenorthugc.com</a>
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
