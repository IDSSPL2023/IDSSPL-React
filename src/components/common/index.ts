// Common, reusable UI system. Feature folders should consume these instead of
// authoring another page-specific table/filter/modal/form component.
// Flat folder: every common component/type lives directly in this directory —
// no table/filter/modal/form/layout subfolders. Import everything via this barrel.

// table
export { default as GlobalTable } from "./GlobalTable";
export { default as AuthorizeTable } from "./AuthorizeTable";
export { default as PaginationModal } from "./PaginationModal";
export { default as TableActionMenu } from "./TableActionMenu";
export { default as StatusBadge } from "./StatusBadge";
export type { TableActionMenuItem } from "./TableActionMenu";
export type { GlobalTableProps } from "./GlobalTable";
export type { AuthorizeTableProps } from "./AuthorizeTable";
export type * from "./table.types";

// filter
export { default as FilterModal } from "./FilterModal";
export type { FilterModalProps } from "./FilterModal";
export type * from "./filter.types";

// modal
export { default as BaseModal } from "./BaseModal";
export { default as NormalFormModal } from "./NormalFormModal";
export { default as AuthorizeFormModal } from "./AuthorizeFormModal";
export { default as SuccessModal } from "./SuccessModal";
export { default as InputRejectModal } from "./InputRejectModal";
export { default as RejectModal } from "./RejectModal";
export { default as PicklistModal } from "./PicklistModal";
export { default as TabModal } from "./TabModal";
export { default as StatusModal } from "./StatusModal";
export { default as ActionModal } from "./ActionModal";
export type { NormalFormModalProps } from "./NormalFormModal";
export type { AuthorizeFormModalProps } from "./AuthorizeFormModal";
export type { SuccessModalProps, SuccessModalVariant } from "./SuccessModal";
export type { InputRejectModalProps } from "./InputRejectModal";
export type { RejectModalProps } from "./RejectModal";
export type { PicklistModalProps, PicklistColumn } from "./PicklistModal";
export type { TabModalProps, TabModalTab } from "./TabModal";
export type { StatusModalProps, StatusOption } from "./StatusModal";
export type { ActionModalProps, ActionModalItem } from "./ActionModal";
export type * from "./modal.types";

// form
export { default as FormField } from "./FormField";
export { default as TextField } from "./TextField";
export { default as SelectField } from "./SelectField";
export { default as DateField } from "./DateField";
export { default as PicklistField } from "./PicklistField";
export { default as CountryPicklistField } from "../CommonApis/CountryPicklistField";
export { default as CityPicklistField } from "./CityPicklistField";
export { default as RadioGroupField } from "./RadioGroupField";
export type { FormFieldProps } from "./FormField";
export type { TextFieldProps } from "./TextField";
export type { SelectFieldProps, SelectFieldOption } from "./SelectField";
export type { DateFieldProps } from "./DateField";
export type { PicklistFieldProps } from "./PicklistField";
export type { CountryPicklistFieldProps } from "../CommonApis/CountryPicklistField";
export type { CityPicklistFieldProps } from "./CityPicklistField";
export type { RadioGroupFieldProps, RadioGroupOption } from "./RadioGroupField";
export * from "./validation";

// layout
export { default as AppNavbar } from "./AppNavbar";
export { default as PageHeader } from "./PageHeader";
export { default as SubMenuScreen } from "./SubMenuScreen";
export { default as WelcomeScreen } from "./WelcomeScreen";
export type { AppNavbarProps } from "./AppNavbar";
export type { PageHeaderProps, BreadcrumbItem } from "./PageHeader";
export type { SubMenuScreenProps, SubMenuItem } from "./SubMenuScreen";
export type { WelcomeScreenProps, WelcomeScreenItem } from "./WelcomeScreen";
