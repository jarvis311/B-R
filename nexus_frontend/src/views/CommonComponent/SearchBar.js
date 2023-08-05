import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { IconSearch } from "@tabler/icons";
import { useTheme } from "@mui/material/styles";

const SearchBar = ({ value, setValue, placeHolder }) => {
  const theme = useTheme();
  return (
    <div>
      <OutlinedInput
        sx={{ pr: 1, pl: 2, my: 2 }}
        id='input-search-profile'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeHolder}
        startAdornment={
          <InputAdornment position='start'>
            <IconSearch
              stroke={1.5}
              size='1rem'
              color={theme.palette.grey[500]}
            />
          </InputAdornment>
        }
        aria-describedby='search-helper-text'
        inputProps={{
          "aria-label": "weight",
        }}
      />
    </div>
  );
};

export default SearchBar;
