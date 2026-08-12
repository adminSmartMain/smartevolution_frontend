import dynamic from "next/dynamic";

const Bills = dynamic(() => import("@views/bills"), { ssr: false });

export default function index() {
  return <Bills />;
}
