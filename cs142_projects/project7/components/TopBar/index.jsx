import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { withRouter } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  // componentDidUpdate is called after the component updates (e.g., when props change).
  // We use it to fetch user data when the route changes, avoiding side effects in render().
  componentDidUpdate(prevProps) {
    const { pathname } = this.props.location;
    const prevPathname = prevProps.location.pathname;

    // Only fetch if the pathname has changed and user is logged in
    if (pathname !== prevPathname && this.props.loggedInUser) {
      this.fetchUserForContext();
    }
  }

  // Fetches user data for the current route's context (user details or photos page).
  // This is separated from render() to avoid side effects and ensure proper async handling.
  fetchUserForContext() {
    const { pathname } = this.props.location;
    const userIdMatch = pathname.match(/^\/users\/([^/]+)$/);
    const photosMatch = pathname.match(/^\/photos\/([^/]+)$/);

    if (userIdMatch) {
      fetchModel(`/user/${userIdMatch[1]}`)
        .then((result) => {
          this.setState({ user: result.data });
        })
        .catch((err) => {
          console.error("Failed to load user:", err.status, err.statusText);
          this.setState({ user: null });
        });
    } else if (photosMatch) {
      fetchModel(`/user/${photosMatch[1]}`)
        .then((result) => {
          this.setState({ user: result.data });
        })
        .catch((err) => {
          console.error("Failed to load user:", err.status, err.statusText);
          this.setState({ user: null });
        });
    } else {
      this.setState({ user: null });
    }
  }

  // Handles logout by calling the /admin/logout API, updating app state, and redirecting to login.
  handleLogout = async () => {
    try {
      const response = await fetch('/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('Logout failed');
        return;
      }

      // Call the parent callback to update app state
      if (this.props.onLogout) {
        this.props.onLogout();
      }

      // Redirect to login page
      this.props.history.push('/admin/login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // Computes the context string for the TopBar based on current state and route.
  // This is a pure function that returns a string without side effects.
  getContext() {
    const { pathname } = this.props.location;
    const userIdMatch = pathname.match(/^\/users\/([^/]+)$/);
    const photosMatch = pathname.match(/^\/photos\/([^/]+)$/);

    if (userIdMatch && user) {
      return `${user.first_name} ${user.last_name}`;
    } else if (photosMatch && user) {
      return `Photos of ${user.first_name} ${user.last_name}`;
    }
    return "";
  }


  render() {
    const { loggedInUser } = this.props;

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
              {loggedInUser ? `Hi, ${loggedInUser.first_name}` : "Please Login"}
            </Typography>
            {loggedInUser && (
              <Button color="inherit" onClick={this.handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

export default withRouter(TopBar);
