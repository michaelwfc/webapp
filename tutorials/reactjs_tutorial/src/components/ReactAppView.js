import React, { useState, useEffect } from "react";
import "./ReactAppView.css";
import ParentComponent from "./ParentComponent";

class ReactAppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { yourName: "", clicker: 0, counter: 0 }; //Makes `<h1>Hello {this.state.yourName}!</h1>` update reactively
  }

  handleChange(event) {
    // setState() triggers React's reconciliation: it updates the state object and calls render() again with the new values.
    this.setState({ yourName: event.target.value });
  }

  handleClicker(event) {
    this.setState({ clicker: this.state.clicker + 1 });
  }

  componentDidMount() {
    // Start 2 sec counter
    const incFunc = () => this.setState({ counter: this.state.counter + 1 });
    this.timerID = setInterval(incFunc, 2 * 1000);
  }
  componentWillUnmount() {
    // Shutdown timer
    clearInterval(this.timerID);
  }
  // `render()` With JSX
  render() {
    return (
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={this.state.yourName}
          //Using arrow functions in JSX
          //  //Creates a new function on each render — OK for most cases.
          onChange={(event) => this.handleChange(event)}
        />
        <h1 id="greeting">Hello {this.state.yourName}!</h1>
        <p className="cs142-code-name">
          This is a simple example of a React component. This component is
          exported to be used elsewhere.
        </p>
        <button onClick={(event) => this.handleClicker(event)}>
          Clicker Times:{this.state.clicker}
        </button>
        <p> Counting: {this.state.counter}</p>
        {/* ParentComponent renders here — ChildComponent is inside it */}
        <ParentComponent />
      </div>
    );
  }
}

export default ReactAppView;
