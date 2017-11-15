export class Context {
  constructor(ctx) {
    this.ctx = ctx;
  }

  handleError(msg, data) {
    console.error(msg, data)
    throw new Error(msg)
  }
}
