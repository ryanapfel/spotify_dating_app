import React, { createContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import constate from "constate";

import { ThemeProvider } from "emotion-theming";
import theme from "./assets/theme.js";
import { Button, Flex, Text, Link, Box } from "rebass";

//Component Imports
import Nav from "./components/nav.js";
import Home from "./components/Home.js";
import Portal from "./components/Portal.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import { LoginWrapper } from "./components/Login.js";
import { Signup, SignUpWrapper } from "./components/Signup.js";
import { Matches, Match } from "./components/Matches.js";
import GenericNotFound from "./components/GenericNotFound.js";

//Context Imports
import { AuthProvider } from "./context/auth.js";
import * as CONST from "./context/constants.js";

// Constants for authentication purposes
const prevAutheniticated = localStorage.getItem(CONST.AUTHENTICATED) || false;
const prevKey = localStorage.getItem(CONST.KEY) || null;
const prevSpotAuth = localStorage.getItem(CONST.SPOTIFY_TOKEN) || null;
const prevSpotTokenCreated =
  localStorage.getItem(CONST.SPOTIFY_TOKEN_CREATED) || null;
const prevSpotTokenExpiration =
  localStorage.getItem(CONST.SPOTIFY_TOKEN_EXPIRATION) || null;
const prevStrapiId = localStorage.getItem(CONST.STRAPI_ID) || null;
const prevUserName = localStorage.getItem(CONST.STRAPI_USERNAME) || null;

function App() {
  return (
    <AuthProvider
      initialValues={{
        [CONST.AUTHENTICATED]: prevAutheniticated,
        [CONST.KEY]: prevKey,
        [CONST.SPOTIFY_TOKEN]: prevSpotAuth,
        [CONST.SPOTIFY_TOKEN_CREATED]: prevSpotTokenCreated,
        [CONST.SPOTIFY_TOKEN_EXPIRATION]: prevSpotTokenExpiration,
        [CONST.STRAPI_ID]: prevStrapiId,
        [CONST.STRAPI_USERNAME]: prevUserName
      }}
    >
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/login" component={LoginWrapper}></Route>
            <Route exact path="/signup" component={SignUpWrapper}></Route>
            <ProtectedRoute
              exact
              path="/portal"
              component={Portal}
            ></ProtectedRoute>
            <ProtectedRoute
              exact
              path="/portal/matches"
              component={Matches}
            ></ProtectedRoute>
            <ProtectedRoute
              path="/portal/matches/:id"
              component={Match}
            ></ProtectedRoute>
            <Route component={GenericNotFound} />
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
