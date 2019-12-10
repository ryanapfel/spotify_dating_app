import React, { useState, useEffect } from "react";
import { useFormContext, useAction } from "../context/auth.js";
import axios from "axios";
import * as CONST from "../context/constants.js";
import {
  useSpotify,
  usePromise,
  spotifyRequest,
  setEmptyState,
  strapiPost,
  createDatingInfo,
  updateUser,
  getSpotifyDatingInfo,
  getUsersNotMatchedWith,
  createMatch,
  createLike,
  getAllUsers,
  getUser
} from "../context/api.js";
import ReactCountryFlag from "react-country-flag";
import placeholder from "../assets/placeholder.png";
import Navigation from "./Navigation.js";

import { Heading, Text, Image, Box, Flex } from "rebass";
import { LoadingButton } from "./LoadingButton";

export const UserProfile = ({ width }) => {
  const globalState = useFormContext();
  const nonSpotify = getUser(
    globalState.values.token,
    globalState.values.user_id
  );

  const [state, promisedApiCall] = usePromise([nonSpotify]);

  useEffect(() => {
    promisedApiCall();
  }, []);

  if (state.loading) {
    return <Box width={width} px={4} py={4} />;
  }

  if (state.data) {
    const userData = state.data[0].data.datinginfo;
    const username = state.data[0].data.username;
    const hasImage =
      userData.user_info.images.length === 0
        ? placeholder
        : userData.user_info.images[0].url;

    return (
      <Box width={width} px={4} py={4}>
        <Flex flexDirection="column" justifyContent="center">
          <Image
            src={hasImage}
            variant="avatar"
            sx={{ width: "85px", margin: "auto" }}
          />

          <Heading py={2} sx={{ margin: "auto" }} fontSize={[2]}>
            {userData.user_info.display_name}
          </Heading>
          <Text color="darkgrey" sx={{ margin: "auto" }} fontSize={[1]}>
            {userData.user_info.email}
          </Text>
          <Text color="darkgrey" py={2} sx={{ margin: "auto" }} fontSize={[1]}>
            {username}
          </Text>
        </Flex>

        <Navigation />
      </Box>
    );
  }
  return "";
};
