export default function LegacyAccessControl(){return null}
export function getServerSideProps(){return {redirect:{destination:"/administration/users",permanent:false}}}
