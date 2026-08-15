import Head from "next/head";
import ProfileView from "@views/profile";

export default function ProfilePage() {
  return (
    <>
      <Head><title>Mi perfil</title></Head>
      <ProfileView />
    </>
  );
}
