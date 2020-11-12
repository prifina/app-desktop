import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as PrifinaLogo } from "../assets/prifina.svg";
import { ReactComponent as PrifinaText } from "../assets/prifina-text.svg";
import Line from "../assets/Line.png";
import { ReactComponent as Search } from '../assets/images/search.svg';



const AppDetailHeaderContainer = ({ user, onLogin, onLogout, onCreateAccount }) => (
  <header>
    <div className="wrapper">
      <div className="header-container mt-4">
        <PrifinaLogo className="site-logo-icon"/> <PrifinaText className="site-logo-text"/> <span className="sit-tagline-divider"></span> <span className="site-tagline">App Directory</span>
        <div style={{marginLeft:'310px'}}>
          <div className="search-box">
            <Search className="search-icon"/>
            <input className="header-searchbox" placeholder="Search app directory"></input>
          </div>
        </div> 
      </div>
    </div>
  </header>

);

AppDetailHeaderContainer.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
};

AppDetailHeaderContainer.defaultProps = {
  user: null,
};


export default AppDetailHeaderContainer;