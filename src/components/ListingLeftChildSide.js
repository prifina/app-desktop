import React from 'react';
import PropTypes from 'prop-types';
import '../assets/scss/style.css';
import { ReactComponent as Back } from '../assets/images/arrow.svg';


const ListingLeftChildSide = ({ user, onLogin, onLogout, onCreateAccount }) => (
    <div className="SubMenuSideBar">
      <h5><a className="back-to-home-navigation"><Back className="mr-1"/> Back to Home</a></h5>
      <ul>
        <li className="active" > <a href="#">Connections </a></li>
        <li> <a href="#"> Events </a> </li>
        <li> <a href="#"> Files </a> </li>
        <li> <a href="#"> Groups </a> </li>
        <li> <a href="#"> Journeys </a> </li>
        <li> <a href="#"> Photos </a> </li>
        <li> <a href="#"> Places </a> </li>
        <li> <a href="#"> Posts </a> </li>
      </ul>
  </div>
);

ListingLeftChildSide.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
};

ListingLeftChildSide.defaultProps = {
  user: null,
};

export default ListingLeftChildSide;