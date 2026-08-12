import dynamic from "next/dynamic";

const Bills = dynamic(() => import("@views/bills/billList"), { ssr: false });

export default function index() {
  return <Bills />;
}
