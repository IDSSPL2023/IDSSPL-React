import React from 'react'
import { useBilingual } from '@/i18n/useBilingual'

const DashboardPage = () => {
  const { t, en } = useBilingual()
  return (
    <div>
      {en('dashboard.title')} {t('dashboard.title') ? <span className="text-gray-500 dark:text-slate-400">/ {t('dashboard.title')}</span> : null}
    </div>
  )
}

export default DashboardPage;
