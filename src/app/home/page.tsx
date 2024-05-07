"use client";

import { useState } from "react";
import { Calendar, Event, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<any>(Views.WEEK);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        timeslots={4}
        step={15}
        date={moment(date).toDate()}
        view={view}
        onNavigate={(date) => setDate(date)}
        onView={(view) => setView(view)}
      />
    </div>
  );
}
