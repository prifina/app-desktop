import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import '../assets/scss/style.css';



/**
 * Primary UI component for user interaction
 */
const Button = ({ btnType = 'default', backgroundColor,variant, fullWidth, size,className, label, ...props }) => {
  // console.log('btnType',btnType)

  return (
    <button
      type="button"
      className={[ `storybook-button--${btnType}` ,(size) ? `storybook-button--${size}` : ``,(variant) ? `storybook-button--${variant}` : ``, (fullWidth) ? `storybook-button--btn-block` : '',(className)? className:``].join(' ')}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  btnType:  PropTypes.oneOf(['default', 'primary', 'secondary']),
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * How variant should the button be?
   */
  variant: PropTypes.oneOf(['solid', 'outline']),
  /**
   * How fullWidth should the button be?
   */
  fullWidth: PropTypes.bool,
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  /**
   * Button contents
   */
  className: PropTypes.string.isRequired,


};

Button.defaultProps = {
  backgroundColor: null,
  btnType: 'default',
  size: 'medium',
  variant:'solid',
  fullWidth:'false',
  onClick: undefined,
  className:''
};

export default Button;