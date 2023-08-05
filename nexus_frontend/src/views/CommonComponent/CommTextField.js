import React from "react";
import TextField from "@mui/material/TextField";

import OutlinedInput from "@mui/material/OutlinedInput";

const CommTextField = ({
  value,
  setValue,
  placeHolder,
  type,
  errorClass,
  helperText,
  name,
  maxRows,
  rows,
  multiline,
  inputProps,
}) => {
  
  // console.log("valuevaluevaluevaluevalue", value);
  return (
    <div>
      <TextField
        fullWidth
        required
        name={name}
        value={value}
        type={type}
        onChange={setValue}
        error={errorClass}
        helperText={helperText}
        id={name}
        multiline={multiline}
        rows={rows}
        inputProps={inputProps}
      />
      {/*<OutlinedInput
        sx={{ pr: 1, pl: 2, my: 2 }}
        id='input-search-profile'
        value={value}
        onChange={setValue}
        placeholder={placeHolder}
        aria-describedby='search-helper-text'
        inputProps={{
          "aria-label": "weight",
        }}
        type={type}
        fullWidth
      />*/}
    </div>
  );
};

export default CommTextField;
