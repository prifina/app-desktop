import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { useTheme  } from "@blend-ui/core";
import colors from "../lib/colors";
// import '../assets/scss/style.css';




/**
 * Primary UI component for user interaction
 */
const Button = ({ btnType = 'default', backgroundColor,variant, fullWidth, size,className, label, ...props }) => {
  const theme = useTheme();
  // console.log('btnType',theme)

  const Btn = styled.div`
  .storybook-button--default, .storybook-button--primary, .storybook-button--secondary {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: .5rem 1.5rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 2rem;
    -webkit-transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
  }
  
  .storybook-button--primary {
    color: ${theme.colors.textLight};
    background-color: ${colors.btn_pry};
    border-color: ${colors.btn_pry};
  }
  
  .storybook-button--secondary {
    color: ${theme.colors.textLight};
    background-color: ${colors.btn_scd};
    border-color: ${colors.btn_scd};
  }
  
  .storybook-button--small {
    padding: .5rem 1rem;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 2rem;
  }
  
  .storybook-button--medium {
    padding: .5rem 1.5rem;
    font-size: 14px;
    line-height: 1.5;
    border-radius: 2rem;
  }
  
  .storybook-button--large {
    padding: .5rem 1.5rem;
    font-size: 16px;
    line-height: 1.5;
    border-radius: 2rem;
  }
  
  .storybook-button--solid {
    color: ${theme.colors.textLight};
    background-color: ${colors.btn_pry};
    border-color: ${colors.btn_pry};
  }
  
  .storybook-button--outline {
    color: ${colors.btn_pry};
    background-color: transparent;
    border-color: ${colors.btn_pry};
  }
  
  .storybook-button--btn-block {
    display: block;
    width: 100%;
  }
  `;
  return (
    <Btn>
    <button
      type="button"
      className={[ `storybook-button--${btnType}` ,(size) ? `storybook-button--${size}` : ``,(variant) ? `storybook-button--${variant}` : ``, (fullWidth) ? `storybook-button--btn-block` : '',(className)? className:``].join(' ')}
      {...props}
    >
      {label}
    </button>
    </Btn>
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