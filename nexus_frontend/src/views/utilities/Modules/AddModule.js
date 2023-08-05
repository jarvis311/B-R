import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CommTextField from "views/CommonComponent/CommTextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import * as Yup from "yup";
import CommButton from "views/CommonComponent/CommButton";
import CommTitle from "views/CommonComponent/CommTitle";
import { addModule, updateModule } from "Services/moduleServices";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AddModule({
  open,
  setOpen,
  editMode = false,
  setLoading,
  getModuleData,
  moduleData,
  handleSnackbarOpen
}) {

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();

  };
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "image/svg+xml",
    "image/gif",
  ];
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    index: Yup.string().required("Index is required"),
    order: Yup.number("Order is required").required("Order is required"),
    icon: Yup.mixed()
      .nullable()
      .notRequired()
      .test(
        "FILE_FORMAT",
        "Uploaded file has unsupported format.",
        (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
      ),
  });


  const formik = useFormik({
    initialValues: {
      name: "",
      index: "",
      order: "",
      icon: "",
    },
    onSubmit: (values) => {
      setLoading(true)
      if (editMode) {
        updateModule(moduleData.id, values).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            handleSnackbarOpen("success", res?.message);
            setOpen(false);
            getModuleData();
            formik.resetForm();
          }
          else {
            handleSnackbarOpen("error", res?.message);
          }
        }).catch((err) => {
          handleSnackbarOpen("error", err?.message);
        })
      }
      else {
        addModule(values).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            handleSnackbarOpen("success", res?.message);
            setOpen(false);
            getModuleData();
            formik.resetForm();
          }
          else {
            handleSnackbarOpen("error", res?.message);
          }
        }).catch((err) => {
          handleSnackbarOpen("error", err?.message);
        })
      }
    },
    validationSchema,
  });

  useEffect(() => {
    formik.setValues({ name: moduleData.name, index: moduleData.index, order: moduleData.order });
  }, [moduleData])

  return (
    <div className='add-user-dialog'>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>

        <CommTitle
          onClose={handleClose}>
          {editMode === true ? "Edit Module" : "Add Module"}
        </CommTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <Typography variant='h5'>Name</Typography>
                <CommTextField
                  value={formik.values.name}
                  setValue={formik.handleChange}
                  type='text'
                  errorClass={
                    formik.touched.name && Boolean(formik.errors.name)
                  }
                  helperText={
                    formik.touched.name && formik.errors.name
                  }
                  name='name'
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h5'>Index</Typography>
                <CommTextField
                  value={formik.values.index}
                  setValue={formik.handleChange}
                  type='text'
                  errorClass={
                    formik.touched.index && Boolean(formik.errors.index)
                  }
                  helperText={formik.touched.index && formik.errors.index}
                  name='index'
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h5'>Order</Typography>
                <CommTextField
                  value={formik.values.order}
                  setValue={formik.handleChange}
                  type='number'
                  errorClass={
                    formik.touched.order && Boolean(formik.errors.order)
                  }
                  helperText={formik.touched.order && formik.errors.order}
                  name='order'
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h5'>Icon</Typography>
                <CommTextField
                  setValue={(e) =>
                    formik.setFieldValue("icon", e.currentTarget.files[0])
                  }
                  type='file'
                  errorClass={
                    formik.touched.icon && Boolean(formik.errors.icon)
                  }
                  helperText={formik.touched.icon && formik.errors.icon}
                  name='profile'
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
            <CommButton title={editMode ? 'Update' : 'Save'} type='submit' />
          </DialogActions>
        </form>
      </BootstrapDialog>

    </div>
  );
}
