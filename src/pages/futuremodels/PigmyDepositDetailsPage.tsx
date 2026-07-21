import { useRouter } from "@/lib/navigation";
import AddPigmyDepositModal from "@/components/FutureModels/AddPigmyDepositModal";


export default function PigmyDepositDetailsPage() {
  const router = useRouter();

  return <AddPigmyDepositModal open onClose={() => router.back()} />;
  
}
