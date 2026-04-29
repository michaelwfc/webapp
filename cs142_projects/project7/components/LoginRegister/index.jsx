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
import axios from 'axios';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import { withRouter } from 'react-router-dom';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Login fields
            login_name: '',
            password: '',
            error: '',
            // Registration fields
            isRegisterMode: false,
            firstName: '',
            lastName: '',
            location: '',
            description: '',
            occupation: '',

        };
    }

    handleLogin = async (event) => {
        event.preventDefault();
        const { login_name, password } = this.state;

        if (!login_name || !password) {
            this.setState({ error: 'Please enter login name and password.' });
            return;
        }

        try {
            const response = await fetch('/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login_name: login_name, password: password })
            });
            
            console.log("status:", response.status);
            console.log("bodyUsed BEFORE text():", response.bodyUsed); // ← tells you if already read

             
            
            if (!response.ok) {
                console.log("entered error branch, response.status:", response.status);
                // A Response body can only be read once. If you try to read it again (e.g., with response.text() or response.json()), it will throw an error because the stream has already been consumed.
                // To handle this, you should read the body once and then use that data for both success and error handling.
                const text = await response.text(); // ← this will fail if response.json() was already called
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

    handleRegister = async (event) => {
        event.preventDefault();
        
        const { 
            firstName, 
            lastName, 
            login_name, 
            password,
            location,
            description,
            occupation
        } = this.state;

        // Validate required fields
        if (!firstName || !lastName || !login_name || !password) {
            this.setState({ error: 'Please fill in all required fields: First Name, Last Name, Login Name, and Password.' });
            return;
        }

        try {
            const response = await fetch('/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    login_name: login_name,
                    password: password,
                    location: location,
                    description: description,
                    occupation: occupation
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || response.statusText);
            }
            
            // Get the user data from the response
            const data = await response.json();
            this.setState({ error: '' }); // Clear any previous errors
            // If registration is successful, call the parent callback to update app state
            if (this.props.onLoginSuccess) {
                this.props.onLoginSuccess(data);
            }

            // Redirect to the user page after successful registration
            const userId = data._id;
            this.props.history.push(`/users/${userId}`);

        } catch (err) {
            this.setState({ error: err.message || 'Registration failed' });
        }
    };

    toggleMode = () => {
        this.setState({
            isRegisterMode: !this.state.isRegisterMode,
            error: '' // Clear error when switching modes
        });
    };

    render() {
        const { isRegisterMode } = this.state;
        
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
                    {isRegisterMode ? 'Register for PhotoShare' : 'Login to PhotoShare'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {isRegisterMode 
                        ? 'Fill in the form below to create your account.' 
                        : 'Enter your username and password to continue. If you are new, use the Register button.'}
                </Typography>

                <Box component="form" sx={{ display: 'grid', gap: 2, mt: 2 }}>
                    {isRegisterMode && (
                        <>
                            <TextField
                                id="firstName"
                                label="First Name *"
                                variant="outlined"
                                fullWidth
                                value={this.state.firstName}
                                onChange={(e) => this.setState({ firstName: e.target.value })}
                            />
                            <TextField
                                id="lastName"
                                label="Last Name *"
                                variant="outlined"
                                fullWidth
                                value={this.state.lastName}
                                onChange={(e) => this.setState({ lastName: e.target.value })}
                            />
                        </>
                    )}
                    <TextField
                        id="login_name"
                        label={isRegisterMode ? "Login Name *" : "Login Name"}
                        variant="outlined"
                        fullWidth //made inputs full-width
                        value={this.state.login_name}
                        onChange={(e) => this.setState({ login_name: e.target.value })}
                    />
                    <TextField
                        id="password"
                        label={isRegisterMode ? "Password *" : "Password"}
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={this.state.password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                    />
                    {isRegisterMode && (
                        <>
                            <TextField
                                id="location"
                                label="Location"
                                variant="outlined"
                                fullWidth
                                value={this.state.location}
                                onChange={(e) => this.setState({ location: e.target.value })}
                            />
                            <TextField
                                id="description"
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={this.state.description}
                                onChange={(e) => this.setState({ description: e.target.value })}
                            />
                            <TextField
                                id="occupation"
                                label="Occupation"
                                variant="outlined"
                                fullWidth
                                value={this.state.occupation}
                                onChange={(e) => this.setState({ occupation: e.target.value })}
                            />
                        </>
                    )}
                    {/* put buttons in a flex row with equal width */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={isRegisterMode ? this.handleRegister : this.handleLogin}
                            sx={{ flex: 1 }}
                        >
                            {isRegisterMode ? 'Register' : 'Login'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.toggleMode}
                            sx={{ flex: 1 }}
                        >
                            {isRegisterMode ? 'Back to Login' : 'Register Me'}
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