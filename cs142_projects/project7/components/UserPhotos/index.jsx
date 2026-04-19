import React from "react";
import { Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
// import fetchModel from "../../lib/fetchModelData";
import axios from "axios";
import "./styles.css";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      user: null,
    };
    this._isMounted = false; // To track if the component is mounted
  }

  /**
   * React components are not always alive. They come and go depending on what the user is doing — 
   * navigating to a page creates them, navigating away destroys them.
   * 
   * Mount — the component is born 
   * Mounting is the moment React takes your component and inserts it into the real DOM for the first time. 
   * Before this moment, your component doesn't exist on the page at all. After this moment, the user can see it.
   * 
   * The sequence when a component mounts:
   * 1. constructor()       — component object is created, state is initialized
   * 2. render()            — React figures out what HTML to produce
   * 3. [DOM is updated]    — the real browser DOM now contains your elements
   * 4. componentDidMount() — fires AFTER the component is visible on the page
   * 
   * componentDidMount is the right place to start fetching data, because at this point you know the component is 
   * actually on screen and worth loading data for.
   * 
   * Unmount — the component is destroyed 
   * Unmounting is the moment React removes your component from the DOM. The user navigated away, or a conditional like 
   * {showPhotos && <UserPhotos />} became false. The component's HTML is gone from the page.
   * 
   */
  componentDidMount() {
    this._isMounted = true; // set true when mounted
    this.loadData();  // safe to fetch — component is now alive on the page
  }

  componentWillUnmount() {
    this._isMounted = false; // set false when unmounted
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.loadData();
    }
  }

  loadData() {
    const userId = this.props.match.params.userId;

    //Guard: don't load data if userId is not defined
    if (!userId) {
      console.warn("No userId provided in URL parameters.");
      return;
    }
    /**
     * When you call fetchModel(...), the data doesn't come back instantly — it has to travel over the network. 
     * Instead of making your code wait and freeze, JavaScript returns a Promise immediately: 
     * an object that says "I don't have the answer yet, but I promise I'll give it to you when it's ready."
     * 
     * A Promise is always in one of three states:
     * pending   →  the work is still in progress
     * fulfilled →  the work finished successfully, here's the result
     * rejected  →  the work failed, here's the error
     * You handle those outcomes with .then() and .catch():
    */
    Promise.all([
      // fetchModel(`/photosOfUser/${userId}`),
      // fetchModel(`/user/${userId}`),
      axios.get(`/photosOfUser/${userId}`),
      axios.get(`/user/${userId}`),
    ])
      .then(([photosResult, userResult]) => {
        // runs when the data arrives successfully
        
        if (!this._isMounted) {
          // don't update state if the component is unmounted
          return;
        }
        
        // inspect what the server is actually sending back
        console.log("photos data:", JSON.stringify(photosResult.data, null, 2));
        console.log("user data:", JSON.stringify(userResult.data, null, 2));

        this.setState({
          photos: photosResult.data,
          user: userResult.data,
        });
      })
      .catch((err) => {
        // runs if the fetch failed
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
