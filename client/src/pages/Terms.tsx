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

export default function Terms() {
  usePageMeta({
    title: "Terms of Service — TrueNorthUGC",
    description: "TrueNorthUGC Terms of Service. Read our terms for using Canada's UGC creator marketplace.",
    canonicalUrl: "https://www.truenorthugc.com/terms",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 pt-32 pb-24">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-12">
          <h1 className="text-4xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-white/50 text-sm">Last updated: June 5, 2026</p>
        </motion.div>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using TrueNorthUGC ("the Platform", "we", "us", or "our"), you agree to be
            bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>
          <p>
            These terms apply to all users of the Platform, including brands and content creators
            (collectively "Users").
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            TrueNorthUGC is a Canadian online marketplace that connects brands with user-generated content
            (UGC) creators. The Platform facilitates discovery, communication, and payment between brands
            and creators.
          </p>
          <p>
            We do not guarantee the quality, accuracy, or completeness of content produced by creators,
            nor do we guarantee that brands will engage with any creator.
          </p>
        </Section>

        <Section title="3. Eligibility">
          <p>
            You must be at least 18 years old and a legal resident of Canada to use the Platform. By
            creating an account, you represent and warrant that you meet these requirements.
          </p>
        </Section>

        <Section title="4. User Accounts">
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You agree
            to notify us immediately of any unauthorized use of your account. We are not liable for any
            loss resulting from unauthorized account access.
          </p>
        </Section>

        <Section title="5. Creator Terms">
          <p>
            Creators on the Platform agree to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate profile information, including location, niche, and experience level.</li>
            <li>Deliver content as agreed with brands within the specified timeframe.</li>
            <li>Own or have the rights to all content they submit or showcase.</li>
            <li>Comply with all applicable Canadian laws when creating content.</li>
            <li>Not engage in fraudulent activity, including fake followers or engagement.</li>
          </ul>
          <p>
            Creators receive 80% of all payments processed through the Platform. TrueNorthUGC retains a
            20% platform fee. The platform owner manually distributes creator payouts.
          </p>
        </Section>

        <Section title="6. Brand Terms">
          <p>Brands on the Platform agree to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate information about their business, products, and campaign requirements.</li>
            <li>Pay creators promptly and fairly as agreed through the Platform.</li>
            <li>Use creator content only within the usage rights agreed upon in the campaign.</li>
            <li>Not contact creators outside the Platform to circumvent fees.</li>
            <li>Comply with Canadian advertising and marketing laws, including ASC guidelines.</li>
          </ul>
        </Section>

        <Section title="7. Payments">
          <p>
            All payments are processed through PayPal. By using the payment features, you agree to PayPal's
            terms and conditions. TrueNorthUGC charges a 20% platform fee on all transactions.
          </p>
          <p>
            Subscription plans (Starter, Growth, Premium) are billed as specified on the Pricing page.
            All prices are in Canadian Dollars (CAD) unless otherwise stated.
          </p>
          <p>
            Refunds are handled on a case-by-case basis. Contact us at TrueNorthUGCcanada@gmail.com
            for refund requests.
          </p>
        </Section>

        <Section title="8. Intellectual Property">
          <p>
            Creators retain ownership of their content. By posting content on the Platform, creators grant
            TrueNorthUGC a limited, non-exclusive licence to display that content on the Platform.
          </p>
          <p>
            Brands receive usage rights to commissioned content as specified in their campaign agreements.
            Usage outside the agreed scope requires additional licensing from the creator.
          </p>
        </Section>

        <Section title="9. Prohibited Conduct">
          <p>Users must not:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Violate any applicable Canadian federal or provincial laws.</li>
            <li>Post false, misleading, or fraudulent information.</li>
            <li>Harass, threaten, or discriminate against other users.</li>
            <li>Attempt to hack, scrape, or disrupt the Platform.</li>
            <li>Use the Platform for any unlawful purpose.</li>
          </ul>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, TrueNorthUGC shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the Platform.
          </p>
          <p>
            Our total liability to you for any claim arising from your use of the Platform shall not
            exceed the amount you paid to TrueNorthUGC in the 12 months preceding the claim.
          </p>
        </Section>

        <Section title="11. Privacy">
          <p>
            Your use of the Platform is also governed by our{" "}
            <a href="/privacy" className="text-pink-400 hover:underline">Privacy Policy</a>, which is
            incorporated into these Terms by reference.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms are governed by the laws of the Province of Ontario and the federal laws of
            Canada applicable therein, without regard to conflict of law principles.
          </p>
        </Section>

        <Section title="13. Changes to Terms">
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of material
            changes via email or a prominent notice on the Platform. Continued use of the Platform
            after changes constitutes acceptance of the new Terms.
          </p>
        </Section>

        <Section title="14. Contact">
          <p>
            For questions about these Terms, contact us at:{" "}
            <a href="mailto:TrueNorthUGCcanada@gmail.com" className="text-pink-400 hover:underline">
              TrueNorthUGCcanada@gmail.com
            </a>
            {" "}or call{" "}
            <a href="tel:+12262201522" className="text-pink-400 hover:underline">1-226-220-1522</a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
