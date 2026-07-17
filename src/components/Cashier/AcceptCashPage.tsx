import React from 'react'
import CashierTable, { type Row } from './CashierTable'

type Props = {
  rows: Row[];
}

export default function AcceptCashPage({ rows }: Props) {
  return (
    <div>
      <CashierTable rows={rows} />
    </div>
  )
}
