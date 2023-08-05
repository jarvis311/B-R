import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
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
import { createSetting, updateSetting } from "Services/settingService";
import CommAlert from "views/CommonComponent/CommAlert";

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

const AddSetting = ({
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

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    formik.resetForm()
  };

  const validationSchema = Yup.object().shape({
    key: Yup.string().required("Name is required"),
    value: Yup.string().required("Value is required"),
  });

  // console.log("editMode>>>", editMode);
  let initialValues = {
    key: editMode ? fetchEditData.key : "",
    value: editMode ? fetchEditData.value : "",
  };
  console.log("initialValue>>>", initialValues);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      // console.log("formData >>", formData);
      // make the post requiest to the server, pass value on the data
      editMode
        ? updateSetting(fetchEditData.id, values).then((res) => {
            console.log("Update Response>>>", res);
            if (res.status === true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              setEditMode(false);
              values.key = "";
              values.value = "";
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
        : createSetting(values)
            .then((res) => {
              console.log("Response Of Add Data>>>", res);
              if (res.status === true) {
                setOpenSnackbar(true);
                setSnackbarSeverity("success");
                setSnackbarMessage(res.message);
                setEditMode(false);
                values.key = "";
                values.value = "";
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
            .catch(() => {
              setOpenSnackbar(true);
              setSnackbarSeverity("error");
              setSnackbarMessage("Something went wrong!!");
            });
      // console.log("Form Add setting value >>", values);
      setOpen(false);
    },
    validationSchema,
  });
  // console.log("first", formik.values);
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
          {editMode === true ? "Edit Setting" : "Add Setting"}
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
                  value={formik.values.key}
                  setValue={formik.handleChange}
                  type="text"
                  errorClass={formik.touched.key && Boolean(formik.errors.key)}
                  helperText={formik.touched.key && formik.errors.key}
                  name="key"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Value</Typography>
                <CommTextField
                  value={formik.values.value}
                  setValue={formik.handleChange}
                  type="text"
                  errorClass={
                    formik.touched.value && Boolean(formik.errors.value)
                  }
                  helperText={formik.touched.value && formik.errors.value}
                  name="value"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
          <CommButton
                title='Cancel'
                type='submit'
                handleClick={handleClose}
              />
            <CommButton
              title={editMode ? "Edit Setting" : "Save"}
              type="submit"
            />
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

export default AddSetting;
