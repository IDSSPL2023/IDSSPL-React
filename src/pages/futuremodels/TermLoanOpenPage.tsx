import { useState } from "react";
import { Eye, SquarePen } from "lucide-react";
import NavbarAM from "@/components/AccountMaster/NavbarAM";
import AddTermLoanFlow from "@/components/FutureModels/AddTermLoanMaster";
import AddLoanAccountModal, { type LoanAccountFormData } from "@/components/FutureModels/AddLoanAccountModal";

interface LoanAccountRecord {
  accountCode: string;
  customerName: string;
  productDescription: string;
  loanAmount: string;
  status: "Active" | "Pending" | "Closed";
  data: Partial<LoanAccountFormData>;
}

const ACCOUNTS: LoanAccountRecord[] = [
  {
    accountCode: "TL-1001",
    customerName: "Akshay Om More",
    productDescription: "501 - Personal Loan",
    loanAmount: "1,50,000",
    status: "Active",
    data: {
      details: {
        customerId: "00012",
        customerName: "Akshay Om More",
        categoryCode: "Public",
        riskCategory: "Low",
        introducerAccountCode: "1001",
        introducerAccountName: "Saving Account",
        dateOfApplication: "2026-01-10",
        accountOperationCapacityId: "Self",
        minBalanceId: "200",
      },
      loan: {
        loanAmount: "150000",
        loanAmountInWords: "One Lakh Fifty Thousand Only",
        interestRate: "11.5",
        tenureMonths: "36",
        repaymentFrequency: "Monthly",
        emiAmount: "4950",
        disbursementDate: "2026-01-15",
        purposeOfLoan: "Personal expenses",
      },
      nominees: [
        {
          srNo: 1,
          salutationCode: "MRS",
          customerId: "00015",
          name: "Priya Sharma",
          relation: "Spouse",
          address1: "12 MG Road",
          address2: "",
          address3: "",
          zip: "416001",
          city: "Kolhapur",
          state: "Maharashtra",
          country: "India",
        },
      ],
      guarantors: [
        {
          srNo: 1,
          salutationCode: "MR",
          customerId: "00021",
          name: "Rahul Verma",
          relation: "Brother",
          address1: "45 Station Road",
          address2: "",
          address3: "",
          zip: "416003",
          city: "Kolhapur",
          state: "Maharashtra",
          country: "India",
        },
      ],
    },
  },
  {
    accountCode: "TL-1002",
    customerName: "Priya Sharma",
    productDescription: "504 - Staff Housing Loan",
    loanAmount: "25,00,000",
    status: "Active",
    data: {
      details: {
        customerId: "00015",
        customerName: "Priya Sharma",
        categoryCode: "Staff",
        riskCategory: "Medium",
        introducerAccountCode: "1002",
        introducerAccountName: "Current Account",
        dateOfApplication: "2026-02-01",
        accountOperationCapacityId: "Self",
        minBalanceId: "500",
      },
      loan: {
        loanAmount: "2500000",
        loanAmountInWords: "Twenty Five Lakh Only",
        interestRate: "9.2",
        tenureMonths: "180",
        repaymentFrequency: "Monthly",
        emiAmount: "25400",
        disbursementDate: "2026-02-10",
        purposeOfLoan: "Purchase of residential flat",
      },
      nominees: [
        {
          srNo: 1,
          salutationCode: "MR",
          customerId: "00012",
          name: "Akshay Om More",
          relation: "Spouse",
          address1: "12 MG Road",
          address2: "",
          address3: "",
          zip: "416001",
          city: "Kolhapur",
          state: "Maharashtra",
          country: "India",
        },
      ],
      guarantors: [
        {
          srNo: 1,
          salutationCode: "MR",
          customerId: "00021",
          name: "Rahul Verma",
          relation: "Father",
          address1: "45 Station Road",
          address2: "",
          address3: "",
          zip: "416003",
          city: "Kolhapur",
          state: "Maharashtra",
          country: "India",
        },
      ],
      landBuildingRows: [
        {
          srNo: 1,
          securityTypeCode: "Land & Building",
          submissionDate: "2026-02-01",
          location: "Kolhapur",
          area: "1200",
          unitOfArea: "SQ-FT",
          east: "Adjoining Plot No. 45",
          west: "Main Road",
          north: "Plot No. 46",
          south: "Nala",
          margin: "25",
          securedValue: "3000000",
          amountValued: "3200000",
          particular: "2BHK flat, 3rd floor",
          engineerName: "Tushar Mane",
        },
      ],
    },
  },
  {
    accountCode: "TL-1003",
    customerName: "Rahul Verma",
    productDescription: "505 - Gold Loan",
    loanAmount: "3,00,000",
    status: "Active",
    data: {
      details: {
        customerId: "00021",
        customerName: "Rahul Verma",
        categoryCode: "Public",
        riskCategory: "High",
        introducerAccountCode: "1003",
        introducerAccountName: "Recurring Deposit",
        dateOfApplication: "2026-03-05",
        accountOperationCapacityId: "Self",
        minBalanceId: "200",
      },
      loan: {
        loanAmount: "300000",
        loanAmountInWords: "Three Lakh Only",
        interestRate: "10.5",
        tenureMonths: "12",
        repaymentFrequency: "Monthly",
        emiAmount: "26800",
        disbursementDate: "2026-03-06",
        purposeOfLoan: "Business working capital",
      },
      nominees: [
        {
          srNo: 1,
          salutationCode: "MRS",
          customerId: "00015",
          name: "Priya Sharma",
          relation: "Spouse",
          address1: "12 MG Road",
          address2: "",
          address3: "",
          zip: "416001",
          city: "Kolhapur",
          state: "Maharashtra",
          country: "India",
        },
      ],
      goldSilverHeader: {
        securityTypeCode: "Gold Ornaments",
        submissionDate: "2026-03-05",
        receiptNumber: "912",
        drawerNumber: "912",
        bagNumber: "231",
        valuatorName: "Shrishank Om Naik",
        valuationRatePerGram: "6200",
        totalValuation: "12,91,400",
      },
      goldSilverItems: [
        { srNo: 1, itemName: "Gold Ring 22K", numberOfItems: "5", grossWeight: "52.30", netWeight: "50.50", nakkiNetWeight: "50.50", marketValue: "485000" },
        { srNo: 2, itemName: "Gold Chain 22K", numberOfItems: "2", grossWeight: "85.60", netWeight: "84.20", nakkiNetWeight: "84.00", marketValue: "806400" },
      ],
    },
  },
  {
    accountCode: "TL-1004",
    customerName: "Sunita Patil",
    productDescription: "506 - Vehicle Loan",
    loanAmount: "8,00,000",
    status: "Active",
    data: {
      details: {
        customerId: "00099",
        customerName: "Sunita Patil",
        categoryCode: "Public",
        riskCategory: "Medium",
        introducerAccountCode: "1001",
        introducerAccountName: "Saving Account",
        dateOfApplication: "2026-04-01",
        accountOperationCapacityId: "Self",
        minBalanceId: "200",
      },
      loan: {
        loanAmount: "800000",
        loanAmountInWords: "Eight Lakh Only",
        interestRate: "9.8",
        tenureMonths: "60",
        repaymentFrequency: "Monthly",
        emiAmount: "16800",
        disbursementDate: "2026-04-05",
        purposeOfLoan: "Purchase of new car",
      },
      guarantors: [
        {
          srNo: 1,
          salutationCode: "MR",
          customerId: "00012",
          name: "Akshay Om More",
          relation: "Brother",
          address1: "12 MG Road",
          address2: "",
          address3: "",
          zip: "416001",
          city: "Kolhapur",
          state: "Maharashtra",
          country: "India",
        },
      ],
      vehicles: [
        {
          srNo: 1,
          vehicleType: "Car",
          makeModel: "Maruti Suzuki Swift",
          modelYear: "2026",
          isNewVehicle: true,
          manufacturingDate: "2026-03-01",
          seatingCapacity: "5",
          carryingCapacity: "400Kg",
          engineCapacityCC: "1197CC",
          chassisNumber: "MA3ERLF1S00123456",
          acquisitionDate: "2026-04-02",
          supplierName: "Akshay Automotives",
          purchasePrice: "850000",
          purchaseParticular: "New hatchback for family use",
          rtoLocation: "Kolhapur",
          registrationNumber: "MH09AB1234",
          registrationDate: "2026-04-10",
          isVehicleInspected: true,
          submissionDate: "2026-04-01",
          insuranceName: "SAM Insurance",
          policyNumber: "POL998877",
          policyType: "Comprehensive",
          policyStartDate: "2026-04-10",
          policyEndDate: "2027-04-09",
          idv: "820000",
          premiumFrequency: "Yearly",
          premiumAmount: "18500",
          totalInsuredAmount: "820000",
          noClaimBonusPercent: "0",
          securityTypeCode: "Vehicle and Motor",
          marginPercent: "6",
        },
      ],
    },
  },
  {
    accountCode: "TL-1005",
    customerName: "Vikram Joshi",
    productDescription: "508 - Small Scale Industry Loan",
    loanAmount: "12,00,000",
    status: "Pending",
    data: {
      details: {
        customerId: "00088",
        customerName: "Vikram Joshi",
        categoryCode: "Public",
        riskCategory: "Medium",
        introducerAccountCode: "1002",
        introducerAccountName: "Current Account",
        dateOfApplication: "2026-05-01",
        accountOperationCapacityId: "Self",
        minBalanceId: "500",
      },
      loan: {
        loanAmount: "1200000",
        loanAmountInWords: "Twelve Lakh Only",
        interestRate: "10.75",
        tenureMonths: "84",
        repaymentFrequency: "Monthly",
        emiAmount: "20600",
        disbursementDate: "",
        purposeOfLoan: "Purchase of lathe machine for workshop",
      },
      guarantors: [
        {
          srNo: 1,
          salutationCode: "MR",
          customerId: "00021",
          name: "Rahul Verma",
          relation: "Brother",
          address1: "45 Station Road",
          address2: "",
          address3: "",
          zip: "416003",
          city: "Kolhapur",
          state: "Maharashtra",
          country: "India",
        },
      ],
      planMachines: [
        {
          srNo: 1,
          securityTypeCode: "Plant & Machinery",
          machineType: "Lathe Machine",
          machineName: "Heavy Duty Lathe",
          isNewEquipment: true,
          distinctiveNumber: "LM-2026-08",
          specification: "2HP, 6 feet bed",
          supplierName: "Kolhapur Engineering Works",
          purchasePrice: "950000",
          particular: "For precision metal turning",
          securityValue: "950000",
          acquisitionDate: "2026-05-05",
          submissionDate: "2026-05-01",
          marginPercent: "20",
        },
      ],
    },
  },
  {
    accountCode: "TL-1006",
    customerName: "Ramesh Kulkarni",
    productDescription: "507 - Domestic Items Loan",
    loanAmount: "50,000",
    status: "Active",
    data: {
      details: {
        customerId: "00077",
        customerName: "Ramesh Kulkarni",
        categoryCode: "Public",
        riskCategory: "Low",
        introducerAccountCode: "1001",
        introducerAccountName: "Saving Account",
        dateOfApplication: "2026-01-20",
        accountOperationCapacityId: "Self",
        minBalanceId: "200",
      },
      loan: {
        loanAmount: "50000",
        loanAmountInWords: "Fifty Thousand Only",
        interestRate: "12",
        tenureMonths: "18",
        repaymentFrequency: "Monthly",
        emiAmount: "3050",
        disbursementDate: "2026-01-22",
        purposeOfLoan: "Purchase of home appliances",
      },
      depositDetails: {
        depositAccountNumber: "SB-000456",
        depositHolderName: "Ramesh Kulkarni",
        depositAmount: "60000",
        depositDate: "2025-06-15",
        maturityDate: "2028-06-15",
        lienAmount: "50000",
      },
    },
  },
  {
    accountCode: "TL-1007",
    customerName: "Anita Deshmukh",
    productDescription: "512 - Secured Short Term Sugar Cane",
    loanAmount: "4,00,000",
    status: "Closed",
    data: {
      details: {
        customerId: "00066",
        customerName: "Anita Deshmukh",
        categoryCode: "Public",
        riskCategory: "Medium",
        introducerAccountCode: "1003",
        introducerAccountName: "Recurring Deposit",
        dateOfApplication: "2025-11-01",
        accountOperationCapacityId: "Self",
        minBalanceId: "200",
      },
      loan: {
        loanAmount: "400000",
        loanAmountInWords: "Four Lakh Only",
        interestRate: "11",
        tenureMonths: "6",
        repaymentFrequency: "Monthly",
        emiAmount: "69500",
        disbursementDate: "2025-11-05",
        purposeOfLoan: "Sugar cane cultivation working capital",
      },
      wareHouse: {
        warehouseName: "Kolhapur Sugar Warehouse",
        receiptNumber: "WR-22456",
        commodityDescription: "Sugar Cane (Harvested)",
        quantity: "500 Quintal",
        storageValue: "420000",
        receiptDate: "2025-11-01",
        expiryDate: "2026-05-01",
      },
    },
  },
];

const STATUS_STYLES: Record<LoanAccountRecord["status"], string> = {
  Active: "border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Pending: "border-amber-500 bg-amber-50 text-amber-600 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Closed: "border-slate-400 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const TermLoanOpenPage = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [viewEdit, setViewEdit] = useState<{ record: LoanAccountRecord; mode: "view" | "edit" } | null>(null);

  return (
    <div className="min-h-screen bg-[#F4F6FC] dark:bg-slate-950 relative">
      <NavbarAM
        titleEn="Term Loan Open"
        titleHi="मुदत कर्ज उघडा"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Future Models", href: "/futuremodels" },
          { label: "Term Loan Open", href: "/futuremodels/tl-open" },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
      />

      <div className="p-6">
        <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary">
                  {["Account Code", "Customer Name", "Product Type", "Loan Amount", "Status", "Actions"].map((label) => (
                    <th key={label} className="whitespace-nowrap px-6 py-3 text-left text-[16px] font-semibold text-white">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACCOUNTS.map((record, idx) => (
                  <tr key={record.accountCode} className={`${idx !== ACCOUNTS.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100">{record.accountCode}</td>
                    <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400">{record.customerName}</td>
                    <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400">{record.productDescription}</td>
                    <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400">₹{record.loanAmount}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium ${STATUS_STYLES[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setViewEdit({ record, mode: "view" })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary transition-colors hover:bg-primary-100"
                          aria-label={`View ${record.accountCode}`}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setViewEdit({ record, mode: "edit" })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary transition-colors hover:bg-primary-100"
                          aria-label={`Edit ${record.accountCode}`}
                        >
                          <SquarePen size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openAddModal && <AddTermLoanFlow onClose={() => setOpenAddModal(false)} />}

      {viewEdit && (
        <AddLoanAccountModal
          mode={viewEdit.mode}
          productDescription={viewEdit.record.productDescription}
          initialData={viewEdit.record.data}
          onClose={() => setViewEdit(null)}
          onSave={() => setViewEdit(null)}
        />
      )}
    </div>
  );
};

export default TermLoanOpenPage;
