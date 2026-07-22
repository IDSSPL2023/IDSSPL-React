import { IMAGES } from "@/assets";
import React, { useState, useEffect } from 'react'
import {
  X,
  User,
  Wallet,
  FileText,
  Check,
  ChevronDown,
} from 'lucide-react'
import Image from "@/components/ui/Image"
import { useBilingual } from '@/i18n/useBilingual'

export interface LienMarkFormData {
  loanAccountCode: string;
  loanAccountName: string;
  lienAmount: string;
  remark: string;
}

export interface LienMarkModalProps {
  onClose: () => void;
  onSave?: (data: LienMarkFormData) => void;
  accountCode?: string;
  accountName?: string;
  ledgerBalance?: string;
  availableBalance?: string;
}

const LeanPage = ({
  onClose,
  onSave,
  accountCode = "1234567890",
  accountName = "Akshay Om More",
  ledgerBalance = "408493.50",
  availableBalance = "408493.50",
}: LienMarkModalProps) => {
  const { t, en } = useBilingual()
  const [remark, setRemark] = useState('')
  const [loanAccountCode, setLoanAccountCode] = useState('')
  const [loanAccountName, setLoanAccountName] = useState('')
  const [lienAmount, setLienAmount] = useState('')

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleValidate = () => {
    const formData: LienMarkFormData = {
      loanAccountCode,
      loanAccountName,
      lienAmount,
      remark
    };
    
    if (onSave) {
      onSave(formData);
    }
    
    // You can add validation logic here
    console.log('Validating:', formData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image
              src={IMAGES.ADD_ICON}
              alt="Lien Mark"
              width={32}
              height={32}
              className="object-contain h-15 w-15"
              priority
            />
            <h2 className="text-[24px] font-bold text-black dark:text-slate-100">
              {en('lienMark.title')}
              {t('lienMark.title') ? <span className="text-gray-500 dark:text-slate-400 font-semibold"> / {t('lienMark.title')}</span> : null}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Details Card */}
        <div className="rounded-2xl border-x border-b border-t-4 border-primary p-6 mb-6 dark:bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full border border-primary/40 bg-primary-50 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-[#0B1B3D] dark:text-slate-100">
              {en('common.accountDetails')}
              {t('common.accountDetails') ? <span className="text-gray-500 dark:text-slate-400 font-semibold"> / {t('common.accountDetails')}</span> : null}
            </h3>
          </div>
          <div className="border-t border-gray-200 mb-6 dark:border-slate-800" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                {en('fields.accountCode')}
                {t('fields.accountCode') ? <span className="text-gray-500 dark:text-slate-400"> / {t('fields.accountCode')}</span> : null}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <User className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={accountCode}
                  className="w-full bg-transparent text-gray-600 dark:text-slate-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                {en('fields.accountName')}
                {t('fields.accountName') ? <span className="text-gray-500 dark:text-slate-400"> / {t('fields.accountName')}</span> : null}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <User className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={accountName}
                  className="w-full bg-transparent text-gray-600 dark:text-slate-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                {en('fields.ledgerBalance')}
                {t('fields.ledgerBalance') ? <span className="text-gray-500 dark:text-slate-400"> / {t('fields.ledgerBalance')}</span> : null}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <Wallet className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={ledgerBalance}
                  className="w-full bg-transparent text-gray-600 dark:text-slate-400 outline-none text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                {en('fields.availableBalance')}
                {t('fields.availableBalance') ? <span className="text-gray-500 dark:text-slate-400"> / {t('fields.availableBalance')}</span> : null}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <Wallet className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={availableBalance}
                  className="w-full bg-transparent text-gray-600 dark:text-slate-400 outline-none text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lien Details Card */}
        <div className="rounded-2xl border-x border-b border-t-4 border-primary p-6 mb-8 dark:bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full border border-primary/40 bg-primary-50 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-[#0B1B3D] dark:text-slate-100">
              {en('common.lienDetails')}
              {t('common.lienDetails') ? <span className="text-gray-500 dark:text-slate-400 font-semibold"> / {t('common.lienDetails')}</span> : null}
            </h3>
          </div>
          <div className="border-t border-gray-200 mb-6 dark:border-slate-800" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                {en('fields.loanAccountCode')}
                {t('fields.loanAccountCode') ? <span className="text-gray-500 dark:text-slate-400"> / {t('fields.loanAccountCode')}</span> : null}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 dark:border-slate-700">
                <User className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={loanAccountCode}
                  onChange={(e) => setLoanAccountCode(e.target.value)}
                  placeholder="Enter loan account code"
                  className="w-full bg-transparent text-gray-800 dark:text-slate-100 outline-none placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                {en('fields.loanAccountName')}
                {t('fields.loanAccountName') ? <span className="text-gray-500 dark:text-slate-400"> / {t('fields.loanAccountName')}</span> : null}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 dark:border-slate-700">
                <input
                  type="text"
                  value={loanAccountName}
                  onChange={(e) => setLoanAccountName(e.target.value)}
                  placeholder="Enter loan account name"
                  className="w-full bg-transparent text-gray-800 dark:text-slate-100 outline-none placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                {en('fields.lienAmount')}
                {t('fields.lienAmount') ? <span className="text-gray-500 dark:text-slate-400"> / {t('fields.lienAmount')}</span> : null}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 dark:border-slate-700">
                <Wallet className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={lienAmount}
                  onChange={(e) => setLienAmount(e.target.value)}
                  placeholder="Enter lien amount"
                  className="w-full bg-transparent text-gray-800 dark:text-slate-100 outline-none placeholder-gray-400 dark:placeholder-slate-500 text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                {en('fields.remark')}
                {t('fields.remark') ? <span className="text-gray-500 dark:text-slate-400"> / {t('fields.remark')}</span> : null}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 dark:border-slate-700">
                <FileText className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter remark"
                  className="w-full bg-transparent text-gray-800 dark:text-slate-100 outline-none placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleValidate}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-[#0a58ac] transition-colors"
          >
            {en('common.validate')} <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-8 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary-50 transition-colors"
          >
            {en('common.cancel')} <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-100 text-gray-400 font-semibold cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
            disabled
          >
            {en('common.save')} <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeanPage;