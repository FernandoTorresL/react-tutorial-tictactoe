import React from "react";
import ReactDom from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={props.squareClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const cellLastMove = this.props.cellLastMove;
    const highlighted = cellLastMove === i ? "highlight_square" : "square";
    return (
      <Square
        squareClass={highlighted}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          rowColLastMove: Array(2).fill(null),
        },
      ],
      stepNumber: 0,
      cellLastMove: null,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const rowColLastMove = calculateRowColLastMove(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          rowColLastMove: rowColLastMove,
        },
      ]),
      stepNumber: history.length,
      cellLastMove: i,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step, rowCol) {
    this.setState({
      stepNumber: step,
      cellLastMove: calculateCellLastMove(rowCol),
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      const rowCol = history[move].rowColLastMove.toString();
      const rowColLastMove = move ? rowCol : null;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move, rowCol)}>
            {desc} ({rowColLastMove})
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            cellLastMove={this.state.cellLastMove}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateCellLastMove(rowCol) {
  switch (rowCol) {
    case "1,1":
      return 0;
    case "1,2":
      return 1;
    case "1,3":
      return 2;
    case "2,1":
      return 3;
    case "2,2":
      return 4;
    case "2,3":
      return 5;
    case "3,1":
      return 6;
    case "3,2":
      return 7;
    case "3,3":
      return 8;
    default:
      return null;
  }
}

function calculateRowColLastMove(cell) {
  switch (cell) {
    case 0:
      return [1, 1];
    case 1:
      return [1, 2];
    case 2:
      return [1, 3];
    case 3:
      return [2, 1];
    case 4:
      return [2, 2];
    case 5:
      return [2, 3];
    case 6:
      return [3, 1];
    case 7:
      return [3, 2];
    case 8:
      return [3, 3];
    default:
      return Array(2).fill(null);
  }
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

// ========================================

ReactDom.render(<Game />, document.getElementById("root"));
