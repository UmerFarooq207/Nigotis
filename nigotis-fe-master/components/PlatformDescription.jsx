import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlatformDescription() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Our Finance Management Platform</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Welcome to our comprehensive finance management platform, designed to
          empower businesses with robust financial tools and insights. Our
          solution offers a wide range of features to streamline your company's
          financial operations, similar to industry-leading software like
          QuickBooks.
        </p>
        <h3 className="text-xl font-semibold">Key Features:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Client Management:</strong> Easily manage your client
            database, including contact information, communication history, and
            financial transactions.
          </li>
          <li>
            <strong>Invoicing:</strong> Create, send, and track professional
            invoices. Monitor payment status and automate reminders for overdue
            payments.
          </li>
          <li>
            <strong>Company Details:</strong> Maintain a centralized repository
            for all your company information, including legal details, tax IDs,
            and business licenses.
          </li>
          <li>
            <strong>Products and Services:</strong> Manage your offerings with
            detailed descriptions, pricing, and inventory tracking for physical
            products.
          </li>
          <li>
            <strong>Employee Management:</strong> Keep track of employee
            information, roles, and performance metrics.
          </li>
          <li>
            <strong>Payroll Processing:</strong> Automate payroll calculations,
            tax withholdings, and direct deposits for your employees.
          </li>
          <li>
            <strong>Asset Tracking:</strong> Monitor and manage company assets,
            including depreciation calculations and maintenance schedules.
          </li>
          <li>
            <strong>Expense Management:</strong> Record, categorize, and analyze
            business expenses for better financial control and tax reporting.
          </li>
          <li>
            <strong>Income Tracking:</strong> Monitor all revenue streams and
            generate insightful reports on income patterns and growth.
          </li>
        </ul>
        <h3 className="text-xl font-semibold mt-6">Financial Reporting:</h3>
        <p>
          Our platform provides a suite of powerful financial reports to give
          you a clear picture of your company's financial health:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Profit and Loss Statements:</strong> Analyze your company's
            profitability over specific periods.
          </li>
          <li>
            <strong>Balance Sheets:</strong> Get a snapshot of your company's
            financial position, including assets, liabilities, and equity.
          </li>
          <li>
            <strong>Open Invoices Report:</strong> Track outstanding payments
            and manage your accounts receivable effectively.
          </li>
          <li>
            <strong>AR Aging Summary:</strong> Visualize the age of your
            receivables to prioritize collection efforts.
          </li>
          <li>
            <strong>Cash Flow Statements:</strong> Understand how cash is moving
            in and out of your business.
          </li>
          <li>
            <strong>Custom Reports:</strong> Create tailored reports to meet
            your specific business needs and decision-making processes.
          </li>
        </ul>
        <p className="mt-4">
          Our platform is designed to grow with your business, offering scalable
          solutions for companies of all sizes. With robust security measures
          and regular updates, you can trust that your financial data is safe
          and that you're always working with the latest features and compliance
          standards.
        </p>
      </CardContent>
    </Card>
  );
}
