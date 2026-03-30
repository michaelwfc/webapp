import React from "react";
import { Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    // const user = window.cs142models.userModel(userId);
    this.setState({ userId: userId });
  }

  // update user id when the route changes
  componentDidUpdate(prevProps) {
    const prevUserId = prevProps.match.params.userId;
    const currentUserId = this.props.match.params.userId;
    if (prevUserId !== currentUserId) {
      // const user = window.cs142models.userModel(currentUserId);
      this.setState({ userId: currentUserId });
    }
  }

  render() {
    const { userId } = this.state;
    const user = window.cs142models.userModel(userId);
    if (!user) {
      return <Typography variant="body1">Loading...</Typography>;
    }

    return (
      <div>
        <Typography variant="h4">
          {/* This should be the UserDetail view of the PhotoShare app. Since it is
        invoked from React Router the params from the route will be in property
        match. So this should show details of user:
        {this.props.match.params.userId}. You can fetch the model for the user
        from window.cs142models.userModel(userId). */}
          {user.first_name} {user.last_name}
        </Typography>
        <Paper className="cs142-user-detail-paper">
          <Typography variant="body1">
            <strong>Location:</strong> {user.location}
          </Typography>
          <Typography variant="body1">
            <strong>Occupation:</strong> {user.occupation}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {user.description}
          </Typography>
          <Typography variant="body1">
            <Link to={`/photos/${user._id}`}>
              View {user.first_name}&apos;s Photos
            </Link>
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default UserDetail;
