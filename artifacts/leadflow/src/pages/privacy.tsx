import PublicLayout from "@/components/layout/public-layout";

const Section = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold text-foreground mb-4 flex items-start gap-2">
      <span className="text-primary font-black min-w-[2rem]">{num}.</span>
      {title}
    </h2>
    <div className="pl-8 space-y-3 text-foreground/80 leading-relaxed">{children}</div>
  </section>
);

export default function Privacy() {
  const lastUpdated = "April 8, 2026";

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto py-16 px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated} · Applies to all ALKABRAIN users</p>
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm text-foreground/80">
            <strong>Our Commitment:</strong> At ALKABRAIN Technologies, your privacy is fundamental to us. We are transparent about how we collect, use, and protect your personal data. This Privacy Policy explains your rights and our responsibilities under applicable Indian privacy laws and international best practices.
          </div>
        </div>

        <Section num="1" title="Who We Are">
          <p>ALKABRAIN Technologies ("Company", "we", "us", "our") operates the ALKABRAIN marketing automation platform.</p>
          <p>We act as the <strong>Data Controller</strong> for the personal data of our registered users. For data processed on behalf of our users (e.g., scraped lead contact data), our users act as independent Data Controllers and we act as a Data Processor.</p>
          <p>For privacy-related questions or to exercise your rights, contact our Data Protection Officer at: <a href="mailto:privacy@alkabrain.in" className="text-primary hover:underline">privacy@alkabrain.in</a></p>
        </Section>

        <Section num="2" title="Data We Collect About You">
          <p><strong>Account Data:</strong> When you register, we collect your name, email address, and profile photo (via Google or Clerk authentication provider). We do not store your password — authentication is handled securely by Clerk.</p>
          <p><strong>Billing Data:</strong> We collect transaction IDs and plan information when you make a payment. We do not store credit card numbers or banking details — payments are processed securely by Razorpay.</p>
          <p><strong>Usage Data:</strong> We automatically collect data about how you use the Platform, including pages visited, features used, campaign statistics, credit usage, and timestamps.</p>
          <p><strong>Integration Credentials:</strong> If you connect Gmail, we store your Gmail address and app password in an encrypted format. We do not store your WhatsApp password — only a session token that maintains your WhatsApp Web session.</p>
          <p><strong>Campaign Content:</strong> We store the campaign names, target niches, email copy, WhatsApp messages, and templates you create.</p>
          <p><strong>Technical Data:</strong> IP addresses, browser type, device information, and server logs are collected automatically for security and operational purposes.</p>
          <p><strong>Communications:</strong> If you contact our support, we retain records of those communications.</p>
        </Section>

        <Section num="3" title="How We Use Your Data">
          <p>We use your personal data for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Service Delivery:</strong> To create and manage your account, process payments, provide credits, and operate all Platform features.</li>
            <li><strong>Campaign Execution:</strong> To scrape leads, send emails on your behalf via your connected Gmail, and coordinate WhatsApp messaging.</li>
            <li><strong>Security:</strong> To detect fraud, unauthorized access, spam abuse, and protect the integrity of the Platform.</li>
            <li><strong>Support:</strong> To respond to your queries, troubleshoot issues, and improve your experience.</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws, respond to lawful requests, and enforce our Terms of Service.</li>
            <li><strong>Analytics:</strong> To understand how users interact with the Platform and improve our features (using aggregated, anonymized data).</li>
            <li><strong>Communications:</strong> To send you service-related notifications, security alerts, and (with your consent) product updates.</li>
          </ul>
          <p className="mt-3"><strong>Legal Basis:</strong> We process your data based on: (1) contractual necessity to provide the service, (2) your explicit consent, (3) our legitimate interests in operating a secure platform, and (4) compliance with legal obligations.</p>
        </Section>

        <Section num="4" title="Third-Party Data (Scraped Leads)">
          <p>Our Platform enables you to scrape publicly available business contact information from search engines. Regarding this data:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Scraped data is collected from publicly indexed search results and is not stored permanently on our servers.</li>
            <li>You (the user) are solely responsible as an independent data controller for any scraped contact data and must comply with applicable privacy laws.</li>
            <li>If you receive a request from a third party to delete or access their data that may have been scraped through our Platform, you are responsible for responding to such requests.</li>
            <li>We do not sell, share, or use scraped lead data for our own marketing purposes.</li>
          </ul>
        </Section>

        <Section num="5" title="Data Sharing and Disclosure">
          <p>We do <strong>not</strong> sell your personal data to third parties. We may share your data only in the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Service Providers:</strong> Trusted providers who assist in operating the Platform:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Clerk Inc. (authentication, US-based, GDPR compliant)</li>
                <li>Razorpay (payment processing, RBI-regulated, India)</li>
                <li>Cloud hosting provider for infrastructure</li>
              </ul>
            </li>
            <li><strong>Legal Requirements:</strong> If required by law, court order, or governmental authority (including CERT-In directives).</li>
            <li><strong>Business Transfer:</strong> In a merger, acquisition, or asset sale, your data may be transferred to the acquiring party under equivalent privacy protections.</li>
            <li><strong>Protection of Rights:</strong> To prevent fraud, enforce our Terms, or protect the safety of users or the public.</li>
          </ul>
        </Section>

        <Section num="6" title="Data Security">
          <p>We implement industry-standard security measures:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.3.</li>
            <li><strong>Encryption at Rest:</strong> Sensitive data including Gmail app passwords are stored in encrypted form.</li>
            <li><strong>Access Controls:</strong> Production system access is restricted to authorized personnel on a need-to-know basis.</li>
            <li><strong>Authentication Security:</strong> Login is handled by Clerk with MFA, brute-force protection, and session management.</li>
            <li><strong>Regular Reviews:</strong> We conduct periodic security assessments and vulnerability scans.</li>
          </ul>
          <p className="mt-3">In the event of a data breach that affects your rights, we will notify you within 72 hours as required by applicable law.</p>
        </Section>

        <Section num="7" title="Data Retention">
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Account data:</strong> Retained until account deletion, plus 30 days for backup purposes.</li>
            <li><strong>Campaign data and templates:</strong> Retained for the duration of your account.</li>
            <li><strong>Billing and transaction records:</strong> Retained for 7 years as required by Indian tax law.</li>
            <li><strong>Server logs:</strong> Retained for 90 days for security and debugging.</li>
            <li><strong>Gmail credentials:</strong> Deleted immediately upon disconnection or account deletion.</li>
            <li><strong>WhatsApp session data:</strong> Deleted immediately upon disconnection or account deletion.</li>
          </ul>
        </Section>

        <Section num="8" title="Your Privacy Rights">
          <p>Depending on your location and applicable law, you may have the following rights:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements).</li>
            <li><strong>Right to Restrict Processing:</strong> Request that we limit how we process your data in certain circumstances.</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format. (You can do this from Settings → Export Data)</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for direct marketing.</li>
            <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, withdraw it at any time.</li>
          </ul>
          <p className="mt-3">To exercise any right, email <a href="mailto:privacy@alkabrain.in" className="text-primary hover:underline">privacy@alkabrain.in</a>. We will respond within 30 days after verifying your identity.</p>
        </Section>

        <Section num="9" title="Cookies and Tracking">
          <p>We use essential cookies and local storage to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Maintain your authenticated session</li>
            <li>Remember your preferences</li>
            <li>Protect against cross-site request forgery (CSRF)</li>
          </ul>
          <p className="mt-3">We do <strong>not</strong> use third-party advertising cookies, behavioral tracking cookies, or sell browsing data to advertising networks.</p>
          <p>Essential cookies cannot be disabled without impairing Platform functionality. By using the Platform, you consent to our use of essential cookies.</p>
        </Section>

        <Section num="10" title="Children's Privacy">
          <p>The Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors.</p>
          <p>If we become aware of data collected from a minor, we will delete it immediately. Contact <a href="mailto:privacy@alkabrain.in" className="text-primary hover:underline">privacy@alkabrain.in</a> if you believe a minor has provided us with data.</p>
        </Section>

        <Section num="11" title="International Data Transfers">
          <p>Our servers and service providers may be located outside India. Where we transfer your data internationally, we ensure appropriate safeguards are in place, including Standard Contractual Clauses and processing agreements that comply with applicable data protection laws.</p>
        </Section>

        <Section num="12" title="Specific Provisions for Indian Users (DPDPA 2023)">
          <p>For users in India, additional provisions apply under the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>We process your personal data only for the purposes stated in this policy and only with your consent or other lawful basis.</li>
            <li>You have the right to nominate another individual to exercise your data rights on your behalf in case of death or incapacity.</li>
            <li>We will not process data beyond what was consented to without obtaining fresh consent.</li>
            <li>You may withdraw consent at any time by contacting us, though this may affect certain Platform features.</li>
            <li>We will process and respond to all privacy requests within DPDPA mandated timelines.</li>
            <li>We comply with the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
          </ul>
        </Section>

        <Section num="13" title="Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Sending an email to your registered address at least 14 days before changes take effect</li>
            <li>Displaying a prominent notice on the Platform</li>
            <li>Updating the "Last Updated" date at the top of this policy</li>
          </ul>
          <p className="mt-3">Your continued use of the Platform after changes take effect constitutes acceptance of the updated policy.</p>
        </Section>

        <div className="mt-12 p-6 rounded-xl bg-muted border">
          <p className="font-semibold text-foreground mb-2">Contact Our Privacy Team</p>
          <p className="text-sm text-muted-foreground">For any privacy concerns, data requests, or to exercise your rights:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Data Protection Officer: <a href="mailto:privacy@alkabrain.in" className="text-primary hover:underline">privacy@alkabrain.in</a></li>
            <li>General Support: <a href="mailto:support@alkabrain.in" className="text-primary hover:underline">support@alkabrain.in</a></li>
            <li>Response Time: Within 30 days of receiving your verified request</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            This Privacy Policy is governed by the laws of India and complies with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
