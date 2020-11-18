import React, { useState, useEffect } from "react";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import axios from "axios";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function HistoryDrawer() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/history/")
      .then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < res.data[i].history.length; j++) {
            let tmp = {
              label: res.data[i].history[j].label,
              modified: res.data[i].history[j].modified,
            };
            let newHistory = history;
            newHistory.push(tmp);
            setHistory(newHistory);
          }
        }
      })
      .catch((err) => console.log(err));
  }, [history]);

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(!open);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {history.map((node) => (
          <ListItem button key={node.modified}>
            <ListItemIcon>
              <InboxIcon /> :
            </ListItemIcon>
            <ListItemText
              primary={node.label}
              secondary={"modified at: " + node.modified}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div style={{ right: "1em", top: "5em" }}>
      <Button onClick={toggleDrawer(true)}>Show History</Button>
      <Drawer anchor={"right"} open={open} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}