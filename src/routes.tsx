import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { ProtectedRoute, PublicRoute } from "@/components/auth/RouteGuards";
import { useRouter } from "@/lib/navigation";

// Public pages
import LoginPage from "@/pages/auth/LoginPage";
import OtpVerificationPage from "@/pages/auth/OtpVerificationPage";

// Pages rendered inside the authenticated layout
import HomePage from "@/pages/HomePage";
import AccountClosingPage from "@/pages/account-closing/AccountClosingPage";
import AccountClosingCaSaPage from "@/pages/account-closing/AccountClosingCaSaPage";
import DepositClosingPage from "@/pages/account-closing/DepositClosingPage";
import AccountClosingInvestmentPage from "@/pages/account-closing/AccountClosingInvestmentPage";
import AccountClosingLoanPage from "@/pages/account-closing/AccountClosingLoanPage";
import AccountClosingPigmyPage from "@/pages/account-closing/AccountClosingPigmyPage";
import AccountMasterLandingPage, { AccountMasterPage as AccountMasterTypePage } from "@/pages/AccountMaster/AccountMaster";
import AccountMasterPage from "@/pages/AccountMasterPage";
import AiDashboardPage from "@/pages/AiDashboard/AiDashboard";
import AssignUserRolePage from "@/pages/AssignUserRole/AssignUserRole";
import DayBeginEndPage from "@/pages/DayBeginEnd/DayBeginEnd";
import BranchActivityPage from "@/pages/BranchActivity/BranchActivity";
import InterestPostingPage from "@/pages/InterestPosting/InterestPosting";
import AuthorizationPage from "@/pages/authorization/AuthorizationPage";
import AuthorizePigmyOpenPage from "@/pages/authorization/AuthorizeAccount/AuthorizePigmyOpen/AuthorizePigmyOpen";
import AuthorizePigmyClosePage from "@/pages/authorization/AuthorizeAccount/AuthorizePigmyClose/AuthorizePigmyClose";
import AuthorizationCustomerPage from "@/pages/authorization/AuthorizeCustomer/AuthorizeCustomer";
import AuthorizeClearingPage from "@/pages/authorization/AuthorizeClearing/AuthorizeClearing";
import AuthorizeTransactionPage from "@/pages/authorization/AuthorizeTransaction/AuthorizeTransaction";
import CashDepositAuthorizePage from "@/pages/authorization/AuthorizeTransaction/CashDepositAuthorize/CashDepositAuthorize";
import CashWithdrawalAuthorizePage from "@/pages/authorization/AuthorizeTransaction/CashWithdrawalAuthorize/CashWithdrawalAuthorize";
import RecurringInstallmentAuthorizePage from "@/pages/authorization/AuthorizeTransaction/RecurringInstallmentAuthorize/RecurringInstallmentAuthorize";
import RtgsAuthorizePage from "@/pages/authorization/AuthorizeTransaction/RtgsAuthorize/RtgsAuthorize";
import TdInterestPaymentAuthorizePage from "@/pages/authorization/AuthorizeTransaction/TdInterestPaymentAuthorize/TdInterestPaymentAuthorize";
import TdsTransactionAuthorizePage from "@/pages/authorization/AuthorizeTransaction/TdsTransactionAuthorize/TdsTransactionAuthorize";
import TlCcInstallmentAuthorizePage from "@/pages/authorization/AuthorizeTransaction/TlCcInstallmentAuthorize/TlCcInstallmentAuthorize";
import TlDisbursementAuthorizePage from "@/pages/authorization/AuthorizeTransaction/TlDisbursementAuthorize/TlDisbursementAuthorize";
import TlOtherChargesAuthorizePage from "@/pages/authorization/AuthorizeTransaction/TlOtherChargesAuthorize/TlOtherChargesAuthorize";
import TransferAuthorizePage from "@/pages/authorization/AuthorizeTransaction/TransferAuthorize/TransferAuthorize";
import AuthorizationUserPage from "@/pages/authorization/AuthorizeUser/AuthorizeUser";
import BranchMasterPage from "@/pages/BranchMaster/BranchMaster";
import CustomerMasterPage from "@/pages/CustomerMaster/CustomerMaster";
import DashboardPage from "@/pages/DashboardPage";
import FutureModelsPage from "@/pages/futuremodels/FutureModels";
import CalculatorPage from "@/pages/futuremodels/Calculator/Calculator";
import LoanCalculatorsPage from "@/pages/futuremodels/LoanCalculators";
import CasaClosingPage from "@/pages/futuremodels/CasaClosing/CasaClosing";
import FixedAssetPage from "@/pages/futuremodels/FixedAsset/FixedAsset";
import InvestmentAccountPage from "@/pages/futuremodels/InvestmentAccount/InvestmentAccount";
import InvestmentAccountClosePage from "@/pages/futuremodels/InvestmentAccountClose/InvestmentAccountClose";
import PigmyDepositDetailsPage from "@/pages/futuremodels/PigmyDepositDetails/PigmyDepositDetails";
import PigmyDetailsPage from "@/pages/futuremodels/PigmyDetails/PigmyDetails";
import StandingInstructionsPage from "@/pages/futuremodels/StandingInstructions/StandingInstructions";
import TdCalculatePage from "@/pages/futuremodels/TdCalculate/TdCalculate";
import TermDepositClosePage from "@/pages/futuremodels/TermDepositClose/TermDepositClose";
import TdOpenPage from "@/pages/futuremodels/TdOpen/TdOpen";
import TDClosingReinvestPage from "@/pages/futuremodels/TdClosingReinvest/TdClosingReinvest";
import TlClosePage from "@/pages/futuremodels/TlClose/TlClose";
import TermLoanOpenPage from "@/pages/futuremodels/TermLoanOpen/TermLoanOpen";
import TLOtherChargesPage from "@/pages/futuremodels/TlOtherCharges/TlOtherCharges";
import UnLeanPage from "@/pages/futuremodels/UnLean/UnLean";
import GlobalMasterPage from "@/pages/GlobalMaster/GlobalMaster";
import HeadOfficeMasterPage from "@/pages/HeadOfficeMaster/HeadOfficeMaster";
import SupportUtilityPage from "@/pages/SupportUtility/SupportUtility";
import ClerkClearingPage from "@/pages/ClerkClearingPage";
import ClerkSmsPage from "@/pages/ClerkSmsPage";
import LockerPage from "@/pages/Locker/Locker";
import TransactionMasterPage, {
  CashDepositPage,
  CashWithdrawalPage,
  RecurringInstallmentPage,
  RtgsPage,
  TdInterestPaymentPage,
  TdsTransactionPage,
  TlCcInstallmentPage,
  TlDisbursementPage,
  TransferPage,
  ModifyTdsTransactionPage,
} from "@/pages/TransactionMaster/TransactionMaster";
import UserMasterPage from "@/pages/UserMaster/UserMaster";
import RoleAuthorizationFlow from "@/pages/authorization/RolesAuthorization/RolesAuthorization";
import AuthorizeAccountMainPage from "@/pages/authorization/AuthorizeAccount/AuthorizeAccount";
import FutureModalsPage from "./pages/FutureModals/FutureModals";
import TDSReportsPage from "./pages/Tds/Tds";
import ModifyBranchGlBalance from "./pages/futuremodels/ModifyBranchGlBalance/ModifyBranchGlBalance";
import ModifyAccountBalancePage from "./pages/futuremodels/ModifyAccountBalance/ModifyAccountBalance";
import ModifyBranchGlHistory from "./pages/futuremodels/ModifyBranchGlHistory/ModifyBranchGlHistory";
import ModifyCashHandlingRecord from "./pages/futuremodels/ModifyCashHandlingRecord/ModifyCashHandlingRecord";
import FinancialClosing from "./pages/FinancialClosing/FinancialClosing";
import TermDepositInterestPayment from "./pages/authorization/AuthorizeTransaction/TermDepositInterestPayment/TermDepositInterestPayment";
import SetProductStatusPage from "./pages/FinancialClosing/SetProductStatus/SetProductStatus";
import Application from "./pages/HoClerk/Application/Application";
import HoClerkTransaction from "./pages/HoClerk/Transaction/Transaction";
import Cashier from "./pages/Cashier/Cashier";
import PagesAcceptCashPage from "@/pages/Cashier/AcceptCash/AcceptCash";
import HoOfficer from "./pages/HoOfficer/HoOfficer";
import HoCashDepositAuthorizePage from "@/pages/HoOfficer/HoCashDepositAuthorize/HoCashDepositAuthorize";
import HoCashWithdrawalAuthorizePage from "@/pages/HoOfficer/HoCashWithdrawalAuthorize/HoCashWithdrawalAuthorize";
import HoTransferAuthorizePage from "@/pages/HoOfficer/HoTransferAuthorize/HoTransferAuthorize";
import InvestmentPaymentClosingAuthorizePage from "@/pages/HoOfficer/InvestmentPaymentClosingAuthorize/InvestmentPaymentClosingAuthorize";
import RtgsOutwardAuthorizePage from "@/pages/HoOfficer/RtgsOutwardAuthorize/RtgsOutwardAuthorize";
import ReconciliationAuthorizePage from "@/pages/HoOfficer/ReconciliationAuthorize/ReconciliationAuthorize";
import DDPage from "./pages/dd/DD/DD";
import DDMaintenancePage from "./pages/dd/Maintenance/Maintenance";
import DDPrintingPage from "./pages/dd/Printing/Printing";
import BillUtilityPage from "./pages/Bill/Bill";
import BillAuthorizationOptions from "@/pages/authorization/AuthorizeBill/AuthorizeBill";
// import PayrollMaster from "./pages/payroll/Master/Master";
// import PayrollTransaction from "./pages/payroll/Transaction/Transaction";
// // import EmployeeLeaveBalancePage from "./pages/payroll/EmployeeLeaveBalancePage";
// import EmployeeLoanDetailsPage from "./pages/payroll/EmployeeLoanDetailsPage";
// // import LeaveOpeningBalancePage from "./pages/payroll/LeaveOpeningBalancePage";
// // import SalaryInstructionPage from "./pages/payroll/SalaryInstructionPage";
// // import SalaryUpdationPage from "./pages/payroll/SalaryUpdationPage";
// // import UpdateAttendancePage from "./pages/payroll/UpdateAttendancePage";
// import AnnualMeetingAttendancePage from "./pages/shares/AnnualMeetingAttendance/AnnualMeetingAttendance";
// import EmployeeDeputationPage from "@/pages/payroll/TrasationEntry/EmployeeDeputation ";
// import EmployeePromotionPage from "@/pages/payroll/TrasationEntry/EmployeePromotion";
// import EmployeeResignationPage from "@/pages/payroll/TrasationEntry/EmployeeResignation";
// import EmployeeSuspensionPage from "@/pages/payroll/TrasationEntry/EmployeeSuspensionInformation";
// import EmployeeTransferPage from "@/pages/payroll/TrasationEntry/EmployeeTransferEntry";
// import LeaveApplicationPage from "@/pages/payroll/TrasationEntry/LeaveApplicationEntry";
// import EmployeeTerminationPage from "@/pages/payroll/TrasationEntry/EmployeeTermination";

import SMSRegistrationPage from "@/pages/SMS/SMS";
// import SMSAuthorizeModal from "@/pages/authorization/AuthorizeSMS/AuthorizeSMS";
import { AuthorizeAccountPage } from "@/pages/authorization/AuthorizeAccount/AuthorizeAccount";
import AuthorizationClearingTablePage from "./pages/authorization/Clearing/AuthorizationClearingTablePage";

function RoleAuthorizationFlowRoute() {
  const router = useRouter();
  return <RoleAuthorizationFlow onClose={() => router.back()} />;
}

/**
 * Single source of truth for URL -> page. The URLs are unchanged from the
 * original Next.js app; only the file locations and component names differ.
 */
export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/otp-verification",
    element: (
      <PublicRoute>
        <OtpVerificationPage />
      </PublicRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "/account-closing", element: <AccountClosingPage /> },
      { path: "/account-closing/ca-sa", element: <AccountClosingCaSaPage /> },
      { path: "/account-closing/deposit", element: <DepositClosingPage /> },
      {
        path: "/account-closing/investment",
        element: <AccountClosingInvestmentPage />,
      },
      { path: "/account-closing/loan", element: <AccountClosingLoanPage /> },
      { path: "/account-closing/pigmy", element: <AccountClosingPigmyPage /> },
      { path: "/account-master", element: <AccountMasterLandingPage /> },
      // { path: "/account-master/bill", element: <BillHero /> },
      { path: "/account-master/bill", element: <BillUtilityPage /> },
      { path: "/account-master/ca-sa", element: <AccountMasterTypePage accountType="ca-sa" /> },
      {
        path: "/account-master/deposit",
        element: <AccountMasterTypePage accountType="deposit" />,
      },
      // { path: "/transaction-entry", element: <EmployeeDeputationPage /> },
      {
        path: "/account-master/investment",
        element: <AccountMasterTypePage accountType="investment" />,
      },
      { path: "/account-master/loan", element: <AccountMasterTypePage accountType="loan" /> },
      { path: "/account-master/fixed-asset", element: <AccountMasterTypePage accountType="fixed-asset" /> },
      { path: "/account-master/pigmy", element: <AccountMasterTypePage accountType="pigmy" /> },
      { path: "/accountmaster", element: <AccountMasterPage /> },
      { path: "/ai-dashboard", element: <AiDashboardPage /> },
      { path: "/assignuserrole", element: <AssignUserRolePage /> },
      { path: "/day-begin-end", element: <DayBeginEndPage /> },
      { path: "/dd", element: <DDPage /> },
      { path: "/dd/maintenance", element: <DDMaintenancePage /> },
      { path: "/dd/printing", element: <DDPrintingPage /> },
      { path: "/branch-activity", element: <BranchActivityPage /> },
      { path: "/interest-posting", element: <InterestPostingPage /> },
      { path: "/authorization", element: <AuthorizationPage /> },
      {
        path: "/authorization/authorizeaccountmain",
        element: <AuthorizeAccountMainPage />,
      },
      
      {
        path: "/authorization/authorizerole",
        element: <RoleAuthorizationFlowRoute />,
      },
      { path: "/interest-posting", element: <InterestPostingPage /> },
      { path: "/sms", element: <SMSRegistrationPage /> },
      // { path: "/annual-meeting-attendance", element: <AnnualMeetingAttendancePage /> },
      { path: "/futuremodels/calculator", element: <CalculatorPage /> },
      {
        path: "/authorization",
        children: [
          {
            index: true,
            element: <AuthorizationPage />,
          },
          {
            path: "authorizeaccountmain",
            children: [
              {
                index: true,
                element: <AuthorizeAccountMainPage />,
              },
              {
                path: "casa",
                element: <AuthorizeAccountPage accountType="casa" />,
              },
              {
                path: "deposite",
                element: <AuthorizeAccountPage accountType="deposite" />,
              },
              {
                path: "loan",
                element: <AuthorizeAccountPage accountType="loan" />,
              },
              {
                path: "fixed",
                element: <AuthorizeAccountPage accountType="fixed" />,
              },
              {
                path: "investment",
                element: <AuthorizeAccountPage accountType="investment" />,
              },
            ],
          },
        ],
      },
      {
        path: "/authorization/authorizerole",
        element: <RoleAuthorizationFlowRoute />,
      },
      {
        path: "/authorization/authorizecustomer",
        element: <AuthorizationCustomerPage />,
      },
      {
        path: "/authorization/pigmy/open",
        element: <AuthorizePigmyOpenPage />,
      },
      {
        path: "/authorization/pigmy/close",
        element: <AuthorizePigmyClosePage />,
      },
      {
        path: "/authorization/authorizecustomer",
        element: <AuthorizationCustomerPage />,
      },
      {
        path: "/authorization/clearing",
        children: [
          {
            index: true,
            element: <AuthorizeClearingPage />,
          },
          {
            path: ":clearingTypes",
            element: <AuthorizationClearingTablePage />,
          },
        ],
      },
      {
        path: "/authorization/transaction",
        element: <AuthorizeTransactionPage />,
      },
      {
        path: "/authorization/transaction/cash-deposit",
        element: <CashDepositAuthorizePage />,
      },
      {
        path: "/authorization/transaction/cash-withdrawal",
        element: <CashWithdrawalAuthorizePage />,
      },
      {
        path: "/authorization/transaction/recurring-installment",
        element: <RecurringInstallmentAuthorizePage />,
      },
      {
        path: "/authorization/transaction/rtgs",
        element: <RtgsAuthorizePage />,
      },
      {
        path: "/authorization/transaction/td-interest-payment",
        element: <TdInterestPaymentAuthorizePage />,
      },
      {
        path: "/authorization/transaction/tds-transaction",
        element: <TdsTransactionAuthorizePage />,
      },
      {
        path: "/authorization/transaction/tl-cc-installment",
        element: <TlCcInstallmentAuthorizePage />,
      },
      {
        path: "/authorization/transaction/tl-disbursement",
        element: <TlDisbursementAuthorizePage />,
      },
      {
        path: "/authorization/transaction/tl-other-charges",
        element: <TlOtherChargesAuthorizePage />,
      },
      {
        path: "/authorization/transaction/transfer",
        element: <TransferAuthorizePage />,
      },
      { path: "/authorization/user", element: <AuthorizationUserPage /> },
      {
        path: "/authorization/transaction/term-deposit-interest-payment",
        element: <TermDepositInterestPayment />,
      },
      { path: "/authorization/user", element: <AuthorizationUserPage /> },
      {
        path: "/authorization/BillAuthorize",
        element: <BillAuthorizationOptions />,
      },

      { path: "/manager/branchmaster", element: <BranchMasterPage /> },
      { path: "/branchmaster" ,element: <BranchMasterPage/>},
      { path: "/customermaster", element: <CustomerMasterPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/futuremodels", element: <FutureModelsPage /> },




      { path: "/loan-calculators", element: <LoanCalculatorsPage /> },


      { path: "/futuremodels/casa-closing", element: <CasaClosingPage /> },
      { path: "/futuremodels/FixedAsset", element: <FixedAssetPage /> },
      {
        path: "/futuremodels/investment-account",
        element: <InvestmentAccountPage />,
      },
      {
        path: "/futuremodels/investment-account-close",
        element: <InvestmentAccountClosePage />,
      },
      {
        path: "/authorization/authorizeaccountmain/casa-closing",
        element: <CasaClosingPage />,
      },
      {
        path: "/authorization/authorizeaccountmain/FixedAsset",
        element: <FixedAssetPage />,
      },
      {
        path: "/futuremodels/investment-account",
        element: <InvestmentAccountPage />,
      },
      {
        path: "/authorization/authorizeaccountmain/investment-account-close",
        element: <InvestmentAccountClosePage />,
      },
      // { path: "/futuremodels/lean", element: <LeanPage /> },
      // { path: "/futuremodels/memo", element: <MemoPage /> },
      {
        path: "/futuremodels/pigmy-deposit-details",
        element: <PigmyDepositDetailsPage />,
      },
      { path: "/futuremodels/PigmyDetails", element: <PigmyDetailsPage /> },
      {
        path: "/futuremodels/standing-instructions",
        element: <StandingInstructionsPage />,
      },
      { path: "/futuremodels/td-calculate", element: <TdCalculatePage /> },
      {
        path: "/authorization/authorizeaccountmain/td-close",
        element: <TermDepositClosePage />,
      },
      { path: "/futuremodels/td-open", element: <TdOpenPage /> },
      {
        path: "/futuremodels/TDClosingReinvest",
        element: <TDClosingReinvestPage />,
      },
      { path: "/futuremodels/tl-close", element: <TlClosePage /> },
      {
        path: "/futuremodels/TDClosingReinvest",
        element: <TDClosingReinvestPage />,
      },
      {
        path: "/authorization/authorizeaccountmain/tl-close",
        element: <TlClosePage />,
      },
      { path: "/futuremodels/tl-open", element: <TermLoanOpenPage /> },
      {
        path: "/futuremodels/tl-other-charges",
        element: <TLOtherChargesPage />,
      },
      { path: "/futuremodels/un-lean", element: <UnLeanPage /> },

      {
        path: "/futuremodels/modifyaccountbalance",
        element: <ModifyAccountBalancePage />,
      },
      {
        path: "/futuremodels/modifybranchglbalance",
        element: <ModifyBranchGlBalance />,
      },
      {
        path: "/futuremodels/modifybranchglhistory",
        element: <ModifyBranchGlHistory />,
      },
      {
        path: "/futuremodels/modifycashhandlingrecord",
        element: <ModifyCashHandlingRecord />,
      },

      { path: "/financial-closing", element: <FinancialClosing /> },
      {
        path: "/financial-closing/set-product-status",
        element: <SetProductStatusPage />,
      },
      { path: "/clerk/branchmaster", element: <BranchMasterPage /> },
      { path: "/globalmaster", element: <GlobalMasterPage /> },
      { path: "/headofficemaster", element: <HeadOfficeMasterPage /> },
      { path: "/support-utility", element: <SupportUtilityPage /> },
      { path: "/clerk/clearing", element: <ClerkClearingPage /> },
      { path: "/clerk/sms", element: <ClerkSmsPage /> },
      { path: "/locker", element: <LockerPage /> },
      { path: "/transactionmaster", element: <TransactionMasterPage /> },
      { path: "/transactionmaster/cash-deposit", element: <CashDepositPage /> },
      {
        path: "/transactionmaster/cash-withdrawal",
        element: <CashWithdrawalPage />,
      },
      {
        path: "/transactionmaster/recurring-installment",
        element: <RecurringInstallmentPage />,
      },
      { path: "/transactionmaster/rtgs", element: <RtgsPage /> },
      {
        path: "/transactionmaster/td-interest-payment",
        element: <TdInterestPaymentPage />,
      },
      {
        path: "/transactionmaster/tds-transaction",
        element: <TdsTransactionPage />,
      },
      {
        path: "/transactionmaster/tl-cc-installment",
        element: <TlCcInstallmentPage />,
      },
      {
        path: "/transactionmaster/tl-disbursement",
        element: <TlDisbursementPage />,
      },
      { path: "/transactionmaster/transfer", element: <TransferPage /> },
      {
        path: "/transactionmaster/modify-tds-transaction",
        element: <ModifyTdsTransactionPage />,
      },
      { path: "/usermaster", element: <UserMasterPage /> },
      { path: "/futuremodals", element: <FutureModalsPage /> },
      { path: "/tds", element: <TDSReportsPage /> },

      // HO-Clerk Route
      { path: "/ho-clerk-application", element: <Application /> },
      { path: "/ho-clerk-transaction", element: <HoClerkTransaction /> },

      // Cashier Route
      { path: "/cashier", element: <Cashier /> },
      { path: "/cashier/accept-cash", element: <PagesAcceptCashPage /> },

      // Ho Officer
      { path: "/ho-officer", element: <HoOfficer /> },
      {
        path: "/ho-officer/ho-cash-deposit-entry",
        element: <HoCashDepositAuthorizePage />,
      },
      {
        path: "/ho-officer/ho-cash-withdrawal-entry",
        element: <HoCashWithdrawalAuthorizePage />,
      },
      {
        path: "/ho-officer/ho-transfer-entry",
        element: <HoTransferAuthorizePage />,
      },
      {
        path: "/ho-officer/investment-payment-closingmark",
        element: <InvestmentPaymentClosingAuthorizePage />,
      },
      {
        path: "/ho-officer/rtgs-outward-file-generation",
        element: <RtgsOutwardAuthorizePage />,
      },
      {
        path: "/ho-officer/reconciliation",
        element: <ReconciliationAuthorizePage />,
      },

      // Payroll
      // { path: "/payroll/master", element: <PayrollMaster /> },
      // { path: "/payroll/transaction", element: <PayrollTransaction /> },
      // { path: "/payroll/transaction/employee-leave-balance", element: <EmployeeLeaveBalancePage /> },
      // { path: "/payroll/transaction/employee-loan-details", element: <EmployeeLoanDetailsPage /> },
      // { path: "/payroll/transaction/leave-opening-balance", element: <LeaveOpeningBalancePage /> },
      // { path: "/payroll/transaction/salary-instruction", element: <SalaryInstructionPage /> },
      // { path: "/payroll/transaction/salary-updation", element: /<SalaryUpdationPage /> },
      // { path: "/payroll/transaction/update-attendance", element: <UpdateAttendancePage /> },
//       { path: "/payroll/employee-promotion", element: <EmployeePromotionPage /> },
// { path: "/payroll/employee-resignation", element: <EmployeeResignationPage /> },
// { path: "/payroll/employee-suspension", element: <EmployeeSuspensionPage /> },
// { path: "/payroll/employee-transfer", element: <EmployeeTransferPage /> },
// { path: "/payroll/leave-application", element: <LeaveApplicationPage /> },
// { path: "/payroll/employee-termination", element: <EmployeeTerminationPage /> },
// 
      // Shares
      // { path: "/shares/allotment-entry", element: <ShareAllotmentEntryPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
