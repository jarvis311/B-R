import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const CommCard = ({ palnName, palnPrice }) => {
  return (
    <Grid
      xs={4}
      sx={{ display: "flex", justifyContent: "center", marginRight: "-8rem" }}
    >
      <Card
        sx={{
          minWidth: 275,
          // width: "50%",
          textAlign: "center",
          border: "1px solid gray",
          margin: "1rem",
        }}s
      >
        <CardContent>
          <div className="card-header" style={{ width: "100%" }}>
            <Typography
              sx={{ mb: 1.5, fontSize: "1.8rem" }}
              color="#4caf50"
              gutterBottom
              fontWeight={500}
            >
              {palnName}
            </Typography>
            <div>
              <Typography variant="h1" component="div">
                ${palnPrice}/Mo
              </Typography>

              <Typography variant="body2">
                Standard
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </div>
          </div>
          <hr />
          <div>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary="Chelsea Otakan usdgfu iy sduf wet u" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CloseIcon />
                </ListItemIcon>
                <ListItemText primary="Chelsea Otakan usdgfu iy sduf wet u" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary="Chelsea Otakan usdgfu iy sduf wet u" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CloseIcon />
                </ListItemIcon>
                <ListItemText primary="Chelsea Otakan usdgfu iy sduf wet u" />
              </ListItemButton>
            </ListItem>
          </div>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button variant="outlined" size="medium">
            Try The Premium
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CommCard;
