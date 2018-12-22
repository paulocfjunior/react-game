export default class ContextActions {
  constructor() {
    this.handlers = {
      Escape: this.handleEscape
    };
  }

  execute(action, callback) {
    console.log('ContextActions:', action);
    this.handlers[action](callback);
  }

  handleEscape(callback) {
    callback();
  }
}
