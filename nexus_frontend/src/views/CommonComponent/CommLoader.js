import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: "rgba(0,0,0,0.3)",
    zIndex: 99999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function KenLoader() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}
