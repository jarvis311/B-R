import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const BootstrapButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  padding: "11px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#0063cc",
  borderColor: "#0063cc",

  float: "right",

  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0062cc",
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "#005cbf",
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
});
const CommButton = ({ title, handleClick, type = "button" }) => {
  if (title !== "Cancel") {
    return (
      <BootstrapButton
        variant={"contained"}
        type={type}
        disableRipple
        onClick={handleClick}>
        {title}
      </BootstrapButton>
    );
  } else {
    return (
      <Button
        variant='outlined'
        type={type}
        disableRipple
        onClick={handleClick}
        className='Cancel-btn'>
        {title}
      </Button>
    );
  }
};

export default CommButton;
