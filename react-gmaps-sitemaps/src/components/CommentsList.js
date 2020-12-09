import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const formatTime = (datetime) => {
  const time = new Date(datetime);
  return time.getUTCHours() + ":" + ("0" + time.getUTCMinutes()).slice(-2);
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

const CommentsList = ({ comments, bottomRef, scrollToBottom }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {comments.map((comment) => (
        <>
          <ListItem alignItems="flex-start" key={comment.created}>
            <ListItemAvatar>
              <Avatar>{comment.profile.user.username.charAt(0)} </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={comment.content}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {comment.profile.user.username}
                  </Typography>
                  {"   - " + formatTime(comment.created) + " UTC"}
                </>
              }
            />
          </ListItem>
          <Divider />
        </>
      ))}
    </List>
  );
};
export default CommentsList;