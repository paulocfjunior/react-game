import React, { Component } from 'react';
import ContextActions from './ContextActions';
import Player from './Player';
import './styles/Scenario.scss';

class Scenario extends Component {
  constructor(props) {
    super(props);

    this.pauseGame = this.pauseGame.bind(this);

    this.contextActions = new ContextActions();
  }

  pauseGame() {
    this.setState({
      paused: true
    });
  }

  render() {
    return (
      <section className="Scenario">
        <div className="player-area">
          <Player />
        </div>
        <div className="floor" />
      </section>
    );
  }
}

export default Scenario;
