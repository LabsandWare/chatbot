import React from 'react';

import { NavBar } from './navbar.js';
import { Board } from './board.js';

export class Bot extends React.Component {
  render() {
    return(
      <div>
        <NavBar />
        <Board />
      </div>
    )
  }
} 