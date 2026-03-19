import React from "react";

class ReactAppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { yourName: "" }; //Makes `<h1>Hello {this.state.yourName}!</h1>` update reactively
  }

  handleChange(event) {
    this.setState({ yourName: event.target.value }); // setState() triggers React's reconciliation: it updates the state object and calls render() again with the new values.
  }

  // Returns an element tree with a div containing label, input, and h1 elements:
  // <div>
  //   <label>Name: </label>
  //   <input type="text" … />
  //   <h1>Hello {this.state.yourName}!</h1>
  // </div>

  //   render() {
  //     let label = React.createElement("label", null, "Name: ");
  //     let input = React.createElement("input", {
  //       type: "text",
  //       value: this.state.yourName,
  //       onChange: (event) => this.handleChange(event),
  //     });
  //     let h1 = React.createElement(
  //       "h1",
  //       null,
  //       "Hello ",
  //       this.state.yourName,
  //       "!",
  //     );
  //     return React.createElement("div", null, label, input, h1);
  //   }

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
        <h1>Hello {this.state.yourName}!</h1>
      </div>
    );
  }
}

export default ReactAppView;
