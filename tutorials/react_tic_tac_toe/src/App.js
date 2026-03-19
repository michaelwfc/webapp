/**
 * Square component
 *
 * The export JavaScript keyword makes this function accessible outside of this file.
 * The default keyword tells other files using your code that it’s the main function in your file.
 * <button> is a JSX element. A JSX element is a combination of JavaScript code and HTML tags that describes what you’d like to display.
 *
 * @returns {JSX.Element} - Square component
 */

// export default function Board() {
//   return (
//     // use Fragments (<> and </>) to wrap multiple adjacent JSX elements
//     <>
//       <div className="board-row">
//         <button className="square">1</button>
//         <button className="square">2</button>
//         <button className="square">3</button>
//       </div>
//       <div className="board-row">
//         <button className="square">4</button>
//         <button className="square">5</button>
//         <button className="square">6</button>
//       </div>
//       <div className="board-row">
//         <button className="square">7</button>
//         <button className="square">8</button>
//         <button className="square">9</button>
//       </div>
//     </>
//   );
// }

// React provides a special function called useState that you can call from your component to let it “remember” things.
// Let’s store the current value of the Square in state, and change it when the Square is clicked.
// Import useState at the top of the file.
// Remove the value prop from the Square component.
// Instead, add a new line at the start of the Square that calls useState.
// Have it return a state variable called value:
import { useState } from "react";
/**
 * React’s component architecture allows you to create a reusable component to avoid messy, duplicated code.

 * 
 */
function Square({ value, onSquareClick }) {
  // value stores the value and setValue is a function that can be used to change the value.
  // The null passed to useState is used as the initial value for this state variable, so value here starts off equal to null.
  //   const [value, setValue] = useState(null);

  //   function handleClick() {
  //     // console.log("Clicked!");
  //     // Now you’ll change Square to display an “X” when clicked. Replace the console.log("clicked!");
  //     // event handler with setValue('X');. Now your Square component looks like this:
  //     setValue("X");
  //   }

  return (
    // By calling this set function from an onClick handler, you’re telling React to re-render that Square whenever its <button> is clicked.
    // <button className="square" onClick={handleClick}>
    // Clicking on the upper left square runs the function that the button received as its onClick prop from the Square.
    // The Square component received that function as its onSquareClick prop from the Board.
    // The Board component defined that function directly in the JSX. It calls handleClick with an argument of 0.
    <button className="square" onClick={() => onSquareClick()}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/**
 * To collect data from multiple children, or to have two child components communicate with each other, declare the shared state in their parent component instead.
 * The parent component can pass that state back down to the children via props.
 * This keeps the child components in sync with each other and with their parent.
 * @returns
 */

// function Board() {
//   const [xIsNext, setXIsNext] = useState(true);

//  Keeping the state of all squares in the Board component will allow it to determine the winner in the future.
// Lifting state into a parent component is common when React components are refactored.
// Board component so that it declares a state variable named squares that defaults to an array of 9 nulls corresponding to the 9 squares:
// const [squares, setSquares] = useState(Array(9).fill(null));

// When called as <Board xIsNext={...} squares={...} onPlay={...} />, React passes one object containing all props, not three separate arguments.
function Board({ xIsNext, squares, onPlay }) {
  // define the handleClick function inside the Board component to update the squares array holding your board’s state:
  function handleClick(i) {
    // You’ll check to see if the square already has an X or an O. If the square is already filled, you will return in the handleClick function early—before it tries to update the board state.
    if (squares[i] || calculateWinner(squares)) {
      // if the square is already filled or if there is a winner, return without updating the squares array
      return;
    }
    const nextSquares = squares.slice();

    // Each time a player moves, xIsNext (a boolean) will be flipped to determine which player goes next and the game’s state will be saved.
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // Calling the setSquares function lets React know the state of the component has changed.
    // This will trigger a re-render of the components that use the squares state (Board) as well as its child components (the Square components that make up the board).
    // setSquares(nextSquares);
    // You’ll update the Board’s handleClick function to flip the value of xIsNext:
    // setXIsNext(!xIsNext);

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    // Now your Board component needs to pass the value prop down to each Square that it renders:
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {/* When you were passing onSquareClick={handleClick}, you were passing the handleClick function down as a prop. You were not calling it! */}
        {/* <Square value={squares[0]} onSquareClick={handleClick} /> */}
        {/* But now you are calling that function right away—notice the parentheses in handleClick(0)—and that’s why it runs too early. You don’t want to call handleClick until the user clicks! */}
        {/* <Square value={squares[0]} onSquareClick={handleClick()} /> */}
        {/* Notice the new () => syntax. Here, () => handleClick(0) is an arrow function, which is a shorter way to define functions.
         When the square is clicked, the code after the => “arrow” will run, calling handleClick(0). */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

//return (
// a. you will use props to pass the value each square should have from the parent component (Board) to its child (Square).
// function Square({ value }) indicates the Square component can be passed a prop called value.
// <>
//   <div className="board-row">
//     <Square value="1" />
//     <Square value="2" />
//     <Square value="3" />
//   </div>
//   <div className="board-row">
//     <Square value="4" />
//     <Square value="5" />
//     <Square value="6" />
//   </div>
//   <div className="board-row">
//     <Square value="7" />
//     <Square value="8" />
//     <Square value="9" />
//   </div>
// </>
// )；
//}

// return (
// <>
//   <div className="board-row">
//     <Square />
//     <Square />
//     <Square />
//   </div>
//   <div className="board-row">
//     <Square />
//     <Square />
//     <Square />
//   </div>
//   <div className="board-row">
//     <Square />
//     <Square />
//     <Square />
//   </div>
// </>
// );
//}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);

  // you’re now using the history state variable to store this information.
  const [history, setHistory] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);

  //   modify the Game component to render the currently selected move, instead of always rendering the final move:
  //   const currentSquares = history[history.length - 1];
  const currentSquares = history[currentMove];

  //create a handlePlay function inside the Game component that will be called by the Board component to update the game.

  function handlePlay(nextSquares) {
    //You’ll want to update history by appending the updated squares array as a new history entry.
    //   creates a new array that contains all the items in history, followed by nextSquares
    // setHistory([...history, nextSquares]);

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    setHistory(nextHistory);
    // Each time a move is made, you need to update currentMove to point to the latest history entry.
    setCurrentMove(nextHistory.length - 1);

    // You also want to toggle xIsNext, just as Board used to do:
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    //update the jumpTo function inside Game to update that currentMove.
    // You’ll also set xIsNext to true if the number that you’re changing currentMove to is even.
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      // Each child in a list should have a unique "key" prop.
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        {/* Pass xIsNext, currentSquares and handlePlay as props to the Board component: */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
