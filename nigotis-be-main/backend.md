# Nigotis — Backend & Admin Panel Reference

A complete, opinionated map of the Nigotis backend (`nigotis-be-main`) and the SuperAdmin panel that lives in the frontend (`nigotis-fe-master/app/super-admin`). Use this as your one-stop reference whenever you need to change a feature, add a field, debug a flow, or extend a permission.

---

## 1. Tech Stack & High-level Architecture

| Layer | Technology |
|---|---|
| Runtime / Framework | **Next.js 14.2.13** (App Router, JS — no TypeScript) |
| Database | **MongoDB** via **Mongoose 8** |
| Auth | **JWT** (`jsonwebtoken`) + **bcryptjs** for password hashing + **Google OAuth2** |
| Payments | **Stripe** (`stripe` SDK v17) + **Ziina** (UAE — custom REST wrapper) |
| Email | **Nodemailer** over Gmail SMTP |
| File Uploads | **AWS S3** (uploads happen on the FE — backend just stores the object key) |
| Frontend (admin panels) | Next.js 14, React 18, Tailwind, shadcn/ui |

**Two separate Next.js apps:**
- `nigotis-be-main/` — pure API server (`/api/v1/...` routes only)
- `nigotis-fe-master/` — marketing site + user dashboard + **SuperAdmin panel** (`/super-admin/...`)

The FE talks to the BE over HTTP using `fetchCustom()` (see [nigotis-fe-master/lib/utils.js](nigotis-fe-master/nigotis-fe-master/lib/utils.js)). Auth is via `Authorization: Bearer <JWT>`.

---

## 2. Folder Map — Backend

```
nigotis-be-main/nigotis-be-main/
├── src/
│   ├── middleware.js            ← CORS (global Next.js middleware)
│   ├── middleware/user.js       ← Role guards (userAuthGuard, userAdminGuard, etc.)
│   ├── lib/
│   │   ├── db.js                ← Mongoose connection (cached on globalThis)
│   │   └── utils.js             ← Static currency list
│   ├── models/                  ← All Mongoose schemas
│   ├── utils/
│   │   ├── sendMail.js          ← Nodemailer wrapper
│   │   ├── sendOTPCode.js       ← OTP + credentials email helpers
│   │   ├── notification.js      ← In-app notification creator
│   │   ├── whatsappMails.js     ← WhatsApp feature email templates
│   │   └── resError.js          ← Standard JSON error response
│   └── app/api/v1/...           ← All API routes (App Router)
```

---

## 3. Environment Variables (`.env`)

Required at runtime — read directly via `process.env`:

| Variable | Used by |
|---|---|
| `DB_URI` | `src/lib/db.js` — MongoDB connection string |
| `JWT_SECRET` | `models/user.js` (sign), `middleware/user.js` (verify) — JWT signing |
| `ALLOWED_ORIGINS` | `src/middleware.js` — comma-separated CORS allowlist |
| `SITE_EMAIL`, `APP_PASS_KEY` | `utils/sendMail.js` — Gmail SMTP credentials (app password) |
| `SUPPORT_EMAIL`, `CONTACT_EMAIL` | invoice/contact/careers handlers |
| `FRONTEND_URL` | `utils/sendOTPCode.js` — link back to sign-in page in credential emails |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Google OAuth callback |
| `STRIPE_SECRET_KEY` | `/api/v1/process-payment` |
| `ZIINA_WEBHOOK_SECRET` | `/api/v1/ziina/webhook` — HMAC verification (optional but recommended) |
| `NEXT_PUBLIC_GRACE_PERIOD` | `middleware/user.js` — grace days after subscription expires |
| `NEXT_PUBLIC_BASE_URL` | `/api/v1/reports/cashflow` — internal API self-call |
| `NEXT_PUBLIC_AWS_OBJECT_BASE_URL` | invoice email attachment URLs |

---

## 4. Data Models

All in `src/models/`. Every model has a `try {find existing}/catch {register}` pattern so hot-reload won't double-register.

### 4.1 User — [user.js](nigotis-be-main/nigotis-be-main/src/models/user.js)
Anyone who logs in: super-admin, admin (company owner), or sub-account (employee/sales/hr/finance).

| Field | Notes |
|---|---|
| `email`, `password` | Password is bcrypt-hashed on save via pre('save') hook |
| `provider`, `providerId` | `"local"` or `"google"` — for OAuth users password is `<googleId>+"nigotis"` |
| `role` | enum: `super-admin`, `admin`, `employee`, `sales`, `hr`, `finance` |
| `companyId` | ref → Company (sub-accounts inherit the admin's company) |
| `subscriptionId` | ref → User_Subscription (only on the admin/buyer) |
| `personalInfo`, `jobInfo` | refs → PersonalInfo, JobInfo |
| `code`, `codeGeneratedAt`, `isVerified` | OTP for email verification (15-min expiry) |
| `isBuyer` | `true` only for the admin who signed up (used to find paying users) |
| `allowedFreeInvoices` | Legacy field — `3` by default. The current free-trial gate uses **14 days from createdAt** instead (see `subscriptionCheckGuard`) |

**Methods**: `generateJWT()` (30d expiry), `comparePassword(plain)`.

### 4.2 Company — [company.js](nigotis-be-main/nigotis-be-main/src/models/company.js)
One company per admin. Sub-accounts reference it via `User.companyId`.

| Field | Notes |
|---|---|
| `adminId`, `subscriptionId` | refs to the owning User and the active subscription |
| `displayName`, `legalName`, `type`, `ein`, `ssn` | Tax/legal identifiers |
| `logo`, `address`, `phone`, `email`, `currencyCode` | Branding + locale |
| `whatsAppNo`, `isWhatsAppActive`, `isReqWhatsApp` | Drives the WhatsApp request → activation flow |

### 4.3 Client — [client.js](nigotis-be-main/nigotis-be-main/src/models/client.js)
A customer of a company (invoices are issued *to* clients).
`companyId`, `personalInfo` (ref), `email` (unique), `about`.

### 4.4 Product / SaleProduct — [product.js](nigotis-be-main/nigotis-be-main/src/models/product.js), [sale_product.js](nigotis-be-main/nigotis-be-main/src/models/sale_product.js)
- **Product**: master catalog item (`name`, `desc`, `price`, `images`, `companyId`)
- **SaleProduct**: a Product snapshotted onto a specific Invoice with `quantity` + `salePrice`. Created when an invoice is posted.

### 4.5 Invoice — [invoice.js](nigotis-be-main/nigotis-be-main/src/models/invoice.js)
| Field | Notes |
|---|---|
| `companyId`, `clientId`, `invoiceBy` (User) | Ownership |
| `items` | array of SaleProduct refs |
| `invoiceNo` | unique, auto-incremented starting at `1000 + invoices.length` |
| `issueDate`, `dueDate`, `status` (`pending`/`paid`) | Lifecycle |
| `tax`, `discount` | Percentages |
| `totalAmount`, `paidAmount` | Computed on the server: `subtotal + tax% − discount%` |
| `fileName` | S3 key for the generated PDF |
| `notes` | Free-form |

Creating an invoice **also creates an Income record** of type `invoice` (in `/api/v1/client/invoice` POST).

### 4.6 Income / Expense / Asset
- **Income** ([income.js](nigotis-be-main/nigotis-be-main/src/models/income.js)) — `type`: `invoice` | `asset` | `others`. `status`: `paid` | `pending`. Reports filter on `status: "paid"`.
- **Expense** ([expense.js](nigotis-be-main/nigotis-be-main/src/models/expense.js)) — `type`: `bill` | `payroll` | `others`. Has `from`/`to` for payroll-style ranges.
- **Asset** ([asset.js](nigotis-be-main/nigotis-be-main/src/models/asset.js)) — `title`, `desc`, `quantity`, `totalAmount`, `date`.

### 4.7 Payroll / PayrollRuns
- **Payroll** ([payroll.js](nigotis-be-main/nigotis-be-main/src/models/payroll.js)) — **the recurring config** per employee: `salaryType` (`fixed`/`hourly`), `salary`, `bonus`, `tax`, `hourlyRate`, `overtimeHours`, `overtimeHourlyRate`.
- **PayrollRuns** ([payrollruns.js](nigotis-be-main/nigotis-be-main/src/models/payrollruns.js)) — **a single payment event**. Created when HR runs payroll for a period; snapshots all Payroll fields plus `from`, `to`, `noOfWorkingHours`, `totalAmount`, `status` (`pending`/`partially-paid`/`paid`), `attachments`, `notes`. Each run also creates a linked Expense of type `payroll`.

### 4.8 Plan / User_Subscription
- **Plan** ([plan.js](nigotis-be-main/nigotis-be-main/src/models/plan.js)) — SuperAdmin-managed pricing tier. `type`: `basic` | `pro` | `premium` | `custom`. `screens`, `pricePerMonth`, `pricePerScreen`, `oldPricePerMonth`, `includes[]` (each include = `{title, tagline, points[]}`). Public price page hides `custom`.
- **User_Subscription** ([user_subscription.js](nigotis-be-main/nigotis-be-main/src/models/user_subscription.js) — Per-user active subscription with embedded `planTrack[]` history of every renewal/upgrade (each entry stores planId, dates, fee, transactionId, screens). `status`: `active` | `unverified` | `expired`.

### 4.9 PersonalInfo / JobInfo / Notification
- **PersonalInfo**: `title, firstName, middleName, lastName, address, phone, avatar, department, jobRole, joinDate` — shared between Users *and* Clients.
- **JobInfo**: `employeeId` (auto-generated `1000 + n`, unique per company), `department`, `jobRole`, `joinDate`, ref to `payrollId`.
- **Notification**: `sentTo` (User), `title`, `message`, `link`, `isViewed`.

---

## 5. Authentication & Authorization

### 5.1 Sign-up / Login flows
| Flow | Endpoint | Notes |
|---|---|---|
| Email sign-up | `POST /api/v1/user` | Creates User+PersonalInfo+JobInfo, sends OTP, returns JWT. `isBuyer: true`. |
| Email verification | `PUT /api/v1/user/verify-code` | 15-minute OTP window. |
| Resend OTP | `POST /api/v1/user/resend-code` | New code, new `codeGeneratedAt`. |
| Email login | `POST /api/v1/user/login` | `loginAs: "admin"` matches admin/super-admin; otherwise matches sub-accounts. Returns deeply-populated user + JWT. |
| Refresh user | `GET /api/v1/user/login` | With `Authorization` header, re-fetches the populated user and re-issues a JWT. |
| Google login | `POST /api/v1/user/login/google` | FE sends Google access token in `Authorization`; backend fetches user info from Google directly, creates the User if missing, returns app JWT. |
| OAuth callback (legacy) | `GET /api/v1/auth/callback/google` | Exchanges `code` for token. Currently logs only; the active path is `/login/google`. |
| Sub-account creation | `POST /api/v1/user/create-user` | HR or admin only. Sends credentials email if role ≠ `employee`. |

### 5.2 Role Guards — [middleware/user.js](nigotis-be-main/nigotis-be-main/src/middleware/user.js)
All guards extract `Authorization: Bearer <token>`, verify JWT, then look up the User with `companyId` + `personalInfo` populated.

| Guard | Allowed roles |
|---|---|
| `userAuthGuard` | any logged-in user |
| `userAdminGuard` | `admin` only |
| `userSuperAdminGuard` | `super-admin` only |
| `userEmployeeGuard` | `employee` or `admin` |
| `userHRGuard` | `hr` or `admin` |
| `userFinanceGuard` | `finance` or `admin` |
| `userSalesGuard` | `sales` or `admin` |
| `subscriptionCheckGuard(subscriptionId, user)` | Not a role — checks subscription status. **Free-trial logic**: if no `subscriptionId`, user gets 14 days from `createdAt`. After that, blocks writes. Uses `NEXT_PUBLIC_GRACE_PERIOD` (days) for paid users past `endDate`. |

> **Note**: `admin` is implicitly granted to every HR/Finance/Sales endpoint — admins can do anything within their company.

### 5.3 CORS — [src/middleware.js](nigotis-be-main/nigotis-be-main/src/middleware.js)
Applies to `/api/:path*`. Origins whitelisted via `ALLOWED_ORIGINS` (comma-separated). Methods: `GET, POST, PUT, DELETE, OPTIONS`. Allowed headers: `Content-Type, Authorization`. Credentials: `true`.

---

## 6. API Routes — Full Reference

All routes are under `/api/v1`. **Response shape**: `{ success: boolean, message?: string, data?: any }`. Errors return HTTP 400 via [resError.js](nigotis-be-main/nigotis-be-main/src/utils/resError.js).

### 6.1 User & Sub-accounts (`/user`)
| Method + Path | Guard | Purpose |
|---|---|---|
| `POST /user` | public | Sign-up new admin/buyer |
| `GET /user` | HR | List all employees in company |
| `PUT /user` | auth | Update password/email for a user |
| `DELETE /user` | HR | Delete an employee + their PersonalInfo, JobInfo, Payroll |
| `POST /user/login` | public | Email/password login |
| `GET /user/login` | auth | Re-hydrate user + new JWT |
| `POST /user/login/google` | public (bearer = Google token) | Google OAuth login/signup |
| `PUT /user/verify-code` | public | Submit OTP |
| `POST /user/resend-code` | public | Generate + email new OTP |
| `POST /user/create-user` | HR | Create sub-account (employee/sales/hr/finance/admin) |
| `PUT /user/personal` | auth | Update PersonalInfo |
| `PUT /user/job-info` | auth | Update JobInfo (employeeId unique per company) |
| `PUT /user/role` | admin | Change a sub-account's role (cannot promote to super-admin, must be same company) |
| `GET /user/sub-accounts` | admin | List sub-accounts (excludes plain employees/admin) |
| `POST /user/bulk-import` | sales/admin | Bulk-create employees from CSV-shaped JSON |
| `GET /user/superadmin` | super-admin | List all admin/buyer users (deep-populated subscriptions) |
| `DELETE /user/superadmin` | super-admin | Hard-delete user **and all their company data** (cascading) |
| `GET /user/superadmin/figures` | super-admin | Dashboard counts: total/active/inactive/free users |
| `GET /user/:id` | super-admin | Fetch any user by ID |

### 6.2 Company (`/company`)
| Method + Path | Guard | Purpose |
|---|---|---|
| `GET /company` | super-admin | List **all** companies |
| `POST /company` | admin | Create the admin's company (also sets `User.companyId`) |
| `PUT /company` | admin | Update own company |
| `DELETE /company` | admin or super-admin | Admin deletes own; super-admin deletes any. Unsets `User.companyId`. |

### 6.3 WhatsApp feature (`/company/whatsapp-req`)
| Method + Path | Guard | Purpose |
|---|---|---|
| `GET /company/whatsapp-req` | super-admin | List companies with `isReqWhatsApp: true` |
| `POST /company/whatsapp-req` | admin | Submit/update WhatsApp number, set `isReqWhatsApp: true`, email ack |
| `DELETE /company/whatsapp-req` | admin | Cancel own request |
| `GET /company/whatsapp-req/activate` | super-admin | List `isWhatsAppActive: true` companies |
| `PUT /company/whatsapp-req/activate` | super-admin | Flip `isWhatsAppActive: true`, clears request flag, emails admin |
| `PUT /company/whatsapp-req/deactivate` | admin or super-admin | Flip `isWhatsAppActive: false`, emails admin |

### 6.4 Assets, Expenses, Income (`/company/asset`, `/company/expense`, `/income`)
All follow the same CRUD pattern, all gated by `userFinanceGuard` (admin/finance):
- `GET` — list (sorted by `createdAt` desc, populated with `addedBy → personalInfo`)
- `POST` — create (passes through `subscriptionCheckGuard`)
- `PUT` — update
- `DELETE` — delete

Bulk import variants live at `/company/asset/bulk-import`, `/company/expense/bulk-import`, `/income/bulk-import` (all sales/admin guard).

**Income `GET`** supports `?fromDate=&toDate=` query params for date filtering.

### 6.5 Clients (`/client`)
| Method + Path | Guard | Purpose |
|---|---|---|
| `GET /client` | sales | List clients of own company |
| `POST /client` | sales | Create Client + PersonalInfo |
| `PUT /client` | sales | Update email/about |
| `DELETE /client` | sales | Delete — **blocked if any invoice references this client** |
| `POST /client/bulk-import` | sales | Bulk-create clients |

### 6.6 Invoices (`/client/invoice`)
| Method + Path | Guard | Purpose |
|---|---|---|
| `GET /client/invoice` | sales | List all invoices of company (sorted desc, deeply populated) |
| `POST /client/invoice` | sales | Create invoice + SaleProducts + linked Income. Auto-numbers invoice. Sends email to client with PDF attachment. Notifies admin. |
| `PUT /client/invoice` | sales | Update invoice. Cascades `status`/`totalAmount` to Income. Emails client + notifies admin. |
| `DELETE /client/invoice` | sales | Deletes invoice + linked Income + linked SaleProducts |

**Invoice creation also**:
1. Computes `totalAmount = subtotal + tax% − discount%`
2. Creates an Income record (type `invoice`)
3. Sends mail to client (with optional PDF attachment from S3 via `NEXT_PUBLIC_AWS_OBJECT_BASE_URL`)
4. Calls `createNotification` for the company admin

### 6.7 Sale Products (`/sale-product`)
`GET` — list all sale products for the company (sales guard).

### 6.8 Payroll (`/payroll`, `/payroll/runs`)
| Method + Path | Guard | Purpose |
|---|---|---|
| `GET /payroll` | HR | List all employees' Payroll configs |
| `POST /payroll` | HR | Create Payroll for an employee (one per employee; also sets `JobInfo.payrollId`) |
| `PUT /payroll` | HR | Update Payroll config |
| `GET /payroll/runs?employeeId=` | HR | List PayrollRuns for one employee |
| `POST /payroll/runs` | HR | Run payroll for one employee in a period. **Also creates an Expense** of type `payroll`. Notifies the employee. |
| `PUT /payroll/runs` | HR | Update a run — also updates the linked Expense |
| `DELETE /payroll/runs?payrollRunsId=` | HR | Delete a run + linked Expense |
| `GET /payroll/runs/all` | HR | All runs across the company (sorted desc) |

### 6.9 Plans & Subscriptions (`/plan`)
| Method + Path | Guard | Purpose |
|---|---|---|
| `GET /plan` | super-admin | List all plans (including `custom`) |
| `POST /plan` | super-admin | Create plan |
| `PUT /plan` | super-admin | Update plan |
| `DELETE /plan` | super-admin | Delete plan |
| `GET /plan/get?id=` | public | Public plan listing — excludes `custom` type unless `?id=` provided |
| `GET /plan/subscription` | super-admin | List **all** user subscriptions |
| `POST /plan/subscription` | admin | Buy first subscription (creates User_Subscription, attaches to user + company) |
| `PUT /plan/subscription` | admin or super-admin | Renew/upgrade/downgrade — pushes new entry into `planTrack[]` |
| `DELETE /plan/subscription` | admin or super-admin | Cancel subscription, clears `User.subscriptionId` |
| `PUT /plan/subscription/screens/buy` | admin or super-admin | Top up additional screens (updates last `planTrack` entry) |

### 6.10 Payments
| Path | Notes |
|---|---|
| `POST /process-payment` | Creates a Stripe **PaymentIntent** in USD. Returns `client_secret` as raw text body. |
| `GET /ziina/verify/:paymentIntentId` | Verifies a Ziina payment intent — returns `success: true` only if `status === "completed"` |
| `POST /ziina/refund` | Creates a Ziina refund (full or partial). Amount in dollars, converted to fils server-side. |
| `POST /ziina/webhook` | **Webhook receiver**. IP-whitelisted to `3.29.184.186, 3.29.190.95, 20.233.47.127, 13.202.161.181`. Optional HMAC-SHA256 verification via `ZIINA_WEBHOOK_SECRET`. Handles `payment_intent.status.updated` and `refund.status.updated`. Currently logs only — **TODO: mark invoice/subscription paid in DB.** |

> Note: `lib/ziina.js` is referenced (`createRefund`, `getPaymentIntent`) but does not exist yet in `src/lib/`. Add it before deploying Ziina flows.

### 6.11 Notifications (`/notification`)
| Method + Path | Guard | Purpose |
|---|---|---|
| `GET /notification?type=all\|new\|read` | auth | List own notifications (newest first) |
| `PUT /notification?_id=` | auth | Mark as read |

### 6.12 Reports (`/reports`)
All guarded by `userFinanceGuard`. Query params shown below; all return `{ success, data }`.

| Path | Params | Output |
|---|---|---|
| `/reports/profit-loss` | `fromDate`, `toDate` | Grouped paid incomes & expenses by `type`, totals, net |
| `/reports/balance-sheet` | `date` (as-of) | Assets with `date ≤ date`, total |
| `/reports/cashflow` | `fromDate`, `toDate` | Month-by-month income vs expense (calls `/reports/income` and `/reports/expenses` internally — those endpoints are referenced but not present in this dump; build/verify them if missing) |
| `/reports/invoices` | `fromDate`, `toDate` (optional) | Aggregated counts/amounts: total, current, overdue, paid |
| `/reports/open-invoices` | `fromDate`, `toDate`, `overDue` | Pending invoices in window, optionally only overdue |
| `/reports/ar-aging-summary` | `date` | Pending invoices bucketed by days past due: `1-30`, `31-60`, `61-90`, `91+` |

### 6.13 Public utility endpoints
| Path | Notes |
|---|---|
| `POST /contact` | Public contact form — emails `CONTACT_EMAIL` |
| `POST /careers-apply` | Public career application — emails `CONTACT_EMAIL` with CV link |

---

## 7. Cross-cutting Behaviors

### 7.1 Auto-create cascades
- **User signup** → creates User + PersonalInfo + JobInfo (employee/admin defaults)
- **Invoice POST** → creates Invoice + SaleProducts (one per item) + Income
- **PayrollRuns POST** → creates PayrollRun + Expense (type `payroll`)
- **Company POST** → updates `User.companyId`

### 7.2 Cascade deletes
- **`DELETE /user/superadmin`** wipes: User, PersonalInfo, User_Subscription, Company, Notifications, Invoice, Product, SaleProduct, Asset, Income, Client, Payroll, PayrollRuns, JobInfo, **and** all sub-account Users in that company.
- **`DELETE /company`** unsets `User.companyId` but does NOT cascade other company data — be careful, this can leave orphans.
- **`DELETE /payroll/runs`** also deletes the linked Expense.
- **`DELETE /client/invoice`** deletes linked Income + SaleProducts.

### 7.3 Notifications
Server-side helper [`createNotification({sentTo, title, message, link})`](nigotis-be-main/nigotis-be-main/src/utils/notification.js). Currently triggered on:
- Invoice created → notifies company admin
- Invoice updated → notifies company admin
- Payroll run created → notifies the employee
- Payroll run updated → notifies the employee (note: bug — references undefined `employeeId` variable in the PUT handler)

### 7.4 Email
All emails go through [`sendMail(to, subject, html, attachments, companyName)`](nigotis-be-main/nigotis-be-main/src/utils/sendMail.js) (Gmail SMTP). Templated helpers:
- `sendOTPCode(email)` — verification OTP
- `sendCredentialsToUser(email, password, role, name, companyName)` — when admin creates a non-employee sub-account
- `sendWhatsappFeatureRequestAcknowledgement / Activated / Deactivated`
- Inline templates for: invoice generated/updated, contact form, careers application

### 7.5 Subscription / free trial gate
`subscriptionCheckGuard` runs before nearly every write. Logic:
1. **No subscriptionId** → user is on free trial. Allow if `now - createdAt < 14 days`. Else block.
2. **With subscriptionId** → load `User_Subscription`. If `now > endDate` mark `status: "expired"`. Allow during grace period (`NEXT_PUBLIC_GRACE_PERIOD` days). Else block.
3. Network/connection errors return a user-friendly retry message.

---

## 8. SuperAdmin Panel (Frontend)

Located at `nigotis-fe-master/app/super-admin/` — wrapped by [SuperAdminDashboardSkeleton](nigotis-fe-master/nigotis-fe-master/components/SuperAdmin/SuperAdminDashboardSkeleton.jsx).

| Route | Component | Talks to |
|---|---|---|
| `/super-admin` | [SuperAdminHome](nigotis-fe-master/nigotis-fe-master/components/SuperAdmin/Home/SuperAdminHome.jsx) | `GET /user/superadmin/figures` |
| `/super-admin/users` | [SuperAdminUsers / AllUsers](nigotis-fe-master/nigotis-fe-master/components/SuperAdmin/Users/AllUsers.jsx) | `GET /user/superadmin`, `DELETE /user/superadmin` |
| `/super-admin/plans` | [SuperAdminPlans / AllPlans](nigotis-fe-master/nigotis-fe-master/components/SuperAdmin/Plans/AllPlans.jsx) + EditPlan | `GET /plan`, `PUT /plan`, `DELETE /plan` |
| `/super-admin/plans/new` | [SuperAdminAddPlan / PlanDetails](nigotis-fe-master/nigotis-fe-master/components/SuperAdmin/Plans/New/SuperAdminAddPlan.jsx) | `POST /plan` |
| `/super-admin/whatsapp-requests` | [WhatsAppFeatureManagment](nigotis-fe-master/nigotis-fe-master/components/SuperAdmin/WhatsApp/WhatsAppFeatureManagment.jsx) | `GET/PUT /company/whatsapp-req` + `/activate` + `/deactivate` |
| `/super-admin/profile` | Reuses dashboard Profile component | `PUT /user/personal` |

### SuperAdmin Home (dashboard cards)
Displays counts from `/user/superadmin/figures`:
- **Total Users** (all buyers)
- **14-Day Free Trial Users** (no subscription) — split into *Active* (within trial) and *Expired* (trial over)
- **Active Subscriptions** (paid, endDate in future)
- **Expired Subscriptions** (paid, endDate in past)

### Users page features
- Search by email, first name, last name, or transaction ID (across all `planTrack` entries)
- Filter by subscription status: `all`/`active`/`expired`/`free`
- Expand row → shows phone, address, role, current plan fee, period, and full **plan track history** (start, end, fee, screens, transaction ID)
- Delete user (with confirmation) — triggers the cascading delete on the backend

### Plans page features
- Search by plan name, filter by type (`basic`/`pro`/`premium`/`custom`/`all`)
- Expand row → shows plan `_id` and all `includes` (title, tagline, points)
- Edit plan (opens [EditPlan](nigotis-fe-master/nigotis-fe-master/components/SuperAdmin/Plans/EditPlan.jsx))
- **Delete is only enabled for `custom` plans** (avoid accidentally killing a tier with active subscribers)

### WhatsApp Management
Two tabs: **Pending** and **Activated**. Each company card shows displayName, company email, admin name + email, phone, and WhatsApp number with copy-to-clipboard. Buttons:
- *Activate* on pending → `PUT /company/whatsapp-req/activate`
- *Deactivate* on activated → `PUT /company/whatsapp-req/deactivate`

---

## 9. Common "Where do I change X?" Recipes

| You want to… | Look at |
|---|---|
| Add a new field to a model | `src/models/<name>.js` + every route that creates/updates it (search by model name) |
| Add a new role | `models/user.js` `role` enum + add a new guard in `middleware/user.js` + use it in routes |
| Tighten/loosen what HR can do | `userHRGuard` is permissive (also allows admin) — change there, or create a stricter guard |
| Adjust the 14-day free trial | `subscriptionCheckGuard` in `middleware/user.js` — search for `14` |
| Change subscription grace period | Set `NEXT_PUBLIC_GRACE_PERIOD` in `.env` (days) |
| Whitelist a new CORS origin | Add to `ALLOWED_ORIGINS` env var (comma-separated) |
| Tweak the invoice number scheme | `client/invoice/route.js` POST — `invoiceNo = 1000 + invoices.length` |
| Tweak employee ID scheme | `user/create-user/route.js` and `user/bulk-import/route.js` — `1000 + users.length` |
| Change which fields are returned to the FE on login | `user/login/route.js` — the `.populate(...)` chain |
| Change email templates | `utils/sendOTPCode.js`, `utils/whatsappMails.js`, inline templates in `client/invoice/route.js`, `careers-apply/route.js`, `contact/route.js` |
| Add a new SuperAdmin page | Create `app/super-admin/<route>/page.js` + a component under `components/SuperAdmin/<Feature>/` |
| Add a new report | New folder under `app/api/v1/reports/<name>/route.js` (use `userFinanceGuard`) + a page under `app/dashboard/reports/[link]/page.js` |
| Hook into Ziina payment success | `app/api/v1/ziina/webhook/route.js` — add DB write inside `payment_intent.status.updated` branch |

---

## 10. Known Issues / Tech Debt (worth knowing before you edit)

1. **`/api/v1/ziina/webhook`** logs payment events but never updates the DB. Wire this to flip invoice/subscription status when production payments come in.
2. **`lib/ziina.js`** is imported by `ziina/refund` and `ziina/verify` but missing from this repo dump — confirm it exists locally; if not, add `createRefund` and `getPaymentIntent` wrappers around the Ziina REST API.
3. **`/api/v1/reports/cashflow`** internally calls `/api/v1/reports/income` and `/api/v1/reports/expenses`, neither of which appears in the routes dump. Verify those handlers exist before relying on cashflow.
4. **`payroll/runs` PUT** references an undefined `employeeId` variable inside `createNotification` — will throw at runtime when used.
5. **`allowedFreeInvoices`** on User is dead code; the trial logic now lives in `subscriptionCheckGuard`. Safe to remove if not used elsewhere.
6. **`/api/v1/auth/callback/google`** is unreachable from the FE (FE uses `/user/login/google` with the access token). Either remove or finish the DB integration.
7. **Cascading delete** for `DELETE /company` only unsets `User.companyId` — invoices, clients, payroll etc. remain orphaned with a dangling `companyId`. Use `DELETE /user/superadmin` for full wipe.
8. **CORS log** in `middleware.js` logs the allowed origins list every request — noisy in production logs.

---

## 11. Quick Onboarding Checklist for a New Developer

1. `cp .env.example .env` (or copy from teammate) — fill `DB_URI`, `JWT_SECRET`, `SITE_EMAIL`, `APP_PASS_KEY`, `STRIPE_SECRET_KEY` at minimum.
2. `npm install` in both `nigotis-be-main/` and `nigotis-fe-master/`.
3. Start BE: `npm run dev` (default port 3000) — change `PORT` if FE is also on 3000.
4. Start FE pointed at BE via `NEXT_PUBLIC_BACKEND_URL` (or whichever env var `fetchCustom` reads — check `lib/utils.js`).
5. Sign up at `/auth/signup` → get OTP email → verify → you're an `admin`.
6. To make yourself a **super-admin**: open MongoDB, set your User document `role: "super-admin"`. Then `/super-admin` becomes accessible.
7. Create a Plan from `/super-admin/plans/new` → buy a subscription via `/pricing/buy-subscription` to test the paid flow.

---

## 12. Nigotis-AI — The AI Chatbot Service

A **separate Python/Django service** that powers the in-app AI assistant. Lives in `Nigotis-AI/` at the project root (sibling to the Node backend and the frontend). The frontend dashboard talks to this service via a thin proxy at [/api/chatbot](nigotis-fe-master/nigotis-fe-master/app/api/chatbot/route.js) → `process.env.NEXT_PUBLIC_BOT_API_URL`.

### 12.1 Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Django 5.1** + **Django REST Framework** |
| LLM | **OpenAI** `gpt-4o-mini` (via **LangChain** + `langchain-openai`) |
| Agent | LangChain `create_tool_calling_agent` + `AgentExecutor` |
| Embeddings / memory | **pgvector** (1536-dim, `text-embedding-3-small`) |
| Database | **PostgreSQL** with the `pgvector` extension |
| API docs | **drf-spectacular** (Swagger UI at `/swagger/`) |
| WhatsApp | **Twilio** (`MessagingResponse`) + Meta Graph API fallback (`whatsapp/service.py`) |
| Deployment | Ubuntu EC2 + `gunicorn` + `ngrok` tunnel |

### 12.2 Folder Map

```
Nigotis-AI/
├── README.md
├── requirements.txt
├── commands.txt              ← server / ngrok setup commands
└── nigotis/                  ← Django project root
    ├── manage.py
    ├── nigotis/              ← project package (settings, urls, wsgi)
    │   ├── settings.py
    │   └── urls.py
    ├── chatbot/              ← Django app: Client, Session, Message + REST endpoints
    │   ├── models.py
    │   ├── serializers.py
    │   ├── views.py
    │   └── urls.py
    ├── agent/                ← LangChain tool-calling agent
    │   └── agent.py
    ├── memory/               ← Embedding + vector similarity search
    │   └── manager.py
    ├── tools/                ← LangChain @tool functions (the AI's capabilities)
    │   ├── auth_tools.py
    │   ├── create_tools.py
    │   ├── fetch_tool.py
    │   ├── delete_tool.py
    │   ├── analysis_tools.py
    │   ├── misc_tools.py
    │   ├── helpers.py
    │   └── pipeline/         ← Map-Reduce-Prompt pattern for analysis
    │       ├── mapper.py     ← Calls Node BE to pull entities
    │       ├── reducer.py    ← Shapes data for the LLM
    │       ├── prompter.py   ← Builds analysis prompts
    │       └── pipeline.py   ← Orchestrates all three
    ├── utils/                ← Helpers (login API, name extraction)
    └── whatsapp/             ← Twilio webhook for WhatsApp bot
        ├── views.py
        └── service.py
```

### 12.3 Data Models (PostgreSQL)

| Model | Fields |
|---|---|
| **Client** | `name`, `role` (ADMIN/SALES/FINANCE/HR), `login_email`, `login_password`, `auth_token`, `authenticated_at`. One per Nigotis user who logs into the bot. |
| **Session** | `title`, `phone_number`, `website` (bool), `client` (FK → Client). One per chat thread. Auto-titled by the LLM from the first message. |
| **Message** | `sender` (USER/BOT), `content`, `embedding` (1536-d pgvector), `session` (FK), `unique_message_id`. Every message is embedded for vector retrieval. |

### 12.4 REST API

Base path: `/` (project), `/whatsapp/` (WhatsApp app). Auto-documented at `/schema/` (OpenAPI) and `/swagger/` (Swagger UI).

| Method + Path | Purpose |
|---|---|
| `POST /client/` | Login proxy — accepts `{email, password, account_type}`. Calls Node BE's `/api/v1/user/login`, stores token in Client, returns Client. |
| `GET /client/` `GET /client/<id>/` | List / retrieve clients |
| `PUT/PATCH/DELETE /client/<id>/` | Standard ModelViewSet CRUD |
| `GET /client/<id>/sessions/` | List sessions for a client |
| `DELETE /client/<id>/sessions/` | Wipe all sessions for a client |
| `POST /refresh-auth/<id>` | Re-authenticate a client and refresh their `auth_token` from the Node BE |
| `POST /session/` `GET /session/` `GET /session/<id>/` | Session CRUD |
| `GET /session/<id>/messages/` | All messages in a session |
| `DELETE /session/<id>/messages/` | Clear chat history for a session |
| `POST /message/` | Manually post a message (rare — the bot flow uses `/talk-to-bot/`) |
| `POST /talk-to-bot/<session_id>` | **The main chat endpoint**. Body: `{message}`. Embeds the user message, runs the tool agent, embeds and saves the bot reply, returns `{message: <bot reply>}`. |
| `POST /whatsapp/` | Twilio inbound webhook. Looks up/creates a Session by `From` phone number, routes to the same agent, returns TwiML. |

### 12.5 How a chat message flows end-to-end

1. **FE** (dashboard `/dashboard/nigotis-ai` page) calls `POST /api/chatbot` on Next.js with `{ url: "/talk-to-bot/<sessionId>", options: { body: { message } } }`.
2. The Next.js proxy forwards to `NEXT_PUBLIC_BOT_API_URL + url` (the Django service).
3. `TalkToChatBotView.post` in [chatbot/views.py](Nigotis-AI/nigotis/chatbot/views.py) loads the Session and stores the user message (with embedding) via [`MemoryManager.add_message`](Nigotis-AI/nigotis/memory/manager.py).
4. [`ToolAgent.get_response`](Nigotis-AI/nigotis/agent/agent.py) builds a LangChain prompt with `session_id`, today's date, and the linked client's `{client_id, name, role, token}`. If the session has no title yet, calls `gpt-4o-mini` once to generate one.
5. The agent (`gpt-4o-mini`, temperature 0) iteratively picks from 12 tools to satisfy the user's request — every tool call uses the stored `auth_token` to hit the **Node backend** at `https://nigotis-be.vercel.app/api/v1`.
6. The bot's reply is embedded and saved as a `BOT` Message; the text is returned to the FE.

### 12.6 The 12 AI Tools (LangChain `@tool`)

All defined in `Nigotis-AI/nigotis/tools/`. The agent picks among these autonomously based on the user's request.

| Tool | File | Calls Node BE | Purpose |
|---|---|---|---|
| `authenticate_session` | `auth_tools.py` | `POST /user/login` | Log a user into a session by email/password |
| `logout_session` | `auth_tools.py` | — | Clear `session.client` |
| `refresh_token` | `auth_tools.py` | `POST /user/login` | Refresh JWT using saved credentials |
| `create_client` | `create_tools.py` | `POST /client` | Create a customer |
| `create_asset` | `create_tools.py` | `POST /company/asset` | Add a company asset |
| `create_expense` | `create_tools.py` | `POST /company/expense` | Record an expense (`bill`/`payroll`/`others`) |
| `create_income` | `create_tools.py` | `POST /income` | Record an income (`invoice`/`others`) |
| `create_invoice` | `create_tools.py` | `POST /client/invoice` | Create an invoice. Resolves client + product **names → IDs** via `resolve_client_name` / `resolve_product_name` helpers. |
| `fetch_tool` | `fetch_tool.py` | various GETs via `Mapper` | Generic fetch for `customers`, `products`, `invoices`, `expenses`, `incomes`, `assets`, `payrolls`. Supports `start_date`/`end_date` filtering. |
| `delete_tool` | `delete_tool.py` | various DELETEs | Generic delete by entity + ID |
| `analysis_tool` | `analysis_tools.py` | runs Map-Reduce-Prompt pipeline | Nine analytics flavors (see below) |
| `sum_tool` | `misc_tools.py` | — | Math helper — sum a list of numbers |

### 12.7 Analysis Pipeline (Map-Reduce-Prompt pattern)

[`tools/pipeline/pipeline.py`](Nigotis-AI/nigotis/tools/pipeline/pipeline.py) — for each analysis type, it:

1. **Map** — `Mapper` pulls raw entities (customers, invoices, products) from the Node BE.
2. **Reduce** — `Reducer` shapes the data into a compact summary the LLM can reason about.
3. **Prompt** — `Prompter` builds an analysis-specific prompt.
4. Sends the prompt to `gpt-4o-mini` and returns the response directly to the user.

Available analyses (`AnalysisChoice` enum):

| Code | Analysis |
|---|---|
| `SEG` | Customer segmentation |
| `PRF` | Product preference per customer |
| `REV` | Revenue insights |
| `PUR` | Purchase-value analysis |
| `TRE` | Seasonal trends |
| `CLV` | Client lifetime value |
| `CHP` | Churn prediction (inactive clients) |
| `MPP` | Most-purchased products |
| `TPR` | Tailored promotions |

### 12.8 Memory & Vector Search

- Every message (user + bot) is embedded via `text-embedding-3-small` (1536 dimensions) on save.
- `MemoryManager.get_similar_messages(session_id, content, limit, threshold)` performs a cosine-distance search using `pgvector`'s `CosineDistance` over the `Message.embedding` column.
- **Currently the retrieved history is NOT being passed back into the agent prompt** — the `context` / `history` lines in `agent.py` are commented out. Embeddings are written but not yet read on each turn. Easy win if you want stronger continuity.

### 12.9 System prompt (RISEN)

The agent is locked to the **RISEN** framework — Role, Identity, Safety, Execution, No-Hallucination. It cannot answer freely; it must always call a tool. Full prompt in [`agent/agent.py`](Nigotis-AI/nigotis/agent/agent.py) lines 27–47.

### 12.10 Environment Variables (`.env` in `Nigotis-AI/nigotis/`)

| Variable | Used for |
|---|---|
| `SECRET_KEY` | Django secret |
| `DEBUG` | `"True"` / `"False"` |
| `DATABASE_URL` | Postgres connection string (parsed into host/user/pass/db) |
| `OPENAI_API_KEY` | LLM + embeddings (read implicitly by `openai` SDK) |
| `VERSION`, `PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN` | Meta Graph API for outbound WhatsApp (in `whatsapp/service.py`) |
| Twilio creds (optional) | Inbound WhatsApp via Twilio (used in `whatsapp/views.py`) |

### 12.11 Frontend Integration

- **In-app chat UI**: `nigotis-fe-master/app/dashboard/nigotis-ai/page.js` + [components/Dashboard/NigotisAI/NigotisAI.jsx](nigotis-fe-master/nigotis-fe-master/components/Dashboard/NigotisAI/NigotisAI.jsx) + [PrevChats.jsx](nigotis-fe-master/nigotis-fe-master/components/Dashboard/NigotisAI/PrevChats.jsx).
- **Proxy route**: [app/api/chatbot/route.js](nigotis-fe-master/nigotis-fe-master/app/api/chatbot/route.js) — accepts `{ url, options }` and forwards to `NEXT_PUBLIC_BOT_API_URL + url` with a 5-minute timeout.
- FE needs `NEXT_PUBLIC_BOT_API_URL` set (e.g. `https://one-urchin-ultimate.ngrok-free.app` per the ngrok tunnel in `commands.txt`, or `http://localhost:8000` locally).

### 12.12 Known Issues / Tech Debt

1. **Vector memory is write-only** — `get_similar_messages` exists but no caller passes the result into the agent prompt. The agent has no conversational memory beyond the current turn.
2. **`login_password` is stored in plain text** on Client to enable `refresh_token` — significant security concern. Consider encrypted credentials or refresh-token rotation against the Node BE.
3. **`BASE_URL` is hardcoded** to `https://nigotis-be.vercel.app/api/v1` in `tools/helpers.py` and `tools/create_tools.py` — move to env var so local dev hits a local BE.
4. **`create_invoice` tool requires exact client/product names** (case-insensitive). If misspelled, the tool returns the valid name list back to the LLM, which usually retries — but it's fragile.
5. **WhatsApp has two paths**: Twilio (`whatsapp/views.py`) is wired up, Meta Graph (`whatsapp/service.py`) is implemented but not routed. Pick one before production.
6. **`apps.py` for `whatsapp/`** exists but the app is **not in `INSTALLED_APPS`** in `settings.py` — only its URL include works because views don't depend on models. Add to `INSTALLED_APPS` if you add models later.

---

## 13. How to Install & Run Everything (Local Dev)

Three services run side by side: **Node BE** (port 3000), **Python AI** (port 8000), **Next.js FE** (port 3001 — or 3000 if BE is on 3001).

### 13.1 Prerequisites

Install once on your machine:

```powershell
# Node.js 18+ (check: node -v)  →  https://nodejs.org
# Python 3.11+ (check: python --version)  →  https://www.python.org
# Git (check: git --version)
# MongoDB — local install OR a free MongoDB Atlas cluster
# PostgreSQL 14+ WITH the pgvector extension installed (or use Neon.tech / Supabase — both support pgvector)
```

> **Tip**: Easiest Postgres+pgvector setup is **Neon.tech** (free tier, pgvector pre-enabled). Easiest Mongo setup is **MongoDB Atlas** (free M0 cluster).

### 13.2 Node Backend (`nigotis-be-main`)

```powershell
cd "c:\Users\HP\Desktop\Projects\Nigotis\nigotis-be-main\nigotis-be-main"

# 1. Install deps
npm install

# 2. Create .env in this folder with at minimum:
#    DB_URI=mongodb+srv://...
#    JWT_SECRET=any-long-random-string
#    SITE_EMAIL=your.gmail@gmail.com
#    APP_PASS_KEY=your-gmail-app-password
#    SUPPORT_EMAIL=support@yourdomain.com
#    CONTACT_EMAIL=contact@yourdomain.com
#    FRONTEND_URL=http://localhost:3001
#    ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
#    STRIPE_SECRET_KEY=sk_test_...        (optional for local)
#    NEXT_PUBLIC_GRACE_PERIOD=3
#    NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 3. Run dev server (port 3000)
npm run dev
```

Verify it works: open `http://localhost:3000/api/v1/plan/get` in a browser — should return `{success, data}`.

### 13.3 Next.js Frontend (`nigotis-fe-master`)

```powershell
# Open a SECOND PowerShell window
cd "c:\Users\HP\Desktop\Projects\Nigotis\nigotis-fe-master\nigotis-fe-master"

# 1. Install deps
npm install

# 2. Create .env.local in this folder with at minimum:
#    NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api/v1
#    NEXT_PUBLIC_BOT_API_URL=http://localhost:8000
#    NEXT_PUBLIC_AWS_OBJECT_BASE_URL=https://your-bucket.s3.amazonaws.com/

# 3. Run on port 3001 so it doesn't collide with the BE
npm run dev -- -p 3001
```

Open `http://localhost:3001` — site should load.

### 13.4 Python AI Service (`Nigotis-AI`)

```powershell
# Open a THIRD PowerShell window
cd "c:\Users\HP\Desktop\Projects\Nigotis\Nigotis-AI"

# 1. Create a virtual environment (one-time)
python -m venv .venv

# 2. Activate it (every new shell)
.\.venv\Scripts\Activate.ps1
# If PowerShell blocks the script, run once:
#   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# 3. Install dependencies
pip install -r requirements.txt
# (also needed but missing from requirements.txt — install manually:)
pip install python-dateutil

# 4. Create Nigotis-AI/nigotis/.env with:
#    SECRET_KEY=any-long-random-string
#    DEBUG=True
#    DATABASE_URL=postgresql://user:pass@host:5432/dbname
#    OPENAI_API_KEY=sk-...    (your OpenAI key from "nigotis open AI key.txt" or .env)

# 5. Run migrations and start the server
cd nigotis
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Verify it works: open `http://localhost:8000/swagger/` — you should see all chatbot endpoints documented.

### 13.5 Quick start-everything cheat sheet

Once installed, in three separate PowerShell windows:

| Window | Command |
|---|---|
| 1 (Node BE) | `cd "c:\Users\HP\Desktop\Projects\Nigotis\nigotis-be-main\nigotis-be-main"; npm run dev` |
| 2 (Next FE) | `cd "c:\Users\HP\Desktop\Projects\Nigotis\nigotis-fe-master\nigotis-fe-master"; npm run dev -- -p 3001` |
| 3 (Python AI) | `cd "c:\Users\HP\Desktop\Projects\Nigotis\Nigotis-AI"; .\.venv\Scripts\Activate.ps1; cd nigotis; python manage.py runserver 0.0.0.0:8000` |

### 13.6 Production reference (from `Nigotis-AI/commands.txt`)

On the Ubuntu EC2 host (`13.60.238.235`), the team uses:

```bash
ssh -i nigotis.pem ubuntu@13.60.238.235
cd Nigotis-AI/
git fetch && git pull origin
source .venv/bin/activate
uv pip install -r requirements.txt          # uses 'uv' as a fast pip replacement
pkill -f 'ngrok|gunicorn|python3'           # kill old workers
nohup python3 nigotis/manage.py runserver 0.0.0.0:8000 &
nohup ngrok http --domain=one-urchin-ultimate.ngrok-free.app 8000 &
```

Public URL: `https://one-urchin-ultimate.ngrok-free.app` — this is what `NEXT_PUBLIC_BOT_API_URL` points to in production.
