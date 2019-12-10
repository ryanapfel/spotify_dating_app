import React, { useState, useEffect } from "react";
import {
  useFormContext,
  useLogin,
  useLogOut,
  useFormValues,
  useFormInput
} from "../context/auth.js";
import { useHistory } from "react-router-dom";
import { Bars } from "svg-loaders-react";
import constate from "constate";
import * as CONST from "../context/constants.js";
import qs from "querystring";
import Loader from "./Loader.js";

import Nav from "./nav.js";
import Error from "./Error.js";

import { Flex, Text, Link, Box, Heading, Button } from "rebass";

import { Label, Input } from "@rebass/forms";
import { LoadingButton } from "./LoadingButton";

const [StepProvider, useStepContext] = constate(useStep);

function useStep({ initialStep = 0 } = {}) {
  const [step, setStep] = useState(initialStep);
  const history = useHistory();

  useEffect(() => {
    document.title = "Login";
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("step")) {
      let curStep = urlParams.get("step");
      setStep(curStep);
    }
  }, []);

  const next = () => {
    setStep(step + 1);
  };
  const previous = () => {
    setStep(step - 1);
  };
  return { step, next, previous };
}

const LoginWizard = () => {
  const { step, next, previous } = useStepContext();
  const [state, login] = useLogin();
  const steps = [Spotify, Login];
  const isLastStep = step === steps.length - 1;

  const props = {
    onSubmit: isLastStep
      ? "" // put submit function here
      : next,
    onBack: previous
  };
  return React.createElement(steps[step], props);
};

export const LoginWrapper = () => {
  return (
    <StepProvider>
      <Box p={4} />
      <Flex>
        <Box width={1 / 3}></Box>

        <LoginWizard />

        <Box width={1 / 3}></Box>
      </Flex>
    </StepProvider>
  );
};

const Spotify = ({ onSubmit }) => {
  const state = useFormContext();
  const step = useStepContext();

  const [spotifyAuth, setSpotifyAuth] = useState(false);
  const redirectURL =
    "https://accounts.spotify.com/authorize?" +
    qs.stringify({
      response_type: "token",
      client_id: CONST.CLIENT_ID,
      scope: CONST.SPOTIFY_SCOPES,
      redirect_uri: CONST.REDIRECT_URI_LOGIN,
      show_dialog: true
    });

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    state.register(CONST.SPOTIFY_TOKEN, null);
    state.register(CONST.SPOTIFY_TOKEN_CREATED, null);
    state.register(CONST.SPOTIFY_TOKEN_EXPIRATION, null);

    if (urlParams.has("spotifyAuth") && window.location.hash) {
      let auth = urlParams.get("spotifyAuth");
      setSpotifyAuth(auth);
      const authObject = qs.decode(window.location.hash.replace("#", ""));
      const token = authObject.access_token;
      const expires = authObject.expires_in;
      state.update(CONST.SPOTIFY_TOKEN, token);
      state.update(CONST.SPOTIFY_TOKEN_EXPIRATION, expires);
      state.update(CONST.SPOTIFY_TOKEN_CREATED, Date.now());
    }
  }, []);
  return (
    <Box
      p={3}
      width={1 / 3}
      sx={{
        boxShadow: "0 0 8px rgba(0, 0, 0, .25)",
        borderRadius: "4px",
        textAlign: "center"
      }}
      color="black"
      as="form"
      bg="lightgray"
      as="form"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(state.values);
      }}
    >
      <Heading fontSize={[3, 4, 5]}>Link Spotify</Heading>
      <Box p={3} />
      <Link href={redirectURL}>Connect Spotify</Link>
      <Box p={3} />
      <Text color="darkGrey">
        Haven't already created an account? <Link href="/signup">Sign Up</Link>
      </Text>
    </Box>
  );
};

const Login = ({ onSubmit }) => {
  const state = useFormContext();
  const values = useFormContext();
  const history = useHistory();
  const [formState, login] = useLogin();

  const username = useFormInput({ name: "username", ...state });
  const password = useFormInput({ name: "password", ...state });

  useEffect(() => {
    if (state.authenticated || localStorage.getItem("authenticated")) {
      history.push("/portal");
    }
  }, [state.authenticated]);

  return (
    <Box
      p={3}
      width={1 / 3}
      sx={{
        boxShadow: "0 0 8px rgba(0, 0, 0, .25)",
        borderRadius: "4px",
        textAlign: "center"
      }}
      color="black"
      bg="lightgray"
      as="form"
      onSubmit={e => {
        e.preventDefault();
        login();
      }}
    >
      <Heading fontSize={[3, 4, 5]}>Login</Heading>
      {formState.error && (
        <Text p={3} color="red">
          Username or Password Not Recognized
        </Text>
      )}

      <Box py={3}></Box>
      <Label htmlFor="user">User</Label>
      <Input id="user" name="user" placeholder="user" {...username}></Input>
      <Box p={2}></Box>
      <Label htmlFor="user">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        {...password}
      ></Input>
      <Box p={3} px={2} ml="auto">
        <LoadingButton onClick={login} loading={formState.loading}>
          Login
        </LoadingButton>
      </Box>
    </Box>
  );
};
