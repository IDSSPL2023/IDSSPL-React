// src/constants/interestPostingModules.ts
export interface InterestPostingModule {
  id: string;
  name: string;
}

export const interestPostingModules: InterestPostingModule[] = [
  { id: 'autoRenewal', name: 'Auto Renewal' },
  { id: 'tdInterestPosting', name: 'Deposit Interest Posting' },
  { id: 'depreciationCalculation', name: 'DEPRECIATION CALCULATION' },
  { id: 'dormantInoperativeSaving', name: 'DORMANT INOPERATIVE SAVING INTEREST POSTING' },
  { id: 'exceedLoanLimit', name: 'EXCEED LOAN LIMIT' },
  { id: 'tlCcInterestPosting', name: 'TL/CC Intrest Posting' },
  { id: 'nfaModification', name: 'NFA Modification' },
  { id: 'savingInterestReport', name: 'Saving Intrest Report' },
  { id: 'sbProductRework', name: 'SB PRODUCT REWORK AND POSTING' },
  { id: 'serviceChargesDormant', name: 'SERVICE CHARGES DORMANT SB CA' },
  { id: 'serviceChargesInoperative', name: 'SERVICE CHARGES INOPERATIVE SB CA' },
  { id: 'applyServiceChargesLive', name: 'APPLY SERVICE CHARGES LIVE SB CA' },
];
