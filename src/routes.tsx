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
import AccountMasterLandingPage from "@/pages/account-master/AccountMasterLandingPage";
import AccountMasterCaSaPage from "@/pages/account-master/AccountMasterCaSaPage";
import AccountMasterDepositPage from "@/pages/account-master/AccountMasterDepositPage";
import AccountMasterInvestmentPage from "@/pages/account-master/AccountMasterInvestmentPage";
import AccountMasterLoanPage from "@/pages/account-master/AccountMasterLoanPage";
import AccountMasterPage from "@/pages/AccountMasterPage";
import AiDashboardPage from "@/pages/AiDashboardPage";
import AssignUserRolePage from "@/pages/AssignUserRolePage";
import DayBeginEndPage from "@/pages/day-begin-end/DayBeginEndPage";
import InterestPostingPage from "@/pages/interest-posting/InterestPostingPage";
import AuthorizationPage from "@/pages/authorization/AuthorizationPage";
import AuthorizeAccountPage from "@/pages/authorization/AuthorizeAccountPage";
import AuthorizationCustomerPage from "@/pages/authorization/AuthorizationCustomerPage";
import AuthorizeTransactionPage from "@/pages/authorization/transaction/AuthorizeTransactionPage";
import CashDepositAuthorizePage from "@/pages/authorization/transaction/CashDepositAuthorizePage";
import CashWithdrawalAuthorizePage from "@/pages/authorization/transaction/CashWithdrawalAuthorizePage";
import RecurringInstallmentAuthorizePage from "@/pages/authorization/transaction/RecurringInstallmentAuthorizePage";
import RtgsAuthorizePage from "@/pages/authorization/transaction/RtgsAuthorizePage";
import TdInterestPaymentAuthorizePage from "@/pages/authorization/transaction/TdInterestPaymentAuthorizePage";
import TdsTransactionAuthorizePage from "@/pages/authorization/transaction/TdsTransactionAuthorizePage";
import TlCcInstallmentAuthorizePage from "@/pages/authorization/transaction/TlCcInstallmentAuthorizePage";
import TlDisbursementAuthorizePage from "@/pages/authorization/transaction/TlDisbursementAuthorizePage";
import TransferAuthorizePage from "@/pages/authorization/transaction/TransferAuthorizePage";
import AuthorizationUserPage from "@/pages/authorization/AuthorizationUserPage";
import BranchMasterPage from "@/pages/MisActivity/BranchMasterPage";
import CustomerMasterPage from "@/pages/CustomerMasterPage";
import DashboardPage from "@/pages/DashboardPage";
import FutureModelsPage from "@/pages/futuremodels/FutureModelsPage";
import CalculatorPage from "@/pages/futuremodels/CalculatorPage";
import CasaClosingPage from "@/pages/futuremodels/CasaClosingPage";
import FixedAssetPage from "@/pages/futuremodels/FixedAssetPage";
import InvestmentAccountPage from "@/pages/futuremodels/InvestmentAccountPage";
import InvestmentAccountClosePage from "@/pages/futuremodels/InvestmentAccountClosePage";
import LeanPage from "@/pages/futuremodels/LeanPage";
import MemoPage from "@/pages/futuremodels/MemoPage";
import PigmyDepositDetailsPage from "@/pages/futuremodels/PigmyDepositDetailsPage";
import PigmyDetailsPage from "@/pages/futuremodels/PigmyDetailsPage";
import StandingInstructionsPage from "@/pages/futuremodels/StandingInstructionsPage";
import TdCalculatePage from "@/pages/futuremodels/TdCalculatePage";
import TermDepositClosePage from "@/pages/futuremodels/TermDepositClosePage";
import TdOpenPage from "@/pages/futuremodels/TdOpenPage";
import TDClosingReinvestPage from "@/pages/futuremodels/TDClosingReinvestPage";
import TlClosePage from "@/pages/futuremodels/TlClosePage";
import TermLoanOpenPage from "@/pages/futuremodels/TermLoanOpenPage";
import TLOtherChargesPage from "@/pages/futuremodels/TLOtherChargesPage";
import UnLeanPage from "@/pages/futuremodels/UnLeanPage";
import GlobalMasterPage from "@/pages/GlobalMasterPage";
import HeadOfficeMasterPage from "@/pages/HeadOfficeMasterPage";
import SupportUtilityPage from "@/pages/SupportUtilityPage";
import ClerkClearingPage from "@/pages/ClerkClearingPage";
import LockerPage from "@/pages/LockerPage";
import TransactionMasterPage from "@/pages/transactionmaster/TransactionMasterPage";
import CashDepositPage from "@/pages/transactionmaster/CashDepositPage";
import CashWithdrawalPage from "@/pages/transactionmaster/CashWithdrawalPage";
import RecurringInstallmentPage from "@/pages/transactionmaster/RecurringInstallmentPage";
import RtgsPage from "@/pages/transactionmaster/RtgsPage";
import TdInterestPaymentPage from "@/pages/transactionmaster/TdInterestPaymentPage";
import TdsTransactionPage from "@/pages/transactionmaster/TdsTransactionPage";
import TlCcInstallmentPage from "@/pages/transactionmaster/TlCcInstallmentPage";
import TlDisbursementPage from "@/pages/transactionmaster/TlDisbursementPage";
import TransferPage from "@/pages/transactionmaster/TransferPage";
import ModifyTdsTransactionPage from "@/pages/transactionmaster/ModifyTdsTransactionPage";
import UserMasterPage from "@/pages/UserMasterPage";
import RoleAuthorizationFlow from "./components/Authorization/RoleAuthorization/Roleauthorizationflow";
import AuthorizeAccountMainPage from "./pages/authorization/account/authorizationaccountmain";
import FutureModalsPage from "./components/FutureModal";
import TDSReportsPage from "./pages/Tds";
import ModifyBranchGlBalance from "./components/futuremodels/ModifyBranchGlBalance";
import ModifyAccountBalancePage from "./components/futuremodels/ModifyAccountBalancePage";
import ModifyBranchGlHistory from "./components/futuremodels/ModifyBranchGlHistory";
import ModifyCashHandlingRecord from "./components/futuremodels/ModifyCashHandlingRecord";
import FinancialClosing from "./components/FinancialClosing";
import TermDepositInterestPayment from "./components/TermDepositInterest/TermDepositInterestPayment";
import SetProductStatusPage from "./components/FinancialClosing/SetProductStatusPage";
// import BillHero from "./components/Bill/BillHero";
import BillUtilityPage from "./components/Bill/BillUtilityPage";
import BillAuthorizationOptions from "@/components/Authorization/BillAuthorize/BillAuthorizationOptions";


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
      { path: "/account-closing/investment", element: <AccountClosingInvestmentPage /> },
      { path: "/account-closing/loan", element: <AccountClosingLoanPage /> },
      { path: "/account-closing/pigmy", element: <AccountClosingPigmyPage /> },
      { path: "/account-master", element: <AccountMasterLandingPage /> },
      // { path: "/account-master/bill", element: <BillHero /> },
      { path: "/account-master/bill", element: <BillUtilityPage /> },
      { path: "/account-master/ca-sa", element: <AccountMasterCaSaPage /> },
      { path: "/account-master/deposit", element: <AccountMasterDepositPage /> },
      { path: "/account-master/investment", element: <AccountMasterInvestmentPage /> },
      { path: "/account-master/loan", element: <AccountMasterLoanPage /> },
      { path: "/accountmaster", element: <AccountMasterPage /> },
      { path: "/ai-dashboard", element: <AiDashboardPage /> },
      { path: "/assignuserrole", element: <AssignUserRolePage /> },
      { path: "/day-begin-end", element: <DayBeginEndPage /> },
{ path: "/interest-posting", element: <InterestPostingPage /> },
      { path: "/authorization", element: <AuthorizationPage /> },
      { path: "/authorization/authorizeaccountmain", element: <AuthorizeAccountMainPage /> },
      { path: "/authorization/authorizerole", element: <RoleAuthorizationFlowRoute /> },
      { path: "/authorization/authorizeaccountmain/authorizeaccount", element: <AuthorizeAccountPage /> },
      { path: "/authorization/authorizecustomer", element: <AuthorizationCustomerPage /> },
      { path: "/authorization/transaction", element: <AuthorizeTransactionPage /> },
      { path: "/authorization/transaction/cash-deposit", element: <CashDepositAuthorizePage /> },
      { path: "/authorization/transaction/cash-withdrawal", element: <CashWithdrawalAuthorizePage /> },
      { path: "/authorization/transaction/recurring-installment", element: <RecurringInstallmentAuthorizePage /> },
      { path: "/authorization/transaction/rtgs", element: <RtgsAuthorizePage /> },
      { path: "/authorization/transaction/td-interest-payment", element: <TdInterestPaymentAuthorizePage /> },
      { path: "/authorization/transaction/tds-transaction", element: <TdsTransactionAuthorizePage /> },
      { path: "/authorization/transaction/tl-cc-installment", element: <TlCcInstallmentAuthorizePage /> },
      { path: "/authorization/transaction/tl-disbursement", element: <TlDisbursementAuthorizePage /> },
      { path: "/authorization/transaction/tl-other-charges", element: <TLOtherChargesPage /> },
      { path: "/authorization/transaction/transfer", element: <TransferAuthorizePage /> },
      { path: "/authorization/user", element: <AuthorizationUserPage /> },
      { path: "/authorization/transaction/term-deposit-interest-payment", element: <TermDepositInterestPayment /> },
      { path: "/authorization/user", element: <AuthorizationUserPage /> },
      { path: "/authorization/BillAuthorize", element: <BillAuthorizationOptions /> },


       
      { path: "/branchmaster", element: <BranchMasterPage /> },
      { path: "/customermaster", element: <CustomerMasterPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/futuremodels", element: <FutureModelsPage /> },
      { path: "/futuremodels/calculator", element: <CalculatorPage /> },
      { path: "/futuremodels/casa-closing", element: <CasaClosingPage /> },
      { path: "/futuremodels/FixedAsset", element: <FixedAssetPage /> },
      { path: "/futuremodels/investment-account", element: <InvestmentAccountPage /> },
      { path: "/futuremodels/investment-account-close", element: <InvestmentAccountClosePage /> },
      { path: "/futuremodels/lean", element: <LeanPage /> },
      { path: "/futuremodels/memo", element: <MemoPage /> },
      { path: "/futuremodels/pigmy-deposit-details", element: <PigmyDepositDetailsPage /> },
      { path: "/futuremodels/PigmyDetails", element: <PigmyDetailsPage /> },
      { path: "/futuremodels/standing-instructions", element: <StandingInstructionsPage /> },
      { path: "/futuremodels/td-calculate", element: <TdCalculatePage /> },
      { path: "/futuremodels/td-close", element: <TermDepositClosePage /> },
      { path: "/futuremodels/td-open", element: <TdOpenPage /> },
      { path: "/futuremodels/TDClosingReinvest", element: <TDClosingReinvestPage /> },
      { path: "/futuremodels/tl-close", element: <TlClosePage /> },
      { path: "/futuremodels/tl-open", element: <TermLoanOpenPage /> },
      { path: "/futuremodels/tl-other-charges", element: <TLOtherChargesPage /> },
      { path: "/futuremodels/un-lean", element: <UnLeanPage /> },

      { path: "/futuremodels/modifyaccountbalance", element: <ModifyAccountBalancePage /> },
      { path: "/futuremodels/modifybranchglbalance", element: <ModifyBranchGlBalance /> },
      { path: "/futuremodels/modifybranchglhistory", element: <ModifyBranchGlHistory /> },
      { path: "/futuremodels/modifycashhandlingrecord", element: <ModifyCashHandlingRecord /> },

      { path: "/financial-closing", element: <FinancialClosing /> },
      { path: "/financial-closing/set-product-status", element: <SetProductStatusPage /> },
      { path: "/branchmaster", element: <BranchMasterPage /> },
      { path: "/globalmaster", element: <GlobalMasterPage /> },
      { path: "/headofficemaster", element: <HeadOfficeMasterPage /> },
      { path: "/support-utility", element: <SupportUtilityPage /> },
      { path: "/clerk/clearing", element: <ClerkClearingPage /> },
      { path: "/locker", element: <LockerPage /> },
      { path: "/transactionmaster", element: <TransactionMasterPage /> },
      { path: "/transactionmaster/cash-deposit", element: <CashDepositPage /> },
      { path: "/transactionmaster/cash-withdrawal", element: <CashWithdrawalPage /> },
      { path: "/transactionmaster/recurring-installment", element: <RecurringInstallmentPage /> },
      { path: "/transactionmaster/rtgs", element: <RtgsPage /> },
      { path: "/transactionmaster/td-interest-payment", element: <TdInterestPaymentPage /> },
      { path: "/transactionmaster/tds-transaction", element: <TdsTransactionPage /> },
      { path: "/transactionmaster/tl-cc-installment", element: <TlCcInstallmentPage /> },
      { path: "/transactionmaster/tl-disbursement", element: <TlDisbursementPage /> },
      { path: "/transactionmaster/transfer", element: <TransferPage /> },
      { path: "/transactionmaster/modify-tds-transaction", element: <ModifyTdsTransactionPage /> },
      { path: "/usermaster", element: <UserMasterPage /> },
      { path: "/futuremodals", element: <FutureModalsPage /> },
      { path: "/tds", element: <TDSReportsPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);