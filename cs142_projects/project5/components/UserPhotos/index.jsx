import React from "react";
import { Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      user: null,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.loadData();
    }
  }

  loadData() {
    const userId = this.props.match.params.userId;
    Promise.all([
      fetchModel(`/photosOfUser/${userId}`),
      fetchModel(`/user/${userId}`),
    ])
      .then(([photosResult, userResult]) => {
        this.setState({
          photos: photosResult.data,
          user: userResult.data,
        });
      })
      .catch((err) => {
        console.error("Failed to load data:", err.status, err.statusText);
      });
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toDateString() + " " + date.toLocaleTimeString();
  }

  render() {
    const { photos, user } = this.state;

    if (photos.length === 0) {
      return (
        <Typography variant="body1">No photos found for this user.</Typography>
      );
    }

    return (
      <div>
        <Typography variant="h4">
          Photos of {user ? `${user.first_name} ${user.last_name}` : "User"}
        </Typography>
        {photos.map((photo) => (
          <Paper key={photo._id} className="cs142-photo-paper">
            <img
              src={`images/${photo.file_name}`}
              alt={`By ${user ? user.first_name : ""}`}
              className="cs142-photo-img"
            />
            <Typography variant="caption" className="cs142-photo-date">
              Created: {UserPhotos.formatDate(photo.date_time)}
            </Typography>
            {photo.comments && photo.comments.length > 0 && (
              <div className="cs142-comments-section">
                <Typography variant="subtitle2">Comments:</Typography>
                {photo.comments.map((comment) => (
                  <Paper key={comment._id} className="cs142-comment-paper">
                    <Typography variant="body2">
                      <Link to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>{" "}
                      said on {UserPhotos.formatDate(comment.date_time)}:
                    </Typography>
                    <Typography variant="body1">{comment.comment}</Typography>
                  </Paper>
                ))}
              </div>
            )}
          </Paper>
        ))}
      </div>
    );
  }
}

export default UserPhotos;
