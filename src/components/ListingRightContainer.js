import React from 'react';
import PropTypes from 'prop-types';
import '../assets/scss/style.css';
import TableListing from "./TableListing";
import { ReactComponent as Filter } from '../assets/images/Icon_filter_ho.svg';
import { ReactComponent as Search } from '../assets/images/search.svg';


const ListingRightContainer = ({ user, onLogin, onLogout, onCreateAccount }) => (
    <div className="col-xs-12 col-sm mainBody">
          <div className="secondMain"><h5>Console</h5>
          <h2> Connections </h2>
          <div className="btn-group">
              <button className="btn"> Hidden Connections </button>
              <button className="btn active"> All Connections </button>
          </div>
          <div className="tabContent">
          <p className="tab-description">This is an combined list of connections pulled from the third-party applications that you installed and connected to the console</p>
          <div className="filter-and-searchbox-container">
          <div className="connection-filter-container">
            
                <Filter className="search-icon"/>
                <select className="connection-filter round">
                <option value="1"> First Name </option>
                </select>
            
          </div>
          <div className="connection-searchbox-container">
          <Search className="search-icon"/>
          <input type="text" className="header-searchbox" placeholder="Search console"/>
          </div>
          </div>

            <TableListing />
          </div>
          </div>
    </div>
    
);

ListingRightContainer.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
};

ListingRightContainer.defaultProps = {
  user: null,
};


export default ListingRightContainer;