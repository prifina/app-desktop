import {
  Image,
} from "@blend-ui/core";

import PropTypes from "prop-types";
import CardContainer from "./CardContainer";

const Card = ({ cognitoMetricImage }) => {
  // console.log("IMAGE ", props);
  const image = `data:image/png;base64,${cognitoMetricImage.result}`;

  return (
    <CardContainer>
      <Image src={image} />

    </CardContainer>
  );
};

Card.propTypes = {
  cognitoMetricImage: PropTypes.object,
};
export default Card;
