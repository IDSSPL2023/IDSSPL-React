import { useRouter } from "@/lib/navigation";
import { toast } from "react-toastify";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import TransactionTypeCard from "@/components/TransactionMaster/TransactionTypeCard";
import type { TransactionTypeItem } from "@/components/TransactionMaster/transactionTypes";
import { accountClosingOptions } from "@/components/shared/AccountTypeCards";
import { useBilingual } from "@/i18n/useBilingual";

const accountClosingTypes: TransactionTypeItem[] = accountClosingOptions.map((option) => ({
  id: option.id,
  titleEn: option.title,
  titleHi: option.titleMr,
  descriptionEn: option.description,
  icon: option.icon,
  iconBg: option.iconBg,
  href: option.href,
}));

const AccountClosingPage = () => {
  const { en, t } = useBilingual();
  const router = useRouter();

  const handleOpen = (item: TransactionTypeItem) => {
    if (item.href) {
      router.push(item.href);
    } else {
      toast.info(`${item.titleEn} will be implemented.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <NavbarCM
        titleEn={en("sidebar.accountClosing")}
        titleHi={t("sidebar.accountClosing")}
        breadcrumbs={[
          { label: en("common.home"), href: "/dashboard" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("sidebar.accountClosing"), href: "/account-closing" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {accountClosingTypes.map((item) => (
          <TransactionTypeCard key={item.id} item={item} onOpen={handleOpen} />
        ))}
      </div>
    </div>
  );
};

export default AccountClosingPage;
