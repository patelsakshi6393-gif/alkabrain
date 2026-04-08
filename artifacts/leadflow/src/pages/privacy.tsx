import PublicLayout from "@/components/layout/public-layout";

export default function Privacy() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto py-16 px-6 lg:px-8 prose prose-gray dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            LeadFlow ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. 
            This policy describes the types of information we may collect from you or that you may provide when you visit the LeadFlow website and use our marketing automation platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p>We collect several types of information from and about users of our Service, including:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Personal Data:</strong> Name, email address, billing information, and phone number when you register for an account.</li>
            <li><strong>Authentication Data:</strong> We use Clerk for authentication, which may collect relevant identity provider information.</li>
            <li><strong>Usage Data:</strong> Information about your internet connection, the equipment you use to access our Service, and usage details.</li>
            <li><strong>Integration Data:</strong> Limited access tokens for Gmail (to send emails on your behalf) and WhatsApp session data (stored locally/ephemerally to facilitate messaging).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use information that we collect about you or that you provide to us, including any personal information:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>To present our Service and its contents to you.</li>
            <li>To provide you with information, products, or services that you request from us.</li>
            <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.</li>
            <li>To notify you about changes to our Service or any products or services we offer or provide though it.</li>
            <li>To improve our Service, marketing, or customer relationships.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Processing and Scraped Data</h2>
          <p>
            When you use our lead scraping tools, the Service aggregates publicly available business data. 
            You act as the Data Controller for this information, and we act as the Data Processor. 
            You are responsible for ensuring that your use of this data (including subsequent marketing communications) complies with applicable data protection laws in your jurisdiction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
            We use industry-standard encryption for data at rest and in transit. Your Gmail app passwords and WhatsApp session data are securely encrypted.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Third-Party Service Providers</h2>
          <p>We may employ third-party companies to facilitate our Service, including:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Clerk (Authentication)</li>
            <li>Razorpay (Payment Processing)</li>
            <li>Google Cloud / AWS (Hosting & Infrastructure)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict the processing of your data. 
            You can manage most of your personal data directly through your account settings. For specific requests, contact our support team.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p>
            To ask questions or comment about this privacy policy and our privacy practices, contact us via the support portal within the application.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}
