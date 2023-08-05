import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CommTextField from "views/CommonComponent/CommTextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CommSelect from "views/CommonComponent/CommSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import CommButton from "views/CommonComponent/CommButton";
import CommTitle from "views/CommonComponent/CommTitle";
import { addMenu, updateMenu } from "Services/menuServices";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AddMenu({
  open,
  setOpen,
  editMode = false,
  setLoading,
  getMenuData,
  menuData,
  rows,
  handleSnackbarOpen,
}) {
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    slug: Yup.string().required("Slug is required"),
    order: Yup.number("Order is required").required("Order is required"),
    status: Yup.string().required("Status is required"),
  });

  const options = [
    { value: 1, text: "Active" },
    { value: 0, text: "Inactive" },
  ];

  const [menuOptions, setMenuOptions] = useState([]);

  useEffect(() => {
    setMenuOptions(
      rows.map((menu) => {
        return {
          text: menu.title,
          value: menu.id,
        };
      })
    );
  }, [rows]);

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      order: "",
      status: "",
      menu_id: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      if (editMode) {
        updateMenu(menuData.id, values)
          .then((res) => {
            setLoading(false);
            if (res && res.status === true) {
              handleSnackbarOpen("success", res?.message);
              setOpen(false);
              getMenuData();
              formik.resetForm();
            } else {
              handleSnackbarOpen("error", res?.message);
            }
          })
          .catch((err) => {
            handleSnackbarOpen("error", err?.message);
          });
      } else {
        addMenu(values)
          .then((res) => {
            setLoading(false);
            if (res && res.status === true) {
              handleSnackbarOpen("success", res?.message);
              setOpen(false);
              getMenuData();
              formik.resetForm();
            } else {
              handleSnackbarOpen("error", res?.message);
            }
          })
          .catch((err) => {
            handleSnackbarOpen("error", err?.message);
          });
      }
    },
    validationSchema,
  });

  useEffect(() => {
    formik.setValues({
      title: menuData.title,
      slug: menuData.slug,
      order: menuData.order,
      status: menuData.status,
      menu_id: menuData.menu_id,
    });
  }, [menuData]);

  return (
    <div className="add-user-dialog">
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <CommTitle onClose={handleClose}>
          {editMode === true ? "Edit Menu" : "Add Menu"}
        </CommTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Typography variant="h5">Title</Typography>
                <CommTextField
                  value={formik.values.title}
                  setValue={formik.handleChange}
                  type="text"
                  errorClass={
                    formik.touched.title && Boolean(formik.errors.title)
                  }
                  helperText={formik.touched.title && formik.errors.title}
                  name="title"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Slug</Typography>
                <CommTextField
                  value={formik.values.slug}
                  setValue={formik.handleChange}
                  type="text"
                  errorClass={
                    formik.touched.slug && Boolean(formik.errors.slug)
                  }
                  helperText={formik.touched.slug && formik.errors.slug}
                  name="slug"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Order</Typography>
                <CommTextField
                  value={formik.values.order}
                  setValue={formik.handleChange}
                  type="number"
                  errorClass={
                    formik.touched.order && Boolean(formik.errors.order)
                  }
                  helperText={formik.touched.order && formik.errors.order}
                  name="order"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Status</Typography>

                <CommSelect
                  value={formik.values.status}
                  setValue={formik.handleChange}
                  options={options}
                  name={"status"}
                />
                <div>
                  {formik.touched.status && formik.errors.status ? (
                    <div className="errorclass">{formik.errors.status}</div>
                  ) : null}
                </div>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Menu</Typography>
                <CommSelect
                  value={formik.values.menu_id}
                  setValue={formik.handleChange}
                  options={menuOptions}
                  name={"menu_id"}
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
            <CommButton
              title={editMode ? "Edit Menu" : "Add Menu"}
              type="submit"
            />
          </DialogActions>
        </form>
      </BootstrapDialog>
    </div>
  );
}
