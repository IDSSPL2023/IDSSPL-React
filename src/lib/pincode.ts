export interface PincodeDetails {
  city: string;
  state: string;
  country: string;
}

/** Global pincode -> city/state/country lookup, shared across all forms. */
export async function fetchPincodeDetails(pin: string): Promise<PincodeDetails | null> {
  if (!/^\d{6}$/.test(pin)) return null;

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const data = await response.json();

    if (data[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
      const office = data[0].PostOffice[0];
      return { city: office.District, state: office.State, country: office.Country };
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
