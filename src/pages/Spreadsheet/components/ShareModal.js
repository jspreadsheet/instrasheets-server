import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import { AuthContext } from "../../../contexts/Auth";

const permissionTypes = ["Viewer", "Editor", "Designer"];

function ShareModal({ open, setOpen, sheetGuid }) {
  const [newUserEmail, setNewUserEmail] = useState("");
  const [permission, setPermission] = useState("");

  const [users, setUsers] = useState([]);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (open === true) {
      const getUsers = async () => {
        const result = await axios.get(
          `${process.env.REACT_APP_API_BASE_PATH}/${sheetGuid}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(result.data);
      };

      getUsers();
    }
  }, [open]);

  const inviteUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("data[0][email]", newUserEmail);
    formData.append("data[0][level]", permission);

    const result = await axios.post(
      `${process.env.REACT_APP_API_BASE_PATH}/${sheetGuid}/users`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (result.data.success) {
      setUsers((currentUsers) => [
        ...currentUsers,
        { email: newUserEmail, name: newUserEmail, level: permission },
      ]);
    } else {
      alert("Sorry something went wrong");
    }
  };

  const updateUser = async (email, level) => {
    const formData = new FormData();
    formData.append("data[0][0]", email);
    formData.append("data[0][1]", level);

    await axios.post(
      `${process.env.REACT_APP_API_BASE_PATH}/${sheetGuid}/users/update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const removeUser = async (userEmail) => {
    const formData = new FormData();
    formData.append("data", userEmail);

    const result = await axios.post(
      `${process.env.REACT_APP_API_BASE_PATH}/${sheetGuid}/users/delete`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (result.data.success) {
      setUsers((currentUsers) => {
        const removedPosition = currentUsers.findIndex(
          (user) => user.email === userEmail
        );

        return [
          ...currentUsers.slice(0, removedPosition),
          ...currentUsers.slice(removedPosition + 1),
        ];
      });
    } else {
      alert("Sorry something went wrong");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="md"
      fullWidth
      sx={{
        "& .css-rnmm7m-MuiPaper-root-MuiDialog-paper": {
          height: "-webkit-fill-available",
        },
      }}
    >
      <DialogTitle variant="h5">
        Sharing your spreadsheet
        <IconButton
          onClick={() => {
            setOpen(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <form onSubmit={inviteUser}>
          <Typography variant="h6">Invite Users</Typography>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            variant="filled"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            required
          />
          <br />
          <br />
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={10}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel id="permission-select-label">
                      Permission
                    </InputLabel>
                    <Select
                      labelId="permission-select-label"
                      label="Permission"
                      value={permission}
                      onChange={(e) => {
                        setPermission(e.target.value);
                      }}
                      required
                    >
                      {permissionTypes.map((permissionType, number) => (
                        <MenuItem key={permissionType} value={number}>
                          {permissionType}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained">
                Invite
              </Button>
            </Grid>
          </Grid>
        </form>
        <br />
        <Typography variant="h6">Invited Users</Typography>
        {users.length ? (
          <ul
            style={{
              listStyle: "none",
              paddingInlineStart: 0,

              overflowY: "auto",
            }}
          >
            {users.map((user, index) => (
              <li key={user.email} style={{ marginTop: index && "1em" }}>
                <Grid container>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    item
                    xs={1}
                  >
                    <Avatar src={user.image} />
                  </Grid>
                  <Grid item xs={6} justifyContent="center">
                    <div
                      style={{
                        height: "100%",

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body1">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="permission-select-label">
                        Permission
                      </InputLabel>
                      <Select
                        labelId="permission-select-label"
                        label="Permission"
                        defaultValue={user.level}
                        onChange={(e) => updateUser(user.email, e.target.value)}
                      >
                        {permissionTypes.map((permissionType, number) => (
                          <MenuItem key={permissionType} value={number}>
                            {permissionType}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{ display: "flex", justifyContent: "end" }}
                  >
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeUser(user.email)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="subtitle1" color="text.secondary">
            No users found
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

ShareModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  sheetGuid: PropTypes.string.isRequired,
};

export default ShareModal;
