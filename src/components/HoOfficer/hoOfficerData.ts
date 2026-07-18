export type HoOfficerItem = {
  id: string;
  title: string;
  marathiTitle: string;
  route: string;
  icon: string;
};

const ICON = "/authorize transaction list icon.png";

export const HO_OFFICER_ITEMS: HoOfficerItem[] = [
  {
    id: "ho-cash-deposit-entry",
    title: "HO CASH DEPOSIT ENTRY",
    marathiTitle: "HO रोख जमा नोंद",
    route: "/ho-officer/ho-cash-deposit-entry",
    icon: ICON,
  },
  {
    id: "ho-cash-withdrawal-entry",
    title: "HO CASH WITHDRAWAL ENTRY",
    marathiTitle: "HO रोख पैसे काढणे नोंद",
    route: "/ho-officer/ho-cash-withdrawal-entry",
    icon: ICON,
  },
  {
    id: "ho-transfer-entry",
    title: "HO TRANSFER ENTRY",
    marathiTitle: "HO हस्तांतरण नोंद",
    route: "/ho-officer/ho-transfer-entry",
    icon: ICON,
  },
  {
    id: "investment-payment-closingmark",
    title: "INVESTMENT PAYMENT CLOSINGMARK",
    marathiTitle: "गुंतवणूक पेमेंट क्लोजिंगमार्क",
    route: "/ho-officer/investment-payment-closingmark",
    icon: ICON,
  },
  {
    id: "rtgs-outward-file-generation",
    title: "RTGS OUTWARD FILE GENERATION",
    marathiTitle: "RTGS आउटवर्ड फाइल जनरेशन",
    route: "/ho-officer/rtgs-outward-file-generation",
    icon: ICON,
  },
  {
    id: "reconciliation",
    title: "RECONCILIATION",
    marathiTitle: "समायोजन",
    route: "/ho-officer/reconciliation",
    icon: ICON,
  },
];
