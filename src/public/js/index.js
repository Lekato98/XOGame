const client = new Colyseus.Client('ws://localhost:2567');
const createBtn = document.querySelector('#create');
const joinBtn = document.querySelector('#join');
const rematchBtn = document.querySelector('#rematch');

const MOVE = 'MOVE';
const REMATCH = 'REMATCH';
const ERROR_MESSAGE = 'ERROR_MESSAGE';

createBtn.addEventListener('click', create);
joinBtn.addEventListener('click', joinGame);

async function create() {
  try {
    const username = window.prompt('Enter your username plz', 'username');
    const type = window.prompt('Join as (Player, Spectator)',
        'PLAYER').toUpperCase();
    const info = {
      username: username,
      type: type
    };

    let get = await fetch("/game/create", {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(info),
    });

    const {seat} = await get.json();

    window.location.replace(`/game/${seat.room.roomId}`);
  } catch (err) {
    console.log(err);
  }
}

async function joinGame(event) {
  try {
    const username = window.prompt('Enter your username plz', 'username');
    const type = window.prompt('Join as (Player, Spectator)',
        'PLAYER').toUpperCase();

    const room_id = document.querySelector('#room_id').value;
    const info = {
      username: username,
      type: type
    };
    let get = await fetch(`/game/join/${room_id}`, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(info),
    });

    const {seat} = await get.json();
    window.location.replace(`/game/${seat.room.roomId}`);
  } catch (err) {
    console.error(err);
  }
}
