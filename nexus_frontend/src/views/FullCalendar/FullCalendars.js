import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FormDialog from "./FormDialog";
import ViewDialog from "./ViewDialog";
import "./fullcalendar.css";
import {
  getRepeatSchedules,
  getSchedule,
  getSchedules,
} from "Services/scheduleService";
import { useEffect } from "react";
import CommAlert from "views/CommonComponent/CommAlert";
import moment from "moment";
const FullCalendars = () => {
  const [weekendsVisible, setweekendsVisible] = useState(true);
  const [currentEvents, setcurrentEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsDetails, seteventsDetails] = useState([]);
  const [clickInfo, setclickInfo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [scheduleData, setScheduleData] = useState("");
  const [repeatScheduleData, setRepeatScheduleData] = useState();
  const [currentEventDates, setcurrentEventDates] = useState("");
  const [currentEventTime, setCurrentEventTime] = useState("");

  const handleDateSelect = (selectInfo) => {
    console.log("selectInfoselectInfoselectInfo", selectInfo);
    if (
      moment(selectInfo.start).format().split("T")[1].split("+")[0] !==
      "00:00:00"
    ) {
      setCurrentEventTime(
        moment(selectInfo.start).format().split("T")[1].split("+")[0]
      );
      setcurrentEventDates(selectInfo.startStr.split("T")[0]);
    } else {
      setcurrentEventDates(selectInfo.startStr);
    }
    setEditMode(false);
    if (
      moment(selectInfo.startStr).format() >=
      moment(new Date()).format().split("T")[0]
    ) {
      setOpen(true);
    }
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.event.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  // const handleWeekendsToggle = () => {
  //   setweekendsVisible({
  //     weekendsVisible: !weekendsVisible,
  //   });
  // };
  // function renderSidebarEvent(event) {
  //   return (
  //     <li key={event.id}>
  //       <b>
  //         {formatDate(event.start, {
  //           year: "numeric",
  //           month: "short",
  //           day: "numeric",   
  //         })}
  //       </b>
  //       <i>{event.title}</i>
  //     </li>
  //   );
  // }
  function renderSidebar() {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2>Total Events ({currentEvents.length})</h2>
          {/* <ul>{currentEvents.map(renderSidebarEvent)}</ul> */}
        </div>
      </div>
    );
  }
  // let rdata = [];

  // if (scheduleData && repeatScheduleData) {
  //   repeatScheduleData?.map((item) => {
  //     scheduleData?.filter((item1) => {
  //       if (
  //         item1.startDate === item.startDate &&
  //         item1.endDate === item.endDate
  //       ) {
  //         if (!item.days) {
  //           item = {
  //             ...item,
  //             title: item1.manageClass.eventName,
  //             days: [],
  //           };
  //         }
  //         item.days.push(item1.day);
  //         rdata.push({ ...item });
  //       } else {
  //         return false;
  //       }
  //     });
  //   });
  // }

  // console.log("rdatardatardata>>", [...new Set(rdata)]);
  // useEffect(() => {
  //   setEvents(
  //     [...new Set(rdata)].map((item) => {
  //       return {
  //         start: item.startDate.split("T")[0],
  //         end: item.endDate.split("T")[0],
  //         title: item.title,
  //         id: item.id,
  //         startRecur: item.startDate.split("T")[0],
  //         endRecur: item.endDate.split("T")[0],
  //         daysOfWeek: item.days,
  //       };
  //     })
  //   );
  // }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  useEffect(() => {
    getScheduledata();
    getRepeatScheduleData();
  }, []);

  const getRepeatScheduleData = () => {
    getRepeatSchedules()
      .then((res) => {
        setRepeatScheduleData(res);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const getScheduledata = () => {
    getSchedules()
      .then((res) => {
        // console.log(">>>>", res.data);
        setEvents(
          res.data.schedules.map((item) => {
            if (item.day) {
              return {
                start: item.startDate.split("T")[0],
                end: item.endDate.split("T")[0],
                title: item.manageClass.eventName,
                id: item.id,
                startRecur: item.startDate.split("T")[0],
                endRecur: item.endDate.split("T")[0],
                daysOfWeek: [item.day],
              };
            } else {
              return {
                start: item.startDate.split("T")[0],
                end: item.endDate.split("T")[0],
                title: item.manageClass.eventName,
                id: item.id,
              };
            }
          })
        );
        setScheduleData(res.data.schedules);
      })
      .catch((error) => {
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.message);
      });
  };
  const handleEventClick = (clickInfo) => {
    // console.log("Handle eventdClick", clickInfo.event._def.publicId);
    setViewDialog(true);
    setclickInfo(clickInfo);
    getSchedule(clickInfo.event._def.publicId).then((res) => {
      seteventsDetails({
        id: res.data.id,
        eventName: res.data.manageClass.eventName,
        startDate: res.data.startDate.split("T")[0],
        endDate: res.data.endDate.split("T")[0],
        startTime: res.data.startTime,
        endTime: res.data.endTime,
        classId: res.data.classId,
        isRepeat: res.data.isRepeat,
        userId: res.data.userId,
        user: res.data.user.first_name,
        day: res.data.day,
      });
    });
  };

  // console.log("get SetEvent Details >>", eventsDetails);
  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setEditMode(false);
  };
  const handleEvents = (events) => {
    setcurrentEvents(events);
  };
  const handledayRender = (date, allDay, jsEvent, view) => {
    console.log("Handle Day render >>>>", date, allDay, jsEvent, view);
  };
  return (
    <div className="demo-app">
      {renderSidebar()}
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          weekends={weekendsVisible}
          // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          dateClick={handleDateClick}
          dayClick={handledayRender}
        />
        <FormDialog
          open={open}
          setOpen={setOpen}
          dialogTitle={editMode ? "Edit Event" : "Add Event"}
          setEvents={setEvents}
          seteventsDetails={seteventsDetails}
          events={events}
          eventsDetails={eventsDetails}
          editMode={editMode}
          setEditMode={setEditMode}
          getScheduledata={getScheduledata}
          currentEventDates={currentEventDates}
          currentEventTime={currentEventTime}
        />
        <ViewDialog
          viewDialog={viewDialog}
          events={events}
          eventsDetails={eventsDetails}
          setViewDialog={setViewDialog}
          setOpen={setOpen}
          clickInfo={clickInfo}
          selectedDate={selectedDate}
          setEditMode={setEditMode}
          getScheduledata={getScheduledata}
        />
        <CommAlert
          message={snackbarMessage}
          severity={snackbarSeverity}
          autoHideDuration={4000}
          open={openSnackbar}
          handleSnackbarClose={handleSnackbarClose}
          position="Top-Right"
        />
      </div>
    </div>
  );
};

export default FullCalendars;
