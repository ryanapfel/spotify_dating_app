import React, { useState, useEffect } from "react";
import constate from "constate";
import { useFormContext, useAction } from "../context/auth.js";
import axios from "axios";
import * as CONST from "../context/constants.js";

import { User, TopArtists, TopTracks, UserProfile } from "./UserComponents.js";
import { MatchContainer } from "./MatchingComponents.js";

import Nav from "./nav.js";

import { Button, Flex, Box } from "rebass";

export default () => {
  useEffect(() => {
    document.title = CONST.PORTAL_TITLE;
  }, []);

  return (
    <>
      <Flex>
        <UserProfile width={25 / 100} />
        <Box width={75 / 100} sx={{ minHeight: "100vh" }} bg="lightgray">
          <Nav></Nav>
          <MatchContainer />
        </Box>
      </Flex>
    </>
  );
};
