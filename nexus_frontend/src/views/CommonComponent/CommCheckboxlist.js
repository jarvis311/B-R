import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Grid, Paper } from "@mui/material";
import { Box } from "@mui/system";
import styled from "@emotion/styled";

export default function CommCheckboxlist({ setChecked, checked }) {
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <Grid container spacing={0.5} sx={{ width: "100%", bgcolor: "background.paper" }}>
      {[
        { day: "Monday", value: 1 },
        { day: "Tuesday", value: 2 },
        { day: "Wedesday", value: 3 },
        { day: "Thurday", value: 4 },
        { day: "Friday", value: 5 },
        { day: "Saturday", value: 6 },
        { day: "Sunday", value: 7 },
      ].map((value) => {
        const labelId = `checkbox-list-label-${value.day}`;
        return (
            <Grid item xs={3} sm={3} md={3} lg={3} key={value.day} disablePadding>
              <Item>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(value.value)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      value={value.value}
                      checked={checked.indexOf(value.value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      // onChange={(e) => console.log("targgte>>", e.target.value)}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${value.day}`} />
                </ListItemButton>
                </Item>
            </Grid>
        );
      })}
    </Grid>
  );
}
