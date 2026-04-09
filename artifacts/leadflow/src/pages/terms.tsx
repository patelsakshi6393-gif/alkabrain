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

export default function Terms() {
  const lastUpdated = "April 8, 2026";

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto py-16 px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Terms &amp; Conditions</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated} · Effective immediately upon account creation</p>
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm text-foreground/80">
            <strong>Important:</strong> By creating an account or using ALKABRAIN ("the Platform"), you agree to these Terms in full. If you do not agree, you must immediately stop using the Platform and close your account. These Terms form a legally binding agreement between you and ALKABRAIN Technologies ("Company", "we", "us", "our").
          </div>
        </div>

        <Section num="1" title="Definitions">
          <p><strong>"Platform"</strong> means the ALKABRAIN website, web application, APIs, and all associated services.</p>
          <p><strong>"User" / "You"</strong> means any individual or business entity that registers for or uses the Platform.</p>
          <p><strong>"Content"</strong> means any message, text, image, or data you upload, create, or send through the Platform.</p>
          <p><strong>"Leads"</strong> means publicly available business contact information scraped from search engines.</p>
          <p><strong>"Credits"</strong> means the in-platform currency used to access scraping and campaign features.</p>
          <p><strong>"Subscription"</strong> means a paid plan that grants you credits and access for a defined period.</p>
        </Section>

        <Section num="2" title="Eligibility and Account Registration">
          <p>You must be at least 18 years old and legally capable of entering into contracts to use this Platform.</p>
          <p>You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.</p>
          <p>You may not register more than one account per person without our written permission. Duplicate accounts may be merged or terminated.</p>
          <p>You are responsible for all activities that occur under your account. Notify us immediately at <strong>support@alkabrain.in</strong> if you suspect unauthorized access.</p>
          <p>We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.</p>
        </Section>

        <Section num="3" title="Permitted and Prohibited Use">
          <p>ALKABRAIN is intended for <strong>lawful B2B (Business-to-Business) outreach only</strong>. By using the Platform, you agree that:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>All messages sent through the Platform are honest, non-deceptive, and clearly identify you as the sender.</li>
            <li>You will only contact businesses and individuals who may have a legitimate interest in your products or services.</li>
            <li>You will honor all unsubscribe/opt-out requests immediately and maintain a suppression list.</li>
            <li>You will not use the Platform to send spam, phishing messages, malware, or any unsolicited bulk communications.</li>
            <li>You will not use the Platform to harass, threaten, defame, discriminate against, or harm any individual or organization.</li>
            <li>You will not impersonate any person, organization, or brand, or misrepresent your identity or affiliation.</li>
            <li>You will not use scraped data to build competitor databases, sell lead lists, or share data with third parties.</li>
            <li>You will not attempt to reverse-engineer, copy, scrape, or resell any part of the Platform itself.</li>
            <li>You will not attempt to circumvent rate limits, security measures, or credit systems through any technical means.</li>
            <li>You will not use the Platform in any manner that violates applicable law, including consumer protection and anti-spam laws.</li>
          </ul>
          <p className="mt-3">Violation of any prohibited use may result in immediate account suspension, data deletion, and legal action at our discretion.</p>
        </Section>

        <Section num="4" title="Anti-Spam and Compliance Policy">
          <p>We have a <strong>zero-tolerance anti-spam policy</strong>. By using the Platform you warrant that:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>You comply with the <strong>Information Technology Act, 2000</strong> and the <strong>IT (Amendment) Act, 2008</strong> (India).</li>
            <li>You comply with the <strong>Telecom Commercial Communications Customer Preference Regulations (TRAI)</strong>.</li>
            <li>You comply with the <strong>CAN-SPAM Act</strong> (if contacting US recipients).</li>
            <li>You comply with the <strong>GDPR</strong> (if contacting recipients in the European Union).</li>
            <li>Every commercial email you send includes a valid physical mailing address and a functional unsubscribe mechanism.</li>
            <li>You do not send messages to addresses obtained through data theft, data breaches, or purchased bulk email lists.</li>
          </ul>
          <p className="mt-3">Accounts with abnormal bounce rates (above 10%), spam complaints (above 0.3%), or any TRAI DND violations will be suspended immediately without refund.</p>
        </Section>

        <Section num="5" title="WhatsApp Integration">
          <p>ALKABRAIN's WhatsApp integration uses your personal WhatsApp account session via WhatsApp Web. By using this feature, you acknowledge and agree that:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>You use WhatsApp automation at your own risk. WhatsApp's Terms of Service prohibit unauthorized automation. Your account may be banned by WhatsApp if they detect automation.</li>
            <li>ALKABRAIN is not responsible for any WhatsApp account bans, suspensions, or penalties that result from your use of this feature.</li>
            <li>You will not use WhatsApp automation to send messages to individuals who have not consented to receive them.</li>
            <li>Sending bulk WhatsApp messages may violate WhatsApp Business Policies. Use this feature responsibly and within applicable limits.</li>
            <li>We store your WhatsApp session data securely but cannot guarantee its permanent availability. Session expiry may require re-authentication.</li>
          </ul>
        </Section>

        <Section num="6" title="Lead Scraping and Data Use">
          <p>Our lead scraping tool collects publicly available business contact information from search engine results (DuckDuckGo). By using this feature, you agree:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Scraped data is provided for your personal business use only and must not be shared, resold, or distributed.</li>
            <li>You are solely responsible for how you use scraped contact information.</li>
            <li>You will not use scraped data in any way that violates privacy laws or regulations applicable to the data subjects.</li>
            <li>We make no warranty regarding the accuracy, completeness, or freshness of scraped contact data.</li>
            <li>Credits are deducted upon scraping completion regardless of the number of results returned. Credits are non-refundable.</li>
          </ul>
        </Section>

        <Section num="7" title="Credits, Subscriptions, and Billing">
          <p><strong>Credit System:</strong> Credits are consumed when you use features like lead scraping (2 credits per search). New users receive 10 free credits upon registration.</p>
          <p><strong>Subscription Plans:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Trial: ₹5 for 3 days, 30 credits</li>
            <li>Monthly: ₹99 for 1 month, 300 credits</li>
            <li>Quarterly: ₹249 for 3 months, 1,000 credits</li>
            <li>Annual: ₹799 for 1 year, 5,000 credits</li>
          </ul>
          <p className="mt-3"><strong>Refund Policy:</strong> All payments are final and non-refundable except where required by applicable law. If you believe a charge was made in error, contact us at <strong>billing@alkabrain.in</strong> within 7 days of the charge.</p>
          <p><strong>Renewals:</strong> Subscriptions do not auto-renew. You must manually purchase a new plan when your subscription expires.</p>
          <p><strong>Price Changes:</strong> We may change subscription prices at any time with 30 days notice. Price changes will not affect your current active subscription period.</p>
          <p><strong>Unused Credits:</strong> Credits expire at the end of your subscription period and are not carried over or refunded.</p>
        </Section>

        <Section num="8" title="Intellectual Property">
          <p>All content on the Platform — including but not limited to software, design, logos, text, and graphics — is owned by or licensed to ALKABRAIN Technologies and protected under intellectual property laws.</p>
          <p>You are granted a limited, non-exclusive, non-transferable license to use the Platform solely for your internal business purposes. You may not copy, modify, distribute, sell, or sublicense any part of the Platform.</p>
          <p>You retain ownership of all content you create using the Platform (campaign copy, templates, etc.), but you grant us a non-exclusive license to store, display, and process this content as needed to operate the service.</p>
        </Section>

        <Section num="9" title="Privacy and Data Protection">
          <p>Your use of the Platform is also governed by our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>
          <p>We collect and process personal data in accordance with applicable Indian privacy laws and our Privacy Policy. By using the Platform, you consent to such collection and processing.</p>
          <p>You are responsible as an independent data controller for any personal data of third parties that you process using the Platform, including scraped lead data.</p>
        </Section>

        <Section num="10" title="Disclaimer of Warranties">
          <p>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING BUT NOT LIMITED TO:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Merchantability or fitness for a particular purpose</li>
            <li>Accuracy or reliability of scraped lead data</li>
            <li>Uninterrupted, error-free, or secure operation of the Platform</li>
            <li>Results from using campaigns or lead scraping features</li>
          </ul>
          <p className="mt-3">We do not guarantee any specific business outcomes, email delivery rates, or WhatsApp message success rates.</p>
        </Section>

        <Section num="11" title="Limitation of Liability">
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, LEADFLOW TECHNOLOGIES AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, goodwill, or business opportunities</li>
            <li>Damages arising from WhatsApp account bans or email delivery failures</li>
            <li>Losses resulting from third-party actions (e.g., DuckDuckGo changing its policies)</li>
          </ul>
          <p className="mt-3">OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM THESE TERMS OR YOUR USE OF THE PLATFORM SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 3 MONTHS PRECEDING THE CLAIM.</p>
        </Section>

        <Section num="12" title="Indemnification">
          <p>You agree to indemnify, defend, and hold harmless ALKABRAIN Technologies and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising out of:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Your use of the Platform or violation of these Terms</li>
            <li>Your violation of any applicable law or third-party rights</li>
            <li>Any content or messages you send through the Platform</li>
            <li>Your use of scraped lead data in a manner that violates privacy laws</li>
          </ul>
        </Section>

        <Section num="13" title="Termination">
          <p>We may suspend or terminate your account and access to the Platform immediately, without notice or liability, for any reason, including if we believe you have violated these Terms.</p>
          <p>Upon termination: (a) your right to use the Platform immediately ceases; (b) any unused credits are forfeited without refund; (c) we may retain your data as required by law or our policies.</p>
          <p>You may terminate your account at any time by contacting <strong>support@alkabrain.in</strong>. Termination does not entitle you to a refund of any unused subscription period.</p>
        </Section>

        <Section num="14" title="Governing Law and Dispute Resolution">
          <p>These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts located in <strong>New Delhi, India</strong>.</p>
          <p>Before initiating legal proceedings, you agree to first attempt to resolve disputes informally by contacting us at <strong>legal@alkabrain.in</strong>. We will attempt to resolve disputes within 30 days of receiving written notice.</p>
        </Section>

        <Section num="15" title="Changes to These Terms">
          <p>We reserve the right to modify these Terms at any time. We will notify you of material changes via email or prominent notice on the Platform at least 14 days before the changes take effect.</p>
          <p>Your continued use of the Platform after changes take effect constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using the Platform.</p>
        </Section>

        <Section num="16" title="Miscellaneous">
          <p><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force.</p>
          <p><strong>No Waiver:</strong> Our failure to enforce any provision shall not be deemed a waiver of our right to enforce it in the future.</p>
          <p><strong>Entire Agreement:</strong> These Terms, along with the Privacy Policy, constitute the entire agreement between you and us regarding the Platform.</p>
          <p><strong>Assignment:</strong> You may not assign your rights or obligations under these Terms without our prior written consent. We may freely assign our rights.</p>
        </Section>

        <div className="mt-12 p-6 rounded-xl bg-muted border">
          <p className="font-semibold text-foreground mb-2">Contact Us</p>
          <p className="text-sm text-muted-foreground">If you have questions about these Terms, please contact us:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Email: <a href="mailto:legal@alkabrain.in" className="text-primary hover:underline">legal@alkabrain.in</a></li>
            <li>Support: <a href="mailto:support@alkabrain.in" className="text-primary hover:underline">support@alkabrain.in</a></li>
            <li>Billing: <a href="mailto:billing@alkabrain.in" className="text-primary hover:underline">billing@alkabrain.in</a></li>
          </ul>
        </div>
      </div>
    </PublicLayout>
  );
}
