import { useState } from 'react'
import { X, UserPlus, User, Wallet, FileText, Check, ChevronDown, Hash } from 'lucide-react'
import { useBilingual } from '@/i18n/useBilingual'
import { FieldShell, TextInput, SelectInput, SectionCard } from '@/components/shared/FormFields'

const UnLeanPage = () => {
  const { t, en } = useBilingual()
  const [serial, setSerial] = useState('9')

  const hi = (key: string) => t(key) || undefined

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-primary-500 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0B1B3D] dark:text-slate-100">
            {en('lienRevoke.title')}
            {t('lienRevoke.title') ? (
              <span className="text-gray-500 dark:text-slate-400 font-semibold"> / {t('lienRevoke.title')}</span>
            ) : null}
          </h2>
        </div>
        <button
          type="button"
          className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors shrink-0 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Account Details Card */}
      <SectionCard
        titleEn={en('common.accountDetails')}
        titleHi={hi('common.accountDetails') ?? en('common.accountDetails')}
        icon={<User size={16} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mt-0">
          <FieldShell label={en('fields.accountCode')} labelHi={hi('fields.accountCode')} required>
            <TextInput icon={<User size={16} />} value="1234567890" onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label={en('fields.accountName')} labelHi={hi('fields.accountName')} required>
            <TextInput icon={<User size={16} />} value="Akshay Om More" onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      {/* Lien Details Card */}
      <div className="mt-4 mb-8">
        <SectionCard
          titleEn={en('common.lienDetails')}
          titleHi={hi('common.lienDetails') ?? en('common.lienDetails')}
          icon={<User size={16} />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6 mt-0 mb-6">
            <FieldShell label={en('fields.serial')} labelHi={hi('fields.serial')} required>
              <SelectInput icon={<Hash size={16} />} value={serial} onChange={setSerial} options={['9', '8', '7']} />
            </FieldShell>
            <FieldShell label={en('fields.loanAccountCode')} labelHi={hi('fields.loanAccountCode')} required>
              <TextInput icon={<User size={16} />} value="1234567890" onChange={() => {}} readOnly />
            </FieldShell>
            <FieldShell label={en('fields.loanAccountName')} labelHi={hi('fields.loanAccountName')} required>
              <TextInput value="Akshay Om More" onChange={() => {}} readOnly />
            </FieldShell>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <FieldShell label={en('fields.lienAmount')} labelHi={hi('fields.lienAmount')} required>
              <TextInput icon={<Wallet size={16} />} value="408493.5" onChange={() => {}} readOnly />
            </FieldShell>
            <FieldShell label={en('fields.remark')} labelHi={hi('fields.remark')} required>
              <TextInput icon={<FileText size={16} />} value="-" onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-[#0a58ac] transition-colors"
        >
          {en('common.validate')} <Check className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-8 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary-50 transition-colors"
        >
          {en('common.cancel')} <X className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-100 text-gray-400 font-semibold cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
          disabled
        >
          {en('common.revoke')} <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default UnLeanPage;
