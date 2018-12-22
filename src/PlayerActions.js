export default class PlayerActions {
  constructor(playerState, playerControls) {
    this.inProgress = false;
    this.actionStack = [];
    this.playerState = playerState;
    this.playerControls = playerControls;
    this.classList = new Set();
    this.actionMap = {
      jump: this.jump
    };

    this.walkStep = 5;
    this.runStep = 15;

    setInterval(() => {
      this.live();
    }, 10);
  }

  live() {
    // console.log('is living');
    // console.table(this.playerState);
    this.handleMoveForward(this);
    this.handleMoveBackward(this);
    this.handleCrouchDown(this);
  }

  async do(action) {
    if (typeof this.actionMap[action] === 'function') {
      await this.actionMap[action](this);
    }
  }

  setState(playerState) {
    this.playerState = playerState;
  }

  addClass(className) {
    this.classList.add(className);
    this.playerControls.setClasses(this.classList);
  }

  removeClass(className) {
    if (!this.classList.has(className)) {
      return;
    }
    this.classList.delete(className);
    this.playerControls.setClasses(this.classList);
  }

  hasClass(className) {
    return this.classList.has(className);
  }

  async jump(self) {
    return new Promise((resolve, reject) => {
      self.addClass('jump');

      setTimeout(() => {
        self.removeClass('jump');
        resolve();
      }, 1000);
    });
  }

  handleMoveForward(self) {
    if (!self.playerState.movingForward) {
      return;
    }
    const playerPosition = self.playerControls.position;
    const oldPosition = playerPosition();
    const stepLengh = self.playerState.running ? self.runStep : self.walkStep;

    playerPosition(oldPosition + stepLengh);
  }

  handleMoveBackward(self) {
    if (!self.playerState.movingBackward) {
      return;
    }

    const { position: playerPosition } = self.playerControls;

    const oldPosition = playerPosition();
    const stepLengh = self.playerState.running ? self.runStep : self.walkStep;

    playerPosition(oldPosition - stepLengh);
  }

  handleCrouchDown(self) {
    if (self.playerState.crouchDown) {
      self.addClass('crouchDown');
    } else {
      self.removeClass('crouchDown');
    }
  }
}
