import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CommDialog from "../CommonComponent/CommDialog";
import CommButton from "views/CommonComponent/CommButton";
import {
  deleteFollowingSchedule,
  deleteSchedule,
} from "Services/scheduleService";
import CommAlert from "views/CommonComponent/CommAlert";
import { Button, DialogContentText } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function ViewDialog({
  viewDialog,
  events,
  eventsDetails,
  setViewDialog,
  setOpen,
  clickInfo,
  selectedDate,
  setEditMode,
  getScheduledata,
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openEventDelete, setOpenEventDelete] = useState(false);
  const [value, setValue] = useState("");
  console.log("values >>>", value);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClose = () => {
    setViewDialog(false);
  };
  const handleCloseOpneEvent = () => {
    setViewDialog(false);
    setOpenConfirm(true);
    setOpenEventDelete(false);
  };
  const handleDeleteEvent = () => {
    setOpenEventDelete(true);
  };
  const deleteRecordhandler = () => {
    setOpenConfirm(false);
    if (value === "single") {
      deleteSchedule(clickInfo.event._def.publicId).then((res) => {
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage(res.message);
        clickInfo.event.remove();
        getScheduledata();
      });
    }
    if (value === "multiple") {
      deleteFollowingSchedule(clickInfo.event._def.publicId).then((res) => {
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage(res.message);
        getScheduledata();
      });
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  // console.log("Event Details >>", eventsDetails);

  return (
    <div className="add-user-dialog">
      <Dialog
        open={viewDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="title-dialogbox">Event Detail</DialogTitle>
        <DialogContent dividers>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Typography variant="h5">Event Name :</Typography>
              {eventsDetails.eventName}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">User :</Typography>
              {eventsDetails.user}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">Event start date :</Typography>
              {eventsDetails.startDate}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">Event end date :</Typography>
              {eventsDetails.endDate}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">Event start time :</Typography>
              {eventsDetails.startTime}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">Event end time :</Typography>
              {eventsDetails.endTime}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">Day :</Typography>
              {eventsDetails.day === null ? "-" : eventsDetails.day}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CommButton title="Delete" handleClick={handleDeleteEvent} />
          <CommButton
            title="Edit"
            handleClick={() => {
              handleClose();
              setOpen(true);
              setEditMode(true);
            }}
          />
        </DialogActions>
      </Dialog>

      {/* Delete all event confirmation */}
      <Dialog
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        open={openEventDelete}
        onClose={openEventDelete}
      >
        <DialogTitle style={{ fontSize: "1rem" }} id="alert-dialog-title">
          Confirmation
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want delete following all event or only this?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            marginLeft: "12px",
          }}
        >
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="single"
                control={<Radio />}
                label="Only this event"
              />
              <FormControlLabel
                value="multiple"
                control={<Radio />}
                label="Following events"
              />
            </RadioGroup>
            <div
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <Button
                style={{ marginLeft: "220px" }}
                onClick={handleCloseOpneEvent}
                variant="contained"
              >
                DELETE
              </Button>
            </div>
          </FormControl>
        </DialogActions>
      </Dialog>
      <CommDialog
        setOpenConfirm={setOpenConfirm}
        openConfirm={openConfirm}
        deleteRecordhandler={deleteRecordhandler}
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
  );
}
