import React from "react";
import { useHistory } from "react-router-dom";

import { Link, Flex } from "rebass";

import { IoIosSearch, IoIosHeart } from "react-icons/io";

export default () => {
  const history = useHistory();

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      py={5}
      mx={{ lineHeight: "0" }}
    >
      <Link py={2} href="/portal">
        <IoIosSearch /> Find People
      </Link>
      <Link py={2} href="/portal/matches">
        <IoIosHeart /> My Matches
      </Link>
    </Flex>
  );
};
