export class RoomException extends Error {
  constructor(message) {
    super(message);
    this.name = "RoomError";
  }
}