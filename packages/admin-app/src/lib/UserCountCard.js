import {

  Text,
} from "@blend-ui/core";

import { useTranslate } from "@prifina-apps/utils";
import PropTypes from "prop-types";
import CardContainer from "./CardContainer";

const Card = ({ userCount }) => {
  // console.log("COUNT ", props);

  const { __ } = useTranslate();
  return (
    <CardContainer>
      <Text textStyle="h5">{userCount}</Text>
      <Text textStyle="caption2">{__("User Count")}</Text>
    </CardContainer>
  );
};

Card.propTypes = {
  userCount: PropTypes.number,
};
export default Card;
