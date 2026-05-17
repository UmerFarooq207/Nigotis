import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CompliancePage() {
  return (
    <div className="container pt-20 mx-auto py-8 max-w-7xl px-4">
      <h1 className="text-4xl text-custom-gradient font-bold mb-8">
        Compliance
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Our Approach to Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We are committed to maintaining the highest standards of regulatory
            compliance to protect your data and ensure transparency.
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Regulatory Frameworks</AccordionTrigger>
              <AccordionContent>
                <p>
                  Our system adheres to key financial and data protection
                  regulations such as SOX, GDPR, CCPA, and other regional
                  frameworks to ensure comprehensive compliance.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Data Security</AccordionTrigger>
              <AccordionContent>
                <p>
                  We implement advanced encryption, secure access controls, and
                  continuous monitoring to safeguard user data and meet strict
                  data privacy standards.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Transparency & Reporting</AccordionTrigger>
              <AccordionContent>
                <p>
                  Our platform provides detailed reporting features and audit
                  logs to ensure accountability and enable easy regulatory
                  audits.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Key Compliance Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We support compliance across the following domains:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Financial Reporting & Audit Trails</li>
            <li>Tax Compliance and Filing Support</li>
            <li>Data Privacy & Consent Management</li>
            <li>Access Control & User Permissions</li>
            <li>Automated Regulatory Updates</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Certifications & Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our platform is designed in accordance with global standards:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>ISO/IEC 27001: Information Security Management</li>
            <li>PCI DSS: Secure Payment Processing</li>
            <li>IFRS & GAAP: Financial Reporting Standards</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Continuous Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Compliance is an ongoing commitment. We continually evolve to meet
            emerging standards and regulations:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proactive regulatory monitoring</li>
            <li>Quarterly platform compliance reviews</li>
            <li>Regular training for staff and partners</li>
            <li>Real-time alerts on compliance updates</li>
          </ul>
          <p className="mt-4">
            Trust is at the core of our compliance strategy — helping you stay
            secure, accountable, and aligned with regulations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
