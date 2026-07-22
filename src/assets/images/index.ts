// Shared, non-icon application imagery (backgrounds, nav art, module art, common decorative art).
// Icons stay in `src/assets/icons`; this file is for photographic/decorative assets.
// Moved out of `public/` so every image is a typed, bundled import instead of a raw string path.
import welcomeHero from "./backgrounds/welcome-hero.png";
import accountStatus from "./common/account-status.png";
import addIcon from "./common/add-icn.png";
import address from "./common/address.png";
import authorize from "./modules/authorize.png";
import authorizeTransactionListIcon from "./modules/authorize-transaction-list-icon.png";
import authorizeUser from "./modules/authorize-user.png";
import backgroundDark from "./backgrounds/background-dark.jpg";
import bill from "./modules/bill.png";
import calendar from "./common/calender.png";
import cashDeposit from "./modules/cash-deposite.png";
import cashWithdrawal from "./modules/cash-withdrawal.png";
import cashWithdrawalFormIcon from "./modules/cash-withdrawal-form-icon.png";
import contact from "./common/contact.png";
import desk from "./common/desk.png";
import editIcon from "./common/edit-icn.png";
import ellipse584 from "./common/ellipse-58-4.png";
import frame1618867441 from "./common/frame-1618867441.png";
import hand from "./modules/hand.png";
import home from "./navigation/home.png";
import icon from "./common/icon.png";
import idsspl from "./navigation/idsspl.png";
import locker from "./modules/locker.png";
import login from "./common/login.png";
import logo from "./navigation/logo.png";
import menu from "./navigation/menu.png";
import message from "./modules/message.png";
import money from "./modules/money.png";
import note from "./common/note.png";
import note1 from "./modules/note1.png";
import note2 from "./modules/note2.png";
import pdf from "./common/pdf.png";
import personEditIcon from "./common/person-edit-icon.png";
import personIcon from "./common/person-icon.png";
import profile from "./common/profile.png";
import reject from "./common/reject.png";
import roles from "./modules/roles.png";
import rtgs from "./modules/rtgs.png";
import setPassword from "./common/set-password.png";
import setting from "./common/setting.png";
import settingUser from "./modules/settinguser.png";
import shieldCheck from "./common/shield-check.png";
import sign from "./common/sign.png";
import tdClosingReinvest from "./modules/td-closing-reinvest.png";
import tdInterestPayment from "./modules/td-intrest-payment.png";
import tdLot from "./modules/td-lot.png";
import transfer from "./modules/transfer.png";
import user from "./common/user.png";
import xls from "./common/xls.png";
import account from "./account.png"
import staff from "./staff.png"
import deposit from "./deposites.png"
import loans from "./loans.png"
import branchInfo from "./branch-info.png"
import branchManager from "./rajesh-kumar.jpg"
import branchMaster from "./branch-master.png"

export const IMAGES = {
  WELCOME_HERO_BG: welcomeHero,
  ACCOUNT_STATUS: accountStatus,
  ADD_ICON: addIcon,
  ADDRESS: address,
  AUTHORIZE: authorize,
  AUTHORIZE_TRANSACTION_LIST_ICON: authorizeTransactionListIcon,
  AUTHORIZE_USER: authorizeUser,
  ACCOUNT:account,
  BACKGROUND_DARK: backgroundDark,
  BILL: bill,
  BRANCH_INFO:branchInfo,
  Branch_MANAGER:branchManager,
  BRANCH_MASTER:branchMaster,
  CALENDAR: calendar,
  CASH_DEPOSIT: cashDeposit,
  CASH_WITHDRAWAL: cashWithdrawal,
  CASH_WITHDRAWAL_FORM_ICON: cashWithdrawalFormIcon,
  CONTACT: contact,
  DESK: desk,
  DEPOSITES:deposit,
  EDIT_ICON: editIcon,
  ELLIPSE_58_4: ellipse584,
  FRAME_1618867441: frame1618867441,
  HAND: hand,
  HOME: home,
  ICON: icon,
  IDSSPL: idsspl,
  LOCKER: locker,
  LOGIN: login,
  LOGO: logo,
  MENU: menu,
  MESSAGE: message,
  MONEY: money,
  NOTE: note,
  NOTE_1: note1,
  NOTE_2: note2,
  PDF: pdf,
  PERSON_EDIT_ICON: personEditIcon,
  PERSON_ICON: personIcon,
  PROFILE: profile,
  REJECT: reject,
  ROLES: roles,
  RTGS: rtgs,
  SET_PASSWORD: setPassword,
  SETTING: setting,
  SETTING_USER: settingUser,
  SHIELD_CHECK: shieldCheck,
  SIGN: sign,
  STAFF:staff,
  TD_CLOSING_REINVEST: tdClosingReinvest,
  TD_INTEREST_PAYMENT: tdInterestPayment,
  TD_LOT: tdLot,
  TRANSFER: transfer,
  USER: user,
  XLS: xls,
  LOANS:loans,
} as const;

// Default export for convenience
export default IMAGES;
