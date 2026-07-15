import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  MoreVertical,
  Check,
  Receipt,
  User,
  UserCircle,
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  Signature,
  Hash,
  Layers,
  Banknote,
  Building2,
  Users,
  FileStack,
  ArrowRightLeft,
  Wallet,
  Search,
} from 'lucide-react';
import FormModal from '@/components/shared/FormModal';
import {
  FieldShell,
  TextInput,
  RadioYesNo,
  SectionCard,
  SelectInput,
} from '@/components/shared/FormFields';

// ==================== TYPE DEFINITIONS ====================

interface FormData {
  accountCode: string;
  accountName: string;
  shortName: string;
  ledgerBalance: string;
  availableBalance: string;
  accountType: string;
  chequeType: string;
  chequeSeries: string;
  chequeNoFrom: string;
  chequeNoTo: string;
  issueDate: string;
  noOfLeaves: string;
  chargesApply: string;
  chequeIssueCharges: string;
  serviceTax: string;
  authorisedSignatory1: string;
  authorisedSignatory2: string;
  authorisedSignatory3: string;
}

interface ChequeBookIssueProps {
  onClose?: () => void;
  onDisplayVouchers?: () => void;
  mode?: 'edit' | 'view' | 'authorize';
}

// ==================== MODE CONFIG ====================

interface ModeConfig {
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
}

const MODE_CONFIG: Record<'edit' | 'view' | 'authorize', ModeConfig> = {
  edit: {
    titleEn: 'Cheque Book Issue',
    titleHi: 'धनादेश पुस्तिका वितरण',
    descEn: 'Create or edit cheque book issue details for the account',
    descHi: 'खात्यासाठी धनादेश पुस्तिका वितरण तपशील तयार किंवा संपादित करा',
  },
  view: {
    titleEn: 'View Cheque Book Issue',
    titleHi: 'धनादेश पुस्तिका वितरण पहा',
    descEn: 'View cheque book issue details for the account',
    descHi: 'खात्यासाठी धनादेश पुस्तिका वितरण तपशील पहा.',
  },
  authorize: {
    titleEn: 'Authorize Cheque Book Issue',
    titleHi: 'धनादेश पुस्तिका वितरण अधिकृत करा',
    descEn: 'Review and authorize cheque book issue request',
    descHi: 'धनादेश पुस्तिका वितरण विनंतीचे पुनरावलोकन करा आणि अधिकृत करा.',
  },
};

const DEFAULT_DATA: FormData = {
  accountCode: '1234567890',
  accountName: 'Akshay Om More',
  shortName: 'Akshay More',
  ledgerBalance: '408493.5',
  availableBalance: '408493.5',
  accountType: 'SB',
  chequeType: 'CTS',
  chequeSeries: 'A',
  chequeNoFrom: '70010',
  chequeNoTo: '70020',
  issueDate: '01-Jun-2026',
  noOfLeaves: '10',
  chargesApply: 'no',
  chequeIssueCharges: '',
  serviceTax: '',
  authorisedSignatory1: '-',
  authorisedSignatory2: '-',
  authorisedSignatory3: '-',
};

// ==================== CHEQUE NUMBER DATA ====================

const CHEQUE_NUMBER_LIST = [
  { from: '20010', to: '20020' },
  { from: '70010', to: '70020' },
  { from: '36010', to: '36020' },
  { from: '36030', to: '36040' },
  { from: '60010', to: '60020' },
  { from: '6001', to: '60010' },
  { from: '36001', to: '360010' },
  { from: '360030', to: '360040' },
  { from: '360060', to: '360070' },
  { from: '88091', to: '89001' },
];

// ==================== LIST MODAL ====================

interface ListModalProps {
  title: string;
  columns: { key: string; label: string }[];
  rows: Record<string, string>[];
  onSelect: (row: Record<string, string>) => void;
  onClose: () => void;
}

function ListModal({ title, columns, rows, onSelect, onClose }: ListModalProps) {
  const [searchText, setSearchText] = useState('');

  const filteredRows = React.useMemo(() => {
    if (!searchText.trim()) return rows;
    const q = searchText.trim().toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(q))
    );
  }, [rows, columns, searchText]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-[95vw] max-w-[720px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        {/* Decorative corner circles */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary-100" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-100" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-6 pb-5">
          <h2 className="shrink-0 text-lg font-bold text-slate-800">{title}</h2>
          <div className="relative w-full max-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Table */}
        <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto px-6 pb-6">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-primary-100 text-slate-700">
                {columns.map((col, idx) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 font-semibold ${idx === 0 ? 'rounded-l-lg' : ''}`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="rounded-r-lg px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-50 last:border-0">
                  {columns.map((col, idx) => (
                    <td key={col.key} className={`px-4 py-3 ${idx === 0 ? '' : 'text-slate-700'}`}>
                      {idx === 0 ? (
                        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {String(row[col.key] ?? '')}
                        </span>
                      ) : (
                        String(row[col.key] ?? '')
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="rounded-lg bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary-100"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-sm text-slate-400">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function ChequeBookIssue({
  onClose,
  onDisplayVouchers,
  mode = 'edit',
}: ChequeBookIssueProps) {
  const [formData, setFormData] = useState<FormData>({ ...DEFAULT_DATA });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isChequeListOpen, setIsChequeListOpen] = useState(false);

  const isView = mode === 'view' || mode === 'authorize';
  const isEdit = mode === 'edit';
  const config = MODE_CONFIG[mode] || MODE_CONFIG.edit;

  const clearError = (key: string) => {
    setErrors((prev) => ({ ...prev, [key]: '' }));
    setIsValidated(false);
  };

  const set =
    <K extends keyof FormData>(key: K) =>
    (val: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: val }));
      clearError(key);
    };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!formData.accountCode.trim()) nextErrors.accountCode = 'Account Code is required';
    if (!formData.accountName.trim()) nextErrors.accountName = 'Account Name is required';
    if (!formData.shortName.trim()) nextErrors.shortName = 'Short Name is required';
    if (!formData.chequeSeries.trim()) nextErrors.chequeSeries = 'Cheque Series is required';
    if (!formData.chequeNoFrom.trim()) nextErrors.chequeNoFrom = 'Cheque No From is required';

    // Validate cheque numbers are numeric
    if (formData.chequeNoFrom && !/^\d+$/.test(formData.chequeNoFrom.trim())) {
      nextErrors.chequeNoFrom = 'Enter a valid cheque number';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    setIsValidated(validate());
  };

  const handleSave = () => {
    if (!isValidated) return;
    console.log('Form Data:', formData);
    onClose?.();
  };

  const handleChequeSelect = (row: Record<string, string>) => {
    setFormData((prev) => ({
      ...prev,
      chequeNoFrom: row.from,
      chequeNoTo: row.to,
    }));
    setIsChequeListOpen(false);
    clearError('chequeNoFrom');
  };

  const grid4 = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4';
  const grid3 = 'grid grid-cols-1 gap-4 md:grid-cols-3';

  // Footer actions based on mode
  const renderFooter = () => {
    if (mode === 'authorize') {
      return (
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            Reject <X size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Cancel <X size={16} />
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Authorize <Check size={16} />
          </button>
        </div>
      );
    }

    if (mode === 'view') {
      return (
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Cancel <X size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            OK, Got it <Check size={16} />
          </button>
        </div>
      );
    }

    return (
      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 flex-wrap">
        <button
          type="button"
          onClick={handleValidate}
          disabled={isValidated}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Validate <Check size={16} />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>
        <button
          type="button"
          onClick={onDisplayVouchers}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Display Vouchers <Receipt size={16} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValidated}
          className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save <ChevronDown size={16} />
        </button>
      </div>
    );
  };

  // Replace Image with img element for React compatibility
  const HeaderIcon = () => (
    <div className="flex h-12 w-12 items-center justify-center">
      <img src="/add-icn.png" alt="Cheque Book" width={50} height={50} />
    </div>
  );

  return (
    <>
      <FormModal
        onClose={onClose ?? (() => {})}
        titleEn={config.titleEn}
        titleHi={config.titleHi}
        subtitleEn={config.descEn}
        subtitleHi={config.descHi}
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        headerIcon={<HeaderIcon />}
      >
        {/* Account Details Section */}
        <SectionCard
          titleEn="Account Details"
          titleHi="खात्याचा तपशील"
          icon="/User.png"
        >
          <div className={grid3}>
            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <TextInput
                icon={<Hash size={16} />}
                value={formData.accountCode}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खाते नाव" required>
              <TextInput
                icon={<User size={16} />}
                value={formData.accountName}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="Short Name" labelHi="संक्षिप्त नाव" required>
              <TextInput
                icon={<User size={16} />}
                value={formData.shortName}
                onChange={set('shortName')}
                placeholder="Enter Short Name"
                readOnly={isView}
                error={!!errors.shortName}
              />
              {errors.shortName && <p className="mt-1 text-sm text-red-500">{errors.shortName}</p>}
            </FieldShell>
          </div>

          <div className={`${grid3} mt-3`}>
            <FieldShell label="Ledger Balance" labelHi="लेजर शिल्लक" required>
              <TextInput
                icon={<Wallet size={16} />}
                value={formData.ledgerBalance}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput
                icon={<Banknote size={16} />}
                value={formData.availableBalance}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Cheque Details Section */}
        <SectionCard
          titleEn="Cheque Details"
          titleHi="धनादेश तपशील"
          icon="/User.png"
        >
          <div className={grid3}>
            <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required>
              {isEdit ? (
                <SelectInput
                  icon={<Building2 size={16} />}
                  value={formData.accountType}
                  onChange={set('accountType')}
                  options={['SB', 'Current', 'Saving', 'Fixed Deposit']}
                  placeholder="Select Account Type"
                  error={!!errors.accountType}
                />
              ) : (
                <TextInput
                  icon={<Building2 size={16} />}
                  value={formData.accountType}
                  onChange={() => {}}
                  readOnly
                />
              )}
            </FieldShell>

            <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required>
              {isEdit ? (
                <SelectInput
                  icon={<FileText size={16} />}
                  value={formData.chequeType}
                  onChange={set('chequeType')}
                  options={['GST', 'CTS', 'NON-CTS']}
                  placeholder="Select Cheque Type"
                  error={!!errors.chequeType}
                />
              ) : (
                <TextInput
                  icon={<FileText size={16} />}
                  value={formData.chequeType}
                  onChange={() => {}}
                  readOnly
                />
              )}
            </FieldShell>

            <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required>
              {isEdit ? (
                <SelectInput
                  icon={<Layers size={16} />}
                  value={formData.chequeSeries}
                  onChange={set('chequeSeries')}
                  options={['A', 'B', 'C', 'D']}
                  placeholder="Select Cheque Series"
                  error={!!errors.chequeSeries}
                />
              ) : (
                <TextInput
                  icon={<Layers size={16} />}
                  value={formData.chequeSeries}
                  onChange={() => {}}
                  readOnly
                />
              )}
            </FieldShell>
          </div>

          <div className={`${grid3} mt-4`}>
            <FieldShell label="Cheque No From" labelHi="चेक क्रमांकापासून" required>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput
                    icon={<ArrowRightLeft size={16} />}
                    value={formData.chequeNoFrom}
                    onChange={set('chequeNoFrom')}
                    placeholder="Enter Starting Cheque No"
                    readOnly={isView}
                    error={!!errors.chequeNoFrom}
                  />
                </div>
                {isEdit && (
                  <button
                    type="button"
                    onClick={() => setIsChequeListOpen(true)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary hover:bg-primary-100"
                  >
                    <MoreVertical size={14} />
                  </button>
                )}
              </div>
              {errors.chequeNoFrom && <p className="mt-1 text-sm text-red-500">{errors.chequeNoFrom}</p>}
            </FieldShell>

            <FieldShell label="Cheque No To" labelHi="चेक क्रमांकापर्यंत" required>
              <TextInput
                icon={<ArrowRightLeft size={16} />}
                value={formData.chequeNoTo}
                onChange={set('chequeNoTo')}
                placeholder="Enter Ending Cheque No"
                readOnly={isView}
                error={!!errors.chequeNoTo}
              />
              {errors.chequeNoTo && <p className="mt-1 text-sm text-red-500">{errors.chequeNoTo}</p>}
            </FieldShell>

            <FieldShell label="Issue Date" labelHi="वितरण तारीख" required>
              {isEdit ? (
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  value={formData.issueDate}
                  onChange={(e) => set('issueDate')(e.target.value)}
                />
              ) : (
                <TextInput
                  icon={<Calendar size={16} />}
                  value={formData.issueDate}
                  onChange={() => {}}
                  readOnly
                />
              )}
            </FieldShell>
          </div>

          <div className={`${grid3} mt-4`}>
            <FieldShell label="No Of Leaves" labelHi="पानांची संख्या" required>
              <TextInput
                icon={<FileStack size={16} />}
                value={formData.noOfLeaves}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="Charges Apply" labelHi="वशुल्क लागू">
              <RadioYesNo
                label=""
                labelHi=""
                value={formData.chargesApply === 'yes'}
                onChange={(v) => set('chargesApply')(v ? 'yes' : 'no')}
                disabled={isView}
              />
            </FieldShell>

            <FieldShell label="Chequebook Issue Charges" labelHi="चेकबुक इश्यू चार्जस" required>
              <TextInput
                icon={<DollarSign size={16} />}
                value={formData.chequeIssueCharges}
                onChange={set('chequeIssueCharges')}
                placeholder="0.00"
                readOnly={isView}
              />
              {errors.chequeIssueCharges && (
                <p className="mt-1 text-sm text-red-500">{errors.chequeIssueCharges}</p>
              )}
            </FieldShell>
          </div>

          <div className={`${grid3} mt-4`}>
            <FieldShell label="Service Tax" labelHi="सेवा कर" required>
              <TextInput
                icon={<DollarSign size={16} />}
                value={formData.serviceTax}
                onChange={set('serviceTax')}
                placeholder="0.00"
                readOnly={isView}
              />
              {errors.serviceTax && <p className="mt-1 text-sm text-red-500">{errors.serviceTax}</p>}
            </FieldShell>

            <FieldShell label="Authorized Signatory 1" labelHi="अधिकृत स्वाक्षरी १" required>
              <TextInput
                icon={<Signature size={16} />}
                value={formData.authorisedSignatory1}
                onChange={set('authorisedSignatory1')}
                placeholder="Enter Authorized Signatory"
                readOnly={isView}
              />
              {errors.authorisedSignatory1 && (
                <p className="mt-1 text-sm text-red-500">{errors.authorisedSignatory1}</p>
              )}
            </FieldShell>

            <FieldShell label="Authorized Signatory 2" labelHi="अधिकृत स्वाक्षरी २" required>
              <TextInput
                icon={<Users size={16} />}
                value={formData.authorisedSignatory2}
                onChange={set('authorisedSignatory2')}
                placeholder="Enter Authorized Signatory"
                readOnly={isView}
              />
              {errors.authorisedSignatory2 && (
                <p className="mt-1 text-sm text-red-500">{errors.authorisedSignatory2}</p>
              )}
            </FieldShell>
          </div>

          <div className={`${grid3} mt-4`}>
            <FieldShell label="Authorized Signatory 3" labelHi="अधिकृत स्वाक्षरी ३" required>
              <TextInput
                icon={<Users size={16} />}
                value={formData.authorisedSignatory3}
                onChange={set('authorisedSignatory3')}
                placeholder="Enter Authorized Signatory"
                readOnly={isView}
              />
              {errors.authorisedSignatory3 && (
                <p className="mt-1 text-sm text-red-500">{errors.authorisedSignatory3}</p>
              )}
            </FieldShell>
          </div>
        </SectionCard>

        {/* Footer */}
        {renderFooter()}
      </FormModal>

      {/* Cheque Number List Modal */}
      {isChequeListOpen && (
        <ListModal
          title="Cheque List"
          columns={[
            { key: 'from', label: 'Cheque Number From' },
            { key: 'to', label: 'Cheque Number To' },
          ]}
          rows={CHEQUE_NUMBER_LIST.map((item) => ({
            from: item.from,
            to: item.to,
          }))}
          onSelect={handleChequeSelect}
          onClose={() => setIsChequeListOpen(false)}
        />
      )}
    </>
  );
}