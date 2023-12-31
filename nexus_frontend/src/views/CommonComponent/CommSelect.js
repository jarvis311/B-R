import React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function CommSelect({ value, setValue, options, name }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={value}
          onChange={setValue}
          helperText="jwegsufyv"
          name={name}>
          {options.map((items) => {
           return <MenuItem value={items.value} key={items.value}>{items.text}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
