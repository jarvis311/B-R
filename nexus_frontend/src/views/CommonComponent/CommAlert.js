import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import "./Snackbar.css";
import CheckIcon from "@mui/icons-material/Check";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export default function CommAlert(props) {
  // const [open, setOpen] = React.useState(false);
  const {
    message,
    severity,
    autoHideDuration,
    open,
    handleSnackbarClose,
    position,
  } = props;
  const [snackbarPosition, setSnackbarPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });

  // severity options = error, warning, info, success"
  // position options  = Top-Center, Top-Right, Bottom-Right, Bottom-Center, Bottom-Left,Top-Left

  useEffect(() => {
    switch (position) {
      case "Top-Center":
        return setSnackbarPosition({ vertical: "top", horizontal: "center" });
      case "Top-Right":
        return setSnackbarPosition({ vertical: "top", horizontal: "right" });
      case "Top-Left":
        return setSnackbarPosition({ vertical: "top", horizontal: "left" });
      case "Bottom-Center":
        return setSnackbarPosition({
          vertical: "bottom",
          horizontal: "center",
        });
      case "Bottom-Right":
        return setSnackbarPosition({ vertical: "bottom", horizontal: "right" });
      case "Bottom-Left":
        return setSnackbarPosition({ vertical: "bottom", horizontal: "left" });

      default:
        return setSnackbarPosition({
          vertical: "bottom",
          horizontal: "center",
        });
    }
  }, [position]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration || 10000}
      anchorOrigin={snackbarPosition}
      onClose={handleSnackbarClose}
      className='snackbar-div'>
      <Alert
        onClose={handleSnackbarClose}
        severity={severity}
        sx={{ width: "100%" }}
        action={
          <Button
            color='inherit'
            onClick={handleSnackbarClose}
            className='closeButton'
            size='small'>
            Close
          </Button>
        }
        icon={<CheckIcon fontSize='inherit' />}>
        {message}
      </Alert>
    </Snackbar>
  );
}
