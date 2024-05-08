"use client";

import moment from "moment";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";

const localizer = momentLocalizer(moment);

const MainCalendar = () => {
  const events: Event[] = [];
  const date = new Date();
  const view = Views.WEEK;

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
      />
    </div>
  );
};

export default MainCalendar;
