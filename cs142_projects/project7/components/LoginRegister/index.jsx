/**

## How  this line `this.props.history.push(`/users/${userId}`);`  will redierect to /users/${userId}? 

Three parts:

### 1. Template literal syntax (``backticks``)

```js
`/users/${userId}`
```

The `${}` evaluates the variable and inserts its value. For example:

- If `userId = "69ea9738f3ccb80fff9cc725"` 
- Then `` `/users/${userId}` `` becomes `"/users/69ea9738f3ccb80fff9cc725"`

### 2. `history.push()` navigates

`this.props.history.push()` comes from React Router's `withRouter` HOC. It changes the browser URL:

```js
this.props.history.push(`/users/69ea9738f3ccb80fff9cc725`);
```

This tells the browser to navigate to that path.

### 3. Route definition matches the path

In photoShare.jsx, you have:

```jsx
<Route path="/users/:userId" render={(props) => <UserDetail {...props} />} />
```

- `path="/users/:userId"` — defines a pattern where `:userId` is a **placeholder**
- The actual URL is a real value like `/users/69ea9738f3ccb80fff9cc725`
- React Router matches the actual URL against the pattern
- It extracts `userId = "69ea9738f3ccb80fff9cc725"` 
- Passes it to `UserDetail` via `props.match.params.userId`

---

## Summary

- **Template literal** substitutes the actual value into the URL string
- **`history.push()`** navigates to that URL
- **Route pattern** (`:paramName`) captures that value and passes it to the component

So if login returns `_id: "69ea..."`, the redirect goes to `/users/69ea...` which matches your route and shows that user's details.

 * 
 */
import React from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import { withRouter } from 'react-router-dom';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
        };
    }

    handleLogin = async (event) => {
        event.preventDefault();
        const { username, password } = this.state;

        if (!username || !password) {
            this.setState({ error: 'Please enter username and password.' });
            return;
        }

        try {
            const response = await fetch('/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login_name: username, password:password }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || response.statusText);
            }
            
            // Get the user data from the response
            const data = await response.json();
            
            // Now receives loggedInUser as prop.
            // If login is successful, call the parent callback to update app state
            if (this.props.onLoginSuccess) {
                this.props.onLoginSuccess(data);
            }

            // Redirect to the user page after successful login
            const userId = data._id; // adjust based on actual response structure
            // this.props.history.push() comes from React Router's withRouter HOC. It changes the browser URL:
            // This tells the browser to navigate to that path.
            this.props.history.push(`/users/${userId}`);

        } catch (err) {
            this.setState({ error: err.message || 'Login failed' });
        }
    };

    handleRegister = (event) => {
        event.preventDefault();
        this.setState({ error: 'Register is not implemented yet.' });
    };

    render() {
        return (
            // wrapped the form in a Paper card with padding and elevation
            <Paper
                elevation={4}
                sx={{
                    maxWidth: 440,
                    mx: 'auto',
                    mt: 4,
                    p: 3,
                    backgroundColor: 'background.paper',
                }}
            >   
  
                {/* added a title and description text */}
                <Typography variant="h5" component="h1" gutterBottom>
                    Login to PhotoShare
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Enter your username and password to continue. If you are new, use the Register button.
                </Typography>

                <Box component="form" sx={{ display: 'grid', gap: 2, mt: 2 }}>
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        fullWidth //made inputs full-width
                        value={this.state.username}
                        onChange={(e) => this.setState({ username: e.target.value })}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={this.state.password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                    />
                    {/* put buttons in a flex row with equal width */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleLogin}
                            sx={{ flex: 1 }}
                        >
                            Login
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.handleRegister}
                            sx={{ flex: 1 }}
                        >
                            Register
                        </Button>
                    </Box>
                    {/*  styled the error text using MUI Typography */}
                    {this.state.error && (
                        <Typography variant="body2" color="error">
                            {this.state.error}
                        </Typography>
                    )}
                </Box>
            </Paper>
        );
    }
}

export default withRouter(LoginRegister);