import axios from "axios";
import React, { useState, useEffect } from "react";
import * as CONST from "./constants.js";
import queryString from "querystring";

export const useSpotify = token => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // The incoming "action" argument to the hook is NOT performed.
  // It is only stored in the function scope; so that, we can use it when
  // performing the action using the following function
  // This function is returned as the second element in the returned array
  const performAction = async (url, type) => {
    try {
      setLoading(true);
      setData(null);
      setError(null);
      const data = await spotifyRequest(token, url, type);
      setData(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  return [{ loading, data, error }, performAction];
};

export const usePromise = (functions, executeAfterFunction = value => null) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // The incoming "action" argument to the hook is NOT performed.
  // It is only stored in the function scope; so that, we can use it when
  // performing the action using the following function
  // This function is returned as the second element in the returned array
  const performAction = async (body = null) => {
    setLoading(true);
    setData(null);
    setError(null);
    Promise.all(functions)
      .then(values => {
        setData(values);
        return executeAfterFunction(values);
      })
      .catch(error => {
        console.log(error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        setError(false);
      });
  };
  return [{ loading, data, error }, performAction];
};

export const spotifyRequest = async (token, url, type) => {
  const response = await axios({
    method: type,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    },
    url: `https://api.spotify.com/v1/${url}`
  });
  return response;
};

export const strapiPost = async (token, url, type, data) => {
  const response = await axios({
    method: type,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    },
    url: `${CONST.URL}/${url}`,
    data: data
  });
  return response;
};

export const strapiPublic = async (url, type, data = {}) => {
  const response = await axios({
    method: type,
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    },
    url: `${CONST.URL}/${url}`,
    data: data
  });
  return response;
};

export const createAccount = async (user, email, password) => {
  const response = await axios.post(`${CONST.URL}/auth/local/register`, {
    username: user,
    email: email,
    password: password
  });
  return response;
};
export const loginAPI = async (user, password) => {
  const response = await axios.post(`${CONST.URL}/auth/local`, {
    identifier: user,
    password: password
  });
  return response;
};

export const updateUser = async (userId, token, data) => {
  const response = await strapiPost(token, `users/${userId}`, "PUT", data);
  return response;
};

export const updateDatingInfo = async (id, token, data) => {
  const response = await strapiPost(token, `datinginfos/${id}`, "PUT", data);
  return response;
};

export const createDatingInfo = async () => {
  const response = await strapiPublic(`datinginfos`, "POST");
  return response;
};

export const getSpotifyDatingInfo = async token => {
  const user = spotifyRequest(token, "me", "GET");
  const topArtist = spotifyRequest(token, "me/top/artists/?limit=6", "GET");
  const topTrack = spotifyRequest(token, "me/top/tracks/?limit=10", "GET");

  const response = await Promise.all([user, topArtist, topTrack]);
  return response;
};

export const createMatch = async (
  token,
  userid,
  userid2,
  username,
  username2
) => {
  const matchOne = strapiPost(token, "matches", "POST", {
    user_name: username,
    user_id: userid,
    root_user: userid2
  });
  const matchTwo = strapiPost(token, "matches", "POST", {
    user_name: username2,
    user_id: userid2,
    root_user: userid
  });

  const response = await Promise.all([matchOne, matchTwo]);
  return response;
};

export const createLike = async (token, user_id, user_name, rootUser) => {
  const response = await strapiPost(token, "likes", "POST", {
    user_id: user_id,
    user_name: user_name,
    root_user: rootUser
  });

  return response;
};

export const getUser = async (token, user) => {
  const response = await strapiPost(token, `users/${user}`, "GET");
  return response;
};

export const getAllUsers = async token => {
  const response = await strapiPost(token, `users`, "GET");
  return response;
};

export const getUsersMatchesandLikes = async (token, userId) => {
  const response = await Promise.all([
    strapiPost(token, `matches?root_user=${userId}`, "GET"),
    strapiPost(token, `likes?root_user=${userId}`, "GET")
  ]);

  return response;
};

export const getUsersMatches = async (token, userId) => {
  const response = await strapiPost(
    token,
    `matches?root_user=${userId}`,
    "GET"
  );
  return response;
};

export const getMatch = async (token, matchId) => {
  const response = await strapiPost(token, `matches/${matchId}`, "GET");
  return response;
};

export const getOtherUserMatch = async (token, myUsername, otherUser) => {
  const response = await strapiPost(
    token,
    `matches?user_name=${myUsername}&root_user=${otherUser}`,
    "GET"
  );

  return response;
};

export const deleteMatch = async (token, matchId) => {
  const response = await strapiPost(token, `matches/${matchId}`, "DELETE");
  return response;
};

export const getUsersNotMatchedWith = async (token, matchedArray) => {
  const response = strapiPost(token, `users?`, "GET")
    .then(value => {
      const arrayOfUsers = value.data;
      let filteredArray = arrayOfUsers;
      console.log(value.data);

      arrayOfUsers.forEach((i, index) => {
        if (matchedArray.includes(i._id)) {
          filteredArray.splice(index, 1);
        }
      });
      return filteredArray;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
  return response;
};
