import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SecurityPage() {
  return (
    <div className="container pt-20 mx-auto py-8 max-w-7xl px-4">
      <h1 className="text-4xl text-custom-gradient font-bold mb-8">
        Security Measures
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Encryption</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We use industry-standard encryption protocols to protect your data:
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Data in Transit</AccordionTrigger>
              <AccordionContent>
                <p>
                  All data transmitted between your device and our servers is
                  encrypted using SSL/TLS protocols, ensuring that your
                  information cannot be intercepted or read by unauthorized
                  parties during transmission.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Data at Rest</AccordionTrigger>
              <AccordionContent>
                <p>
                  We use AES-256 encryption for all data stored on our servers.
                  This military-grade encryption ensures that even if
                  unauthorized access to our servers were to occur, the data
                  would remain unreadable and secure.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Access Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We implement strict access controls and authentication measures:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Multi-factor authentication (MFA) for all user accounts</li>
            <li>
              Role-based access control (RBAC) to ensure users only have access
              to the data they need
            </li>
            <li>
              Regular access reviews to maintain the principle of least
              privilege
            </li>
            <li>
              Automatic session timeouts and account lockouts after multiple
              failed login attempts
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Regular Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We conduct regular security audits and penetration testing to
            identify and address potential vulnerabilities:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Annual third-party security audits</li>
            <li>Quarterly internal vulnerability assessments</li>
            <li>
              Continuous automated security scanning of our infrastructure
            </li>
            <li>
              Bug bounty program to encourage responsible disclosure of security
              issues
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incident Response</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We have a comprehensive incident response plan in place to quickly
            address and mitigate any security breaches or data loss events:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Immediate isolation of affected systems</li>
            <li>Rapid assessment of the scope and impact of the incident</li>
            <li>Notification of affected users within 72 hours of discovery</li>
            <li>
              Collaboration with law enforcement and cybersecurity experts as
              needed
            </li>
            <li>
              Post-incident analysis and implementation of preventive measures
            </li>
          </ol>
          <p className="mt-4">
            Our incident response team conducts regular drills to ensure
            readiness in the event of a real security incident.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
