import { PageModal } from "@/app/components/modal/page-modal";
import { getAvailability } from "@/sanity/sanity.query";
import "@/app/(site)/calendar/calendar.scss";

export default async function CalendarModal() {
  const availability = await getAvailability();

  return <PageModal availability={availability} />;
}
