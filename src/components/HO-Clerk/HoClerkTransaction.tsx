import React, { useState } from 'react'
import NavbarCM from '../CustomerMaster/NavbarCM'
import { useRouter } from '@/lib/navigation';
import { useBilingual } from '@/i18n/useBilingual';
import Image from '@/components/ui/Image';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import AddCashDeposit from '@/components/TransactionMaster/AddCashDeposit';
import AddCashWithdrawal from '@/components/TransactionMaster/AddCashWithdrawal';
import AddInvestmentAccountClose from '@/components/futuremodels/AddInvestmentAccountClose';

const HO_CLERK_TRANSACTION_ITEMS = [
  {
    key: 'ho-cash-deposit-entry',
    iconSrc: '/note1.png',
    titleEn: 'HO CASH DEPOSIT ENTRY',
    titleHi: 'HO रोख जमा नोंद',
    badge: 'New',
    description: 'Create and authorize a head office cash deposit entry.',
    count: 0,
    href: '#',
  },
  {
    key: 'ho-cash-withdrawal-entry',
    iconSrc: '/note1.png',
    titleEn: 'HO CASH WITHDRAWAL ENTRY',
    titleHi: 'HO रोख पैसे काढणे नोंद',
    badge: 'New',
    description: 'Create and authorize a head office cash withdrawal entry.',
    count: 0,
    href: '#',
  },
  {
    key: 'ho-transfer-entry',
    iconSrc: '/note1.png',
    titleEn: 'HO TRANSFER ENTRY',
    titleHi: 'HO हस्तांतरण नोंद',
    badge: 'New',
    description: 'Create and authorize a head office transfer entry.',
    count: 0,
    href: '#',
  },
  {
    key: 'investment-payment-closingmark',
    iconSrc: '/note1.png',
    titleEn: 'INVESTMENT PAYMENT CLOSINGMARK',
    titleHi: 'गुंतवणूक पेमेंट क्लोजिंगमार्क',
    badge: 'New',
    description: 'Create and authorize investment payment closing mark entries.',
    count: 0,
    href: '#',
  },
  {
    key: 'rtgs-outward-file-generation',
    iconSrc: '/note1.png',
    titleEn: 'RTGS OUTWARD FILE GENERATION',
    titleHi: 'RTGS आउटवर्ड फाइल जनरेशन',
    badge: 'New',
    description: 'Generate and authorize RTGS outward file entries.',
    count: 0,
    href: '#',
  },
  {
    key: 'reconciliation',
    iconSrc: '/note1.png',
    titleEn: 'RECONCILIATION',
    titleHi: 'समायोजन',
    badge: 'New',
    description: 'Review and authorize reconciliation entries.',
    count: 0,
    href: '#',
  },
];

type TransactionCardProps = {
  item: typeof HO_CLERK_TRANSACTION_ITEMS[number];
  onOpen: (key: string) => void;
};

const TransactionCard = ({ item, onOpen }: TransactionCardProps) => (
   <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item.key)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(item.key);
      }}
      className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
        <Image
          src={item.iconSrc}
          alt=""
          width={56}
          height={56}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">
          {item.titleEn}
        </h3>
        <p className="mt-0.5 truncate text-sm text-[#64748B] dark:text-slate-400">
          {item.titleHi}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen(item.key);
        }}
        className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        Open <ChevronRight size={16} />
      </button>
    </div>
);

const HoClerkTransaction = () => {
  const { en, t } = useBilingual();
  const router = useRouter();
  const [openHoCashDeposit, setOpenHoCashDeposit] = useState(false);
  const [openHoCashWithdrawal, setOpenHoCashWithdrawal] = useState(false);
  const [openInvestmentClosing, setOpenInvestmentClosing] = useState(false);

  const handleOpen = (key: string) => {
    if (key === 'ho-cash-deposit-entry') {
      setOpenHoCashDeposit(true);
      return;
    }
    if (key === 'ho-cash-withdrawal-entry') {
      setOpenHoCashWithdrawal(true);
      return;
    }
    if (key === 'investment-payment-closingmark') {
      setOpenInvestmentClosing(true);
      return;
    }
    const item = HO_CLERK_TRANSACTION_ITEMS.find((row) => row.key === key);
    if (item?.href && item.href !== '#') {
      router.push(item.href);
    }
  };

  const handleCloseHoCashDeposit = () => {
    setOpenHoCashDeposit(false);
  };
  const handleCloseHoCashWithdrawal = () => {
    setOpenHoCashWithdrawal(false);
  };
  const handleCloseInvestmentClosing = () => {
    setOpenInvestmentClosing(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn={en("application.title")}
        titleHi={t("application.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/dashboard" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("application.breadcrumb"), href: "/account-master" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HO_CLERK_TRANSACTION_ITEMS.map((item) => (
            <TransactionCard key={item.key} item={item} onOpen={handleOpen} />
          ))}
        </div>
      </div>
      {openHoCashDeposit && (
        <AddCashDeposit
          onClose={handleCloseHoCashDeposit}
          titleEn="Ho Cash Deposit Entry"
          titleHi="HO रोख रक्कम जमा नोंद"
          subtitleEn="Fill in the HO cash deposit entry details."
          subtitleHi="HO रोख रक्कम जमा नोंद तपशील भरा."
        />
      )}
      {openHoCashWithdrawal && (
        <AddCashWithdrawal
          onClose={handleCloseHoCashWithdrawal}
          titleEn="Ho Cash Withdrawal Entry"
          titleHi="HO रोख पैसे काढणे नोंद"
          subtitleEn="Fill in the HO cash withdrawal entry details."
          subtitleHi="HO रोख पैसे काढणे नोंद तपशील भरा."
        />
      )}
      {openInvestmentClosing && (
        <AddInvestmentAccountClose
          onClose={handleCloseInvestmentClosing}
          variant="modal"
        />
     )}
    </div>
  )
}

export default HoClerkTransaction
