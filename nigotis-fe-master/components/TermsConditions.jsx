import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const termsContent = {
  introduction: {
    title: "Introduction",
    content:
      "Welcome to our finance management platform. These Terms and Conditions govern your use of our services, including but not limited to client management, invoicing, company details, product/service management, employee management, payroll, asset tracking, expense tracking, income recording, and financial reporting.",
  },
  definitions: {
    title: "Definitions",
    items: [
      {
        term: "Platform",
        definition: "Our finance management software and related services.",
      },
      {
        term: "User",
        definition: "Any individual or entity accessing or using our Platform.",
      },
      {
        term: "Client",
        definition:
          "A customer or business entity for whom you manage financial information.",
      },
      {
        term: "Data",
        definition:
          "Any information input, stored, or generated through the use of our Platform.",
      },
    ],
  },
  dataUsage: {
    title: "Data Usage and Privacy",
    points: [
      "We collect and process data in accordance with our Privacy Policy.",
      "You retain ownership of all data you input into the Platform.",
      "We use industry-standard security measures to protect your data.",
      "We may anonymize and aggregate data for analytical purposes.",
    ],
  },
  userResponsibilities: {
    title: "User Responsibilities",
    content: "As a user of our Platform, you are responsible for:",
    points: [
      "Maintaining the confidentiality of your account credentials",
      "Ensuring the accuracy of all data input into the Platform",
      "Complying with all applicable laws and regulations",
      "Obtaining necessary permissions from clients, employees, and other relevant parties",
    ],
  },
  features: {
    title: "Platform Features",
    sections: [
      {
        title: "Client Management",
        description:
          "Our Platform allows you to manage client information, including contact details, financial history, and communication logs.",
      },
      {
        title: "Invoicing",
        description:
          "Create, send, and track invoices for your clients, including support for recurring invoices and payment reminders.",
      },
      {
        title: "Financial Reporting",
        description:
          "Generate various financial reports, including but not limited to:",
        items: [
          "Profit and Loss statements",
          "Balance Sheets",
          "Accounts Receivable Aging Summary",
          "Open Invoices Report",
        ],
      },
      {
        title: "Payroll Management",
        description:
          "Manage employee payroll, including salary calculations, tax deductions, and payment processing.",
      },
      {
        title: "Expense Tracking",
        description:
          "Record and categorize business expenses, attach receipts, and generate expense reports.",
      },
    ],
  },
  limitationOfLiability: {
    title: "Limitation of Liability",
    content:
      "While we strive to provide accurate and reliable services, we cannot guarantee the absence of errors or uninterrupted availability of the Platform. Our liability is limited to the extent permitted by applicable law.",
  },
  termination: {
    title: "Termination",
    content:
      "We reserve the right to terminate or suspend your access to the Platform for violations of these Terms and Conditions or for any other reason at our discretion. Upon termination, you may request a copy of your data within a reasonable timeframe.",
  },
};

const Section = ({ title, children }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const List = ({ items }) => (
  <ul className="list-disc pl-6 space-y-2">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

export default function TermsConditions() {
  return (
    <div className="container mx-auto py-8 px-4 pt-20 max-w-7xl">
      <h1 className="text-4xl text-custom-gradient font-bold mb-8">
        Terms and Conditions
      </h1>

      <Section title={termsContent.introduction.title}>
        <p>{termsContent.introduction.content}</p>
      </Section>

      <Section title={termsContent.definitions.title}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {termsContent.definitions.items.map((item, index) => (
            <div key={index} className="border-b pb-2">
              <dt className="font-semibold">{item.term}</dt>
              <dd>{item.definition}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={termsContent.dataUsage.title}>
        <List items={termsContent.dataUsage.points} />
      </Section>

      <Section title={termsContent.userResponsibilities.title}>
        <p>{termsContent.userResponsibilities.content}</p>
        <List items={termsContent.userResponsibilities.points} />
      </Section>

      <Section title={termsContent.features.title}>
        {termsContent.features.sections.map((section, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <p>{section.description}</p>
            {section.items && <List items={section.items} />}
          </div>
        ))}
      </Section>

      <Section title={termsContent.limitationOfLiability.title}>
        <p>{termsContent.limitationOfLiability.content}</p>
      </Section>

      <Section title={termsContent.termination.title}>
        <p>{termsContent.termination.content}</p>
      </Section>

      <Separator className="my-8" />

      <p className="text-sm text-gray-500 text-center">
        By using our Platform, you agree to these Terms and Conditions. If you
        do not agree, please do not use our services.
      </p>
    </div>
  );
}
