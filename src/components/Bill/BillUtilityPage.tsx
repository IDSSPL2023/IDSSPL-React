import { useState } from "react";
import HeroBill from "./BillHero";

import IBCEntryModal from "./IBCEntry";
import IBCRealizeMarkModal from "./IBCMark";
import OBCEntryModal from "./OBCEntry";
import OBCRealizeMarkModal from "./OBCMark";
import BillHero from "./BillHero";

type ActiveModal = "ibcEntry" | "ibcMark" | "obcEntry" | "obcMark" | null;

export default function BillUtilityPage() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <BillHero
        onOpenIBCEntry={() => setActiveModal("ibcEntry")}
        onOpenIBCMark={() => setActiveModal("ibcMark")}
        onOpenOBCEntry={() => setActiveModal("obcEntry")}
        onOpenOBCMark={() => setActiveModal("obcMark")}
      />

      {activeModal === "ibcEntry" && <IBCEntryModal onClose={closeModal} />}
      {activeModal === "ibcMark" && <IBCRealizeMarkModal onClose={closeModal} />}
      {activeModal === "obcEntry" && <OBCEntryModal onClose={closeModal} />}
      {activeModal === "obcMark" && <OBCRealizeMarkModal onClose={closeModal} />}
    </>
  );
}