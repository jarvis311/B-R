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
import { Switch } from "@mui/material";
import { useEffect } from "react";

import {
  addCustomer,
  getCustomer,
  updateCustomer,
} from "Services/customerService";

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

const AddCustomer = ({
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
  const [customerOption, setCustomerOption] = useState("");

  // console.log("fetchEditData>>", fetchEditData);
  const [active, setActive] = useState("");
  const [isBlock, setIsBlock] = useState(false);

  const handleToggle = (params) => {
    setActive(!active);
    setIsBlock(!active);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    formik.resetForm();
  };

  useEffect(() => {
    getCustomerData();
  }, [open, setOpen]);

  const getCustomerData = () => {
    getCustomer().then((res) => {
      setCustomerOption(
        res.data.customer?.map((item) => {
          return {
            value: item.id,
            text: item.firstName,
          };
        })
      );
    });
  };
  
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Firstname is required"),
    lastName: Yup.string().required("Lastname  is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string("Password is required"),
  });

  let initialValues = {
    firstName: editMode ? fetchEditData.firstName : "",
    lastName: editMode ? fetchEditData.lastName : "",
    email: editMode ? fetchEditData.email : "",
    password: editMode ? fetchEditData.password : "",
    phone: editMode ? fetchEditData.phone : "",
    isBlock: editMode ? fetchEditData.isBlock : "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      let data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        isBlock: isBlock,
      };

      editMode
        ? updateCustomer(fetchEditData.id, data).then((res) => {
            console.log("Update Response>>>", res);
            if (res.status === true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              setEditMode(false);
              values.firstName = "";
              values.lastName = "";
              values.email = "";
              values.password = "";
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
        : addCustomer(data).then((res) => {
            console.log("Response Of Add Data>>>", res);
            if (res.status == true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              setEditMode(false);
              values.firstName = "";
              values.lastName = "";
              values.email = "";
              values.password = "";
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
          {editMode === true ? "Edit Customer" : "Add Customer"}
        </BootstrapDialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Typography variant="h5">First Name</Typography>
                <CommTextField
                  value={formik.values.firstName}
                  setValue={formik.handleChange}
                  type="text"
                  errorClass={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  name="firstName"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Last Name</Typography>
                <CommTextField
                  value={formik.values.lastName}
                  setValue={formik.handleChange}
                  errorClass={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  type="text"
                  minRows={3}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  name="lastName"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Email</Typography>
                <CommTextField
                  value={formik.values.email}
                  setValue={formik.handleChange}
                  errorClass={
                    formik.touched.email && Boolean(formik.errors.email)
                  }
                  type="text"
                  minRows={3}
                  helperText={formik.touched.email && formik.errors.email}
                  name="email"
                />
              </Grid>
              {!editMode && (
                <Grid item xs={6}>
                  <Typography variant="h5">Password</Typography>
                  <CommTextField
                    value={formik.values.password}
                    setValue={formik.handleChange}
                    errorClass={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    type="password"
                    minRows={3}
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    name="password"
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <Typography variant="h5">Phone Number</Typography>
                <CommTextField
                  value={formik.values.phone}
                  setValue={formik.handleChange}
                  errorClass={
                    formik.touched.phone && Boolean(formik.errors.phone)
                  }
                  type="text"
                  minRows={3}
                  helperText={formik.touched.phone && formik.errors.phone}
                  name="phone"
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h5">Is Block</Typography>
                <Switch
                  checked={active}
                  onClick={handleToggle}
                  value={active}
                  inputProps={{
                    "aria-label": "secondary checkbox",
                  }}
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

export default AddCustomer;
