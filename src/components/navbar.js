import React from 'react';

import './general.css';
import law_icon from './law_icon.png';

export class NavBar extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        hide: true
      }
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) =>  { 
      e.preventDefault();  
      this.setState({hide: !this.state.hide})
      console.log('The link was clicked.'); 
    }

    render() {

      let sub_menu = this.state.hide ? '': "show-submenu";

      return(
        <nav className="nav navbar is-success">

            <div className="nav__title navbar-item" role="navigation">
              <span className="image is-32x32">
                <img className="is-rounded" src={law_icon} alt="bot icon" />
              </span>  Mr John
            </div>
            <ul className="nav__list">
              <li className={"nav__item dropdown " + sub_menu}>
                <span onClick={this.handleClick}>
                  <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
                    <circle cx="15" cy="30" r="8" fill="white"/>
                    <circle cx="15" cy="55" r="8" fill="white" />
                    <circle cx="15" cy="80" r="8" fill="white" />
                  </svg>
                </span>
                <nav className="submenu">
                  <ul className="submenu-items">
                    <li className="submenu-item"><a href="https://legalnaija.com/" className="submenu-link">Home</a></li>
                    <li className="submenu-item"><a href="https://app.legalnaija.com" className="submenu-link">Contact Support</a></li>
                    <li className="submenu-item"><a href="https://app.legalnaija.com/lawyers" className="submenu-link">Find a Lawyer</a></li>
                    <li className="submenu-item"><a href="https://legalnaija.com/shop/" className="submenu-link">Get Legal Resource</a></li>
                    <li className="submenu-item"><a href="https://legalnaija.com/blawg/" className="submenu-link">Read Legal Article</a></li>
                    <li className="submenu-item"><a href="https://legalnaija.com/online-dispute-resolution/" className="submenu-link">Fill an ADR Case</a></li>
                    <li className="submenu-item"><a href="https://app.legalnaija.com/agreement" className="submenu-link">Get Agreement Template</a></li>
                    <li className="submenu-item"><a href="https://app.legalnaija.com" className="submenu-link">End Chat</a></li>
                  </ul>
                </nav>
              </li>
            </ul>
        </nav>
      )
    }
}