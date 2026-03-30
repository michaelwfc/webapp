import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";

/**
 * Define UserList, a React component of CS142 Project 5.
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: window.cs142models.userListModel(),
    };
  }

  render() {
    return (
      <div>
        <Typography variant="Users">
          {/* This is the user list, which takes up 3/12 of the window. You might
          choose to use <a href="https://mui.com/components/lists/">Lists</a>{" "}
          and <a href="https://mui.com/components/dividers/">Dividers</a> to
          display your users like so: */}
        </Typography>
        <List component="nav">
          {this.state.users.map((user) => (
            <ListItem
              key={user._id}
              component={Link}
              to={`/users/${user._id}`}
              button
            >
              <ListItemText primary={user.first_name + " " + user.last_name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default UserList;
