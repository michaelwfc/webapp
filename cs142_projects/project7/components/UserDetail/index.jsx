import React from "react";
import { Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.loadUserData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.loadUserData();
    }
  }

  loadUserData() {
    const userId = this.props.match.params.userId;
    fetchModel(`/user/${userId}`)
      .then((result) => {
        this.setState({ user: result.data });
      })
      .catch((err) => {
        console.error("Failed to load user:", err.status, err.statusText);
      });
  }

  render() {
    const { user } = this.state;
    if (!user) {
      return <Typography variant="body1">Loading...</Typography>;
    }

    return (
      <div>
        <Typography variant="h4">
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
