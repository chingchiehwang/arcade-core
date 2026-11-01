export const Direction = Object.freeze({
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down'
});

function copyGrid(board) {
  const copy = [];
  for (let r = 0; r < 4; r++) {
    const row = [];
    for (let c = 0; c < 4; c++) {
      row.push(board[r][c]);
    }
    copy.push(row);
  }
  return copy;
}

function removeZeros(row) {
  const tiles = [];
  for (let i = 0; i < row.length; i++) {
    if (row[i] !== 0) tiles.push(row[i]);
  }
  return tiles;
}

function collideNeighbors(tiles) {
  const newTiles = [];
  let points = 0;
  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      newTiles.push(tiles[i] * 2);
      points += tiles[i] * 2;
      i += 2;
    } else {
      newTiles.push(tiles[i]);
      i += 1;
    }
  }
  return { tiles: newTiles, points };
}

function fillZeros(tiles) {
  const newRow = tiles.slice();
  while (newRow.length < 4) {
    newRow.push(0);
  }
  return newRow;
}

function slideRowLeft(row) {
  const tiles = removeZeros(row);
  const collided = collideNeighbors(tiles);
  const newRow = fillZeros(collided.tiles);
  return { row: newRow, points: collided.points };
}

function slideLeft(board) {
  const newBoard = [];
  let points = 0;
  for (let r = 0; r < 4; r++) {
    const result = slideRowLeft(board[r]);
    newBoard.push(result.row);
    points += result.points;
  }
  return { board: newBoard, points };
}

function transpose(board) {
  const newBoard = [];
  for (let r = 0; r < 4; r++) {
    const row = [];
    for (let c = 0; c < 4; c++) {
      row.push(board[c][r]);
    }
    newBoard.push(row);
  }
  return newBoard;
}

function reverseRows(board) {
  const newBoard = [];
  for (let r = 0; r < 4; r++) {
    newBoard.push(board[r].slice().reverse());
  }
  return newBoard;
}

function slideBoard(board, direction) {
  if (direction === Direction.LEFT) {
    return slideLeft(board);
  }

  if (direction === Direction.RIGHT) {
    const result = slideLeft(reverseRows(board));
    return { board: reverseRows(result.board), points: result.points };
  }

  if (direction === Direction.UP) {
    const result = slideLeft(transpose(board));
    return { board: transpose(result.board), points: result.points };
  }

  const result = slideLeft(reverseRows(transpose(board)));
  return { board: transpose(reverseRows(result.board)), points: result.points };
}

export function move(board, direction) {
  return slideBoard(board, direction).board;
}

export function generateBlock(board, rng = Math.random) {
  const newBoard = copyGrid(board);

  const emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (newBoard[r][c] === 0) emptyCells.push({ row: r, col: c });
    }
  }

  if (emptyCells.length === 0) return newBoard;

  const cell = emptyCells[Math.floor(rng() * emptyCells.length)];
  const value = rng() < 0.9 ? 2 : 4;
  newBoard[cell.row][cell.col] = value;
  return newBoard;
}

export function isDirectionMovable(board, direction) {
  return JSON.stringify(move(board, direction)) !== JSON.stringify(board);
}

export function isMovable(board) {
  return (
    isDirectionMovable(board, Direction.LEFT) ||
    isDirectionMovable(board, Direction.RIGHT) ||
    isDirectionMovable(board, Direction.UP) ||
    isDirectionMovable(board, Direction.DOWN)
  );
}

export function movePoints(board, direction) {
  return slideBoard(board, direction).points;
}
