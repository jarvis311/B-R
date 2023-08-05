import { Grid } from "@mui/material";
import React from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";


const CommDatePicker = ({ setSetDateValue, label,initialDate }) => {
  const [dateValue, setDateValue] = useState(initialDate);
  // console.log("value>>", dateValue.$d);

  const handleChange = (newValue) => {
    setDateValue(newValue.$d);
    setSetDateValue(newValue.$d);
  };
  return (
    <Grid sx={{mb:2, mt:1}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label={label}
          inputFormat="MM/DD/YYYY"
          value={dateValue}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Grid>
  );
};

export default CommDatePicker;
