/**
`#sym:onLoginSuccess` is a custom prop name, not a React built-in.

In photoShare.jsx, you pass it into `LoginRegister`:

- `onLoginSuccess={this.handleLoginSuccess}`

So inside `LoginRegister`, `this.props.onLoginSuccess` refers to the parent method `handleLoginSuccess`.

`#sym:handleLoginSuccess` is the actual method defined on `PhotoShare`:

- `handleLoginSuccess = () => { this.setState({ userIsLoggedIn: true }); };`

How it works:

1. `PhotoShare` renders `LoginRegister` and hands it a callback prop.
2. `LoginRegister` does login work, then calls `this.props.onLoginSuccess()` after success.
3. That runs `PhotoShare.handleLoginSuccess()`.
4. `handleLoginSuccess()` updates `PhotoShare` state:
   - `userIsLoggedIn: true`
5. React re-renders `PhotoShare` with `userIsLoggedIn === true`.
6. Now the routes inside `render()` show the protected pages instead of redirecting to `/admin/login`.

So:
- `onLoginSuccess` = the name of the prop passed to the child
- `handleLoginSuccess` = the function the parent provides to handle successful login and switch app state
*/

import React from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userIsLoggedIn: false,
      loggedInUser: null,
    };
  }

  handleLoginSuccess = (userData) => {
    this.setState({ userIsLoggedIn: true, loggedInUser: userData });
  };

  handleLogoutSuccess = () => {
    this.setState({ userIsLoggedIn: false, loggedInUser: null });
  };

  render() {
    const { userIsLoggedIn } = this.state;

    return (
      <HashRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Pass loggedInUser and onLogout callback to TopBar */}
              <TopBar loggedInUser={this.state.loggedInUser} onLogout={this.handleLogoutSuccess} />
            </Grid>
            <div className="cs142-main-topbar-buffer" />

            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                {userIsLoggedIn ? (
                    <Route
                      // path="/users/:userId" — defines a pattern where :userId is a placeholder
                      path="/users/:userId"
                      render={(props) => <UserDetail {...props} />}
                    />
                ) : (
                  <Typography variant="body1">
                    Please log in to view user details.
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route
                    path="/admin/login"
                    // Pass the onLoginSuccess callback to LoginRegister so it can update app state on successful login
                    render={(props) => (
                      <LoginRegister
                        {...props}
                        onLoginSuccess={this.handleLoginSuccess}
                      />
                    )}
                  />

                  {userIsLoggedIn ? (
                      <Route
                        path="/photos/:userId"
                        render={(props) => <UserPhotos {...props} />}
                      />
                  ) : (
                    <Redirect to="/admin/login" />
                  )}
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
