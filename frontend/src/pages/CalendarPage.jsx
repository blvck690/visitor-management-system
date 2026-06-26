import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { api } from "../services/api.js";

const statusColors = {
  PENDING: "#f59e0b", APPROVED: "#10b981", REJECTED: "#ef4444",
  ON_HOLD: "#64748b", CHECKED_IN: "#3b6cf6", CHECKED_OUT: "#94a3b8", CANCELLED: "#dc2626",
};

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    api.get("/calendar/events").then((r) => setEvents(
      r.data.map((e) => ({ ...e, backgroundColor: statusColors[e.status], borderColor: statusColors[e.status] })),
    ));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
      <div className="card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
          events={events}
          height={720}
        />
      </div>
    </div>
  );
}