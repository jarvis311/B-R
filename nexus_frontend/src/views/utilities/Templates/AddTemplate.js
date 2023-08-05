import React, { useEffect, useState } from 'react'
import { Card, CardActions, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material';
import CommButton from 'views/CommonComponent/CommButton';
import { useNavigate, useParams } from 'react-router';
import { addTemplate, getTemplateDetail, updateTemplate } from 'Services/templateServices';
import CommLoader from "../../CommonComponent/CommLoader";
import CommTextField from 'views/CommonComponent/CommTextField';
import { useFormik } from 'formik';
import * as Yup from "yup";
import CommAlert from 'views/CommonComponent/CommAlert';
import CommBreadCrum from 'views/CommonComponent/CommBreadCrum';
import { Link } from 'react-router-dom';
import CommEditor from 'views/CommonComponent/CommEditor';
import { EditorState, ContentState } from 'draft-js'
import "./template.css";
import "../user.css";
import htmlToDraft from 'html-to-draftjs';

const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
};

const AddTemplate = ({ editMode }) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    subject: Yup.string().required("Subject is required"),
  });
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      subject: "",
    },
    onSubmit: (values) => {
      setLoading(true)
      let tempate = {
        name: values.name,
        subject: values.subject,
        body: editorState.htmlValue
      }
      if (editMode) {
        updateTemplate(params.id, tempate).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            handleSnackbarOpen("success", res?.message);
          }
          else {
            handleSnackbarOpen("error", res?.message);
          }
        }).catch((err) => {
          setLoading(false);
          handleSnackbarOpen("error", err?.message);
        })
      }
      else {
        addTemplate(tempate).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            handleSnackbarOpen("success", res?.message);
            setEditorState({
              htmlValue: "",
              editorState: EditorState.createEmpty()
            })
            formik.resetForm();
          }
          else {
            handleSnackbarOpen("error", res?.message);
          }
        }).catch((err) => {
          setLoading(false);
          handleSnackbarOpen("error", err?.message);
        })
      }
    },
    validationSchema,
  });

  useEffect(() => {
    if (editMode && params.id) {
      getTemplateDetail(params.id).then(res => {
        if (res.status === true && res.data) {
          formik.setValues({ name: res.data.name, subject: res.data.subject });
          const editorStateInHtml = res.data.body;
          const blocksFromHTML = htmlToDraft(res.data.body);
          const content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks);
          setEditorState({
            htmlValue: editorStateInHtml,
            editorState: EditorState.createWithContent(content),
          })
        }
      })
    }
  }, [editMode,params.id])

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/templates")
  }

  const breadcrumbs = [
    <Link
      underline='hover'
      key='1'
      color='inherit'
      to='/'>
      Dashboard
    </Link>,
    <Link underline='hover' to='/templates' key='2' color='text.primary' aria-current='page'>
      Email Templates
    </Link>,
    <Link underline='hover' to='' key='2' color='text.primary' aria-current='page'>
      {editMode ? "Edit Template" : "Add Template"}
    </Link>
  ];

  return (
    <>
      {loading && <CommLoader />}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CommBreadCrum breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item xs={12}>
          <Card title="">
            <form onSubmit={formik.handleSubmit}>
              <CardHeader sx={headerSX} title={<Typography variant="h3">{editMode ? "Edit Template" : "Add Template"}</Typography>} />
              <Divider />
              <CardContent>
                <Grid container rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                  <Grid item xs={12} md={6}>
                    <Typography variant='h5' p={1}>Name</Typography>
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
                  <Grid item xs={12} md={6}>
                    <Typography variant='h5' p={1}>Subject</Typography>
                    <CommTextField
                      value={formik.values.subject}
                      setValue={formik.handleChange}
                      type='text'
                      errorClass={
                        formik.touched.subject && Boolean(formik.errors.subject)
                      }
                      helperText={
                        formik.touched.subject && formik.errors.subject
                      }
                      name='subject'
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <Typography variant='h5' p={1}>Body</Typography>
                    <CommEditor
                      description={editorState}
                      setDescription={setEditorState}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions>
                <CommButton
                  title={editMode ? "Update" : "Save"}
                  type='submit'
                />
                <CommButton title='Cancel' handleClick={handleCancel} />
              </CardActions>
            </form>
          </Card>
          <CommAlert
            message={snackbarMessage}
            severity={snackbarSeverity}
            autoHideDuration={10000}
            open={openSnackbar}
            handleSnackbarClose={handleSnackbarClose}
            position='Top-Right'
          />
        </Grid>
      </Grid>
    </>
  )
}

export default AddTemplate