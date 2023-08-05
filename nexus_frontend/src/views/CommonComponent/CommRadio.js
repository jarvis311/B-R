import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";

export default function CommRadio({ value, setValue, options = [] }) {
  return (
    <RadioGroup
      row
      aria-labelledby="demo-row-radio-buttons-group-label"
      name="row-radio-buttons-group"
      onChange={setValue}
      sx={{ padding: 1 }}
      value={value}
    >
      {
        options?.map((items) => {
          return <FormControlLabel value={items.value} key={items.value} control={<Radio />} label={items.key} />
        })
      }

    </RadioGroup>
  );
}
