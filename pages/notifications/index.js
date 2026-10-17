import Head from "next/head";

import NotificationsView from "@views/notifications";

export default function NotificationsPage() {
  return (
    <>
      <Head>
        <title>Notificaciones | Smart Evolution</title>
      </Head>

      <NotificationsView />
    </>
  );
}