import React, { useState, useEffect } from "react";
import {
  useFormContext,
  useSignup,
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
import { LoadingButton } from "./LoadingButton.js";

import { Label, Input } from "@rebass/forms";

const [StepProvider, useStepContext] = constate(useStep);

function useStep({ initialStep = 0 } = {}) {
  const [step, setStep] = useState(initialStep);
  const history = useHistory();

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("step")) {
      let curStep = urlParams.get("step");
      setStep(curStep);
    }
    // const getStep = localStorage.get('step') || initialStep;
  }, []);

  const next = () => {
    setStep(step + 1);
  };
  const previous = () => {
    setStep(step - 1);
  };
  return { step, next, previous };
}

export const SignUpWizard = () => {
  const { step, next, previous } = useStepContext();
  const [state, signUp] = useSignup();
  const steps = [Spotify, Signup];
  const isLastStep = step === steps.length - 1;

  const props = {
    onSubmit: isLastStep
      ? alert(state.values) // put submit function here
      : next,
    onBack: previous
  };
  return React.createElement(steps[step], props);
};

export const SignUpWrapper = () => {
  return (
    <StepProvider>
      <Box p={4} />
      <Flex>
        <Box width={1 / 3}></Box>

        <SignUpWizard />

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
      redirect_uri: CONST.REDIRECT_URI,
      show_dialog: true
    });

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    state.register("spotifyAuth", null);
    state.register("spotifyExpiration", null);
    state.register("spotifyTokenCreated", null);

    if (urlParams.has("spotifyAuth") && window.location.hash) {
      let auth = urlParams.get("spotifyAuth");
      setSpotifyAuth(auth);
      const authObject = qs.decode(window.location.hash.replace("#", ""));
      const token = authObject.access_token;
      const expires = authObject.expires_in;
      state.update("spotifyAuth", token);
      state.update("spotifyExpiration", expires);
      state.update("spotifyTokenCreated", Date.now());
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
    </Box>
  );
};

const Signup = ({ onSubmit }) => {
  const state = useFormContext();
  const values = useFormContext();
  const history = useHistory();
  const [formState, createAcct] = useSignup();

  const username = useFormInput({ name: "username", ...state });
  const email = useFormInput({ name: "email", ...state });
  const password = useFormInput({ name: "password", ...state });
  const password2 = useFormInput({ name: "password2", ...state });

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
        createAcct();
      }}
    >
      <Heading fontSize={[3, 4, 5]}>Sign up</Heading>
      {formState.error && (
        <Text p={3} color="red">
          There is an issue with your signup
        </Text>
      )}
      <Box py={3}>
        <Label htmlFor="user">User</Label>
        <Input id="user" name="user" placeholder="user" {...username}></Input>
        <Box p={2}></Box>

        <Label htmlFor="user">Email</Label>
        <Input id="email" name="email" placeholder="email" {...email}></Input>

        <Box p={2}></Box>
        <Label htmlFor="user">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder=""
          {...password}
        ></Input>
        <Box p={2}></Box>

        <Label htmlFor="user">Confirm Password</Label>
        <Input
          id="password2"
          name="password2"
          type="password"
          placeholder=""
          {...password2}
        ></Input>

        <Box p={3} px={2} ml="auto">
          <LoadingButton onClick={createAcct} loading={formState.loading}>
            Signup
          </LoadingButton>
          <Box p={2}></Box>
        </Box>

        {formState.loading && <Loader />}
      </Box>
    </Box>
  );
};
