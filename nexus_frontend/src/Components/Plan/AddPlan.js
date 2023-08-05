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
import { createPlan, updatePlan } from "Services/planService";
import CommEditor from "views/CommonComponent/CommEditor";
import CommSelect from "views/CommonComponent/CommSelect";
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

const AddPlan = ({
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
  const [featureDescription, setFeatureDescription] = useState("");

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    formik.resetForm();
  };

  const validationSchema = Yup.object().shape({
    planName: Yup.string().required("Name is required"),
    planPrice: Yup.string().required("Price is required"),
    planfeature: editMode && Yup.string(),
    credits: editMode && Yup.number(),
    description: editMode && Yup.string(),
  });

  const planOfferByOption = [
    {
      value: "C",
      text: "Credit",
    },
    {
      value: "D",
      text: "Date",
    },
  ];

  let sDate;
  let eDate;
  if (fetchEditData.startingDate && fetchEditData.endingDate) {
    sDate = fetchEditData.startingDate.split("T")[0];
    eDate = fetchEditData.endingDate.split("T")[0];
  }
  let initialValues = {
    planName: editMode ? fetchEditData.planName : "",
    planPrice: editMode ? fetchEditData.planPrice : "",
    description: editMode ? fetchEditData.description : "",
    offerBy: editMode ? fetchEditData.offerBy : "",
    credits: editMode ? fetchEditData.credits : "",
    startingDate: editMode ? sDate : "",
    endingDate: editMode ? eDate : "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      console.log("formData>>", formData);

      // make the post requiest to the server, pass value on the data
      let data = {
        planName: values.planName,
        planPrice: values.planPrice,
        description: values.description,
        features: featureDescription.htmlValue,
        offerBy: values.offerBy,
        credits: values.credits ? values.credits : null,
        startingDate: values.startingDate ? values.startingDate : null,
        endingDate: values.endingDate ? values.endingDate : null,
      };

      editMode
        ? updatePlan(fetchEditData.id, data).then((res) => {
            console.log("Update Response>>>", res);
            if (res.status === true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              setEditMode(false);
              values.planName = "";
              values.planPrice = "";
              featureDescription = "";
              values.description = "";
              values.offerBy = "";
              values.credits = "";
              values.startingDate = "";
              values.endingDate = "";
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
        : createPlan(data).then((res) => {
            console.log("Response Of Add Data>>>", res);
            if (res.status == true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              setEditMode(false);
              values.planName = "";
              values.planPrice = "";
              featureDescription = "";
              values.description = "";
              values.offerBy = "";
              values.credits = "";
              values.startingDate = "";
              values.endingDate = "";
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
      // console.log("initialValues2>>>", initialValues);
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
          {editMode === true ? "Edit Plan" : "Add Plan"}
        </BootstrapDialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Typography variant="h5">Name</Typography>
                <CommTextField
                  value={formik.values.planName}
                  setValue={formik.handleChange}
                  type="text"
                  errorClass={
                    formik.touched.planName && Boolean(formik.errors.planName)
                  }
                  helperText={formik.touched.planName && formik.errors.planName}
                  name="planName"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Price</Typography>
                <CommTextField
                  value={formik.values.planPrice}
                  setValue={formik.handleChange}
                  type="number"
                  errorClass={
                    formik.touched.planPrice && Boolean(formik.errors.planPrice)
                  }
                  helperText={
                    formik.touched.planPrice && formik.errors.planPrice
                  }
                  name="planPrice"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Description</Typography>
                <CommTextArea
                  value={formik.values.description}
                  setValue={formik.handleChange}
                  minRows={3}
                  errorClass={
                    formik.touched.planPrice &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.planPrice && formik.errors.description
                  }
                  name="description"
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h5">Offer By</Typography>
                <CommSelect
                  value={formik.values.offerBy}
                  setValue={formik.handleChange}
                  options={planOfferByOption}
                  name="offerBy"
                />
              </Grid>
              {(formik.values.offerBy || fetchEditData.offerBy) === "C" && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h5">credits</Typography>
                    <CommTextField
                      value={formik.values.credits}
                      setValue={formik.handleChange}
                      type="number"
                      errorClass={
                        formik.touched.planPrice &&
                        Boolean(formik.errors.credits)
                      }
                      helperText={
                        formik.touched.planPrice && formik.errors.credits
                      }
                      name="credits"
                    />
                  </Grid>
                </>
              )}

              {(formik.values.offerBy || fetchEditData.offerBy) === "D" && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="h5">Starting Date</Typography>
                    <CommTextField
                      value={formik.values.startingDate}
                      setValue={formik.handleChange}
                      type="date"
                      errorClass={
                        formik.touched.planPrice &&
                        Boolean(formik.errors.startingDate)
                      }
                      helperText={
                        formik.touched.planPrice && formik.errors.startingDate
                      }
                      name="startingDate"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="h5">Ending Date</Typography>
                    <CommTextField
                      value={formik.values.endingDate}
                      setValue={formik.handleChange}
                      type="date"
                      errorClass={
                        formik.touched.planPrice &&
                        Boolean(formik.errors.endingDate)
                      }
                      helperText={
                        formik.touched.planPrice && formik.errors.endingDate
                      }
                      name="endingDate"
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Typography variant="h5">Feature</Typography>
                <CommEditor
                  description={featureDescription}
                  setDescription={setFeatureDescription}
                  editMode={editMode}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <CommButton
              title="Cancel"
              type="submit"
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

export default AddPlan;
