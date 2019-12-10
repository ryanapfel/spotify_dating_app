import React, { useState, useEffect } from "react";
import constate from "constate";
import axios from "axios";
import { useHistory } from "react-router-dom";

import * as CONST from "./constants.js";
import {
  axiosLogin,
  getSpotifyDatingInfo,
  createDatingInfo,
  updateUser,
  createAccount,
  updateDatingInfo,
  loginAPI
} from "./api.js";

export const [AuthProvider, useFormContext, useFormValues] = constate(
  useAuthState,
  value => value,
  value => value.values
);

export const useAction = action => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // The incoming "action" argument to the hook is NOT performed.
  // It is only stored in the function scope; so that, we can use it when
  // performing the action using the following function
  // This function is returned as the second element in the returned array
  const performAction = async (body = null) => {
    try {
      setLoading(true);
      setData(null);
      setError(null);
      const data = await action(body);
      setData(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  return [{ loading, data, error }, performAction];
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const state = useFormContext();
  const history = useHistory();

  const login = async () => {
    setLoading(true);
    const getSpotifyData = getSpotifyDatingInfo(state.values.spotifyAuth);
    const login = loginAPI(state.values.username, state.values.password);

    await Promise.all([login, getSpotifyData])
      .then(response => {
        const [loginResponse, spotifyResponse] = response;

        const token = loginResponse.data.jwt;
        const id = loginResponse.data.user._id;
        const data = {
          track_info: spotifyResponse[1].data,
          artist_info: spotifyResponse[2].data,
          user_info: spotifyResponse[0].data
        };
        const createObjectID = loginResponse.data.user.datinginfo;
        state.update(CONST.STRAPI_USERNAME, loginResponse.data.user.username);
        state.updateAuthenticated(true);
        state.updateKey(token);
        state.update(CONST.STRAPI_ID, id);

        // set local storage
        localStorage.setItem(CONST.KEY, token);
        localStorage.setItem(CONST.AUTHENTICATED, true);
        localStorage.setItem(CONST.SPOTIFY_TOKEN, state.values.spotifyAuth);
        localStorage.setItem(
          CONST.SPOTIFY_TOKEN_CREATED,
          state.values.spotifyTokenCreated
        );
        localStorage.setItem(
          CONST.SPOTIFY_TOKEN_EXPIRATION,
          state.values.spotifyExpiration
        );
        localStorage.setItem(CONST.STRAPI_ID, id);
        localStorage.setItem(
          CONST.STRAPI_USERNAME,
          loginResponse.data.user.username
        );

        return updateDatingInfo(createObjectID, token, data);
      })
      .then(value => {
        setLoading(false);
        history.push("/portal");
      })
      .catch(error => {
        setLoading(false);
        setError(true);
      });
  };

  return [{ loading, data, error }, login];
};

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const state = useFormContext();
  const history = useHistory();

  const signup = async () => {
    const createDatingObject = createDatingInfo();
    const getSpotifyData = getSpotifyDatingInfo(state.values.spotifyAuth);
    const create = createAccount(
      state.values.username,
      state.values.email,
      state.values.password
    );

    !state.values.username.length > 2 && setError(true); //username greater than 2
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.values.email) && setError(true); //valid username

    if (!error) {
      setLoading(true);
      await Promise.all([createDatingObject, getSpotifyData, create])
        .then(response => {
          const [datingResponse, spotifyResponse, creatUserResponse] = response;
          const token = creatUserResponse.data.jwt;
          const id = creatUserResponse.data.user._id;
          const createObjectID = datingResponse.data.id;
          console.log(spotifyResponse);
          const data = {
            track_info: spotifyResponse[1].data,
            artist_info: spotifyResponse[2].data,
            user_info: spotifyResponse[0].data
          };

          const size1 = spotifyResponse[2].data.total;
          const size2 = spotifyResponse[1].data.total;
          const size3 = spotifyResponse[0].data.total;

          state.updateAuthenticated(true);
          state.updateKey(token);
          state.update(CONST.STRAPI_ID, id);
          state.update(
            CONST.STRAPI_USERNAME,
            creatUserResponse.data.user.username
          );
          localStorage.setItem(CONST.KEY, creatUserResponse.data.jwt);
          localStorage.setItem(CONST.AUTHENTICATED, true);
          localStorage.setItem(CONST.SPOTIFY_TOKEN, state.values.spotifyAuth);
          localStorage.setItem(
            CONST.SPOTIFY_TOKEN_CREATED,
            state.values.spotifyTokenCreated
          );
          localStorage.setItem(
            CONST.SPOTIFY_TOKEN_EXPIRATION,
            state.values.spotifyExpiration
          );
          localStorage.setItem(CONST.STRAPI_ID, id);
          localStorage.setItem(
            CONST.STRAPI_USERNAME,
            creatUserResponse.data.user.username
          );

          return Promise.all([
            updateUser(id, token, { datinginfo: createObjectID }),
            updateDatingInfo(createObjectID, token, data)
          ]);
        })
        .then(response => {
          setLoading(false);
          history.push("/portal");
        })
        .catch(error => {
          setError(true);
          setLoading(false);
        });
    }
  };

  return [{ loading, error }, signup];
};

export const useLogOut = () => {
  const state = useFormContext();
  const history = useHistory();
  const logOut = () => {
    console.log("logOut");
    localStorage.clear();
    state.updateAuthenticated(false);
    history.push("/");
  };
  return logOut;
};

export function useFormInput({
  register,
  values,
  update,
  name,
  initialValue = ""
}) {
  useEffect(() => register(name, initialValue), []);
  return {
    name,
    onChange: e => update(name, e.target.value),
    value: values[name] || initialValue
  };
}

export function useAuthState({ initialValues = {} } = {}) {
  const [values, setValues] = useState(initialValues);
  return {
    values,
    register: (name, initialValue) =>
      setValues(prevValues => ({
        ...prevValues,
        [name]: prevValues[name] || initialValue
      })),
    update: (name, value) =>
      setValues(prevValues => ({ ...prevValues, [name]: value })),
    updateKey: value =>
      setValues(prevValues => ({ ...prevValues, [CONST.KEY]: value })),
    updateAuthenticated: value =>
      setValues(prevValues => ({
        ...prevValues,
        [CONST.AUTHENTICATED]: value
      })),
    updateError: value =>
      setValues(prevValues => ({ ...prevValues, [CONST.ERROR]: value }))
  };
}
