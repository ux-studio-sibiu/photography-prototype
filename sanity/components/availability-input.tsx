import { useEffect, useMemo, useState } from "react";
import { ObjectInputProps, set, unset } from "sanity";
import { Box, Button, Stack, Text, TextArea } from "@sanity/ui";

type DayStatus = "occupied" | "free";

interface DayRecord {
  _key?: string;
  date?: string;
  status?: DayStatus;
  note?: string;
}

// Legacy shape (pre-migration): range-based occupied dates.
interface LegacyRange {
  startDate?: string;
  endDate?: string;
}

const makeKey = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const toDateStr = (y: number, m: number, day: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

// A record is worth keeping only if it marks the day occupied or carries a note.
const isMeaningful = (d: DayRecord) =>
  Boolean(d.date) && (d.status === "occupied" || Boolean(d.note?.trim()));

export function AvailabilityInput(props: ObjectInputProps) {
  const { value, onChange } = props;
  const days = (value?.days as DayRecord[] | undefined) ?? [];

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const writeDays = (next: DayRecord[]) => {
    const clean = next.filter(isMeaningful);
    onChange(clean.length > 0 ? set(clean, ["days"]) : unset(["days"]));
  };

  // One-time migration: expand any legacy `occupiedDates` ranges into per-day
  // records, then drop the old field. Runs until no legacy data remains.
  useEffect(() => {
    const legacy = value?.occupiedDates as LegacyRange[] | undefined;
    if (!legacy || legacy.length === 0) return;

    const migrated: DayRecord[] = [...days];
    const seen = new Set(days.map((d) => d.date));

    legacy.forEach(({ startDate, endDate }) => {
      if (!startDate || !endDate) return;
      const current = new Date(startDate);
      const end = new Date(endDate);
      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        if (!seen.has(dateStr)) {
          seen.add(dateStr);
          migrated.push({ _key: makeKey(), date: dateStr, status: "occupied" });
        }
        current.setDate(current.getDate() + 1);
      }
    });

    onChange([
      set(migrated.filter(isMeaningful), ["days"]),
      unset(["occupiedDates"]),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.occupiedDates]);

  const dayMap = useMemo(() => {
    const map = new Map<string, DayRecord>();
    days.forEach((d) => {
      if (d.date) map.set(d.date, d);
    });
    return map;
  }, [days]);

  const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  // Offset of the 1st within a Monday-first week (Mon=0 … Sun=6)
  const mondayFirstOffset = (m: number, y: number) =>
    (new Date(y, m, 1).getDay() + 6) % 7;

  const monthDays = Array.from(
    { length: daysInMonth(month, year) },
    (_, i) => i + 1
  );
  const blanks = Array.from(
    { length: mondayFirstOffset(month, year) },
    (_, i) => i
  );

  const monthName = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const upsertDay = (dateStr: string, changes: Partial<DayRecord>) => {
    const existing = dayMap.get(dateStr);
    const merged: DayRecord = {
      _key: existing?._key ?? makeKey(),
      date: dateStr,
      status: changes.status ?? existing?.status ?? "occupied",
      note: changes.note !== undefined ? changes.note : existing?.note,
    };
    const others = days.filter((d) => d.date !== dateStr);
    writeDays([...others, merged]);
  };

  const prevMonth = () => {
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

  const selectedRecord = selectedDate ? dayMap.get(selectedDate) : undefined;
  const selectedStatus: DayStatus = selectedRecord?.status ?? "free";

  return (
    <Stack space={4} padding={4}>
      <Box>
        <Text weight="semibold" size={2} style={{ marginBottom: "1rem" }}>
          Availability (click a day to edit)
        </Text>

        <Stack space={3} style={{ marginBottom: "1.5rem" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button text="← Previous" onClick={prevMonth} mode="bleed" fontSize={1} />
            <Text weight="semibold">{monthName}</Text>
            <Button text="Next →" onClick={nextMonth} mode="bleed" fontSize={1} />
          </Box>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "8px",
            }}
          >
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "#999",
                  padding: "8px 0",
                }}
              >
                {day}
              </div>
            ))}

            {blanks.map((_, i) => (
              <div key={`blank-${i}`} />
            ))}

            {monthDays.map((day) => {
              const dateStr = toDateStr(year, month, day);
              const record = dayMap.get(dateStr);
              const isOccupied = record?.status === "occupied";
              const hasNote = Boolean(record?.note?.trim());
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  title={record?.note || undefined}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    aspectRatio: "1",
                    padding: "4px",
                    overflow: "hidden",
                    border: isSelected
                      ? "2px solid #1a1a1a"
                      : "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    backgroundColor: isOccupied ? "#d9534f" : "#f0f0f0",
                    color: isOccupied ? "#fff" : "#1a1a1a",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{day}</span>
                  {hasNote && (
                    <span
                      style={{
                        maxWidth: "100%",
                        fontSize: "0.55rem",
                        lineHeight: 1.1,
                        fontWeight: 400,
                        opacity: 0.85,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {record?.note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Stack>
      </Box>

      {selectedDate && (
        <Box
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <Stack space={3}>
            <Text weight="semibold" size={1}>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                text="Occupied"
                tone="critical"
                mode={selectedStatus === "occupied" ? "default" : "ghost"}
                fontSize={1}
                onClick={() => upsertDay(selectedDate, { status: "occupied" })}
              />
              <Button
                text="Free"
                mode={selectedStatus === "free" ? "default" : "ghost"}
                fontSize={1}
                onClick={() => upsertDay(selectedDate, { status: "free" })}
              />
            </div>

            <Stack space={2}>
              <Text size={1} muted>
                Note
              </Text>
              <TextArea
                rows={2}
                value={selectedRecord?.note ?? ""}
                placeholder="Optional note for this day…"
                onChange={(e) =>
                  upsertDay(selectedDate, { note: e.currentTarget.value })
                }
              />
            </Stack>

            <Button
              text="Close"
              mode="bleed"
              fontSize={1}
              onClick={() => setSelectedDate(null)}
            />
          </Stack>
        </Box>
      )}

      <Box
        style={{
          padding: "12px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          fontSize: "0.85rem",
          color: "#666",
        }}
      >
        <Text size={1}>
          💡 Click a day to mark it occupied/free and add an optional note. A dot
          marks days with a note.
        </Text>
      </Box>
    </Stack>
  );
}
