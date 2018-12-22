import React, { Component } from 'react';
import Player from './Player';
import './styles/Scenario.scss';

class Scenario extends Component {
  render() {
    return (
      <section className="scenario">
        <Player />
      </section>
    );
  }
}

export default Scenario;
