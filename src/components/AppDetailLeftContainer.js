import React from 'react';
import PropTypes from 'prop-types';
import '../assets/scss/style.css';
import {ThumbnailImage} from "./Image";
import {TableInformation} from "./TableInformation";
import Button from "./Button";
import { ReactComponent as Vector4 } from '../assets/Vector-4.svg';


const AppDetailLeftContainer = ({ user, onLogin, onLogout, onCreateAccount }) => (
    <div className="left-side-app-detail">

      <h4> <Vector4 />  Browse Apps</h4> 

      <div>
        <ThumbnailImage />

        <div>
          <Button
          btnType="primary"
          fullWidth={true}
          label="Install"
          variant="solid"
          className="mt-1 mb-1"
          />
        </div>
        <div>
          <Button
            btnType="secondary"
            fullWidth={true}
            label="Report App Issues"
            size="medium"
            variant="outline"
            className="mt-1 mb-1"
          />
        </div>
        <div>
          <Button
            btnType="secondary"
            fullWidth={true}
            label="Email Support"
            size="medium"
            variant="outline"
            className="mt-1 mb-1"
          />
        </div>
        <div>
          <h4>Data Permissions</h4>
          <p>This data will only use data locally and no data will be shared out side of your data cloud.</p>
        </div>
        <div>
          <h4>Compatibility</h4>
          <p>This app shares the following profiles [Profile 1] [Profile 2] with third parties (Bank of America) and (Shazam) in order to provide the apps services.</p>
        </div>
        <TableInformation />
      </div>
      
    </div>
);

AppDetailLeftContainer.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
};

AppDetailLeftContainer.defaultProps = {
  user: null,
};

export default AppDetailLeftContainer;