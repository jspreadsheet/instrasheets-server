import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import jspreadsheet from "jspreadsheet-alpha";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";

import { AuthContext } from "../contexts/Auth";

jspreadsheet.setLicense(process.env.REACT_APP_JSS_LICENSE);

const drawerWidth = 220;

function History() {
  const [versions, setVersions] = useState([]);

  const [selectedVersion, setSelectedVersion] = useState(null);

  const selectedVersionCount = useRef(0);

  const jssRef = useRef(null);
  const sheetRef = useRef(null);

  const { token } = useContext(AuthContext);

  const { guid } = useParams();

  const navigate = useNavigate();

  const backToSpreadsheet = () => {
    navigate(`/spreadsheet/${guid}`);
  };

  const updateWorksheetsSize = () => {
    if (sheetRef.current) {
      sheetRef.current.forEach((worksheet) => {
        const availableArea = jssRef.current.getBoundingClientRect();
        const currentArea =
          worksheet.element.parentElement.getBoundingClientRect();

        worksheet.setViewport(
          `${jssRef.current.offsetWidth}px`,
          `${availableArea.height - (currentArea.y - availableArea.y)}px`
        );
      });
    }
  };

  const recoverVersion = async () => {
    if (typeof selectedVersion !== "number") {
      return;
    }

    const formData = new FormData();

    await axios.post(
      `${process.env.REACT_APP_API_BASE_PATH}/${guid}/history/recover/${versions[selectedVersion].versionId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    backToSpreadsheet();
  };

  const deleteVersion = async (versionIndex) => {
    const { versionId } = versions[versionIndex];

    await axios.delete(
      `${process.env.REACT_APP_API_BASE_PATH}/${guid}/history/${versionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (selectedVersion === versionIndex) {
      setSelectedVersion(null);
    }

    setVersions((currentVersions) => [
      ...currentVersions.slice(0, versionIndex),
      ...currentVersions.slice(versionIndex + 1),
    ]);
  };

  useEffect(() => {
    const getVersions = async () => {
      const result = await axios.get(
        `${process.env.REACT_APP_API_BASE_PATH}/${guid}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVersions(result.data);
    };

    getVersions();

    window.addEventListener("resize", updateWorksheetsSize);

    return () => {
      window.removeEventListener("resize", updateWorksheetsSize);
    };
  }, []);

  useEffect(() => {
    if (typeof selectedVersion === "number") {
      selectedVersionCount.current += 1;
      const currentRotation = selectedVersionCount.current;

      const version = versions[selectedVersion];

      const getVersion = async () => {
        const result = await axios.get(
          `${process.env.REACT_APP_API_BASE_PATH}/${guid}/history/${version.versionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const config = result.data;
        config.editable = false;

        for (let i = 0; i < config.worksheets.length; i += 1) {
          const worksheet = config.worksheets[i];

          worksheet.tableOverflow = true;
        }

        if (
          currentRotation === selectedVersionCount.current &&
          jssRef.current
        ) {
          sheetRef.current = jspreadsheet(jssRef.current, config);

          updateWorksheetsSize();
        }
      };

      getVersion();
    }

    return () => {
      if (jssRef.current && jssRef.current.spreadsheet) {
        jspreadsheet.destroy(jssRef.current);
        sheetRef.current = null;
      }
    };
  }, [selectedVersion]);

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginTop: 1, marginLeft: 2, marginRight: 1, width: "unset" }}
        >
          <Grid item>
            <Typography variant="h5">Versions</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={backToSpreadsheet}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>
        </Grid>
        <List dense>
          {versions.map((version, index) => (
            <ListItem
              key={version.versionId}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => {
                    deleteVersion(index);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
                onClick={() => setSelectedVersion(index)}
                selected={index === selectedVersion}
              >
                <ListItemText
                  primary={version.date}
                  secondary={`Size: ${version.size} bytes`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Grid
        item
        xs={12}
        sm={11}
        md={11}
        lg={11}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,

          height: "100%",
          paddingTop: "unset !important",

          display: typeof selectedVersion !== "number" && "none",
        }}
      >
        <Paper
          sx={{
            height: "100%",
            padding: 3,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid
              item
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                marginBottom: 1,
              }}
            >
              <Grid item>
                <Typography variant="h4">
                  {typeof selectedVersion === "number"
                    ? versions[selectedVersion].date
                    : ""}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  size="large"
                  onClick={recoverVersion}
                >
                  Recover version
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <div
            ref={jssRef}
            style={{ flexGrow: 1, width: "100%", overflow: "hidden" }}
          />
        </Paper>
      </Grid>
    </>
  );
}

export default History;
