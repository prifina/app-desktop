import React from 'react';
import PropTypes from 'prop-types';
import '../assets/scss/style.css';

import { ReactComponent as PrifinaVectorIcon } from '../assets/images/Icon1.svg';
import { ReactComponent as Dashboard } from '../assets/images/dashboard.svg';
import { ReactComponent as Cloud } from '../assets/images/cloud.svg';
import { ReactComponent as Search } from '../assets/images/search.svg';
import { ReactComponent as Rectangle } from '../assets/images/Rectangle.svg';

const ListingLeftMainSide = ({ user, onLogin, onLogout, onCreateAccount }) => (
    <div className="mainSideBar">
        <ul className="vertical-main-menu">
          <li className="active"><Rectangle className="active-left-li"/> <a href="#"><PrifinaVectorIcon /> </a> </li>
          <li> <a href="#"><Dashboard /> </a> </li>
          <li> <a href="#"><Cloud /> </a> </li>
          <li> <a href="#"><Search /> </a> </li>
        </ul>
    </div>
);

ListingLeftMainSide.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
};

ListingLeftMainSide.defaultProps = {
  user: null,
};

export default ListingLeftMainSide;