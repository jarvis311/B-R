import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CommTextField from "views/CommonComponent/CommTextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import * as Yup from "yup";
import CommButton from "views/CommonComponent/CommButton";
import CommAlert from "views/CommonComponent/CommAlert";
import CommSelect from "views/CommonComponent/CommSelect";
import { useEffect } from "react";
import { getAllClasses } from "Services/manageClassesService";
import { createSchedule, EditSchedule } from "Services/scheduleService";
import CommCheckboxlist from "views/CommonComponent/CommCheckboxlist";
import { Checkbox } from "@mui/material";
import { GetUserData } from "Services/apiServices";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, p: 2 }}
      {...other}
      className="add-user-title"
      style={{ fontSize: "1.5rem" }}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const AddSchedule = ({
  open,
  setOpen,
  editMode,
  setEditMode,
  fetchEditData,
  getData,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [scheduleClassOption, setScheduleClassOption] = useState([]);
  const [scheduleUserOption, setscheduleUserOption] = useState([]);
  const [checked, setChecked] = useState([]);
  const [isRepeat, setisRepeat] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    formik.resetForm();
  };

  useEffect(() => {
    getScheduleData();
    getUsereData();
  }, [open, setOpen]);

  const getScheduleData = () => {
    getUsereData();
    getAllClasses().then((res) => {
      setScheduleClassOption(
        res.data.classesData?.map((item) => {
          return {
            value: item.id,
            text: item.eventName,
          };
        })
      );
    });
  };

  useEffect(() => {
    if (fetchEditData.isRepeat) {
      setisRepeat(fetchEditData.isRepeat);
      setChecked([fetchEditData.day]);
    }
  }, [fetchEditData]);
  console.log('fetchEditDatafetchEditData>>',fetchEditData)
  const getUsereData = () => {
    GetUserData().then((res) => {
      setscheduleUserOption(
        res.data.users
          ?.filter((item) => item.role_id === 23)
          .map((item) => {
            return {
              value: item.id,
              text: item.first_name,
            };
          })
      );
    });
  };
  const validationSchema = Yup.object().shape({
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string().required("End time is required"),
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    userId: Yup.number().required("Select User "),
    day: Yup.array(),
  });
  let initialValues = {
    startTime: editMode ? fetchEditData.startTime : "",
    endTime: editMode ? fetchEditData.endTime : "",
    startDate: editMode ? fetchEditData.startDate?.split("T")[0] : "",
    endDate: editMode ? fetchEditData.endDate?.split("T")[0] : "",
    userId: editMode ? fetchEditData.userId : "",
    isRepeat: editMode ? fetchEditData.isRepeat : true,
    classId: editMode ? fetchEditData.classId : "",
    day: editMode ? fetchEditData.day : "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      let singleData = {
        classId: values.classId,
        startDate: values.startDate,
        endDate: values.endDate,
        startTime: values.startTime,
        endTime: values.endTime,
        userId: values.userId,
        isRepeat: isRepeat,
        day: editMode ? checked : null,
      };
      let data = [];
      if (isRepeat) {
        checked.map((item) => {
          data.push({
            classId: values.classId,
            startDate: values.startDate,
            endDate: values.endDate,
            startTime: values.startTime,
            endTime: values.endTime,
            userId: values.userId,
            isRepeat: isRepeat,
            day: item,
          });
        });
      }

      editMode
        ? EditSchedule(fetchEditData.id, singleData).then((res) => {
            console.log("Update Response>>>", res);
            if (res.status === true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              setEditMode(false);
              values.startDate = "";
              values.endDate = "";
              values.startTime = "";
              values.endTime = "";
              values.userId = "";
              values.isRepeat = "";
              getData();
            }
            if (res.status === false) {
              setOpenSnackbar(true);
              setSnackbarSeverity("info");
              setSnackbarMessage(res.message);
              setEditMode(false);
              getData();
            }
          })
        : createSchedule(checked && isRepeat ? data : singleData).then(
            (res) => {
              console.log("Response Of Add Data>>>", res);
              if (res.status === true) {
                setOpenSnackbar(true);
                setSnackbarSeverity("success");
                setSnackbarMessage(res.message);
                setEditMode(false);
                values.startDate = "";
                values.endDate = "";
                values.startTime = "";
                values.endTime = "";
                values.userId = "";
                values.isRepeat = false;
                getData();
              }
              if (res.status === false) {
                setOpenSnackbar(true);
                setSnackbarSeverity("info");
                setSnackbarMessage(res.message);
                setEditMode(false);
                getData();
              }
            }
          );
      setOpen(false);
    },
    validationSchema,
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  return (
    <div className="add-user-dialog">
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {editMode === true ? "Edit Schedule" : "Add Schedule"}
        </BootstrapDialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Typography variant="h5">
                  Select Class{" "}
                  {!editMode && <span style={{ color: "red" }}>*</span>}
                </Typography>
                <CommSelect
                  name="classId"
                  value={formik.values.classId}
                  setValue={formik.handleChange}
                  options={scheduleClassOption}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Select User</Typography>
                <CommSelect
                  name="userId"
                  value={formik.values.userId}
                  setValue={formik.handleChange}
                  options={scheduleUserOption}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">
                  Start Date{" "}
                  {!editMode && <span style={{ color: "red" }}>*</span>}
                </Typography>
                <CommTextField
                  value={formik.values.startDate}
                  setValue={formik.handleChange}
                  type="date"
                  errorClass={
                    formik.touched.startDate && Boolean(formik.errors.startDate)
                  }
                  helperText={
                    formik.touched.startDate && formik.errors.startDate
                  }
                  name="startDate"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">
                  End Date{" "}
                  {!editMode && <span style={{ color: "red" }}>*</span>}
                </Typography>
                <CommTextField
                  value={formik.values.endDate}
                  setValue={formik.handleChange}
                  type="date"
                  errorClass={
                    formik.touched.endDate && Boolean(formik.errors.endDate)
                  }
                  helperText={formik.touched.endDate && formik.errors.endDate}
                  name="endDate"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">
                  Start Time{" "}
                  {!editMode && <span style={{ color: "red" }}>*</span>}
                </Typography>
                <CommTextField
                  value={formik.values.startTime}
                  setValue={formik.handleChange}
                  type="time"
                  errorClass={
                    formik.touched.startTime && Boolean(formik.errors.startTime)
                  }
                  helperText={
                    formik.touched.startTime && formik.errors.startTime
                  }
                  name="startTime"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">
                  End Time{" "}
                  {!editMode && <span style={{ color: "red" }}>*</span>}
                </Typography>
                <CommTextField
                  value={formik.values.endTime}
                  setValue={formik.handleChange}
                  type="time"
                  errorClass={
                    formik.touched.endTime && Boolean(formik.errors.endTime)
                  }
                  helperText={formik.touched.endTime && formik.errors.endTime}
                  name="endTime"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Is Repeat</Typography>
                <Checkbox
                  checked={isRepeat}
                  onChange={(event) => setisRepeat(event.target.checked)}
                  name="isRepeat"
                  color="primary"
                />
              </Grid>

              {isRepeat ? (
                <Grid item xs={12} sx={{ my: 2 }}>
                  <Typography variant="h5">Choose Days</Typography>
                  <CommCheckboxlist setChecked={setChecked} checked={checked} />
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <CommButton
              title="Cancel"
              type="submit"
              handleClick={handleClose}
            />
            {editMode ? (
              <CommButton title="Update" type="submit" />
            ) : (
              <CommButton title="Save" type="submit" />
            )}
          </DialogActions>
        </form>
      </BootstrapDialog>
      <CommAlert
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={1000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Top-Right"
      />
    </div>
  );
};

export default AddSchedule;
