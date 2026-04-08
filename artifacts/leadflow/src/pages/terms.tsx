import PublicLayout from "@/components/layout/public-layout";

export default function Terms() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto py-16 px-6 lg:px-8 prose prose-gray dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using LeadFlow ("the Service", "we", "us", "our"), you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            LeadFlow provides a marketing automation platform that includes tools for business contact discovery (lead scraping), email outreach automation, and WhatsApp messaging capabilities. The service is intended strictly for B2B (Business-to-Business) communication.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p>You agree to use the Service only for lawful purposes. You are strictly prohibited from:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Using the Service to send unsolicited commercial email (spam) in violation of applicable laws.</li>
            <li>Using the Service to send harassing, threatening, or abusive messages.</li>
            <li>Scraping or harvesting data for illegal purposes or to sell to third parties.</li>
            <li>Impersonating any person or entity or misrepresenting your affiliation.</li>
            <li>Attempting to bypass our security measures or rate limits.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Anti-Spam Policy</h2>
          <p>
            We have a zero-tolerance policy against spam. You must ensure that your use of the Service complies with the CAN-SPAM Act, the IT Act 2000 (India), and other applicable anti-spam laws.
            Accounts found to be sending spam or generating unusually high bounce/complaint rates will be immediately suspended without refund.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. WhatsApp Integration</h2>
          <p>
            Our WhatsApp integration utilizes your own device session via WhatsApp Web. You acknowledge that:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>You are bound by WhatsApp's Terms of Service.</li>
            <li>Sending unsolicited messages may result in WhatsApp banning your phone number.</li>
            <li>LeadFlow is not responsible for any bans, restrictions, or limitations placed on your WhatsApp account.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Credits and Billing</h2>
          <p>
            The Service operates on a credit-based system. Credits are consumed when utilizing features like lead scraping and messaging.
            Subscription fees are billed in advance on a recurring basis. All payments are non-refundable unless required by law.
            We use Razorpay for secure payment processing.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, LeadFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}
