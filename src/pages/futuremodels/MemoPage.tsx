import React, { useState } from 'react'
import { X, CreditCard, User, FileText, Upload, Settings } from 'lucide-react'
import { useBilingual } from '@/i18n/useBilingual'

const MemoPage = () => {
  const { t, en, tRaw } = useBilingual()
  const [memo, setMemo] = useState('')
  const maxChars = 200

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) {
      setMemo(e.target.value)
    }
  }

  return (
    <div className="relative mt-10  w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-primary/10 rounded-full" />

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center bg-gradient-to-br from-primary-100 to-white">
              <Settings className="w-10 h-10 text-primary"  />
            </div>
            <h2 className="text-[24px] font-bold text-black dark:text-slate-100">
              {en('memo.title')}
              {t('memo.title') ? <span className="text-gray-500 dark:text-slate-400 font-semibold">/ {t('memo.title')}</span> : null}
            </h2>
          </div>
          <button
            type="button"
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Code + Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[16px] font-medium text-black dark:text-slate-100 mb-2">
              {en('memo.accountCode')}
              {t('memo.accountCode') ? <span className="text-gray-500 dark:text-slate-400"> / {t('memo.accountCode')}</span> : null}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <CreditCard className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0" />
              <input
                type="text"
                readOnly
                defaultValue="7208076812"
                className="w-full bg-transparent text-gray-600 dark:text-slate-400 outline-none "
              />
            </div>
          </div>

          <div>
            <label className="block text-[16px] font-medium text-black dark:text-slate-100 mb-2">
              {en('memo.name')}
              {t('memo.name') ? <span className="text-gray-500 dark:text-slate-400"> / {t('memo.name')}</span> : null}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <User className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0" />
              <input
                type="text"
                readOnly
                defaultValue="Akshay Om More"
                className="w-full bg-transparent text-gray-600 dark:text-slate-400 outline-none "
              />
            </div>
          </div>
        </div>

        {/* Memo Details */}
        <div className="mb-2">
          <label className="block text-[16px] font-medium text-black dark:text-slate-100 mb-2">
            {en('memo.memoDetails')}
            {t('memo.memoDetails') ? <span className="text-gray-500 dark:text-slate-400"> / {t('memo.memoDetails')}</span> : null}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="rounded-xl border-2 border-primary px-4 py-3">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0 mt-0.5" />
              <textarea
                value={memo}
                onChange={handleMemoChange}
                placeholder={tRaw('memo.detailsPlaceholder')}
                rows={10}
                className="w-full resize-none bg-transparent outline-none text-gray-700 placeholder-gray-400 dark:text-slate-300 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Character count */}
        <div className="text-right text-[16px] text-gray-700 dark:text-slate-400 mb-6">
          {en('memo.charactersOnly', { count: maxChars })}<span className="text-red-500">*</span>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {en('common.cancel')} <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-[#0a58ac] transition-colors"
          >
            {en('common.submit')} <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MemoPage;
