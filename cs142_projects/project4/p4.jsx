import React from "react";
import ReactDOM from "react-dom";

import Example from "./components/Example";
import States from "./components/States";

class SwithView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "example",
    };
  }
  render() {
    const view = this.state.view;
    return (
      <div>
        <div className="switch-view-button">
          <button
            onClick={() => {
              this.setState({
                view: view === "example" ? "states" : "example",
              });
            }}
          >
            {view === "example" ? "Switch to States" : "Switch to Example"}
          </button>
        </div>
        <div className="example-view" hidden={view !== "example"}>
          <Example />
        </div>
        <div className="states-view" hidden={view !== "states"}>
          <States />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<SwithView />, document.getElementById("reactapp"));
