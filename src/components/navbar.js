import React from 'react';

import './general.css';
import icon_bot from './icon_bot.jpg';

export function NavBar () {
    return(
      <nav className="navbar is-success" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <div className="navbar-item">
              <span className="image is-32x32">
                <img className="is-rounded" src={icon_bot} alt="bot icon" />
              </span> Mr John 
            </div>
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
              <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
                <circle cx="15" cy="30" r="8" fill="white"/>
                <circle cx="15" cy="55" r="8" fill="white" />
                <circle cx="15" cy="80" r="8" fill="white" />
              </svg>
            </a>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <span className="is-active">
                <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
                <circle cx="15" cy="30" r="8" fill="white"/>
                <circle cx="15" cy="55" r="8" fill="white" />
                <circle cx="15" cy="80" r="8" fill="white" />
              </svg>
              </span>
              <div className="dropdown-content">
                <p>Hello World!</p>
              </div>
            </div>
          </div>
      </nav>
    )
  }