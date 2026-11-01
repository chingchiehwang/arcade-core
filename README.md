# @chingchiehwang/arcade-core

Game logic for 2048. Every function takes a board and returns a new one.

Install:

```sh
npm install @chingchiehwang/arcade-core
```

Call:

```js
import { move, generateBlock, isDirectionMovable, isMovable, movePoints, Direction } from '@chingchiehwang/arcade-core';
```

`movePoints(board, direction)` returns the points a move earns.
