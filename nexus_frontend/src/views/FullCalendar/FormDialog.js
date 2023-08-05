import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import moment from "moment";
import CommTextField from "views/CommonComponent/CommTextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import CommButton from "views/CommonComponent/CommButton";
import CommCheckboxlist from "../CommonComponent/CommCheckboxlist";

import { createSchedule, EditSchedule } from "Services/scheduleService";
import { getAllClasses } from "Services/manageClassesService";
import { useEffect } from "react";
import CommSelect from "views/CommonComponent/CommSelect";
import { Button, Checkbox } from "@mui/material";
import CommAlert from "views/CommonComponent/CommAlert";
import { GetUserData } from "Services/apiServices";
import { checkRemainingCredits, getPlans } from "Services/planService";
import { getCustomers, getCustomer } from "Services/customerService";
import { createBooking } from "Services/bookingService";
export default function FormDialog({
  open,
  setOpen,
  dialogTitle,
  eventsDetails,
  editMode,
  getScheduledata,
  currentEventDates,
  currentEventTime,
}) {
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const [checked, setChecked] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [optionUsers, setoptionUsers] = useState([]);
  const [scheduleClassOption, setScheduleClassOption] = useState([]);
  const [value, setValue] = useState("");
  const [isRepeat, setisRepeat] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [planOptions, setPlanOptions] = useState();
  const [customerOption, setCustomerOption] = useState("");
  const [isUserHavePlan, setIsUserHavePlan] = useState(true);
  const [customerAllData, setCustomerAllData] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [setAllPlanData, setSetAllPlanData] = useState();
  const [openPaymentCard, setOpenPaymentCard] = useState(false);
  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setoptionUsers((prev) => [...prev, newOption]);
      setValue(newOption);
    }, 1000);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    getClassData();
    getCustomerOption();
    getUserData();
    getPlansOption();
  }, [open, setOpen]);

  const getUserData = () => {
    GetUserData().then((res) => {
      setoptionUsers(
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
  const getClassData = () => {
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
  const getPlansOption = () => {
    getPlans().then((res) => {
      setPlanOptions(
        res.data.plan
          ?.filter((item) => item.credits > 0)
          .map((item) => {
            return {
              value: item.id,
              text: item.planName,
            };
          })
      );
      setSetAllPlanData(res.data.plan);
    });
  };
  const getCustomerOption = () => {
    getCustomers()
      .then((res) => {
        setCustomerOption(
          res.data.customer?.map((item) => {
            return {
              value: item.id,
              text: item.firstName,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (eventsDetails.isRepeat) {
      setisRepeat(eventsDetails.isRepeat);
      setChecked([eventsDetails.day]);
    }
  }, [eventsDetails]);

  const formik = useFormik({
    initialValues: {
      eventName: editMode ? eventsDetails.classId : "",
      eventStartDate: editMode ? eventsDetails.startDate : currentEventDates,
      eventEndDate: editMode ? eventsDetails.endDate : currentEventDates,
      startTime: editMode ? eventsDetails.startTime : currentEventTime,
      endTime: editMode ? eventsDetails.endTime : currentEventTime,
      isRepeat: editMode ? eventsDetails.isRepeat : true,
      userId: editMode ? eventsDetails.userId : "",
      days: editMode ? checked : "",
      customerId: editMode ? eventsDetails.customerId : "",
      planId: editMode ? eventsDetails.planId : "",
    },
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      setOpen(false);
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
        // console.log("values >>", values);
      }
      const data = {
        startTime: values.startTime,
        endTime: values.endTime,
        startDate: values.eventStartDate,
        endDate: values.eventEndDate,
        userId: values.userId,
        isRepeat: false,
        classId: values.eventName,
        day: editMode ? value.day : null,
      };
      let ifIsRepeatData = [];
      if (isRepeat) {
        checked.map((item) => {
          ifIsRepeatData.push({
            classId: values.eventName,
            startDate: values.eventStartDate,
            endDate: values.eventEndDate,
            startTime: values.startTime,
            endTime: values.endTime,
            userId: values.userId,
            isRepeat: isRepeat,
            day: item,
          });
        });
      }
      if (editMode) {
        EditSchedule(eventsDetails.id, data).then((res) => {
          console.log("Update Response>>>", res);
          if (res.status === true) {
            setOpenSnackbar(true);
            setSnackbarSeverity("success");
            setSnackbarMessage(res.message);
            getScheduledata();
          }
          if (res.status === false) {
            setOpenSnackbar(true);
            setSnackbarSeverity("info");
            setSnackbarMessage(res.message);
          }
        });
      }
      if (
        values.eventStartDate >= moment(new Date()).format().split("T")[0] &&
        values.eventEndDate >= values.eventStartDate &&
        !editMode
      ) {
        createSchedule(checked && isRepeat ? ifIsRepeatData : data)
          .then((res) => {
            if (res?.status === true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              getScheduledata();
              if (isBooking) {
                createBooking({
                  scheduleId: res.data.id,
                  planId: values.planId,
                  customerId: values.customerId,
                  credits: values.credits,
                }).then((res) => {
                  console.log("response of boookigng >>>", res);
                });
              }
            }
            if (res?.status === false) {
              setOpenSnackbar(true);
              setSnackbarSeverity("info");
              setSnackbarMessage(res.message);
            }
          })
          .catch((error) => {
            setOpenSnackbar(true);
            setSnackbarSeverity("error");
            setSnackbarMessage(error.message);
          });
      } else {
        setOpenSnackbar(true);
        setSnackbarSeverity("info");
        setSnackbarMessage("Past date are not allow!!");
      }
      resetForm({ values: "" });
    },
  });

  useEffect(() => {
    if (formik.values.customerId) {
      getCustomerById();
    }
  }, [formik.values.customerId]);

  const getCustomerById = () => {
    getCustomer(formik.values.customerId)
      .then((res) => {
        setCustomerAllData((pre) => res.data);
      })
      .catch((err) => console.log(err.message));
  };

  const handleOpnePaymentCard = () => {
    setOpenPaymentCard(true);
  };
  // console.log("setIsUserHavePlan>>", isUserHavePlan);
  useEffect(() => {
    if (customerAllData.planId) {
      setIsUserHavePlan(true);
    } else {
      setIsUserHavePlan(false);
    }
  }, [customerAllData.planId]);

  const [remainingCredits, setRemainingCredits] = useState(0);

  const checkCreaditOfUserPlan = () => {
    const data = {
      customerId: formik.values.customerId,
      planId: formik.values.planId,
    };
    checkRemainingCredits(data)
      .then((response) => {
        setRemainingCredits(response.data);
      })
      .catch();
  };

  useEffect(() => {
    checkCreaditOfUserPlan();
  }, [formik.values.planId]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="title-dialogbox">{dialogTitle}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12}>
                <Typography variant="h5">
                  Select Event{" "}
                  {!editMode && <span style={{ color: "red" }}>*</span>}
                </Typography>
                <CommSelect
                  name="eventName"
                  value={formik.values.eventName}
                  setValue={formik.handleChange}
                  options={scheduleClassOption}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Event start date</Typography>
                <CommTextField
                  value={formik.values.eventStartDate}
                  setValue={formik.handleChange}
                  type="date"
                  errorClass={
                    formik.touched.eventStartDate &&
                    Boolean(formik.errors.eventStartDate)
                  }
                  helperText={
                    formik.touched.eventStartDate &&
                    formik.errors.eventStartDate
                  }
                  name="eventStartDate"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Event end date</Typography>
                <CommTextField
                  value={formik.values.eventEndDate}
                  setValue={formik.handleChange}
                  type="date"
                  errorClass={
                    formik.touched.eventEndDate &&
                    Boolean(formik.errors.eventEndDate)
                  }
                  helperText={
                    formik.values.eventStartDate > formik.values.eventEndDate
                      ? "Enddate must be greater than startdate"
                      : ""
                  }
                  name="eventEndDate"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Event start time</Typography>
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
                <Typography variant="h5">Event end time</Typography>
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
                <Typography variant="h5">Select instructor</Typography>
                <CommSelect
                  name="userId"
                  value={formik.values.userId}
                  setValue={formik.handleChange}
                  options={optionUsers}
                />
              </Grid>

              <Grid item xs={6} style={{ marginBottom: "20px" }}>
                <Typography variant="h5">Is Repeat</Typography>
                <Checkbox
                  checked={isRepeat}
                  onChange={(event) => setisRepeat(event.target.checked)}
                  name="isRepeat"
                  color="primary"
                />
              </Grid>
              {isRepeat && (
                <Grid item xs={12}>
                  <CommCheckboxlist setChecked={setChecked} checked={checked} />
                </Grid>
              )}
              {/* Second section */}  
              <DialogContent dividers>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12}>
                    <Typography sx={{ mb: 3 }} variant="h3" component="div">
                      Select Customer
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="h5">Customer</Typography>
                    <CommSelect
                      name="customerId"
                      value={formik.values.customerId}
                      setValue={formik.handleChange}
                      options={customerOption}
                    />
                  </Grid>
                  {isUserHavePlan === false ? (
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "flex",
                        alignItems: "end",
                      }}
                    >
                      <Button
                        variant="contained"
                        style={{
                          background: "#0063cc",
                          height: "50px",
                        }}
                        onClick={handleOpnePaymentCard}
                      >
                        Buy Now
                      </Button>
                    </Grid>
                  ) : (
                    isUserHavePlan === true && (
                      <Grid item xs={6}>
                        <Typography variant="h5">Select Plan</Typography>
                        <CommSelect
                        
                          name="planId"
                          value={formik.values.planId}
                          setValue={formik.handleChange}
                          options={planOptions}
                          helperText="fsdhfsdgdi"
                        />
                      </Grid>
                    )
                  )}
                  {openPaymentCard && (
                    <Dialog
                      open={openPaymentCard}
                      onClose={false}
                      fullWidth={true}
                      maxWidth={"xs"}
                    >
                      <DialogTitle variant="h3">Card</DialogTitle>
                      <DialogContent>
                        <Grid item xs={6}>
                          <Typography variant="h5">Card number</Typography>
                          <CommTextField
                            value={formik.values.cardNumber}
                            setValue={formik.handleChange}
                            type="number"
                            errorClass={
                              formik.touched.cardNumber &&
                              Boolean(formik.errors.cardNumber)
                            }
                            helperText={
                              formik.touched.cardNumber &&
                              formik.errors.cardNumber
                            }
                            name="endTime"
                          />
                        </Grid>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpenPaymentCard(false)}>
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  )}
                </Grid>
              </DialogContent>
            </Grid>
          </DialogContent>
          <DialogActions>
            <CommButton title={editMode ? "Update" : "Save"} type="submit" />
            <CommButton title="Cancel" handleClick={handleClose} />
          </DialogActions>
        </form>
      </Dialog>
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
