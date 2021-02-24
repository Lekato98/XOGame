const client = new Colyseus.Client(getServer());
const rematchBtn = document.querySelector('#rematch');
const leaveBtn = document.querySelector('#leave');

const MOVE = 'MOVE';
const REMATCH = 'REMATCH';
const ERROR_MESSAGE = 'ERROR_MESSAGE';
const USER = 'user';
const PLAYER = 'PLAYER';

async function joinGame() {
  try {
    const username = getUser();
    const res = await fetch(`/player/${username}`, {
          headers: {'Content-Type': 'application/json', user: username},
          method: 'GET',
        },
    );

    const {seat, joinType} = await res.json();

    const room = await client.consumeSeatReservation(seat);

    prepareRoomListeners(room, joinType);
  } catch (err) {
    console.error(err);
  }
}

function leaveGame(room) {
  leaveBtn.addEventListener('click', () => {
    room.leave();
    window.location.replace('/');
  });
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
    setGrid(state.gameStateHandler.grid);
    if (state.gameStateHandler.isGameOver === true) {
      gameOver(state);
    }
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

  leaveGame(room);

  if (joinType === PLAYER) {
    gridCell(room);
    rematch(room);
  }
}

function rematch(room) {
  rematchBtn.addEventListener('click', () => {
    room.send(REMATCH);
  });
}

function gridCell(room) {
  const cells = Array.from(document.querySelectorAll('td'));
  cells.map((cell, index) => {
    cell.addEventListener('click', () => {
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

function gameOver(state) {
  let message;
  if (state.gameStateHandler.result === 'DRAW') {
    message = 'DRAW';
  } else {
    message = `The Winner Is Player ${state.gameStateHandler.winner === 'D'
        ? 'DRAW'
        : state.gameStateHandler.winner}`;
  }
  alert(message);
}

function main() {
  joinGame().catch(err => console.error(err));
}

main();