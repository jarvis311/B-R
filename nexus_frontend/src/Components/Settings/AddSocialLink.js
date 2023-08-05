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
import CommSelect from "views/CommonComponent/CommSelect";
import CommLoader from "views/CommonComponent/CommLoader";

import { createSocialLinks, updateSocialLinks } from "Services/settingService";
import { useState } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AddSocialLink({
  open,
  setOpen,
  editMode = false,
  getSettingData,
  settingData,
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

  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    url: Yup.string().required("Status is required")
      .matches(
        /^(http|https):\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/,
        'Enter correct url!'
      ),
    status: Yup.string().required("Status is required"),
    icon: Yup.mixed()
      .nullable()
      .test(
        "FILE_FORMAT",
        "Uploaded file has unsupported format.",
        (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
      ),
  });

  const formik = useFormik({
    initialValues: {
      url: "",
      status: "",
      icon: "",
    },
    onSubmit: (values) => {
      setLoading(true)
      if (editMode) {
        updateSocialLinks(settingData.id, values).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            handleSnackbarOpen("success", res?.message);
            setOpen(false);
            getSettingData();
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
        createSocialLinks(values).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            handleSnackbarOpen("success", res?.message);
            setOpen(false);
            getSettingData();
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
    formik.setValues({ url: settingData.url, status: settingData.status });
  }, [settingData])

  const options = [
    { value: 1, text: "Active", },
    { value: 0, text: "Inactive", },
  ];

  return (
    <>
      {loading && <CommLoader />}

      <div className='add-user-dialog'>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby='customized-dialog-title'
          open={open}>

          <CommTitle
            onClose={handleClose}>
            {editMode === true ? "Edit Social Link" : "Add Social Link"}
          </CommTitle>

          <form onSubmit={formik.handleSubmit}>
            <DialogContent dividers>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <Typography variant='h5'>URL</Typography>
                  <CommTextField
                    value={formik.values.url}
                    setValue={formik.handleChange}
                    type='text'
                    errorClass={
                      formik.touched.url && Boolean(formik.errors.url)
                    }
                    helperText={
                      formik.touched.url && formik.errors.url
                    }
                    name='url'
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='h5'>Status</Typography>
                  <CommSelect
                    value={formik.values.status}
                    setValue={formik.handleChange}
                    options={options}
                    name={"status"}
                  />
                  <div>
                    {formik.touched.status && formik.errors.status ? (
                      <div className='errorclass'>{formik.errors.status}</div>
                    ) : null}
                  </div>
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
                    name='icon'
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
    </>
  );
}
