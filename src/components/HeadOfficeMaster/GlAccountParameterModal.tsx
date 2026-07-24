// @ts-nocheck
import { IMAGES } from "@/assets";
import { useState } from "react";
import Image from "@/components/ui/Image";
import { X, Check, ChevronDown, ThumbsUp, UserRound, SquarePen, FileText, Hash, Landmark } from "lucide-react";
import PicklistModal from "@/components/common/PicklistModal";
import { searchFinalAccountGroupsForGl, searchCdRatioGroups } from "@/api/headoffice.api";

const PAGE_SIZE = 10;

const MODAL_META = {
  add: {
    titleEn: "Add New Parameter",
    titleHi: "नवीन मापदंड जोडा",
    subtitleEn: "Fill in the details below to create a new parameter.",
    subtitleHi: "नवीन पॅरामीटर जोडण्यासाठी खालील तपशील प्रविष्ट करा.",
    useImage: true,
  },
  edit: {
    titleEn: "Edit Parameter",
    titleHi: "पॅरामीटर संपादित करा",
    subtitleEn: "Review and update the details below as needed.",
    subtitleHi: "आवश्यकतेनुसार खालील तपशील तपासा व अद्ययावत करा.",
    useImage: false,
    Icon: SquarePen,
  },
  view: {
    titleEn: "View Parameter",
    titleHi: "पॅरामीटर पहा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    useImage: false,
    Icon: UserRound,
  },
};

const emptyForm = () => ({
  glAccountCode: "",
  description: "",
  sequenceNumber: "",
  dayBookSequenceNumber: "",
  positiveFinalAccountGroup: "",
  positiveFinalAccountGroupDescription: "",
  negativeFinalAccountGroup: "",
  negativeFinalAccountGroupDescription: "",
  cdRatioGroupCode: "",
  cdRatioGroupDescription: "",
  transactionAllowed: "Y",
  directOuterInBspl: "N",
  accountSerial: "",
  alie: "A",
});

const formFromRecord = (record) => ({
  ...emptyForm(),
  glAccountCode: record.glAccountCode ?? "",
  description: record.description ?? "",
  sequenceNumber: record.sequenceNumber != null ? String(record.sequenceNumber) : "",
  dayBookSequenceNumber: record.dayBookSequenceNumber != null ? String(record.dayBookSequenceNumber) : "",
  positiveFinalAccountGroup: record.positiveFinalAccountGroup ?? "",
  negativeFinalAccountGroup: record.negativeFinalAccountGroup ?? "",
  cdRatioGroupCode: record.cdRatioGroupCode ?? "",
  transactionAllowed: record.transactionAllowed ?? "Y",
  directOuterInBspl: record.directOuterInBspl ?? "N",
  accountSerial: record.accountSerial ?? "",
  alie: record.alie ?? "A",
});

const REQUIRED_KEYS = [
  "glAccountCode",
  "description",
  "sequenceNumber",
  "dayBookSequenceNumber",
  "positiveFinalAccountGroup",
  "negativeFinalAccountGroup",
  "cdRatioGroupCode",
];

function TextField({ label, labelHi, icon: Icon, value, onChange, placeholder, error, readOnly }) {
  return (
    <div>
      <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
        {label}
        <span className="font-medium text-gray-500 dark:text-slate-400"> / {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div
        className={`flex h-11 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
          error
            ? "border-red-400"
            : readOnly
              ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
        }`}
      >
        <Icon size={18} className="shrink-0 text-[#6B7280]" />
        <input
          type="text"
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`ml-3 w-full bg-transparent text-[15px] outline-none ${
            readOnly ? "text-slate-500 dark:text-slate-400" : "text-[#4B5563] placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">This field is required</p>}
    </div>
  );
}

function PicklistTriggerField({ label, labelHi, icon: Icon, value, placeholder, error, onOpen, readOnly }) {
  return (
    <div>
      <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
        {label}
        <span className="font-medium text-gray-500 dark:text-slate-400"> / {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <div
          className={`flex h-11 flex-1 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
            error
              ? "border-red-400"
              : readOnly
                ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                : "border-[#B8C2D6] dark:border-slate-700"
          }`}
        >
          <Icon size={18} className="shrink-0 text-[#6B7280]" />
          <span className={`ml-3 truncate text-[15px] ${value ? "text-[#4B5563] dark:text-slate-100" : "text-[#7C879B] dark:text-slate-500"}`}>
            {value || placeholder}
          </span>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Open ${label} list`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-primary transition-colors hover:bg-primary-200 dark:bg-primary-950/40"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="5" r="1.2" />
              <circle cx="12" cy="12" r="1.2" />
              <circle cx="12" cy="19" r="1.2" />
            </svg>
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">This field is required</p>}
    </div>
  );
}

function RadioField({ label, labelHi, value, onChange, disabled }) {
  return (
    <div>
      <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
        {label}
        <br />
        <span className="text-[13px] font-medium text-gray-500 dark:text-slate-400">{labelHi}</span>
      </label>
      <div className="flex h-11 items-center gap-6">
        {[
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ].map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            <input
              type="radio"
              checked={value === opt.value}
              disabled={disabled}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 accent-primary"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function GlAccountParameterModal({ mode = "add", initialData = null, onClose, onSave }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";
  const meta = MODAL_META[mode];

  const [form, setForm] = useState(() => (initialData ? formFromRecord(initialData) : emptyForm()));
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [picklist, setPicklist] = useState(null); // "positiveGroup" | "negativeGroup" | "cdRatioGroup"
  const [positiveGroups, setPositiveGroups] = useState([]);
  const [positiveGroupsPage, setPositiveGroupsPage] = useState(1);
  const [negativeGroups, setNegativeGroups] = useState([]);
  const [negativeGroupsPage, setNegativeGroupsPage] = useState(1);
  const [cdRatioGroups, setCdRatioGroups] = useState([]);
  const [cdRatioGroupsPage, setCdRatioGroupsPage] = useState(1);
  const [picklistLoading, setPicklistLoading] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  // Opening a picklist never calls the API — results only load once the user
  // presses Submit inside the picklist's own search form.
  const openPicklist = (which) => {
    setPicklist(which);
  };

  const handlePositiveGroupSearch = async (searchBy, textToSearch) => {
    setPicklistLoading(true);
    try {
      setPositiveGroups(await searchFinalAccountGroupsForGl({ groupFor: "POSITIVE", searchBy, textToSearch }));
      setPositiveGroupsPage(1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load final account groups.");
    } finally {
      setPicklistLoading(false);
    }
  };

  const handleNegativeGroupSearch = async (searchBy, textToSearch) => {
    setPicklistLoading(true);
    try {
      setNegativeGroups(await searchFinalAccountGroupsForGl({ groupFor: "NEGATIVE", searchBy, textToSearch }));
      setNegativeGroupsPage(1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load final account groups.");
    } finally {
      setPicklistLoading(false);
    }
  };

  const handleCdRatioGroupSearch = async (searchBy, textToSearch) => {
    setPicklistLoading(true);
    try {
      setCdRatioGroups(await searchCdRatioGroups({ searchBy, textToSearch }));
      setCdRatioGroupsPage(1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load CD ratio groups.");
    } finally {
      setPicklistLoading(false);
    }
  };

  const handleValidate = () => {
    const nextErrors = {};
    REQUIRED_KEYS.forEach((key) => {
      if (!form[key]?.toString().trim()) nextErrors[key] = true;
    });
    setErrors(nextErrors);
    setValidated(Object.keys(nextErrors).length === 0);
  };

  const handleSave = async () => {
    if (!validated || saving) return;
    setSaving(true);
    try {
      const glAccount = {
        accountSerial: form.accountSerial || String(Date.now()).slice(-7),
        description: form.description,
        sequenceNumber: Number(form.sequenceNumber) || 0,
        alie: form.alie,
        transactionAllowed: form.transactionAllowed,
        dayBookSequenceNumber: Number(form.dayBookSequenceNumber) || 0,
        directOuterInBspl: form.directOuterInBspl,
        positiveFinalAccountGroup: form.positiveFinalAccountGroup,
        negativeFinalAccountGroup: form.negativeFinalAccountGroup,
        cdRatioGroupCode: form.cdRatioGroupCode,
        includeExpenseStatement: "N",
        createOutListWhen: "N",
      };
      if (isAdd) {
        await onSave({
          glAccount: { glAccountCode: form.glAccountCode, ...glAccount },
          effectiveDate: new Date().toISOString().slice(0, 10),
          userId: "admin",
        });
      } else {
        await onSave({ glAccountCode: form.glAccountCode, update: glAccount });
      }
      onClose();
    } catch {
      // onSave surfaces the error; keep the modal open so the user can retry.
    } finally {
      setSaving(false);
    }
  };

  const HeaderIcon = meta.useImage ? null : meta.Icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            {meta.useImage ? (
              <Image src={IMAGES.ADD_ICON} alt="" width={50} height={50} />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
                <HeaderIcon size={24} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-[#1C398E] dark:text-slate-100">
                {meta.titleEn} <span className="font-bold text-[#64748B] dark:text-slate-400">/ {meta.titleHi}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {meta.subtitleEn} / {meta.subtitleHi}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            <TextField
              label="GL Account Code"
              labelHi="जीएल अकाउंट कोड"
              icon={UserRound}
              value={form.glAccountCode}
              placeholder="Enter GL Account Code"
              error={errors.glAccountCode}
              readOnly={isView || isEdit}
              onChange={(v) => update("glAccountCode", v)}
            />
            <TextField
              label="Description"
              labelHi="वर्णन"
              icon={FileText}
              value={form.description}
              placeholder="Enter Description"
              error={errors.description}
              readOnly={isView}
              onChange={(v) => update("description", v)}
            />

            <TextField
              label="BS/PL Sequence No"
              labelHi="बीएस / पीएल सिक्वेन्स नंबर"
              icon={Hash}
              value={form.sequenceNumber}
              placeholder="Enter BS/PL Sequence No."
              error={errors.sequenceNumber}
              readOnly={isView}
              onChange={(v) => update("sequenceNumber", v)}
            />
            <TextField
              label="Day Book Seq No"
              labelHi="दैनिक नोंदवही क्रम क्रमांक"
              icon={Hash}
              value={form.dayBookSequenceNumber}
              placeholder="Enter Day Book Sequence No"
              error={errors.dayBookSequenceNumber}
              readOnly={isView}
              onChange={(v) => update("dayBookSequenceNumber", v)}
            />

            <PicklistTriggerField
              label="Final Account Master When Positive"
              labelHi="फायनल अकाउंट मास्टर व्हेन पॉझिटिव्ह"
              icon={Landmark}
              value={form.positiveFinalAccountGroup}
              placeholder="Enter Final Account Master"
              error={errors.positiveFinalAccountGroup}
              readOnly={isView}
              onOpen={() => openPicklist("positiveGroup")}
            />
            <TextField
              label="Description"
              labelHi="वर्णन"
              icon={FileText}
              value={form.positiveFinalAccountGroupDescription}
              readOnly
              placeholder="Enter Description"
              error={errors.positiveFinalAccountGroupDescription}
              onChange={() => {}}
            />

            <PicklistTriggerField
              label="Final Account Master When Negative"
              labelHi="फायनल अकाउंट मास्टर व्हेन नेगेटिव्ह"
              icon={Landmark}
              value={form.negativeFinalAccountGroup}
              placeholder="Enter Final Account Master"
              error={errors.negativeFinalAccountGroup}
              readOnly={isView}
              onOpen={() => openPicklist("negativeGroup")}
            />
            <TextField
              label="Description"
              labelHi="वर्णन"
              icon={FileText}
              value={form.negativeFinalAccountGroupDescription}
              readOnly
              placeholder="Enter Description"
              error={errors.negativeFinalAccountGroupDescription}
              onChange={() => {}}
            />

            <PicklistTriggerField
              label="CD Ratio Group"
              labelHi="सीडी रेशिओ ग्रुप"
              icon={Hash}
              value={form.cdRatioGroupCode}
              placeholder="Select CD Ratio Group"
              error={errors.cdRatioGroupCode}
              readOnly={isView}
              onOpen={() => openPicklist("cdRatioGroup")}
            />
            <TextField
              label="Description"
              labelHi="वर्णन"
              icon={FileText}
              value={form.cdRatioGroupDescription}
              readOnly
              placeholder="Enter Description"
              error={errors.cdRatioGroupDescription}
              onChange={() => {}}
            />

            <RadioField
              label="Is Transaction Allowed"
              labelHi="व्यवहाराला परवानगी आहे का?"
              value={form.transactionAllowed}
              disabled={isView}
              onChange={(v) => update("transactionAllowed", v)}
            />
            <RadioField
              label="Direct Outer In BS / PL Report"
              labelHi="डायरेक्ट आउटर इन बीएस / पीएल रिपोर्ट दाखवावे का?"
              value={form.directOuterInBspl}
              disabled={isView}
              onChange={(v) => update("directOuterInBspl", v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          {isView ? (
            <>
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
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Ok, Got It <ThumbsUp size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleValidate}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Validate <Check size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel <X size={16} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  disabled={!validated || saving}
                  onClick={() => validated && setSaveMenuOpen((o) => !o)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    validated && !saving
                      ? "bg-primary-100 text-primary hover:bg-primary-200"
                      : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                  }`}
                >
                  {saving ? "Saving..." : "Save"} <ChevronDown size={16} />
                </button>
                {saveMenuOpen && validated && (
                  <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={() => {
                        setSaveMenuOpen(false);
                        handleSave();
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {picklist === "positiveGroup" && (
        <PicklistModal
          title="Select Final Account Master (Positive)"
          columns={[
            { key: "code", header: "Code", width: "160px" },
            { key: "description", header: "Description" },
          ]}
          rows={positiveGroups.slice((positiveGroupsPage - 1) * PAGE_SIZE, positiveGroupsPage * PAGE_SIZE)}
          rowKey={(row) => row.code}
          loading={picklistLoading}
          emptyMessage="No final account groups found"
          searchByOptions={[
            { label: "Code", value: "FINAL_ACCOUNT_GROUP_CODE" },
            { label: "Description", value: "DESCRIPTION" },
          ]}
          onSearchSubmit={handlePositiveGroupSearch}
          onSelect={(row) => {
            setForm((prev) => ({ ...prev, positiveFinalAccountGroup: row.code, positiveFinalAccountGroupDescription: row.description }));
            setPicklist(null);
          }}
          onClose={() => setPicklist(null)}
          pagination={{
            page: positiveGroupsPage,
            totalPages: Math.max(1, Math.ceil(positiveGroups.length / PAGE_SIZE)),
            onPageChange: setPositiveGroupsPage,
          }}
        />
      )}

      {picklist === "negativeGroup" && (
        <PicklistModal
          title="Select Final Account Master (Negative)"
          columns={[
            { key: "code", header: "Code", width: "160px" },
            { key: "description", header: "Description" },
          ]}
          rows={negativeGroups.slice((negativeGroupsPage - 1) * PAGE_SIZE, negativeGroupsPage * PAGE_SIZE)}
          rowKey={(row) => row.code}
          loading={picklistLoading}
          emptyMessage="No final account groups found"
          searchByOptions={[
            { label: "Code", value: "FINAL_ACCOUNT_GROUP_CODE" },
            { label: "Description", value: "DESCRIPTION" },
          ]}
          onSearchSubmit={handleNegativeGroupSearch}
          onSelect={(row) => {
            setForm((prev) => ({ ...prev, negativeFinalAccountGroup: row.code, negativeFinalAccountGroupDescription: row.description }));
            setPicklist(null);
          }}
          onClose={() => setPicklist(null)}
          pagination={{
            page: negativeGroupsPage,
            totalPages: Math.max(1, Math.ceil(negativeGroups.length / PAGE_SIZE)),
            onPageChange: setNegativeGroupsPage,
          }}
        />
      )}

      {picklist === "cdRatioGroup" && (
        <PicklistModal
          title="Select CD Ratio Group"
          columns={[
            { key: "code", header: "Code", width: "160px" },
            { key: "description", header: "Description" },
          ]}
          rows={cdRatioGroups.slice((cdRatioGroupsPage - 1) * PAGE_SIZE, cdRatioGroupsPage * PAGE_SIZE)}
          rowKey={(row) => row.code}
          loading={picklistLoading}
          emptyMessage="No CD ratio groups found"
          searchByOptions={[
            { label: "Code", value: "CD_RATIO_CODE" },
            { label: "Description", value: "DESCRIPTION" },
          ]}
          onSearchSubmit={handleCdRatioGroupSearch}
          onSelect={(row) => {
            setForm((prev) => ({ ...prev, cdRatioGroupCode: row.code, cdRatioGroupDescription: row.description }));
            setPicklist(null);
          }}
          onClose={() => setPicklist(null)}
          pagination={{
            page: cdRatioGroupsPage,
            totalPages: Math.max(1, Math.ceil(cdRatioGroups.length / PAGE_SIZE)),
            onPageChange: setCdRatioGroupsPage,
          }}
        />
      )}
    </div>
  );
}
