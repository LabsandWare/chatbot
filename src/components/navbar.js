/* @flow */
import React , { Component } from 'react';

import law_icon from './law_icon.png';

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hide: true
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (e) =>  { 
    e.preventDefault();  
    this.setState({hide: !this.state.hide});
  }

  render() {

    let sub_menu = this.state.hide ? '': "show-submenu";

    return (
      <div className="hero-head">
        <nav className="navbar is-success user-nav">
          <div className="navbar-start">
            <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                      <img src={law_icon} alt="bot icon" className="is-rounded" />
                    </figure>
                </div>
                <div className="media-content">
                    <div className="content">
                      <p>
                          <strong>Tim</strong>
                          <br />
                          <small>online</small>
                      </p>
                    </div>
                </div>
              </div>
          </div>
          <div className="navbar-end">
            <div className={"navbar-item menu dropdown " + sub_menu}>
              <span className="icon is-size-2" onClick={this.handleClick}>
                <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em">
                  <circle cx="15" cy="30" r="7" fill="white"/>
                  <circle cx="15" cy="55" r="7" fill="white" />
                  <circle cx="15" cy="80" r="7" fill="white" />
                </svg>
              </span>
              <nav className="submenu">
                <ul className="submenu-items">
                  <li className="submenu-item"><a href="https://app.legalnaija.com" className="submenu-link">Contact Support</a></li>
                  <li className="submenu-item"><a href="https://app.legalnaija.com/lawyers" className="submenu-link">Find a Lawyer</a></li>
                  <li className="submenu-item"><a href="https://legalnaija.com/shop/" className="submenu-link">Get Legal Resource</a></li>
                  <li className="submenu-item"><a href="https://legalnaija.com/blawg/" className="submenu-link">Read Legal Article</a></li>
                  <li className="submenu-item"><a href="https://legalnaija.com/online-dispute-resolution/" className="submenu-link">Fill an ADR Case</a></li>
                  <li className="submenu-item"><a href="https://app.legalnaija.com/agreement" className="submenu-link">Get Agreement Template</a></li>
                  <li className="submenu-item"><a href="https://app.legalnaija.com" className="submenu-link">End Chat</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default  NavBar;