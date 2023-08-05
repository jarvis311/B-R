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
import { createClasses, updateClasses } from "Services/manageClassesService";
import { getPlans } from "Services/planService";
import { useEffect } from "react";
import CommTextArea from "views/CommonComponent/CommTextArea";

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

const AddManageClasses = ({
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
  const [classesPlanOption, setClassesPlanOption] = useState([]);
  // console.log("fetchEditData>>", fetchEditData);

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    formik.resetForm();
  };

  useEffect(() => {
    getPlanData();
  }, [open, setOpen]);

  const getPlanData = () => {
    console.log("Get Data function>>");
    getPlans().then((res) => {
      setClassesPlanOption(
        res.data.plan?.map((item) => {
          return {
            value: item.id,
            text: item.planName,
          };
        })
      );
    });
  };
  const validationSchema = Yup.object().shape({
    eventName: Yup.string().required("Name is required"),
    Description: Yup.string().required("Description is required"),
    type: Yup.string(),
    isplan: Yup.boolean(),
  });

  const ClassesTypeOption = [
    {
      value: "special",
      text: "Special",
    },
    {
      value: "regular",
      text: "Regular",
    },
  ];

  const ClassesIsPlanOption = [
    { value: true, text: "Yes" },
    { value: false, text: "No" },
  ];
  let initialValues = {
    eventName: editMode ? fetchEditData.eventName : "",
    Description: editMode ? fetchEditData.Description : "",
    type: editMode ? fetchEditData.type : "",
    isplan: editMode ? fetchEditData.isplan : "",
    planId: editMode ? fetchEditData.planId : "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      // console.log("formData>>", formData);

      // make the post requiest to the server, pass value on the data
      let data = {
        eventName: values.eventName,
        Description: values.Description,
        type: values.type,
        isplan: values.isplan,
        planId: values.planId ? values.planId : null,
      };

      editMode
        ? updateClasses(fetchEditData.id, data).then((res) => {
            console.log("Update Response>>>", res);
            if (res.status === true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              setEditMode(false);
              values.eventName = "";
              values.Description = "";
              values.type = "";
              values.isplan = "";
              values.planId = "";
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
        : createClasses(data).then((res) => {
            console.log("Response Of Add Data>>>", res);
            if (res.status == true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              setEditMode(false);
              values.eventName = "";
              values.Description = "";
              values.type = "";
              values.isplan = "";
              values.planId = "";
              getData();
            }
            if (res.status === false) {
              setOpenSnackbar(true);
              setSnackbarSeverity("info");
              setSnackbarMessage(res.message);
              setEditMode(false);
              getData();
            }
          });
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
          {editMode === true ? "Edit Class" : "Add Class"}
        </BootstrapDialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Typography variant="h5">Event Name</Typography>
                <CommTextField
                  value={formik.values.eventName}
                  setValue={formik.handleChange}
                  type="text"
                  errorClass={
                    formik.touched.eventName && Boolean(formik.errors.eventName)
                  }
                  helperText={
                    formik.touched.eventName && formik.errors.eventName
                  }
                  name="eventName"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Description</Typography>
                <CommTextArea
                  value={formik.values.Description}
                  setValue={formik.handleChange}
                  errorClass={
                    formik.touched.Description &&
                    Boolean(formik.errors.Description)
                  }
                  minRows={3}
                  helperText={
                    formik.touched.Description && formik.errors.Description
                  }
                  name="Description"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Type</Typography>
                <CommSelect
                  value={formik.values.type}
                  setValue={formik.handleChange}
                  options={ClassesTypeOption}
                  name="type"
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h5">Is plan mandatory</Typography>
                <CommSelect
                  value={formik.values.isplan}
                  setValue={formik.handleChange}
                  options={ClassesIsPlanOption}
                  name="isplan"
                />
              </Grid>

              {formik.values.isplan ? (
                <Grid item xs={6}>
                  <Typography variant="h5">Choose Plan</Typography>
                  <CommSelect
                    value={formik.values.planId}
                    setValue={formik.handleChange}
                    options={classesPlanOption}
                    name="planId"
                  />
                </Grid>
              ) : null}
            </Grid>
          </DialogContent>
          <DialogActions>
          <CommButton
                title='Cancel'
                type='submit'
                handleClick={handleClose}
              />
            <CommButton title={editMode ? "Update" : "Save"} type="submit" />
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

export default AddManageClasses;
