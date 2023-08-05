import React, { useState, useEffect } from "react";
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
import CommSelect from "views/CommonComponent/CommSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import CommButton from "views/CommonComponent/CommButton";
import {
  AddUsersData,
  updateUsersData,
  GetRoleData,
} from "Services/apiServices";
import CommAlert from "views/CommonComponent/CommAlert";
import CommLoader from "../CommonComponent/CommLoader";
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
    <DialogTitle sx={{ m: 0, p: 2 }} {...other} className='add-user-title'>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
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

export default function AddUserData({
  open,
  setOpen,
  editMode = false,
  setEditMode,
  editData,
  editId,
  setRefreshPage,
}) {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    setLoading(true);
    GetRoleData()
      .then((res) => {
        const roles = [];
        res.data.roles.map((items) => {
          roles.push({
            value: items.id,
            text: items.name,
          });
        });
        setRoleOptions(roles);
        setLoading(false);
      })
      .catch((error) => {
        handleSnackbarOpen("success", error.message);
        setLoading(false);
      });
  }, []);

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  console.log("editDataeditDataeditData", editData);
  const options = [
    {
      value: 1,
      text: "Admin",
    },
    {
      value: 2,
      text: "User",
    },
    {
      value: 3,
      text: "Super Admin",
    },
  ];

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];
  let validationSchema = "";
  if (editMode) {
    validationSchema = Yup.object().shape({
      first_name: Yup.string().required("First Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      profile: Yup.mixed()
        .nullable()
        .notRequired()
        .test(
          "FILE_FORMAT",
          "Uploaded file has unsupported format.",
          (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
        ),
    });
  } else {
    validationSchema = Yup.object().shape({
      first_name: Yup.string().required("First Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must not exceed 40 characters"),
      profile: Yup.mixed()
        .nullable()
        .notRequired()
        .test(
          "FILE_FORMAT",
          "Uploaded file has unsupported format.",
          (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
        ),
      role_id: Yup.string().required("role is required"),
    });
  }

  console.log("editMode", editMode);
  const formik = useFormik({
    initialValues: {
      first_name: editMode === false ? "" : editData.first_name,
      last_name: editMode === false ? "" : editData.last_name,
      email: editMode === false ? "" : editData.email,
      password: editMode === false && "",
      profile: editMode === false ? "" : editData.profile_img,
      role_id: editMode === false ? "" : editData.role_id,
    },

    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      console.log("valuesvaluesvaluesvalues", values);
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      setLoading(true);
      if (editMode === false) {
        AddUsersData(formData)
          .then((res) => {
            console.log("respose og add data>>>", res);
            if (res.status === false) {
              setEditMode(false);
              handleSnackbarOpen("error", res.message);
              setLoading(false);
              setOpen(false);
            } else {
              setEditMode(false);
              setRefreshPage(true);
              handleSnackbarOpen("success", res.message);
              setLoading(false);
              setOpen(false);
            }
          })
          .catch((error) => {
            console.log("error", error);
            setOpen(false);
            setEditMode(false);
            handleSnackbarOpen("error", error.message);
            setLoading(false);
          });
        resetForm({ values: "" });
      } else {
        console.log("fdafhb sjdfhsuisdfh u");
        updateUsersData(editId, formData)
          .then((res) => {
            console.log("respose og add data>>>", res);
            if (res.status === false) {
              setEditMode(false);

              handleSnackbarOpen("error", res.data.message);
              setLoading(false);
              setOpen(false);
            } else {
              console.log("res.message", res.message);
              setEditMode(false);
              handleSnackbarOpen("success", res.message);
              setLoading(false);
              setRefreshPage(true);
              setOpen(false);
            }
          })
          .catch((error) => {
            console.log("error", error);
            setOpen(false);
            setEditMode(false);
            handleSnackbarOpen("error", error.message);
            setLoading(false);
          });
        resetForm({ values: "" });
      }
    },
    validationSchema,
  });

  return (
    <div className='add-user-dialog'>
      {loading && <CommLoader />}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}>
          {editMode === true ? "Edit User" : "Add User"}
        </BootstrapDialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <Typography variant='h5'>First Name</Typography>
                <CommTextField
                  value={formik.values.first_name}
                  setValue={formik.handleChange}
                  type='text'
                  errorClass={
                    formik.touched.first_name &&
                    Boolean(formik.errors.first_name)
                  }
                  helperText={
                    formik.touched.first_name && formik.errors.first_name
                  }
                  name='first_name'
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h5'>Last Name</Typography>
                <CommTextField
                  value={formik.values.last_name}
                  setValue={formik.handleChange}
                  type='text'
                  errorClass={
                    formik.touched.last_name && Boolean(formik.errors.last_name)
                  }
                  helperText={
                    formik.touched.last_name && formik.errors.last_name
                  }
                  name='last_name'
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h5'>Email Address</Typography>
                <CommTextField
                  value={formik.values.email}
                  setValue={formik.handleChange}
                  type='email'
                  errorClass={
                    formik.touched.email && Boolean(formik.errors.email)
                  }
                  helperText={formik.touched.email && formik.errors.email}
                  name='email'
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h5'>Password</Typography>
                <CommTextField
                  value={formik.values.password}
                  setValue={formik.handleChange}
                  type='password'
                  errorClass={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  name='password'
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant='h5'>Profile Image</Typography>
                <CommTextField
                  // value={formik.values.profile_img}
                  setValue={(e) =>
                    formik.setFieldValue("profile", e.currentTarget.files[0])
                  }
                  type='file'
                  errorClass={
                    formik.touched.profile && Boolean(formik.errors.profile)
                  }
                  helperText={formik.touched.profile && formik.errors.profile}
                  name='profile'
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant='h5'>User Role</Typography>

                <CommSelect
                  value={formik.values.role_id}
                  setValue={formik.handleChange}
                  options={roleOptions}
                  name={"role_id"}
                />
                <div>
                  {formik.touched.role_id && formik.errors.role_id ? (
                    <div className='errorclass'>{formik.errors.role_id}</div>
                  ) : null}
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <CommButton title='Cancel' handleClick={handleClose} />
            <CommButton
              title={editMode === true ? "Update" : "Save"}
              type='submit'
            />
          </DialogActions>
        </form>
      </BootstrapDialog>
      <CommAlert
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={10000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position='Top-Right'
      />
    </div>
  );
}
