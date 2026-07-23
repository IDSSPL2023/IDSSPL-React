import { useRouter } from "@/lib/navigation";
import { toast } from "react-toastify";
import { useBilingual } from "@/i18n/useBilingual";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import TransactionTypeCard from "@/components/TransactionMaster/TransactionTypeCard";
import type { TransactionTypeItem } from "@/components/TransactionMaster/transactionTypes";
import { accountMasterOptions } from "@/components/shared/AccountTypeCards";

/** Maps an account-type id ("ca-sa") to its i18n key segment ("caSa"). */
function toI18nId(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

const HoApplication = () => {
  const { en, t, tRaw } = useBilingual();
  const router = useRouter();

  const accountMasterTypes: TransactionTypeItem[] = accountMasterOptions.map((option) => {
    const key = `accountMaster.options.${toI18nId(option.id)}`;
    return {
      id: option.id,
      titleEn: en(`${key}.title`),
      titleHi: t(`${key}.title`),
      descriptionEn: tRaw(`${key}.description`),
      icon: option.icon,
      iconBg: option.iconBg,
      href: option.href,
    };
  });

  const handleOpen = (item: TransactionTypeItem) => {
    if (item.href) {
      router.push(item.href);
    } else {
      toast.info(`${item.titleEn} will be implemented.`);
    }
  };

  return (
    <div className="min-h-screen app-page-bg">
      <NavbarCM
        titleEn={en("application.title")}
        titleHi={t("application.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/dashboard" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("application.breadcrumb"), href: "/account-master" },
        ]}
        onBack={() => router.back()}
        hideActions
      />

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {accountMasterTypes.map((item) => (
          <TransactionTypeCard key={item.id} item={item} onOpen={handleOpen} />
        ))}
      </div>
    </div>
  );
};

export default HoApplication;
