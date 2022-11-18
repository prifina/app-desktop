import {
  Image,
} from "@blend-ui/core";

import PropTypes from "prop-types";
import CardContainer from "./CardContainer";

const Card = ({ cognitoMetricImage, detailsClick }) => {
  // console.log("IMAGE ", props);
  const image = `data:image/png;base64,${cognitoMetricImage.result}`;

  return (
    <CardContainer onClick={detailsClick} style={{ cursor: "pointer" }}>
      <Image src={image} />

    </CardContainer>
  );
};

Card.propTypes = {
  cognitoMetricImage: PropTypes.object,
  detailsClick: PropTypes.func,
};
export default Card;
