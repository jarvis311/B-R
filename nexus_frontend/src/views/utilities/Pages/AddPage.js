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
import { createPage, updatePage } from "Services/pageServices";
import { deleteBanner, getMenus } from "Services/menuServices";
import { IconTrash } from "@tabler/icons";
import './page.css'
import CommDialog from "views/CommonComponent/CommDialog";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AddPage({
  open,
  setOpen,
  editMode = false,
  setLoading,
  getPageData,
  pageData,
  handleSnackbarOpen,
}) {

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    short_description: Yup.string().required("Short Description is required"),
    long_description: Yup.string().required("Long Description is required"),
    menu_id: Yup.number("Order is required").required("Menu is required"),
    status: Yup.string().required("Status is required"),
  });

  const options = [
    { value: 1, text: "Active", },
    { value: 0, text: "Inactive", },
  ];
  const [menuOptions, setMenuOptions] = useState([]);
  const [pagedetail, setpagedetail] = useState({});
  const [banners, setBanners] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const getMenuData = () => {
    setLoading(true);
    getMenus().then((data) => {
      setLoading(false);
      if (data && data.data) {
        setMenuOptions(
          data.data.menus.map((menu) => {
            return {
              text: menu.title,
              value: menu.id
            }
          })
        )
      }
    })
  }
  useEffect(() => {
    setImagePreviews([])
  }, [open])

  useEffect(() => {
    getMenuData();
  }, [])

  const deleteRecordhandler = () => {
    setOpenConfirm(false);
    deleteBanner(deleteId).then(async(res) => {
      if (res && res.status === true) {
        handleSnackbarOpen("success", res.message);
        setImagePreviews(imagePreviews.filter(image=>image.id!==deleteId))
        setpagedetail(pagedetail.filter(image=>image.id!==deleteId))
      }
      else {
        handleSnackbarOpen("error", res?.message);
      }
    }).catch((err) => {
      handleSnackbarOpen("error", err?.message);
    })
  };

  const handlefileChange = (files) => {
    setBanners(files)
    let images = [];
    if (pagedetail) {
      for (let banner of pagedetail) {
        images.push({ id: banner.id, name: banner.name });
      }
    }
    for (let i = 0; i < files.length; i++) {
      images.push({ name: URL.createObjectURL(files[i]) });
    }
    setImagePreviews(images);
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      short_description: "",
      long_description: "",
      status: "",
      menu_id: ""
    },
    onSubmit: (values) => {
      setLoading(true)
      const formData = new FormData();

      for (let key in values) {
        formData.append(key, values[key]);
      }

      if (banners) {
        for (let i = 0; i < banners.length; i++) {
          formData.append("banner", banners[i]);
        }
      }

      if (editMode) {
        updatePage(pageData.id, formData).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            handleSnackbarOpen("success", res?.message);
            setOpen(false);
            getPageData();
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
        createPage(formData).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            handleSnackbarOpen("success", res?.message);
            setOpen(false);
            getPageData();
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
  
  const deleteHandler = (id) => {
    setOpenConfirm(true);
    setDeleteId(id);
  }

  useEffect(() => {
    setpagedetail(pageData.banners)
    if (pageData.banners) {
      let images = [];
      for (let banner of pageData.banners) {
        images.push({ id: banner.id, name: banner.name });
      }
      setImagePreviews(images);
    }
    formik.setValues({ title: pageData.title, short_description: pageData.short_description, long_description: pageData.long_description, status: pageData.status ? pageData.status : '', menu_id: pageData.menu_id ? pageData.menu_id : '' });
  }, [pageData])

  return (
    <div className='add-user-dialog'>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>

        <CommTitle
          onClose={handleClose}>
          {editMode === true ? "Edit Page" : "Add Page"}
        </CommTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12}>
                <Typography variant='h5'>Title</Typography>
                <CommTextField
                  value={formik.values.title}
                  setValue={formik.handleChange}
                  type='text'
                  errorClass={
                    formik.touched.title && Boolean(formik.errors.title)
                  }
                  helperText={
                    formik.touched.title && formik.errors.title
                  }
                  name='title'
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5'>Sort Description</Typography>
                <CommTextField
                  maxRows={2}
                  multiline={true}
                  rows={2}
                  value={formik.values.short_description}
                  setValue={formik.handleChange}
                  type='text'
                  errorClass={
                    formik.touched.short_description && Boolean(formik.errors.short_description)
                  }
                  helperText={formik.touched.short_description && formik.errors.short_description}
                  name='short_description'
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5'>Long Description</Typography>
                <CommTextField
                  maxRows={4}
                  multiline={true}
                  rows={4}
                  value={formik.values.long_description}
                  setValue={formik.handleChange}
                  type='text'
                  errorClass={
                    formik.touched.long_description && Boolean(formik.errors.long_description)
                  }
                  helperText={formik.touched.long_description && formik.errors.long_description}
                  name='long_description'
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
                <Typography variant='h5'>Menu</Typography>
                <CommSelect
                  value={formik.values.menu_id}
                  setValue={formik.handleChange}
                  options={menuOptions}
                  name={"menu_id"}
                />
                <div>
                  {formik.touched.menu_id && formik.errors.menu_id ? (
                    <div className='errorclass'>{formik.errors.menu_id}</div>
                  ) : null}
                </div>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5'>Banner</Typography>
                <CommTextField
                  setValue={(e) =>
                    handlefileChange(
                      e.target.files
                    )
                  }
                  type='file'
                  errorClass={
                    formik.touched.profile_img &&
                    Boolean(formik.errors.profile_img)
                  }
                  helperText={
                    formik.touched.profile_img && formik.errors.profile_img
                  }
                  name='profile_img'
                  inputProps={{
                    multiple: true
                  }}
                />
              </Grid>
              {imagePreviews && (
                imagePreviews.map((img, i) => {
                  return (
                    <Grid item md={4} className="previewContainer">
                      <img className="previewImage" src={img.name} alt={"image-" + i} key={i} />
                      {img.id && <IconTrash className="trashIcon" onClick={() => deleteHandler(img.id)} />}
                    </Grid>
                  );
                })
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
          <CommButton
                title='Cancel'
                type='submit'
                handleClick={handleClose}
              />
            <CommButton title={editMode ? 'Edit Page' : 'Add Page'} type='submit' />
          </DialogActions>
          <CommDialog
            setOpenConfirm={setOpenConfirm}
            openConfirm={openConfirm}
            deleteRecordhandler={deleteRecordhandler}
          />
        </form>
      </BootstrapDialog>
    </div>
  );
}
