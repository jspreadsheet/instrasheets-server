import React, { useContext, useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import axios from "axios";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { AuthContext } from "../contexts/Auth";

function ListSpreadsheets() {
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  const theme = useTheme();

  useEffect(() => {
    const getSpreadsheets = async () => {
      const result = await axios.get(
        `${process.env.REACT_APP_API_BASE_PATH}/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const activeSpreadsheets = result.data.filter(
        (spreadsheet) => spreadsheet.sheet_status !== 0
      );

      setSpreadsheets(activeSpreadsheets);
    };

    getSpreadsheets();
  }, []);

  const goToSpreadsheet = (guid) => {
    navigate(`/spreadsheet/${guid}`);
  };

  const redirectToSpreadsheet = (spreadsheetGuid) => {
    goToSpreadsheet(spreadsheetGuid);
  };

  const deleteSpreadsheet = async (spreadsheetGuid) => {
    await axios.delete(
      `${process.env.REACT_APP_API_BASE_PATH}/${spreadsheetGuid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSpreadsheets((currentSpreadsheets) => {
      const removedIndex = currentSpreadsheets.findIndex(
        (spreadsheet) => spreadsheet.sheet_guid === spreadsheetGuid
      );

      const newArray = [
        ...currentSpreadsheets.slice(0, removedIndex),
        ...currentSpreadsheets.slice(removedIndex + 1),
      ];

      return newArray;
    });
  };

  const handleClose = async (save) => {
    setOpen(false);

    if (save) {
      const formData = new FormData();
      formData.append("description", name);

      const result = await axios.post(
        `${process.env.REACT_APP_API_BASE_PATH}/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      goToSpreadsheet(result.data.data);
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent="center"
        alignItems="flex-start"
        sx={{ height: "100%", margin: 0 }}
        rowSpacing={1}
      >
        <Grid
          item
          xs={11}
          sm={8}
          md={7}
          lg={5}
          sx={{
            paddingTop: "unset !important",

            [theme.breakpoints.down("sm")]: {
              height: "80%",
            },
            [theme.breakpoints.up("sm")]: {
              height: "90%",
            },
          }}
        >
          <Paper sx={{ padding: 1, height: "100%", position: "relative" }}>
            <List
              sx={{
                maxHeight: "100%",
                width: "100%",
                overflow: "auto",
                boxSizing: "border-box",
              }}
            >
              {spreadsheets.map((spreadsheet) => (
                <ListItem
                  key={spreadsheet.sheet_guid}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteSpreadsheet(spreadsheet.sheet_guid)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    onClick={() =>
                      redirectToSpreadsheet(spreadsheet.sheet_guid)
                    }
                  >
                    <ListItemText
                      primary={spreadsheet.sheet_description}
                      secondary={moment(spreadsheet.sheet_updated).fromNow()}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Fab
              color="success"
              aria-label="Create Spreadsheet"
              sx={{
                position: "absolute",
                [theme.breakpoints.down("sm")]: {
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%) translateY(50%)",
                },
                [theme.breakpoints.up("sm")]: {
                  top: 0,
                  right: -10,
                  transform: "translateX(100%)",
                },
              }}
              onClick={() => setOpen(true)}
            >
              <AddIcon />
            </Fab>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => handleClose()}>
        <DialogTitle>Set a name for your new spreadsheet</DialogTitle>
        <DialogContent>
          <TextField
            label="Spreadsheet name"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button onClick={() => handleClose(true)}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ListSpreadsheets;
