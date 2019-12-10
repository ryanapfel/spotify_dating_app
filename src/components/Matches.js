import React, { useState, useEffect } from "react";
import constate from "constate";
import { useFormContext, useAction } from "../context/auth.js";
import axios from "axios";
import * as CONST from "../context/constants.js";
import { useHistory } from "react-router-dom";

import { User, TopArtists, TopTracks, UserProfile } from "./UserComponents.js";
import { MatchContainer } from "./MatchingComponents.js";

import {
  getUsersMatches,
  getMatch,
  getOtherUserMatch,
  deleteMatch
} from "../context/api.js";

import Nav from "./nav.js";
import Loader from "./Loader.js";

import { Button, Flex, Box, Heading, Link } from "rebass";

export const Matches = () => {
  const globalState = useFormContext();
  const myFunc = async () =>
    getUsersMatches(globalState.values.token, globalState.values.user_id);
  const [state, getMatches] = useAction(myFunc);

  useEffect(() => {
    document.title = "Matches";
    getMatches();
  }, []);

  if (state.loading) {
    return (
      <Flex>
        <UserProfile width={25 / 100} />
        <Box width={75 / 100} sx={{ minHeight: "100vh" }} bg="lightgray">
          <Nav></Nav>
          <Box mx={4}>
            <Heading>Your Matches</Heading>
            <Loader />
          </Box>
        </Box>
      </Flex>
    );
  }

  if (state.error) {
    return <p>Erro</p>;
  }

  if (state.data) {
    return (
      <Flex>
        <UserProfile width={25 / 100} />
        <Box width={75 / 100} sx={{ minHeight: "100vh" }} bg="lightgray">
          <Nav></Nav>
          <Box mx={4}>
            <Heading>Your Matches</Heading>
            {state.data.data.map((item, index) => {
              const url = `/portal/matches/${item._id}`;
              return (
                <Box py={2}>
                  <Link href={url}>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      flexDirection="row"
                      p={2}
                      variant={["smallbox"]}
                    >
                      <Heading p={2} fontSize={[2]}>
                        {item.user_name}
                      </Heading>
                    </Flex>
                  </Link>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Flex>
    );
  }

  return "";
};

export const Match = ({ match }) => {
  const globalState = useFormContext();
  const myFunc = async () =>
    getMatch(globalState.values.token, match.params.id);
  const [state, getInfo] = useAction(myFunc);
  const history = useHistory();

  const handleDelete = async () => {
    getOtherUserMatch(
      globalState.values.token,
      globalState.values.username,
      state.data.data.user_id
    )
      .then(values => {
        const deleteMine = state.data.data.id;
        const deleteHis = values.data[0]._id;

        return Promise.all([
          deleteMatch(globalState.values.token, deleteMine),
          deleteMatch(globalState.values.token, deleteHis)
        ]);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        history.push("/portal/matches");
      });
  };

  useEffect(() => {
    document.title = match.params.id;
    getInfo();
  }, []);

  if (state.loading) {
    return (
      <Flex>
        <UserProfile width={25 / 100} />
        <Box width={75 / 100} sx={{ minHeight: "100vh" }} bg="lightgray">
          <Nav></Nav>
          <Box mx={4}>
            <Heading>Your Match</Heading>
            <Loader />
          </Box>
        </Box>
      </Flex>
    );
  }
  if (state.error) {
    return <p>error</p>;
  }

  if (state.data) {
    return (
      <Flex>
        <UserProfile width={25 / 100} />
        <Box width={75 / 100} sx={{ minHeight: "100vh" }} bg="lightgray">
          <Nav></Nav>
          <Box mx={4}>
            <Heading>Your Match With {state.data.data.user_name}</Heading>
            <Button onClick={handleDelete}>Unmatch</Button>
          </Box>
        </Box>
      </Flex>
    );
  }
  return "";
};
