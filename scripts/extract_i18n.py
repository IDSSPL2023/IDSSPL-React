#!/usr/bin/env python3
"""
extract_i18n.py
================
Extracts user-facing strings from the Next.js pages under `src/app/(root)`
and generates locale message files for react-i18next (en / hi / mr).

What it does
------------
1. Scans every `*.tsx` file under src/app/(root).
2. Detects candidate UI strings using regex patterns for the codebase's
   conventions:
      - titleEn="..."  / titleHi="..."
      - label / labelHi props
      - breadcrumb  { label: "..." }
      - inline "English / <span>native</span>" JSX pairs
      - button / heading / placeholder text
   and writes a coverage report to  i18n-extraction-report.json
3. Emits nested locale files:
      src/i18n/locales/en.json
      src/i18n/locales/hi.json
      src/i18n/locales/mr.json
   built from the curated CATALOG below (English is the source of truth;
   hi/mr are human-curated translations, with the original in-code native
   strings preserved for Marathi where they existed).

Run:
    python3 scripts/extract_i18n.py
"""

from __future__ import annotations
import json
import re
from pathlib import Path

# ----------------------------------------------------------------------------
# Paths
# ----------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parents[1]
PAGES_DIR = ROOT / "src" / "app" / "(root)"
LOCALES_DIR = ROOT / "src" / "i18n" / "locales"
REPORT_FILE = ROOT / "i18n-extraction-report.json"

# ----------------------------------------------------------------------------
# Curated translation catalog.
# Keys are namespaced (dot notation -> nested JSON). English is authoritative.
# Marathi (mr) values reuse the native strings already present in the code
# where they existed; Hindi (hi) values are added.
# ----------------------------------------------------------------------------
CATALOG: dict[str, dict[str, str]] = {
    # ---- shared / common ---------------------------------------------------
    "common.home":            {"en": "Home",         "hi": "होम",            "mr": "मुख्यपृष्ठ"},
    "common.misActivity":     {"en": "MIS Activity", "hi": "एमआईएस गतिविधि", "mr": "एमआयएस अ‍ॅक्टिव्हिटी"},
    "common.futureModels":    {"en": "Future Models","hi": "फ्यूचर मॉडल्स",   "mr": "फ्युचर मॉडेल्स"},
    "common.cancel":          {"en": "Cancel",       "hi": "रद्द करें",       "mr": "रद्द करा"},
    "common.save":            {"en": "Save",         "hi": "सहेजें",          "mr": "जतन करा"},
    "common.submit":          {"en": "Submit",       "hi": "जमा करें",        "mr": "सादर करा"},
    "common.validate":        {"en": "Validate",     "hi": "सत्यापित करें",   "mr": "प्रमाणित करा"},
    "common.revoke":          {"en": "Revoke",       "hi": "निरस्त करें",     "mr": "रद्द करा"},
    "common.details":         {"en": "Details",      "hi": "विवरण",          "mr": "तपशील"},
    "common.accountDetails":  {"en": "Account Details", "hi": "खाता विवरण",  "mr": "खात्याचा तपशील"},
    "common.lienDetails":     {"en": "Lien Details", "hi": "ग्रहणाधिकार विवरण", "mr": "बोजा तपशील"},
    "common.logout":          {"en": "Logout",       "hi": "लॉगआउट",         "mr": "लॉगआउट"},

    # ---- shared field labels ----------------------------------------------
    "fields.accountCode":     {"en": "Account Code", "hi": "खाता कोड",       "mr": "खाते कोड"},
    "fields.accountName":     {"en": "Account Name", "hi": "खाता नाम",       "mr": "खाते नाव"},
    "fields.name":            {"en": "Name",         "hi": "नाम",            "mr": "नाव"},
    "fields.ledgerBalance":   {"en": "Ledger Balance", "hi": "लेजर बैलेंस",  "mr": "लेजर शिल्लक"},
    "fields.availableBalance":{"en": "Available Balance", "hi": "उपलब्ध बैलेंस", "mr": "उपलब्ध शिल्लक"},
    "fields.loanAccountCode": {"en": "Loan Account Code", "hi": "ऋण खाता कोड", "mr": "कर्ज खाते कोड"},
    "fields.loanAccountName": {"en": "Loan Account Name", "hi": "ऋण खाता नाम", "mr": "कर्ज खाते नाव"},
    "fields.lienAmount":      {"en": "Lien Amount",  "hi": "ग्रहणाधिकार राशि", "mr": "बोजा रक्कम"},
    "fields.remark":          {"en": "Remark",       "hi": "टिप्पणी",        "mr": "शेरा"},
    "fields.serial":          {"en": "Serial",       "hi": "क्रम",           "mr": "क्रम"},

    # ---- account master ----------------------------------------------------
    "accountMaster.title":       {"en": "Account Master", "hi": "खाता मास्टर", "mr": "खाते मास्टर"},
    "accountMaster.breadcrumb":  {"en": "Account Master", "hi": "खाता मास्टर", "mr": "खाते मास्टर"},
    "accountMaster.options.caSa.title":            {"en": "CA/SA",       "hi": "सीए/एसए",  "mr": "चालू/बचत खाते"},
    "accountMaster.options.caSa.description":      {"en": "Enter the CA/SA application details.",       "hi": "सीए/एसए आवेदन विवरण दर्ज करें.",       "mr": "सीए/एसए अर्जाचा तपशील भरा."},
    "accountMaster.options.deposit.title":         {"en": "Deposit",     "hi": "जमा",       "mr": "ठेव"},
    "accountMaster.options.deposit.description":   {"en": "Enter the Deposit application details.",     "hi": "जमा आवेदन विवरण दर्ज करें.",           "mr": "ठेव अर्जाचा तपशील भरा."},
    "accountMaster.options.loan.title":            {"en": "Loan",        "hi": "ऋण",        "mr": "कर्ज"},
    "accountMaster.options.loan.description":      {"en": "Enter the Loan application details.",        "hi": "ऋण आवेदन विवरण दर्ज करें.",            "mr": "कर्ज अर्जाचा तपशील भरा."},
    "accountMaster.options.investment.title":      {"en": "Investment",  "hi": "निवेश",     "mr": "गुंतवणूक"},
    "accountMaster.options.investment.description":{"en": "Enter the Investment application details.",  "hi": "निवेश आवेदन विवरण दर्ज करें.",         "mr": "गुंतवणूक अर्जाचा तपशील भरा."},

    "application.title":       {"en": "Application", "hi": "आवेदन", "mr": "अर्ज"},
    "application.breadcrumb":  {"en": "Application", "hi": "आवेदन", "mr": "अर्ज"},

    # ---- user master -------------------------------------------------------
    "userMaster.title":      {"en": "User Master", "hi": "यूज़र मास्टर", "mr": "युझर मास्टर"},
    "userMaster.breadcrumb": {"en": "User Master", "hi": "यूज़र मास्टर", "mr": "युझर मास्टर"},

    # ---- customer master ---------------------------------------------------
    "customerMaster.title":      {"en": "Customer Master", "hi": "कस्टमर मास्टर", "mr": "कस्टमर मास्टर"},
    "customerMaster.breadcrumb": {"en": "Customer Master", "hi": "कस्टमर मास्टर", "mr": "कस्टमर मास्टर"},

    # ---- branch master -----------------------------------------------------
    "branchMaster.title":        {"en": "Branch Master", "hi": "शाखा मास्टर", "mr": "शाखा मास्टर"},
    "branchMaster.breadcrumb":   {"en": "Branch Master", "hi": "शाखा मास्टर", "mr": "शाखा मास्टर"},
    "branchMaster.filters.branchCode":    {"en": "Branch Code",   "hi": "शाखा कोड",   "mr": "शाखा कोड"},
    "branchMaster.filters.branchName":    {"en": "Branch Name",   "hi": "शाखा नाम",   "mr": "शाखा नाव"},
    "branchMaster.filters.cityCode":      {"en": "City Code",     "hi": "शहर कोड",    "mr": "शहर कोड"},
    "branchMaster.filters.isImplemented": {"en": "Is Implemented","hi": "लागू है",    "mr": "अंमलात आणले"},

    # ---- global master -----------------------------------------------------
    "globalMaster.title": {"en": "Master Maintenance Global", "hi": "मास्टर मेंटेनेंस ग्लोबल", "mr": "जागतिक मास्टर मेंटेनन्स"},

    # ---- head office master ------------------------------------------------
    "headOfficeMaster.title": {"en": "Master Maintenance Head Office", "hi": "मास्टर मेंटेनेंस हेड ऑफिस", "mr": "मुख्य कार्यालय मास्टर मेंटेनन्स"},

    # ---- authorization -----------------------------------------------------
    "authorization.title":      {"en": "Authorization", "hi": "प्राधिकरण", "mr": "अधिकृतीकरण"},
    "authorization.breadcrumb": {"en": "Authorization", "hi": "प्राधिकरण", "mr": "अधिकृतीकरण"},

    # ---- futuremodels: term deposit close ----------------------------------
    "tdClose.title":      {"en": "Term Deposit Close", "hi": "मियादी जमा बंद करें", "mr": "मुदत ठेव बंद करा"},
    "tdClose.breadcrumb": {"en": "Term Deposit Close", "hi": "मियादी जमा बंद करें", "mr": "मुदत ठेव बंद करा"},

    # ---- futuremodels: standing instructions -------------------------------
    "standingInstructions.title":      {"en": "Standing Instructions", "hi": "स्थायी निर्देश", "mr": "स्थायी सूचना"},
    "standingInstructions.breadcrumb": {"en": "Standing Instructions", "hi": "स्थायी निर्देश", "mr": "स्थायी सूचना"},

    # ---- futuremodels: memo ------------------------------------------------
    "memo.title":            {"en": "Account Memo",  "hi": "खाता मेमो",     "mr": "हिशेबाची टीप"},
    "memo.accountCode":      {"en": "Account Code",  "hi": "खाता कोड",      "mr": "खात्याचा कोड"},
    "memo.name":             {"en": "Name",          "hi": "नाम",           "mr": "नाव"},
    "memo.memoDetails":      {"en": "Memo Details",  "hi": "मेमो विवरण",    "mr": "टीप तपशील"},
    "memo.detailsPlaceholder": {"en": "Details",     "hi": "विवरण",         "mr": "तपशील"},
    "memo.charactersOnly":   {"en": "{{count}} Characters Only", "hi": "केवल {{count}} अक्षर", "mr": "फक्त {{count}} अक्षरे"},

    # ---- futuremodels: lien mark (lean) ------------------------------------
    "lienMark.title": {"en": "Lien Mark", "hi": "ग्रहणाधिकार चिह्न", "mr": "बोजा नोंदवणे"},

    # ---- futuremodels: lien revoke (un-lean) -------------------------------
    "lienRevoke.title": {"en": "Lien Revoke Mark", "hi": "ग्रहणाधिकार निरस्त चिह्न", "mr": "बोजा काढल्याची नोंद"},

    # ---- futuremodels: td-calculate (maturity amount) ----------------------
    "tdCalculate.title":     {"en": "Maturity Amount", "hi": "परिपक्वता राशि", "mr": "परिपक्वतेची रक्कम"},
    "tdCalculate.subtitle":  {"en": "All Information's are related to Maturity Amount",
                              "hi": "सभी जानकारी परिपक्वता राशि से संबंधित है",
                              "mr": "सर्व माहिती परिपक्वतेच्या रकमेशी संबंधित आहे"},
    "tdCalculate.accountType":      {"en": "Account Type",      "hi": "खाता प्रकार",         "mr": "खात्याचा प्रकार"},
    "tdCalculate.productCode":      {"en": "Product Code",      "hi": "उत्पाद कोड",          "mr": "उत्पादन कोड"},
    "tdCalculate.productDescription": {"en": "Product Description", "hi": "उत्पाद विवरण",    "mr": "उत्पादन वर्णन"},
    "tdCalculate.categoryCode":     {"en": "Category Code",     "hi": "श्रेणी कोड",          "mr": "कॅटेगरी कोड"},
    "tdCalculate.openingDate":      {"en": "Opening Date",      "hi": "खोलने की तारीख",      "mr": "उद्घाटनाची तारीख"},
    "tdCalculate.unitOfPeriod":     {"en": "Unit Of Period",    "hi": "अवधि की इकाई",        "mr": "कालावधीचे एकक"},
    "tdCalculate.periodOfDeposit":  {"en": "Period of Deposit", "hi": "जमा की अवधि",         "mr": "ठेवींची कालावधी"},
    "tdCalculate.rate":             {"en": "Rate",              "hi": "दर",                  "mr": "दर"},
    "tdCalculate.interestFrequency":{"en": "Interest Payment frequency", "hi": "ब्याज भुगतान आवृत्ति", "mr": "व्याज भरण्याची वारंवारिता"},
    "tdCalculate.depositAmount":    {"en": "Deposit Amount",    "hi": "जमा राशि",            "mr": "ठेवी रक्कम"},
    "tdCalculate.maturityAmount":   {"en": "Maturity Amount",   "hi": "परिपक्वता राशि",      "mr": "परिपक्वतेची रक्कम"},
    "tdCalculate.maturityDate":     {"en": "Maturity Date",     "hi": "परिपक्वता तारीख",     "mr": "परिपक्वता तारीख"},
    "tdCalculate.subProductList":   {"en": "Sub Product List",  "hi": "उप उत्पाद सूची",      "mr": "उप उत्पादन यादी"},
    "tdCalculate.descriptionCol":   {"en": "Description",       "hi": "विवरण",               "mr": "वर्णन"},

    # ---- dashboard ---------------------------------------------------------
    "dashboard.title": {"en": "Dashboard", "hi": "डैशबोर्ड", "mr": "डॅशबोर्ड"},

    # ---- sidebar (single labels — rendered with tRaw) ----------------------
    "sidebar.dashboard":        {"en": "Dashboard",        "hi": "डैशबोर्ड",                 "mr": "डॅशबोर्ड"},
    "sidebar.aiDashboard":      {"en": "AI Dashboard",     "hi": "एआई डैशबोर्ड",             "mr": "एआय डॅशबोर्ड"},
    "sidebar.authorization":    {"en": "Authorization",    "hi": "प्राधिकरण",                "mr": "अधिकृतीकरण"},
    "sidebar.misActivity":      {"en": "MIS Activity",     "hi": "एमआईएस गतिविधि",           "mr": "एमआयएस अ‍ॅक्टिव्हिटी"},
    "sidebar.accountMaster":    {"en": "Account Master",   "hi": "खाता मास्टर",              "mr": "खाते मास्टर"},
    "sidebar.accountClosing":   {"en": "Account Closing",  "hi": "खाता बंद करना",            "mr": "खाते बंद करणे"},
    "sidebar.clerk":            {"en": "Clerk",            "hi": "क्लर्क",                   "mr": "क्लार्क"},
    "sidebar.bills":            {"en": "Bills",            "hi": "बिल",                      "mr": "बिले"},
    "sidebar.clearing":         {"en": "Clearing",         "hi": "क्लियरिंग",                "mr": "क्लिअरिंग"},
    "sidebar.locker":           {"en": "Locker",           "hi": "लॉकर",                     "mr": "लॉकर"},
    "sidebar.queries":          {"en": "Queries",          "hi": "क्वेरीज़",                 "mr": "क्वेरीज"},
    "sidebar.sms":              {"en": "SMS",              "hi": "एसएमएस",                   "mr": "एसएमएस"},
    "sidebar.customerMaster":   {"en": "Customer Master",  "hi": "कस्टमर मास्टर",            "mr": "कस्टमर मास्टर"},
    "sidebar.userMaster":       {"en": "User Master",      "hi": "यूज़र मास्टर",             "mr": "युझर मास्टर"},
    "sidebar.assignUserRole":   {"en": "Assign User Role", "hi": "यूज़र भूमिका असाइन करें",  "mr": "वापरकर्ता भूमिका नियुक्त करा"},
    "sidebar.headOfficeMaster": {"en": "Headoffice Master","hi": "हेड ऑफिस मास्टर",          "mr": "मुख्य कार्यालय मास्टर"},
    "sidebar.globalMaster":     {"en": "Global Master",    "hi": "ग्लोबल मास्टर",            "mr": "जागतिक मास्टर"},
    "sidebar.branchMaster":     {"en": "Branch Master",    "hi": "शाखा मास्टर",              "mr": "शाखा मास्टर"},
    "sidebar.futureModels":     {"en": "Future Models",    "hi": "फ्यूचर मॉडल्स",            "mr": "फ्युचर मॉडेल्स"},
    "sidebar.search":           {"en": "Search",           "hi": "खोजें",                    "mr": "शोधा"},
    "sidebar.lastLogin":        {"en": "Last Login:",      "hi": "अंतिम लॉगिन:",             "mr": "शेवटचे लॉगिन:"},
    "sidebar.role":             {"en": "Role:",            "hi": "भूमिका:",                  "mr": "भूमिका:"},
    "sidebar.manager":          {"en": "Manager",          "hi": "मैनेजर",                    "mr": "व्यवस्थापक"},
    "sidebar.hoOfficer":        {"en": "Ho Officer",       "hi": "एचओ अधिकारी",              "mr": "एचओ अधिकारी"},
    "sidebar.hoClerk":          {"en": "Ho Clerk",         "hi": "एचओ क्लर्क",               "mr": "एचओ क्लार्क"},
    "sidebar.supportUtility":   {"en": "Support Utility",  "hi": "सपोर्ट यूटिलिटी",          "mr": "सपोर्ट युटिलिटी"},
    "sidebar.interestPosting":  {"en": "Interest Posting", "hi": "ब्याज पोस्टिंग",           "mr": "व्याज पोस्टिंग"},
    "sidebar.financialClosing": {"en": "Financial Closing","hi": "वित्तीय समापन",            "mr": "आर्थिक समारोप"},
    "sidebar.cashier":          {"en": "Cashier",          "hi": "कैशियर",                   "mr": "कॅशियर"},
    "sidebar.dba":              {"en": "DBA",              "hi": "डीबीए",                    "mr": "डीबीए"},
    "sidebar.noMatchingItems":  {"en": "No matching menu items", "hi": "कोई मेल खाने वाला मेनू आइटम नहीं", "mr": "जुळणारे मेनू आयटम नाहीत"},
    "sidebar.comingSoon":       {"en": "Coming soon",      "hi": "जल्द आ रहा है",             "mr": "लवकरच येत आहे"},
    "sidebar.logoAlt":          {"en": "Logo",             "hi": "लोगो",                     "mr": "लोगो"},
}

# ----------------------------------------------------------------------------
# Extraction patterns (for the coverage report)
# ----------------------------------------------------------------------------
PATTERNS = {
    "titleEn":   re.compile(r'titleEn\s*=\s*"([^"]+)"'),
    "titleHi":   re.compile(r'titleHi\s*=\s*"([^"]+)"'),
    "labelHi":   re.compile(r'labelHi\s*=\s*"([^"]+)"'),
    "label":     re.compile(r'\blabel\s*[:=]\s*"([^"]+)"'),
    "fieldLabel":re.compile(r'<Field\s+label="([^"]+)"'),
    "nativeSpan":re.compile(r'<span[^>]*>\s*([^<>{}]*[ऀ-ॿ][^<>{}]*?)\s*</span>'),
}


def extract_strings() -> dict:
    """Scan tsx files and collect candidate strings for the coverage report."""
    report: dict[str, dict] = {}
    for path in sorted(PAGES_DIR.rglob("*.tsx")):
        text = path.read_text(encoding="utf-8")
        rel = str(path.relative_to(ROOT))
        found: dict[str, list[str]] = {}
        for name, pat in PATTERNS.items():
            hits = [m.strip() for m in pat.findall(text) if m.strip()]
            if hits:
                found[name] = sorted(set(hits))
        if found:
            report[rel] = found
    return report


def unflatten(flat: dict[str, str]) -> dict:
    """Turn dotted keys into nested dicts."""
    nested: dict = {}
    for dotted, value in flat.items():
        node = nested
        parts = dotted.split(".")
        for part in parts[:-1]:
            node = node.setdefault(part, {})
        node[parts[-1]] = value
    return nested


def build_locale(lang: str) -> dict:
    return unflatten({k: v[lang] for k, v in CATALOG.items()})


def main() -> None:
    LOCALES_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Coverage report
    report = extract_strings()
    REPORT_FILE.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    # 2. Locale files
    for lang in ("en", "hi", "mr"):
        out = LOCALES_DIR / f"{lang}.json"
        out.write_text(
            json.dumps(build_locale(lang), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    # 3. Summary
    total_native = sum(len(v.get("titleHi", [])) + len(v.get("labelHi", [])) + len(v.get("nativeSpan", []))
                       for v in report.values())
    print(f"Scanned files with strings : {len(report)}")
    print(f"Catalog keys generated     : {len(CATALOG)}")
    print(f"Native strings detected    : {total_native}")
    print(f"Report written             : {REPORT_FILE.relative_to(ROOT)}")
    print(f"Locales written            : {', '.join(l.name for l in sorted(LOCALES_DIR.glob('*.json')))}")


if __name__ == "__main__":
    main()
