"use client";

import { useMemo, useState } from "react";
import type { AvailabilityType, DayRecord } from "@/types";
import "./calendar.scss";

interface CalendarProps {
  availability: AvailabilityType | null;
  month?: number;
  year?: number;
}

// Monday-first week order (Sunday last)
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Offset of the 1st of the month within a Monday-first week (Mon=0 … Sun=6)
const mondayFirstOffset = (m: number, y: number) =>
  (new Date(y, m, 1).getDay() + 6) % 7;

export default function Calendar({
  availability,
  month: initialMonth = new Date().getMonth(),
  year: initialYear = new Date().getFullYear(),
}: CalendarProps) {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();

  const dayMap = useMemo(() => {
    const map = new Map<string, DayRecord>();
    availability?.days?.forEach((d) => {
      if (d.date) map.set(d.date, d);
    });
    return map;
  }, [availability]);

  const days = Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1);
  const blanks = Array.from(
    { length: mondayFirstOffset(month, year) },
    (_, i) => i
  );

  const monthName = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Don't allow navigating earlier than the current month.
  const now = new Date();
  const atCurrentMonth =
    year < now.getFullYear() ||
    (year === now.getFullYear() && month <= now.getMonth());

  const prevMonth = () => {
    if (atCurrentMonth) return;
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav"
          onClick={prevMonth}
          disabled={atCurrentMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="calendar-title">{monthName}</h2>
        <button
          type="button"
          className="calendar-nav"
          onClick={nextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="calendar-day calendar-day--empty" />
        ))}

        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const record = dayMap.get(dateStr);
          const isOccupied = record?.status === "occupied";
          const note = record?.note?.trim();
          const isToday =
            new Date().toISOString().split("T")[0] === dateStr;

          return (
            <div
              key={day}
              title={note || undefined}
              className={`calendar-day ${
                isOccupied ? "calendar-day--occupied" : "calendar-day--free"
              } ${isToday ? "calendar-day--today" : ""} ${
                note ? "calendar-day--has-note" : ""
              }`}
            >
              {day}
              {note && <span className="calendar-day-note-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
