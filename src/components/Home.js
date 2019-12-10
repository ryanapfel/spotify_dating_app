import React from "react";

import Nav from "./nav.js";

import { Heading, Flex, Box, Button } from "rebass";
import { Link } from "react-router-dom";
import { LoadingButton } from "./LoadingButton";

export default () => {
  return (
    <>
      <Nav></Nav>
      <Flex>
        <Box width={1} textAlign="center" p={5}>
          <Heading fontSize={[5, 6, 7]}>Spotify Dating App</Heading>
          <Link to="/portal">
            <Button
              variant="primary"
              my={5}
              fontSize={3}
              style={{ cursor: "pointer" }}
              mr={2}
            >
              Go to app
            </Button>
          </Link>
        </Box>
      </Flex>
    </>
  );
};
