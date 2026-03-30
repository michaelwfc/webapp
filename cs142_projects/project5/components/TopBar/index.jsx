import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { withRouter } from "react-router-dom";

import "./styles.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
  }

  getContext() {
    const { pathname } = this.props.location;
    const userIdMatch = pathname.match(/^\/users\/([^/]+)$/);
    const photosMatch = pathname.match(/^\/photos\/([^/]+)$/);

    if (userIdMatch) {
      const user = window.cs142models.userModel(userIdMatch[1]);
      if (user) {
        return `${user.first_name} ${user.last_name}`;
      }
    } else if (photosMatch) {
      const user = window.cs142models.userModel(photosMatch[1]);
      if (user) {
        return `Photos of ${user.first_name} ${user.last_name}`;
      }
    }
    return "";
  }

  render() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className="cs142-topbar-appBar" position="absolute">
          <Toolbar>
            <Typography
              variant="h5"
              color="inherit"
              sx={{ flexGrow: 1 }}
              className="cs142-topbar-name"
            >
              Michael Wang
            </Typography>
            <Typography
              variant="h5"
              color="inherit"
              className="cs142-topbar-user"
            >
              {this.getContext()}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

// withRouter is a Higher Order Component from React Router v5 that injects
// router props (location, history, match) into the wrapped component,
// allowing it to access the current route.

export default withRouter(TopBar);
