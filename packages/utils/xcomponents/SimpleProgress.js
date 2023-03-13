/* eslint-disable react/no-unknown-property */
import React from "react";

import styled from "styled-components";

import PropTypes from "prop-types";

const Tracker = ({ className, variation, steps, active, w }) => {
  //console.log("TRACKER ", variation, steps, active)
  return <div className={className}>
    <ul className={variation}>
      {Array(steps).fill(0).map((step, i) => {
        //console.log("STEP ", i)
        return <li key={"step-" + i} w={w} className={`horizontal ${i === active ? "is-active" : i < active ? "is-ready" : ""}`} />
      })}

    </ul>
  </div>
}

Tracker.propTypes = {
  className: PropTypes.string,
  variation: PropTypes.string,
  steps: PropTypes.number,
  active: PropTypes.number,
  w: PropTypes.string
};

Tracker.displayName = "Tracker";
const propsCheck = (props) => {
  //console.log("PROPS ", props);
  /* padding: 3px 30px 3px 30px; */
  let widthProp = Math.floor(100 / props.steps) - 1;
  let paddingLeft = 30;
  let paddingRight = 30;
  const maxWidth = parseInt(props.w);
  const stepsWidth = props.steps * 70;
  //console.log(maxWidth, stepsWidth);
  if (stepsWidth >= maxWidth) {
    //console.log(maxWidth, stepsWidth);
    const paddingMin = Math.max(2, stepsWidth - maxWidth);
    paddingLeft -= paddingMin;
    paddingRight -= paddingMin;
    //console.log(paddingMin);
    widthProp -= 1;
  }
  const newWidth = (maxWidth * widthProp / 100) * props.steps + (10 * props.steps);
  if (newWidth >= maxWidth) {
    widthProp -= 1;
  }
  //console.log(paddingLeft, widthProp, newWidth);

  return [{ width: widthProp + "%" }, { paddingLeft: paddingLeft + "px" }, { paddingRight: paddingRight + "px" }]
}

// if texts... then 11px->16px
const SimpleProgress = styled(Tracker)`
.tracker-arrow,.tracker {
  padding: 0;
  list-style-type: none;
  clear: both;
  line-height: 1em;
  margin: 0 -1px;
  text-align: center;
  font-size: 12px;
}

.tracker-arrow li.horizontal,.tracker li.horizontal {
  float:left;
}
.tracker-arrow li {
  background: grey;
  /* padding: 10px 30px 10px 30px; */
  padding-top:10px;
  padding-bottom:10px;
  position: relative;
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
  ${propsCheck};
  margin: 0 4px;
}
.tracker li {
  background: grey;
  padding-top:3px;
  padding-bottom:3px;
  /* padding: 3px 30px 3px 30px; */
  position: relative;
  border: 1px solid grey;

  ${propsCheck};
  margin: 0 4px;
}

.tracker-arrow li.is-active {
  background: orange;
  border-color: orange;
  &:after {
    border-left: 11px solid orange;
  }
}

.tracker li.is-active {
  background: orange;
  border-color: orange;
}

.tracker-arrow li.is-ready {
  background: green;
  border-color: green;
  &:after {
    border-left: 11px solid green;
  }
}

.tracker li.is-ready {
  background: green;
  border-color: green;
}


.tracker-arrow li:after {
  content: '';
  border-left: 11px solid grey;
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  position: absolute;
  top: 0;
  left: 100%;
  z-index: 9;
}


.tracker-arrow li:before {
  content: '';
  border-left: 11px solid #fff;
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  position: absolute;
  top: 0;
  left: 0;
}

`;

export default SimpleProgress;