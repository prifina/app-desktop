import React from "react";

import styled from "styled-components";
import PropTypes from "prop-types";

/*
const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  `;
*/
const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color:#1E1D1D;
  `;
const LoadingFallback = ({ msg, ...props }) => (
  <LoadingContainer>

    <div {...props}>{msg || "Loading..."}</div>
  </LoadingContainer>
);

LoadingFallback.propTypes = {
  msg: PropTypes.string,
};

export default LoadingFallback;
