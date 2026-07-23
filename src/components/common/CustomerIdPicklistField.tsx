import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import PicklistField from "./PicklistField";
import PicklistModal from "./PicklistModal";

export interface CustomerOption {
  customerId: string;
  customerName: string;
  address1: string;
  address2: string;
  address3: string;
  phoneMobile: string;
  homeBranch: string;
  status: string;
}

export interface CustomerIdPicklistFieldProps {
  label?: string;
  labelHi?: string;
  icon?: ReactNode;
  value: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string;
  onSelect: (customer: CustomerOption) => void;
  preFetch?: boolean;
  pageSize?: number;
  modalMaxWidthPx?: number;
  modalMaxHeightPx?: number;
  modalMinHeightPx?: number;
}

const COLUMNS = [
  { key: "customerId", header: "Customer ID" },
  { key: "customerName", header: "Customer Name" },
  { key: "address1", header: "Address 1" },
  { key: "address2", header: "Address 2" },
  { key: "phoneMobile", header: "Phone"},
  { key: "homeBranch", header: "Home Branch" },
  { key: "status", header: "Status" },
];

const SEARCH_BY_OPTIONS = [
  { label: "Customer ID", value: "customerId" },
  { label: "Address1", value: "address1" },
  { label: "Address2", value: "address2" },
];

// Map search options to API expected parameters
const SEARCH_BY_API_MAP: Record<string, string> = {
  customerId: "customerId",
  customerName: "customerName",
  address1: "address1",
  address2: "address2",
};

const BASE_URL = import.meta.env.VITE_MASTER_MAINTENANCE_API_URL || "http://13.202.249.213:8080";

async function fetchCustomers(
  params: { searchtext?: string; value?: string; page?: number; size?: number } = {}
): Promise<{ content: CustomerOption[]; totalElements: number; totalPages: number; page: number; size: number }> {
  const { 
    searchtext = "customerId", 
    value = "", 
    page = 0, 
    size = 10
  } = params;

  // Build URL with query parameters (only pagination)
  const url = new URL(`${BASE_URL}/customer/search`);
  url.searchParams.append("page", String(page));
  url.searchParams.append("size", String(size));

  // Build request body with search parameters
  const requestBody: any = {};
  
  // Always include searchtext and value in the body
  requestBody.searchtext = searchtext;
  requestBody.value = value;

  console.log(`📤 Fetching page ${page} with:`, { 
    url: url.toString(),
    searchtext, 
    value,
    requestBody 
  });

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error (${response.status}):`, errorText);
      throw new Error(`Failed to load customers (${response.status})`);
    }
    
    const data = await response.json();
    
    console.log(`📥 Response for page ${page}:`, {
      contentLength: data.content?.length || 0,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      searchCriteria: { searchtext, value }
    });
    
    const content = data.content || [];
    return {
      content: content.map((item: any) => ({
        customerId: String(item.customerId || ""),
        customerName: String(item.customerName || ""),
        address1: String(item.address1 || "").trim(),
        address2: String(item.address2 || "").trim(),
        address3: String(item.address3 || "").trim(),
        phoneMobile: String(item.phoneMobile || ""),
        homeBranch: String(item.homeBranch || ""),
        status: String(item.status || ""),
      })),
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      page: data.pageable?.pageNumber || page,
      size: data.pageable?.pageSize || size,
    };
  } catch (error) {
    console.error("❌ Fetch error:", error);
    throw error;
  }
}

export default function CustomerIdPicklistField({
  label = "Customer ID",
  labelHi,
  icon,
  value,
  placeholder = "Select Customer",
  required,
  readOnly,
  disabled,
  error,
  onSelect,
  preFetch = false,
  pageSize = 10,
  modalMaxWidthPx = 1200,
  modalMaxHeightPx = 900,
  modalMinHeightPx = 600,
}: CustomerIdPicklistFieldProps) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentSearchText, setCurrentSearchText] = useState("customerId");
  const [currentSearchValue, setCurrentSearchValue] = useState("");

  const selectedCustomer = customers.find(c => c.customerId === value);
  const displayValue = selectedCustomer?.customerId || value;
  console.log("selectedCustomer",selectedCustomer,displayValue)

  // Load customers with pagination
  const loadCustomers = useCallback(async (
    searchtext: string = "customerId", 
    searchValue: string = "", 
    page: number = 1
  ) => {
    const apiPage = page - 1;
    setLoading(true);
    setLoadError("");
    
    try {
      const result = await fetchCustomers({ 
        searchtext, 
        value: searchValue, 
        page: apiPage, 
        size: pageSize 
      });
      
      setCustomers(result.content);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
      
      setCurrentSearchText(searchtext);
      setCurrentSearchValue(searchValue);
      
      if (result.content.length === 0) {
        if (searchValue.trim()) {
          setLoadError(`No customers found matching "${searchValue}"`);
        } else {
          setLoadError(`No customers found`);
        }
      }
    } catch (err) {
      console.error("❌ Error loading customers:", err);
      setLoadError(err instanceof Error ? err.message : "Failed to load customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === currentPage) return;
    loadCustomers(currentSearchText, currentSearchValue, newPage);
  }, [currentPage, currentSearchText, currentSearchValue, loadCustomers]);

  const performSearch = useCallback(async (searchtext: string, searchValue: string) => {
    await loadCustomers(searchtext, searchValue, 1);
  }, [loadCustomers]);

  useEffect(() => {
    if (preFetch) {
      performSearch("customerId", "");
    }
  }, [preFetch, performSearch]);

  const openPicklist = useCallback(() => {
    if (readOnly || disabled) return;
    setOpen(true);
    if (customers.length === 0 && !loading) {
      performSearch("customerId", "");
    }
  }, [customers.length, disabled, loading, performSearch, readOnly]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelect = useCallback((row: CustomerOption) => {
    onSelect(row);
    setOpen(false);
  }, [onSelect]);

  const handleSearchSubmit = useCallback((searchBy: string, textToSearch: string) => {
    const searchtext = SEARCH_BY_API_MAP[searchBy] || searchBy;
    
    if (!textToSearch.trim()) {
      performSearch(searchtext, "");
      return;
    }
    
    performSearch(searchtext, textToSearch);
  }, [performSearch]);

  return (
    <>
      <PicklistField
        label={label}
        labelHi={labelHi}
        icon={icon}
        value={displayValue}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        error={error}
        onOpenPicklist={openPicklist}
      />
      {open && (
        <PicklistModal<CustomerOption>
          title="Select Customer"
          columns={COLUMNS}
          rows={customers}
          rowKey={(row) => row.customerId || row.customerName}
          searchByOptions={SEARCH_BY_OPTIONS}
          onSearchSubmit={handleSearchSubmit}
          loading={loading}
          emptyMessage={loadError || "No customers found"}
          onSelect={handleSelect}
          onClose={handleClose}
          pagination={{
            page: currentPage,
            totalPages: totalPages,
            onPageChange: handlePageChange
          }}
          maxWidthPx={modalMaxWidthPx}
          maxHeightPx={modalMaxHeightPx}
          minHeightPx={modalMinHeightPx}
        />
      )}
    </>
  );
}