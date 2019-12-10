import React, { useState, useEffect } from "react";
import constate from "constate";
import { useFormContext, useLogin, useLogOut } from "../context/auth.js";
import { useHistory } from "react-router-dom";

import { Button, Flex, Text, Link, Box } from "rebass";

export default function Nav() {
  const state = useFormContext();
  const [loginState, login] = useLogin();
  const logOut = useLogOut();
  const history = useHistory();

  const redirectLogin = e => {
    e.preventDefault();
    history.push("/login");
  };

  return (
    <Flex px={3} py={3} bg="lightgray" color="primary">
      <Text p={2} fontWeight="bold">
        Spotify App
      </Text>
      <Box mx="auto" />

      {state.values.authenticated ? (
        <Button style={{ cursor: "pointer" }} onClick={logOut} p={2}>
          Logout
        </Button>
      ) : (
        <Button style={{ cursor: "pointer" }} onClick={redirectLogin} p={2}>
          Login
        </Button>
      )}
    </Flex>
  );
}
