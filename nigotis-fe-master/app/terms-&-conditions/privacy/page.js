import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PrivacyPage() {
  return (
    <div className="container pt-20 mx-auto max-w-7xl py-8 px-4">
      <h1 className="text-4xl text-custom-gradient font-bold mb-8">
        Privacy Policy
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We collect various types of data to provide and improve our finance
            management services. This includes:
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Client Information</AccordionTrigger>
              <AccordionContent>
                <p>
                  Names, addresses, contact details, and financial history of
                  your clients.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Financial Records</AccordionTrigger>
              <AccordionContent>
                <p>
                  Invoices, expenses, income, assets, and other financial data
                  related to your business operations.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Employee Details</AccordionTrigger>
              <AccordionContent>
                <p>
                  Names, addresses, social security numbers, salary information,
                  and other payroll-related data for your employees.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>User Activity Logs</AccordionTrigger>
              <AccordionContent>
                <p>
                  Information about how you use our platform, including login
                  times, features used, and actions taken.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The collected data is used for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing and improving our finance management services</li>
            <li>
              Generating financial reports such as profit and loss statements,
              balance sheets, and cash flow statements
            </li>
            <li>Processing payroll and managing employee benefits</li>
            <li>Complying with legal obligations and financial regulations</li>
            <li>
              Analyzing usage patterns to improve user experience and platform
              performance
            </li>
          </ul>
          <p className="mt-4">
            We do not sell personal data to third parties under any
            circumstances.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Rights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            As a user of our platform, you have the following rights regarding
            your personal data:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Right to access: You can request a copy of your personal data at
              any time.
            </li>
            <li>
              Right to rectification: You can request corrections to any
              inaccurate or incomplete data.
            </li>
            <li>
              Right to erasure: You can request the deletion of your personal
              data, subject to legal retention requirements.
            </li>
            <li>
              Right to data portability: You can request a copy of your data in
              a structured, commonly used, and machine-readable format.
            </li>
            <li>
              Right to object: You can object to the processing of your personal
              data for certain purposes.
            </li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, please contact our Data Protection
            Officer at dpo@example.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
