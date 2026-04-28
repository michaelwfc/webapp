import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";


class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    fetchModel("/user/list")
      .then((result) => {
        this.setState({ users: result.data });
      })
      .catch((err) => {
        console.error("Failed to load users:", err.status, err.statusText);
      });
  }

  render() {
    return (
      <div>
        <Typography variant="h6">Users</Typography>
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
