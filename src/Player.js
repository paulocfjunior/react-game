import React, { Component } from 'react';
import PlayerActions from './PlayerActions';
import './styles/Player.scss';

const allowedMovementKeys = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Space',
  'Escape'
];

const initialPlayerState = {
  movingForward: false,
  movingBackward: false,
  crouchDown: false,
  running: false,
  alive: true
};

const allowedModifierKeys = ['ctrlKey', 'shiftKey'];

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerClassList: ['Player'],
      playerPosition: 20
    };

    this.handleMovements = this.handleMovements.bind(this);
    this.updatePlayerStatesEnable = this.updatePlayerStatesEnable.bind(this);
    this.updatePlayerStatesDisable = this.updatePlayerStatesDisable.bind(this);

    this.setPlayerClasses = this.setPlayerClasses.bind(this);
    this.playerPosition = this.playerPosition.bind(this);

    this.playerControls = {
      setClasses: this.setPlayerClasses,
      position: this.playerPosition
    };

    this.playerState = initialPlayerState;

    this.player = new PlayerActions(this.playerState, this.playerControls);
    this.inProgress = false;
  }

  async handleMovements(event) {
    const { code: action } = event;

    const activeModifiers = allowedModifierKeys.filter(modifier => {
      return event[modifier] === true;
    });

    if (
      this.inProgress ||
      (!allowedMovementKeys.includes(action) && activeModifiers.length === 0)
    ) {
      return;
    }

    await this.player.do(action);
  }

  isKeyCombinationAllowed(key, shiftKey, ctrlKey) {
    return allowedMovementKeys.includes(key) || shiftKey || ctrlKey;
  }

  async updatePlayerStatesEnable(event) {
    const { code: key, shiftKey, ctrlKey } = event;
    if (!this.isKeyCombinationAllowed(key, shiftKey, ctrlKey)) {
      return;
    }

    let newState = {};

    console.log(key);

    switch (key) {
      case 'Escape':
        this.playerPosition(20);
        this.playerState = initialPlayerState;
        this.player.setState(this.playerState);
        break;
      case 'ArrowRight':
        newState = Object.assign(newState, {
          movingForward: true,
          movingBackward: false
        });
        break;
      case 'ArrowLeft':
        newState = Object.assign(newState, {
          movingBackward: true,
          movingForward: false
        });
        break;
      case 'ArrowDown':
        newState = Object.assign(newState, { crouchDown: true });
        break;
      case 'Space':
      case 'ArrowUp':
        newState = Object.assign(newState, { crouchDown: false });
        await this.player.do('jump');
        break;

      default:
        if (ctrlKey || key === 'ArrowDown') {
          newState = Object.assign(newState, { crouchDown: true });
        }

        if (shiftKey) {
          newState = Object.assign(newState, { running: true });
        }
    }

    this.playerState = Object.assign(this.playerState, newState);

    this.player.setState(this.playerState);
  }

  async updatePlayerStatesDisable(event) {
    const { code: key, shiftKey, ctrlKey } = event;
    if (!this.isKeyCombinationAllowed(key, shiftKey, ctrlKey)) {
      return;
    }

    let newState = {};

    if (key === 'ArrowRight') {
      newState = Object.assign(newState, { movingForward: false });
    }

    if (key === 'ArrowLeft') {
      newState = Object.assign(newState, { movingBackward: false });
    }

    if (!ctrlKey && key === 'ArrowDown') {
      newState = Object.assign(newState, { crouchDown: false });
    }

    if (!shiftKey) {
      newState = Object.assign(newState, { running: false });
    }

    this.playerState = Object.assign(this.playerState, newState);

    await this.player.setState(this.playerState);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.updatePlayerStatesEnable, false);
    document.addEventListener('keyup', this.updatePlayerStatesDisable, false);
  }

  componentWillUnmount() {
    document.removeEventListener(
      'keydown',
      this.updatePlayerStatesEnable,
      false
    );
    document.removeEventListener(
      'keyup',
      this.updatePlayerStatesDisable,
      false
    );
  }

  setPlayerClasses(classSet) {
    classSet.add('Player');
    this.setState({ playerClassList: [...classSet] });
  }

  playerPosition(newPosition) {
    if (newPosition) {
      this.setState({ playerPosition: newPosition });
    } else {
      return this.state.playerPosition;
    }
  }

  render() {
    return (
      <div
        className={this.state.playerClassList.join(' ')}
        style={{ left: this.state.playerPosition + 'px' }}
      />
    );
  }
}

export default Player;
