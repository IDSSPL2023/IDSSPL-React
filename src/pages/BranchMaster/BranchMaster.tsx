import React, { useState, useMemo } from "react";
import {
  Edit3,
  Users,
  Briefcase,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Send,
  Calendar,
  MapPin,
  ShieldCheck,
  Hash,
  Copy,
  CheckCircle2,
  User,
  Award,
  Smartphone,
  Wallet,
  Landmark,
  PiggyBank,
  Home as HomeIcon,
  Sprout,
  Gem,
  Banknote,
  Monitor,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import { IMAGES } from "@/assets";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";

// Import Tab Components
import { NonCBSTab } from "./NonCBSTab";
import { ChequeLotTab } from "./ChequeLotTab";
import { TDLotTab } from "./TDLotTab";
import { UserDenominationTab } from "./UserDenominationTab";
import { AgentTab } from "./AgentTab";
import { AdviceNoTab } from "./AdviceNoTab";
import { SIExecutionTab } from "./SIExecutionTab";
import { useLocation } from "react-router-dom";

// ============== REUSABLE COMPONENTS ==============

interface StatCardProps {
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  value: string;
  label: string;
  trend?: string;
  imageSrc?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  value,
  label,
  trend,
  imageSrc,
}) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-200/80 relative overflow-hidden flex flex-col justify-between min-h-[128px]">
    <div className="flex items-center justify-between">
      <div
        className={`w-9 h-9 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}
      >
        <Icon className={iconColor} size={18} />
      </div>
      {trend && (
        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <span className="text-[9px]">^</span> {trend}
        </span>
      )}
    </div>
    <div className="mt-2 z-10">
      <div className="text-2xl font-bold text-gray-900 leading-tight">
        {value}
      </div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
    {imageSrc && (
      <img
        src={imageSrc}
        alt={label}
        className="absolute bottom-1 right-2 w-16 h-16 object-contain opacity-80 pointer-events-none"
      />
    )}
  </div>
);

interface InfoBoxProps {
  icon: React.ElementType;
  label: string;
  value: string;
  colSpan?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  icon: Icon,
  label,
  value,
  colSpan = "col-span-1",
}) => (
  <div
    className={`bg-[#F6F8FC] p-3 rounded-xl flex items-center gap-3 border border-gray-100 ${colSpan}`}
  >
    <div className="w-8 h-8 rounded-lg bg-blue-50/80 text-blue-600 flex items-center justify-center shrink-0">
      <Icon size={15} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </div>
      <div className="text-xs font-bold text-gray-800 leading-tight mt-0.5 truncate">
        {value}
      </div>
    </div>
  </div>
);

interface ServiceItemProps {
  icon: React.ElementType;
  name: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon: Icon, name }) => (
  <div className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-gray-50 border border-gray-100 transition-all duration-200 hover:bg-blue-50 hover:border-blue-200">
    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
      <Icon size={12} className="text-blue-600" />
    </div>
    <span className="text-sm text-gray-700 hover:text-blue-700 transition-colors duration-200">
      {name}
    </span>
  </div>
);

// ============== MAIN COMPONENT ==============
export default function BranchMasterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("Branch Overview");
  const location = useLocation();

  // Dynamic navigation configuration based on pathname
  const navConfig = useMemo(() => {
    const pathname = location.pathname;
    const pathSegments = pathname.split("/").filter(Boolean);

    // Determine the role from the first segment
    const role = pathSegments[0] || "clerk";

    // Role configuration - Added 'manager' role
    const roleConfig: Record<string, { label: string; path: string }> = {
      clerk: {
        label: "Clerk",
        path: "/clerk",
      },
      master: {
        label: "Master",
        path: "/master",
      },
      manager: {
        label: "Manager",
        path: "/manager",
      },
    };

    const currentRole = roleConfig[role] || roleConfig.clerk;

    // Check if we're on a sub-page
    const isSubPage = pathSegments.length > 2;
    const subPage = isSubPage ? pathSegments[2] : null;

    // Sub-page mapping
    const subPageMap: Record<string, { en: string; hi: string }> = {
      create: { en: "Create Branch", hi: "शाखा बनाएं" },
      edit: { en: "Edit Branch", hi: "शाखा संपादित करें" },
      details: { en: "Branch Details", hi: "शाखा विवरण" },
      view: { en: "View Branch", hi: "शाखा देखें" },
      delete: { en: "Delete Branch", hi: "शाखा हटाएं" },
    };

    // If on sub-page
    if (subPage && subPageMap[subPage]) {
      const pageInfo = subPageMap[subPage];
      return {
        titleEn: pageInfo.en,
        titleHi: pageInfo.hi,
        breadcrumbs: [
          { label: "Home", href: "/" },
          {
            label: currentRole.label,
            onClick: () => router.push(currentRole.path),
          },
          {
            label: "Branch Master",
            href: `/${role}/branchmaster`,
          },
          { label: pageInfo.en, href: "#" },
        ],
      };
    }

    // Default main page configuration
    return {
      titleEn: "Branch Master",
      titleHi: "शाखा मास्टर",
      breadcrumbs: [
        { label: "Home", href: "/" },
        {
          label: currentRole.label,
          onClick: () => router.push(currentRole.path),
        },
        { label: "Branch Master", href: "#" },
      ],
    };
  }, [location.pathname, router]);

  const tabs: string[] = [
    "Branch Overview",
    "Non CBS",
    "Cheque Lot",
    "TD Lot",
    "User Denomination",
    "Agent",
    "Advice No",
    "SI Execution",
  ];

  const services = [
    { icon: Wallet, name: "Savings Account" },
    { icon: Landmark, name: "Current Account" },
    { icon: PiggyBank, name: "Fixed Deposit" },
    { icon: Award, name: "Recurring Deposit" },
    { icon: HomeIcon, name: "Home Loan" },
    { icon: Sprout, name: "Agriculture Loan" },
    { icon: Gem, name: "Gold Loan" },
    { icon: User, name: "Personal Loan" },
    { icon: Send, name: "RTGS / NEFT" },
    { icon: Banknote, name: "IMPS" },
    { icon: CreditCard, name: "DD / PO" },
    { icon: Shield, name: "Locker Facility" },
    { icon: CreditCard, name: "ATM" },
    { icon: Smartphone, name: "Mobile Banking" },
    { icon: Monitor, name: "Internet Banking" },
    { icon: Shield, name: "Insurance" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Non CBS":
        return <NonCBSTab />;
      case "Cheque Lot":
        return <ChequeLotTab />;
      case "TD Lot":
        return <TDLotTab />;
      case "User Denomination":
        return <UserDenominationTab />;
      case "Agent":
        return <AgentTab />;
      case "Advice No":
        return <AdviceNoTab />;
      case "SI Execution":
        return <SIExecutionTab />;
      default:
        return <BranchOverview />;
    }
  };

  const BranchOverview = () => (
    <div className="space-y-4">
      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          value="24"
          label="Total Staff"
          trend="↑ +2 this yr"
          imageSrc={IMAGES.STAFF}
        />
        <StatCard
          icon={Briefcase}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
          value="8,420"
          label="Total Accounts"
          trend="↑ +340 this yr"
          imageSrc={IMAGES.ACCOUNT}
        />
        <StatCard
          icon={CreditCard}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
          value="₹ 84.2 Cr"
          label="Total Deposits"
          trend="↑ 6.2%"
          imageSrc={IMAGES.DEPOSITES}
        />
        <StatCard
          icon={Building2}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-500"
          value="₹ 52.6 Cr"
          label="Total Loans"
          trend="↑ 4.8%"
          imageSrc={IMAGES.LOANS}
        />
      </div>

      {/* 2. Middle Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Branch Information Card (Left side) - IMAGE AT TOP-RIGHT */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col">
          {/* Header with image at top-right */}
          <div className="flex items-start justify-between mb-4 z-10 relative">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <HomeIcon size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 leading-none">
                  Branch Information
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Overview of branch details and location
                </p>
              </div>
            </div>

            {/* Image at top-right */}
            <div className="shrink-0 ml-2">
              <img
                src={IMAGES.BRANCH_INFO}
                alt="Bank"
                className="h-14 w-auto object-contain opacity-80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 z-10 relative">
            <InfoBox icon={Hash} label="BRANCH CODE" value="0002" />
            <InfoBox
              icon={Calendar}
              label="ESTABLISHED"
              value="12 March 1992"
            />
            <InfoBox
              icon={SlidersHorizontal}
              label="BRANCH TYPE"
              value="Main Branch"
            />

            <InfoBox
              icon={MapPin}
              label="DISTRICT / STATE"
              value="Bagalkot, Karnataka – 587116"
            />
            <InfoBox icon={ShieldCheck} label="IFSC CODE" value="IBKL01071BP" />
            <InfoBox icon={Hash} label="MICR CODE" value="583074002" />

            <InfoBox
              icon={HomeIcon}
              label="ADDRESS"
              value="Near Old Bus Stand, Main Road, Bilagi, Bilagi"
              colSpan="sm:col-span-3"
            />
          </div>
        </div>

        {/* Branch Manager Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider leading-none">
                  BRANCH MANAGER
                </h2>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Branch leadership & contact details
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/80 whitespace-nowrap">
              <CheckCircle2 size={11} className="mr-1" /> Verified Manager
            </span>
          </div>

          {/* Content Grid - Side by Side */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Left - Profile Card */}
            <div className="sm:w-[30%] bg-[#031B4E] rounded-2xl p-3 text-white flex flex-col items-center justify-center text-center min-h-[230px]">
              <div className="relative mb-2">
                <img
                  src={IMAGES.Branch_MANAGER}
                  alt="Rajesh Kumar Patil"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#031B4E] rounded-full"></span>
              </div>
              <h3 className="text-sm font-bold leading-tight text-white">
                Rajesh Kumar Patil
              </h3>
              <span className="mt-1.5 px-3 py-0.5 rounded-full bg-white/10 text-[10px] text-blue-200 font-medium">
                Branch Manager
              </span>

              {/* Serving Since */}
              <div className="mt-4 pt-3 border-t border-white/10 w-full">
                <div className="flex items-center justify-center gap-2">
                  <Calendar size={14} className="text-white/70" />
                  <div className="text-left">
                    <div className="text-[8px] font-bold text-slate-300 tracking-wider uppercase">
                      SERVING SINCE
                    </div>
                    <div className="text-xs font-bold text-white">Jan 2021</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Contact Information */}
            <div className="sm:w-[60%] flex flex-col gap-2.5">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                CONTACT INFORMATION
              </div>

              {/* Mobile */}
              <div className="bg-[#E0EAFF] p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone size={13} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] font-bold text-gray-400 uppercase">
                      MOBILE NUMBER
                    </div>
                    <div className="text-xs font-bold text-gray-800">
                      8989567890
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-blue-600 shrink-0 p-1">
                  <Copy size={13} />
                </button>
              </div>

              {/* Email */}
              <div className="bg-[#E0EAFF] p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail size={13} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] font-bold text-gray-400 uppercase">
                      EMAIL ADDRESS
                    </div>
                    <div className="text-xs font-bold text-gray-800 truncate">
                      BILAGI.MAIN@BPSBN.CO.IN
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-blue-600 shrink-0 p-1">
                  <Copy size={13} />
                </button>
              </div>

              {/* Gradient Button */}
              <button
                style={{
                  background:
                    "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)",
                }}
                className="w-full py-3.5 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md shadow-blue-900/20 hover:opacity-95 active:scale-[0.99] mt-3"
              >
                <Send size={16} className="-rotate-12" />
                <span>Contact Manager</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Available Services - No Scroll */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Award className="text-blue-600" size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Available Services
              </h2>
              <p className="text-xs text-gray-400">
                All {services.length} services offered
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {services.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
          {services.map((service, index) => (
            <ServiceItem key={index} icon={service.icon} name={service.name} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F4F9] dark:bg-slate-950 pb-6">
      <GlobalNav
        titleEn={navConfig.titleEn}
        titleHi={navConfig.titleHi}
        breadcrumbs={navConfig.breadcrumbs}
        onBack={() => router.back()}
      />

      <div className="p-4">
        {/* Branch Banner Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#031B4E] p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-25 h-25 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src={IMAGES.BRANCH_MASTER}
                  alt="Branch Logo"
                  className="object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
                    Operational
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-gray-300">
                    Main Branch
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-gray-300">
                    Code: 0002
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Bilagi Main Branch
                </h1>
                <p className="text-xs text-gray-300 mt-0.5">
                  Bilagi Pattan Sahakari Bank Niyamit
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-medium transition shadow-md">
              <Edit3 size={14} /> <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Exact Match */}
        <div className="flex items-center gap-6 border-b border-gray-200 px-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
        text-sm font-medium whitespace-nowrap transition-all 
        py-3 px-1 relative
        ${
          activeTab === tab
            ? "text-blue-600"
            : "text-gray-600 hover:text-gray-900"
        }
      `}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Content */}
        <div className="mt-4">{renderContent()}</div>
      </div>
    </div>
  );
}
