const client = new Colyseus.Client('ws://localhost:2567');
const createBtn = document.querySelector('#create');
const joinBtn = document.querySelector('#join');

const MOVE = 'MOVE';
const ERROR_MESSAGE = 'ERROR_MESSAGE';

createBtn.addEventListener('click', createGame);
joinBtn.addEventListener('click', joinGame);

async function createGame(event) {
  const res = await fetch('/lekato', {
    headers: {'Content-Type': 'application/json'},
    method: 'GET',
  });

  const data = await res.json();
  const joinType = window
  .prompt('Join as (PLAYER, SPECTATOR)', 'PLAYER')
  .toUpperCase();

  const room = await client.create('XORoom', {type: joinType});

  prepareRoomListeners(room, joinType);
}

async function joinGame(event) {
  const room_id = document.querySelector('#room_id');
  const joinType = window
  .prompt('Join as (PLAYER, SPECTATOR)', 'PLAYER')
  .toUpperCase();
  const room = await client.joinById(room_id.value, {type: joinType});
  prepareRoomListeners(room, joinType);
}

function prepareRoomListeners(room, joinType) {
  room.onStateChange.once((state) => {
    console.log('First State: ', JSON.stringify(state, null, 2));
    setGrid(state.gameStateHandler.grid);
  });

  room.onLeave((code) => {
    console.log('Client Leave Code: ' + code);
  });

  room.onStateChange((state) => {
    console.log('Updated State:', JSON.stringify(state, null, 2));
    if (state.gameStateHandler.isGameOver) {
      alert(
          `The Winner Is Player ${state.gameStateHandler.winner === 'D' ? 'DRAW'
              : state.gameStateHandler.winner}`);
    }
    setGrid(state.gameStateHandler.grid);
  });

  room.onError((code, message) => {
    console.log('Error Code: ', code);
    console.log(message);
  });

  room.onMessage(ERROR_MESSAGE, (message) => {
    alert(message);
  });

  room.onMessage('SERVER', (message) => {
    alert(message);
  });

  room.onMessage('UPDATE_STATE', (message) => {
    alert(JSON.stringify(message, null, 2));
  });

  if (joinType == 'PLAYER') {
    gridCell(room);
  }
}

function gridCell(room) {
  const cells = Array.from(document.querySelectorAll('td'));
  cells.map((cell, index) => {
    cell.addEventListener('click', (e) => {
      room.send(MOVE, {cell_id: index});
    });
  });
}

function setGrid(grid) {
  const cells = Array.from(document.querySelectorAll('td'));
  cells.map((cell, index) => {
    cell.innerText = grid[index];
  });
}
