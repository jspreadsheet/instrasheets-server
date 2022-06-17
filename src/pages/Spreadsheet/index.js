import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import jspreadsheet from "jspreadsheet-alpha";
import render from "@jspreadsheet/render";
import cloud from "@jspreadsheet/cloud";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import SettingsIcon from "@mui/icons-material/Settings";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import ShareIcon from "@mui/icons-material/Share";
import PublicIcon from "@mui/icons-material/Public";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import { useTheme } from "@mui/material";

import { AuthContext } from "../../contexts/Auth";
import ShareModal from "./components/ShareModal";

jspreadsheet.setLicense(process.env.REACT_APP_JSS_LICENSE);
jspreadsheet.setExtensions({ render, cloud });

cloud({
  url: process.env.REACT_APP_API_BASE_PATH.slice(0, -3),
  onbeforecreate: (config) => {
    for (let i = 0; i < config.worksheets.length; i += 1) {
      const worksheet = config.worksheets[i];

      worksheet.tableOverflow = true;

      if (!worksheet.columns) {
        worksheet.columns = [];
      }
    }
  },
});

function Spreadsheet() {
  const [sheetName, setSheetName] = useState("");
  const [sheetPrivacy, setSheetPrivacy] = useState(1);

  const [anchorEl, setAnchorEl] = useState(null);

  const [openShareModal, setOpenShareModal] = useState(false);

  const [openPrivacyDialog, setOpenPrivacyDialog] = useState(false);

  const { token } = useContext(AuthContext);

  const { guid } = useParams();

  const jssContainer = useRef(null);
  const jssRef = useRef(null);
  const worksheetsRef = useRef(null);

  const navigate = useNavigate();

  const theme = useTheme();

  const updateWorksheetsSize = () => {
    if (worksheetsRef.current) {
      worksheetsRef.current.forEach((worksheet) => {
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const downloadSpreadsheet = () => {
    setAnchorEl(null);

    jspreadsheet.render(jssRef.current);
  };

  const createSnapshot = async () => {
    setAnchorEl(null);

    const formData = new FormData();

    await axios.post(
      `${process.env.REACT_APP_API_BASE_PATH}/${guid}/history`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const goToHistory = () => {
    setAnchorEl(null);

    navigate("history");
  };

  const closePrivacyDialog = async (save) => {
    setOpenPrivacyDialog(false);

    if (!save) {
      return;
    }

    const newPrivacy = (sheetPrivacy + 1) % 2;

    const formData = new FormData();

    const result = await axios.post(
      `${process.env.REACT_APP_API_BASE_PATH}/${guid}/privacy/${newPrivacy}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (result.data.success) {
      setSheetPrivacy(newPrivacy);
    } else {
      alert("Sorry something went wrong");
    }
  };

  useEffect(() => {
    const getSpreadsheetConfig = async () => {
      const result = await axios.get(
        `${process.env.REACT_APP_API_BASE_PATH}/${guid}/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSheetName(result.data.sheet_description);
      setSheetPrivacy(result.data.sheet_privacy);
    };

    getSpreadsheetConfig();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateWorksheetsSize);

    return () => {
      window.removeEventListener("resize", updateWorksheetsSize);
    };
  }, []);

  const count = useRef(0);

  useEffect(() => {
    count.current += 1;
    const version = count.current;

    cloud({ token });

    jssRef.current = document.createElement("div");
    jssRef.current.style.height = "100%";
    jssRef.current.style.width = "100%";

    jssContainer.current.appendChild(jssRef.current);

    jspreadsheet(jssRef.current, {
      cloud: guid,
      onload: (a) => {
        if (version === count.current) {
          worksheetsRef.current = a.worksheets;
          updateWorksheetsSize();
        } else {
          jspreadsheet.destroy(a.element);
        }
      },
    });

    return () => {
      if (jssRef.current) {
        jspreadsheet.destroy(jssRef.current);
      }

      if (jssContainer.current) {
        jssContainer.current.removeChild(jssRef.current);
      }
      jssRef.current = null;

      worksheetsRef.current = null;
    };
  }, [token, guid]);

  useEffect(() => {
    if (worksheetsRef.current) {
      updateWorksheetsSize();
    }
  }, [sheetName]);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%", margin: 0 }}
        rowSpacing={1}
      >
        <Grid
          item
          xs={12}
          sm={11}
          md={11}
          lg={11}
          sx={{
            height: "95%",
            paddingTop: "unset !important",

            [theme.breakpoints.down("sm")]: {
              height: "100%",
            },
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
            <Breadcrumbs>
              <Link underline="hover" color="inherit" href="/spreadsheet">
                spreasheet list
              </Link>
            </Breadcrumbs>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h4" gutterBottom>
                  {sheetName}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton aria-label="settings" onClick={handleClick}>
                  <SettingsIcon />
                </IconButton>
                <Checkbox
                  checked={sheetPrivacy === 1}
                  onChange={() => setOpenPrivacyDialog(true)}
                  icon={<PublicIcon />}
                  checkedIcon={<VpnLockIcon />}
                  sx={{
                    color: "#0000008a",
                    "&.Mui-checked": {
                      color: "#0000008a",
                    },
                  }}
                />
                <IconButton
                  aria-label="share"
                  onClick={() => {
                    setOpenShareModal(true);
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Grid>
            </Grid>
            <div
              ref={jssContainer}
              style={{ flexGrow: 1, width: "100%", overflow: "hidden" }}
            />
          </Paper>
        </Grid>
      </Grid>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <MenuItem onClick={downloadSpreadsheet}>Download Spreadsheet</MenuItem>
        <MenuItem onClick={createSnapshot}>Create snapshot</MenuItem>
        <MenuItem onClick={goToHistory}>Version history</MenuItem>
      </Menu>
      <ShareModal
        open={openShareModal}
        setOpen={setOpenShareModal}
        sheetGuid={guid}
      />
      <Dialog open={openPrivacyDialog}>
        <DialogTitle>Spreadsheet Privacy</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will make your sheet
            {sheetPrivacy === 1 ? " available public" : " hidden to the public"}
            . Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              closePrivacyDialog();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              closePrivacyDialog(true);
            }}
            autoFocus
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Spreadsheet;
