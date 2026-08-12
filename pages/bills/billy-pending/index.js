import dynamic from "next/dynamic";

const PendingBillyBills = dynamic(() => import("@views/bills/billyPending"), { ssr: false });

export default function Index() {
  return <PendingBillyBills />;
}
