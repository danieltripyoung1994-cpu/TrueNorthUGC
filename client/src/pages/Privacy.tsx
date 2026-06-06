import { Navbar } from "@/components/Navbar";
import { usePageMeta } from "@/hooks/use-page-meta";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mb-10"
    >
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
      <div className="text-white/70 leading-relaxed space-y-3">{children}</div>
    </motion.section>
  );
}

export default function Privacy() {
  usePageMeta({
    title: "Privacy Policy — TrueNorthUGC",
    description: "TrueNorthUGC Privacy Policy. How we collect, use, and protect your data on Canada's UGC creator marketplace.",
    canonicalUrl: "https://www.truenorthugc.com/privacy",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 pt-32 pb-24">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-12">
          <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-white/50 text-sm">Last updated: June 5, 2026</p>
        </motion.div>

        <Section title="1. Introduction">
          <p>
            TrueNorthUGC ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you use our
            Platform at truenorthugc.com.
          </p>
          <p>
            This Policy is governed by Canada's Personal Information Protection and Electronic Documents
            Act (PIPEDA) and applicable provincial privacy laws.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong className="text-white">Account Information:</strong> When you register, we collect your name, email address, and profile information provided through Replit Authentication.</p>
          <p><strong className="text-white">Profile Data:</strong> Creators and brands may provide additional information including bio, location, niche, social media handles, portfolio content, and rate information.</p>
          <p><strong className="text-white">Communication Data:</strong> Messages sent between users on the Platform are stored to facilitate communication.</p>
          <p><strong className="text-white">Payment Data:</strong> Payment transactions are processed through PayPal. We store transaction records including amounts and status, but we do not store full payment card details.</p>
          <p><strong className="text-white">Usage Data:</strong> We collect information about how you use the Platform, including pages visited, features used, and interaction data via Google Analytics 4.</p>
          <p><strong className="text-white">Device Data:</strong> Browser type, IP address, device type, and operating system information.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-2">
            <li>To operate and improve the Platform and its features.</li>
            <li>To facilitate connections between creators and brands.</li>
            <li>To process payments and maintain transaction records.</li>
            <li>To send platform notifications and service-related communications.</li>
            <li>To analyze platform usage and improve user experience.</li>
            <li>To enforce our Terms of Service and prevent fraud.</li>
            <li>To comply with applicable legal obligations.</li>
          </ul>
        </Section>

        <Section title="4. Information Sharing">
          <p>We do not sell your personal information to third parties.</p>
          <p>We share information with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white">Other Users:</strong> Profile information you make public (bio, portfolio, rates) is visible to other Platform users.</li>
            <li><strong className="text-white">Service Providers:</strong> We use third-party services including Replit (hosting), PayPal (payments), and Google Analytics (analytics).</li>
            <li><strong className="text-white">Legal Authorities:</strong> When required by law, court order, or legal process.</li>
          </ul>
        </Section>

        <Section title="5. Third-Party Services">
          <p>We use the following third-party services that have their own privacy policies:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white">Google Analytics 4:</strong> For website analytics and performance monitoring.</li>
            <li><strong className="text-white">PayPal:</strong> For payment processing.</li>
            <li><strong className="text-white">Replit Auth:</strong> For user authentication.</li>
            <li><strong className="text-white">Google Mail (Gmail):</strong> For platform email communications.</li>
          </ul>
          <p>
            We may also use Meta Pixel and TikTok Pixel for advertising purposes. You can opt out of
            targeted advertising through your browser settings or platform ad preferences.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your personal information for as long as your account is active or as needed to
            provide services. You may request deletion of your account and associated data by contacting us.
          </p>
          <p>
            Transaction records may be retained for up to 7 years for tax and legal compliance purposes.
          </p>
        </Section>

        <Section title="7. Your Rights (PIPEDA)">
          <p>Under PIPEDA, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Withdraw consent for certain uses of your information.</li>
            <li>Request deletion of your personal information (subject to legal obligations).</li>
            <li>File a complaint with the Office of the Privacy Commissioner of Canada.</li>
          </ul>
          <p>To exercise these rights, contact us at TrueNorthUGCcanada@gmail.com.</p>
        </Section>

        <Section title="8. Cookies">
          <p>
            We use cookies and similar technologies to maintain sessions, remember preferences, and analyze
            Platform usage. You can control cookies through your browser settings, but disabling cookies
            may affect Platform functionality.
          </p>
        </Section>

        <Section title="9. Data Security">
          <p>
            We implement industry-standard security measures to protect your information, including
            encrypted connections (HTTPS), secure session management, and access controls.
          </p>
          <p>
            No system is completely secure. In the event of a data breach that poses a real risk of harm,
            we will notify affected users and relevant authorities as required by law.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>
            The Platform is not intended for users under 18 years of age. We do not knowingly collect
            personal information from children. If we discover we have collected information from a child
            under 18, we will delete it promptly.
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes
            via email or a notice on the Platform. Continued use of the Platform after changes constitutes
            acceptance of the updated Policy.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            For privacy-related questions or concerns, contact our Privacy Officer:
          </p>
          <ul className="list-none space-y-1">
            <li><strong className="text-white">Email:</strong>{" "}
              <a href="mailto:TrueNorthUGCcanada@gmail.com" className="text-pink-400 hover:underline">
                TrueNorthUGCcanada@gmail.com
              </a>
            </li>
            <li><strong className="text-white">Phone:</strong>{" "}
              <a href="tel:+12262201522" className="text-pink-400 hover:underline">1-226-220-1522</a>
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
