import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Link } from "react-router-dom";

import Example from "./components/Example";
import States from "./components/States";
import "./styles/p5.css";

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
        <div className="hashrouter-section">
          <HashRouter>
            <div className="toolbar-section">
              <p>
                <Link to="/example" className="toolbar-link">
                  Example
                </Link>
              </p>
              <p>
                <Link to="/states" className="toolbar-link">
                  States
                </Link>
              </p>
            </div>
            <div className="routes-section">
              <Route path="/states" component={States} />
              <Route path="/example" component={Example} />
            </div>
          </HashRouter>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<SwithView />, document.getElementById("reactapp"));
