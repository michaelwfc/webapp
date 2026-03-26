import React from "react";
import "./styles.css";
import Header from "../Header";

/**
 * Define States, a React component of CS142 Project 4, Problem 2. The model
 * data for this view (the state names) is available at
 * window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      states: window.cs142models.statesModel(),
      substringInput: "",
      filterStateList: window.cs142models.statesModel(),
    };
    console.log(
      "window.cs142models.statesModel()",
      window.cs142models.statesModel(),
    );

    this.handleSubstringChangeBound = (event) =>
      this.handleSubstringChange(event);

    this.handleFilterStatesBound = (event) => this.handleFilterStates(event);
  }

  handleSubstringChange(event) {
    const substring = event.target.value;

    // useing for loop to  filter the states
    // let filterList = [];
    // this.setState({ filterStateList: [] });

    // for (let i = 0; i < this.state.states.length; i++) {
    //   let state = this.state.states[i].toLowerCase();
    //   if (state.includes(substring.toLowerCase())) {
    //     filterList.push(state);
    //   }
    // }

    const filterList = this.state.states
      .filter((state) => state.toLowerCase().includes(substring.toLowerCase()))
      .sort();

    // update the state
    this.setState({
      substringInput: substring,
      filterStateList: filterList,
    });
  }

  render() {
    return (
      <div>
        <Header />
        <h1>CS142 Project 4 React.js Problem 2</h1>
        <div className="substring-input-section">
          <label htmlFor="substring-input">Substring Input: </label>
          <input
            id="substring-input"
            type="text"
            placeholder="Enter a string"
            onChange={this.handleSubstringChangeBound}
            value={this.state.substringInput}
          ></input>
        </div>
        <div className="substring-output-section">
          <label htmlFor="substring-output">Substring Output:</label>
          <textarea
            id="substring-output"
            value={this.state.substringInput}
            readOnly
          ></textarea>
        </div>
        {/* show the filtered states */}
        <div className="filter-states-section">
          {this.state.filterStateList.length === 0 &&
          this.state.substringInput !== "" ? (
            <p>No states match "{this.state.substringInput}"</p>
          ) : (
            <ul>
              {this.state.filterStateList.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default States;
