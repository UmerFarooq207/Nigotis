import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LegalPage() {
  return (
    <div className="container pt-20 mx-auto max-w-7xl py-8 px-4">
      <h1 className="text-4xl text-custom-gradient font-bold mb-8">
        Legal Information
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>User Responsibilities</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Maintain the confidentiality of your account credentials
                  </li>
                  <li>
                    Ensure the accuracy of all data input into the Platform
                  </li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>
                    Obtain necessary permissions from clients, employees, and
                    other relevant parties
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Data Ownership</AccordionTrigger>
              <AccordionContent>
                <p>
                  You retain ownership of all data you input into the Platform.
                  We may anonymize and aggregate data for analytical purposes,
                  but we will never sell or share your personal or client data
                  without your explicit consent.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Service Limitations</AccordionTrigger>
              <AccordionContent>
                <p>
                  While we strive to provide accurate and reliable services, we
                  cannot guarantee the absence of errors or uninterrupted
                  availability of the Platform. Our liability is limited to the
                  extent permitted by applicable law.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            All content, features, and functionality of our platform are owned
            by us and are protected by international copyright, trademark,
            patent, trade secret, and other intellectual property laws. Users
            are granted a limited, non-exclusive license to use the platform for
            its intended purpose.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dispute Resolution</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Any disputes arising from the use of our platform will be resolved
            through arbitration. The arbitration process will be conducted by a
            neutral arbitrator and will take place in [City, State/Country]. The
            decision of the arbitrator will be final and binding on both
            parties.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Termination</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We reserve the right to terminate or suspend your access to the
            Platform for violations of these Terms and Conditions or for any
            other reason at our discretion. Upon termination, you may request a
            copy of your data within a reasonable timeframe, which we will
            provide in a commonly used, machine-readable format.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
