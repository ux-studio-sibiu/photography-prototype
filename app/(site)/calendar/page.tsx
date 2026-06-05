import Calendar from "@/app/components/calendar/calendar";
import { getAvailability } from "@/sanity/sanity.query";
import "./calendar.scss";

export const metadata = {
  title: "Calendar | Photography",
};

export const revalidate = 60; // seconds

export default async function CalendarPage() {
  const availability = await getAvailability();

  return (
    <main className="calendar-page">
      <div className="calendar-page-container">
        <h1 className="calendar-page-title">Availability Calendar</h1>
        <p className="calendar-page-subtitle">
          Red dates indicate when I'm not available for bookings
        </p>

        <div className="calendar-page-content">
          <Calendar availability={availability} />
        </div>
      </div>
    </main>
  );
}
