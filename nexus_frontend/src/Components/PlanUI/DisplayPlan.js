import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import CommLoader from "../../views/CommonComponent/CommLoader";
import Box from "@mui/material/Box";
import CommCard from "./CommCard";
const DisplayPlan = () => {
  const [loading, setLoading] = useState(false);
  const [monthly, setMonthly] = useState(true);
  const [yearly, setYearly] = useState(false);

  return (
    <>
      {loading && <CommLoader />}
      <Box sx={{ flexGrow: 3, mt: 10 }}>
        <div className="pricing-header">
          <Grid
            container
            spacing={2}
            gap={4}
            // border={1}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid
              xs={12}
              // border={1}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Typography variant="h1">Choose Your Plan</Typography>
            </Grid>
            <Grid
              xs={12}
              // border={1}
              sx={{ display: "flex", justifyContent: "center" }}
              gap={2}
            >
              <Button
                variant={`${monthly ? "contained" : ""}`}
                sx={{ borderRadius: "2rem" }}
                onClick={(pre) => {
                  setYearly(false);
                  setMonthly(true);
                }}
                size="medium"
              >
                Monthy
              </Button>
              <Button
                variant={`${yearly ? "contained" : ""}`}
                sx={{ borderRadius: "2rem" }}
                onClick={(pre) => {
                  setMonthly(false);
                  setYearly(true);
                }}
                size="medium"
              >
                Yearly
              </Button>{" "}
            </Grid>
          </Grid>
        </div>
        <Grid container spacing={2}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            <CommCard palnName="Basic" palnPrice="49" />
            <CommCard palnName="Starndard" palnPrice="89" />
            <CommCard palnName="Primium" palnPrice="129" />
          </div>
        </Grid>
      </Box>
    </>
  );
};

export default DisplayPlan;
