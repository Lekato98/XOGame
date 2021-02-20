const createBtn = document.querySelector('#create');
const joinBtn = document.querySelector('#join');

const MOVE = 'MOVE';
const REMATCH = 'REMATCH';
const ERROR_MESSAGE = 'ERROR_MESSAGE';
const USER = 'user';
const PLAYER = 'PLAYER';
const SPECTATOR = 'SPECTATOR';

createBtn.addEventListener('click', create);
joinBtn.addEventListener('click', joinGame);

async function create() {
  try {
    const type = window.prompt('Join as (Player, Spectator)',
        PLAYER).toUpperCase();
    const username = getUser();
    const info = {
      username: username,
      type: type,
    };

    const get = await fetch("/game/create", {
      headers: {'Content-Type': 'application/json', user: username},
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
    const username = getUser();
    const type = window.prompt('Join as (Player, Spectator)',
        PLAYER).toUpperCase();

    const room_id = document.querySelector('#room_id').value;
    const info = {
      username: username,
      type: type
    };

    const get = await fetch(`/game/join/${room_id}`, {
      headers: {'Content-Type': 'application/json', user: username},
      method: 'POST',
      body: JSON.stringify(info),
    });

    const {seat} = await get.json();
    window.location.replace(`/game/${seat.room.roomId}`);
  } catch (err) {
    console.error(err);
  }
}

function authorize() {
  if (localStorage.getItem(USER) !== null) {
    return;
  }

  const username = window.prompt('Enter your username', 'username');
  localStorage.setItem(USER, username);
}

authorize();