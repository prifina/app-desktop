import React from 'react';
import PropTypes from 'prop-types';
import '../assets/scss/style.css';
import {ScreenImages} from "./Image";




const AppDetailRightContainer = ({ user, onLogin, onLogout, onCreateAccount }) => (
  
    <div className="right-side-app-detail">
      <h2>Dashboard</h2> 

      <div className="breadcrumbs-container">
        <span className="breadcrumbs-previous-page">Prifina</span><span className="breadcrumbs-divider"></span> <span className="breadcrumbs-active-page">Data</span>
      </div>

      <div>
        <ScreenImages />
        
        <div>
          <h4>Description</h4>
          <p>Have you ever wondered what insights can be gathered from your everyday data? Prifina’s dashboard app is the answer. This app allows you to view your raw data through visual analytics and insights, with additional features such as a discovery feed and third party widgets.</p> 
          <p>Feeling overwhelmed by your data? This dashboard makes understanding this information easier, by allowing you to participate and understand the analytics process by visualizing trends and occurrences. This is designed for quick analysis and informational awareness to reduce the complexity of understanding the information.</p>
        </div>

        <div>
          <h4>Key Features</h4>
          
          <h5 className="paragraph-heading-strong">Data Visualizations</h5>
          <ul className="app-details-key-features-list">
            <li>Customize your categories to view different data insights</li>
            <li>Learn how to understand your data in the form of tables, charts, and other visual gauges</li>
          </ul>
          
          

          <h5 className="paragraph-heading-strong">Data Insights</h5>
          <ul className="app-details-key-features-list">
            <li>Discover trends and patterns in your everyday life</li>
            <li>Use these insights to better understand the patterns in the different areas of your life</li>
          </ul>

          <h5 className="paragraph-heading-strong">Third Party Widgets</h5>
          <ul className="app-details-key-features-list">
            <li>Access frequently used functions directly from the dashboard</li>
            <li>Reduce the frequency of clicking to open other apps</li>
          </ul>

          <h5 className="paragraph-heading-strong">Discovery Feed</h5>
          <ul className="app-details-key-features-list">
            <li>Get customized topics and news on items that interest you</li>
            <li>Find information on your interests without searching for them</li>
          </ul>
        </div>
      </div>
      
    </div>
);

AppDetailRightContainer.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
};

AppDetailRightContainer.defaultProps = {
  user: null,
};

export default AppDetailRightContainer;