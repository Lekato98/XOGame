function getServer() {
  const host = window.document.location.host.replace(/:.*/, '');
  return location.protocol.replace("http", "ws") + "//" + host + (location.port
      ? ':'
      + location.port : '')
}

console.log(getServer());

function getUser() {
  return localStorage.getItem(USER);
}