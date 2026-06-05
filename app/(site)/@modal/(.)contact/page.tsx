import { PageModal } from "@/app/components/modal/page-modal";
import { getGeneralInfo } from "@/sanity/sanity.query";

export default async function ContactModal() {
  const info = await getGeneralInfo();
  return <PageModal social={info?.social} />;
}
