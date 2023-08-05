
import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import CommButton from "views/CommonComponent/CommButton";
import { updateEmailSetting } from "Services/settingService";
import CommAlert from "views/CommonComponent/CommAlert";
import CommEditor from "views/CommonComponent/CommEditor";
import { ContentState, EditorState } from "draft-js";
import '../../views/utilities/Templates/template.css'
import CommTextField from "views/CommonComponent/CommTextField";
import htmlToDraft from 'html-to-draftjs';
import { useEffect } from "react";

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

const AddEmailSetting = ({
  open,
  setOpen,
  fetchEditData,
  getData,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );
  const handleClose = () => {
    setOpen(false);
  };

  let initialValues = {
    value: fetchEditData.value ? fetchEditData.value : "",
  };

  useEffect(() => {
    if (fetchEditData.key === "header" || fetchEditData.key === "footer") {
      if (fetchEditData.value) {
        const blocksFromHTML = htmlToDraft(fetchEditData.value);
        const content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks);
        const editorStateInHtml = fetchEditData.value;

        setEditorState({
          htmlValue: editorStateInHtml,
          editorState: EditorState.createWithContent(content),
        })
      }
      else{
        setEditorState({
          htmlValue: '',
          editorState:EditorState.createEmpty(),
        })
      }

    }
  }, [fetchEditData])

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      let tempate = {}
      if (fetchEditData.key === "header" || fetchEditData.key === "footer") {

        tempate = {
          key: fetchEditData.key,
          value: editorState.htmlValue
        }
      }
      else {
        tempate = {
          key: fetchEditData.key,
          value: formik.values.value
        }
      }
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      updateEmailSetting(fetchEditData.id, tempate).then((res) => {
        if (res.status === true) {
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage(res.message);
          values.key = "";
          values.value = "";
          getData();
        }
        else {
          setOpenSnackbar(true);
          setSnackbarSeverity("info");
          setSnackbarMessage(res.message);
          getData();
        }
      })

      setOpen(false);
    },
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
          Edit Setting
        </BootstrapDialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12}>
                <Typography variant="h5" p={1}>Value</Typography>
                {(fetchEditData.key === "header" || fetchEditData.key === "footer") ?
                  <CommEditor
                    description={editorState}
                    setDescription={setEditorState}
                  />
                  :
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
                }
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <CommButton
              title={"Update"}
              type="submit"
            />
            <CommButton title='Cancel' handleClick={handleClose} />
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

export default AddEmailSetting;
