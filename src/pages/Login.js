import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { AuthContext } from "../contexts/Auth";

function Login() {
  const [token, setToken] = useState("");

  const { setToken: setExternToken } = useContext(AuthContext);

  const navigate = useNavigate();

  const saveToken = (event) => {
    event.preventDefault();

    setExternToken(token);
    navigate("/spreadsheet");
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%", margin: 0 }}
      rowSpacing={1}
    >
      <Grid item xs={11} sm={8} md={7} lg={5}>
        <Paper component="form" onSubmit={saveToken} sx={{ padding: 3 }}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item sx={{ width: "100%" }}>
              <TextField
                label="Access token"
                variant="filled"
                fullWidth
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                Continue
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;
