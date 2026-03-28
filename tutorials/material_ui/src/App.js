import React, { useState, useEffect } from "react";
import ButtonUsage from "./components/Button";
import NavBar from "./components/NavBar";

class ReactAppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { yourName: "", clicker: 0, counter: 0 }; //Makes `<h1>Hello {this.state.yourName}!</h1>` update reactively
  }

  // `render()` With JSX
  render() {
    return (
      <div>
        {/* <div className="button-section">
          <ButtonUsage />
        </div> */}
        <div className="nav-section">
          <NavBar />
        </div>
      </div>
    );
  }
}

export default ReactAppView;
