
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import CommButton from "views/CommonComponent/CommButton";
import CommAlert from "views/CommonComponent/CommAlert";
import CommEditor from "views/CommonComponent/CommEditor";
import { EditorState } from "draft-js";
import { useEffect } from "react";
import CommTitle from "views/CommonComponent/CommTitle";
import CommTextField from "views/CommonComponent/CommTextField";
import CommRadio from "views/CommonComponent/CommRadio";
import '../Templates/template.css'
import * as Yup from "yup";
import CommLoader from "../../CommonComponent/CommLoader";
import { sendNewsLetters } from "Services/contactServices";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const SendMail = ({
  open,
  setOpen,
  fetchEditData,
  selectedRows
}) => {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [sendTo, setSendTo] = useState(1);
  const [bodyError, setBodyError] = useState("");
  const [editorState, setEditorState] = useState({ htmlValue: "", editorState: EditorState.createEmpty() });

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (editorState?.editorState?.getCurrentContent().hasText()) {
      setBodyError("");
    }
    else {

      setBodyError("Body is required");

    }
  }, [editorState])


  const validationSchema = Yup.object().shape({
    subject: Yup.string().required("Subject is required"),
  });

  const formik = useFormik({
    initialValues: {
      subject: ""
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      if (editorState?.editorState?.getCurrentContent().hasText()) {
        if (sendTo === '0' && (!selectedRows || selectedRows.length === 0)) {
          setOpenSnackbar(true);
          setSnackbarSeverity("info");
          setSnackbarMessage("No User Selected , Please select Users to send");
        }
        else {
          let data = {}
          data = {
            subject: formik.values.subject,
            body: editorState.htmlValue,
            users: []
          }

          let users = [];

          if (sendTo === '0') {
            for (let rows of selectedRows) {
              users = [...users, rows.id]
            }
            data.users = users;
          }
          else {
            data.users = [];
          }

          setLoading(true);

          sendNewsLetters(data).then((res) => {
            setLoading(false);
            setOpen(false);
            if (res.status === true) {
              setOpenSnackbar(true);
              setSnackbarSeverity("success");
              setSnackbarMessage(res.message);
              setEditorState({
                htmlValue: "",
                editorState: EditorState.createEmpty()
              })
              formik.resetForm();
            }
            else {
              setOpenSnackbar(true);
              setSnackbarSeverity("error");
              setSnackbarMessage(res.message);
            }
          }).catch((err) => {
            setOpenSnackbar(true);
            setSnackbarSeverity("error");
            setSnackbarMessage(err.message);
          })
        }
      }
    },
    validationSchema
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleSelect = (e) => {
    setSendTo(e.target.value)
  };

  return (
    <div className="add-user-dialog">
      {loading && <CommLoader />}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <CommTitle
          onClose={handleClose}>
          Send Mail
        </CommTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12}>
                <Typography variant="h5" p={1}>Subject</Typography>

                <CommTextField
                  value={formik.values.subject}
                  setValue={formik.handleChange}
                  type="text"
                  errorClass={
                    formik.touched.subject && Boolean(formik.errors.subject)
                  }
                  helperText={formik.touched.subject && formik.errors.subject}
                  name="subject"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" p={1}>Body</Typography>
                <CommEditor
                  description={editorState}
                  setDescription={setEditorState}
                />
                <p className="errorclass">{formik.touched.subject ? bodyError : ""}</p>

              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" p={1}>Send to </Typography>
                <CommRadio
                  value={sendTo}
                  setValue={handleSelect}
                  options={
                    [
                      { "value": "0", "key": "Send to Selected Users" },
                      { "value": "1", "key": "Send to All" },
                    ]
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <CommButton
              title={"Send"}
              type="submit"
            />
            <CommButton title='Cancel' handleClick={handleClose} />
          </DialogActions>
        </form>
      </BootstrapDialog>

      <CommAlert
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={2000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Top-Right"
      />
    </div>
  );
};

export default SendMail;
