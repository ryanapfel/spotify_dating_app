import React, { useState, useEffect } from "react";
import { useFormContext, useAuthState, useAction } from "../context/auth.js";
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
  createMatch,
  createLike,
  getUser,
  getUsersMatchesandLikes,
  getUsersNotMatchedWith
} from "../context/api.js";

import placeholder from "../assets/placeholder.png";
import { FaHeart } from "react-icons/fa";
import { IoMdHeartDislike } from "react-icons/io";
import { LoadingButton } from "./LoadingButton";

import { Heading, Text, Image, Box, Flex, Link, Button } from "rebass";
import Loader from "./Loader.js";

import constate from "constate";

function useMatch({ initialStep = 0 } = {}) {
  const [index, setIndex] = useState(0);
  const [userInfo, setUserinfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noneLeft, setNoneLeft] = useState(false);
  const [matched, setMatched] = useState(false);
  const state = useFormContext();

  const getUsers = async () => {
    setLoading(true);
    await getUsersMatchesandLikes(state.values.token, state.values.user_id)
      .then(values => {
        const [matches, likes] = values;

        let excludedUsers = [];
        matches.data.forEach(value => excludedUsers.push(value.user_id));
        likes.data.forEach(value => excludedUsers.push(value.user_id));

        const onlyUnique = (value, index, self) => {
          return self.indexOf(value) === index;
        };

        return excludedUsers.filter(onlyUnique);
      })
      .then(values => {
        let ar = values;
        ar.push(state.values.user_id);
        return getUsersNotMatchedWith(state.values.token, ar);
      })
      .then(values => {
        let returnThis = values;
        values.forEach((i, index) => {
          if (i._id.includes(state.values.user_id)) {
            values.splice(index, 1);
          }
        });

        if (values.length !== 0) {
          setUserinfo(returnThis);
        } else {
          setNoneLeft(true);
        }
      })
      .catch(error => {
        setNoneLeft(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const next = () => {
    if (index === userInfo.length - 1) {
      setNoneLeft(true);
    } else {
      setIndex(index + 1);
    }
  };
  const previous = () => {
    setIndex(index - 1);
  };
  const currentUser = () => {
    // make sure user has all info
    const user = userInfo[index];

    return user;
  };

  const values = {
    loading,
    userInfo,
    index,
    noneLeft,
    matched
  };

  return { values, next, previous, currentUser, setMatched };
}

export const [MatchProvider, otherUserState] = constate(
  useMatch,
  value => value
);

export const MatchContainer = () => {
  return (
    <MatchProvider>
      <Match />
    </MatchProvider>
  );
};

export const Match = () => {
  const profileState = otherUserState();
  const handleMatchNext = () => {
    profileState.setMatched(false);
    profileState.next();
  };
  if (profileState.values.noneLeft) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%" }}
        width={1}
      >
        <Box>
          <Heading color="darkGrey">No More Profiles to View</Heading>
        </Box>
      </Flex>
    );
  }
  if (profileState.values.matched) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%" }}
        width={1}
      >
        <Box>
          <Heading p={3}>You Guys Matched</Heading>
          <Text p={3}>Keep searchin for your next friend</Text>
          <Button p={3} onClick={handleMatchNext}>
            Keep Going
          </Button>
        </Box>
      </Flex>
    );
  }

  return profileState.values.loading ? (
    <Flex
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%" }}
      width={1}
    >
      <Box>
        <Loader color="#07c" />
      </Box>
    </Flex>
  ) : (
    <Box mx={2}>
      <Box width={40 / 100} sx={{ display: "inline-block" }}>
        <UserInfo />
        <LikeHandler />
      </Box>
      <Box sx={{ float: "right" }} width={55 / 100}>
        <TopTracks />
        <TopArtists />
      </Box>
    </Box>
  );
};

const LikeHandler = () => {
  const appState = useFormContext();
  const profileState = otherUserState();
  const [data, setData] = useState(null);
  const isLastStep =
    profileState.values.index === profileState.values.userInfo.length - 1;

  const handleLike = async () => {
    const otherUsers = data.username;
    const otherUsersId = data._id;
    const otherUsersLikes = data.likes;
    const myUserId = appState.values.user_id;
    const myUsername = appState.values.username;
    strapiPost(appState.values.token, `likes?root_user=${myUserId}`, "GET")
      .then(values => {
        let meIsLiked = false;
        if (otherUsersLikes.length > 0) {
          otherUsersLikes.forEach(i => {
            if (i.user_id === myUserId) {
              meIsLiked = true;
            }
          });
        }
        return meIsLiked;
      })
      .then(liked => {
        // if me is liked then we want to create a match else we will just post a like
        if (liked) {
          createMatch(
            appState.values.token,
            myUserId,
            otherUsersId,
            myUsername,
            otherUsers
          ).then(value => {
            profileState.setMatched(true);
          });
        } else {
          createLike(
            appState.values.token,
            otherUsersId,
            otherUsers,
            myUserId
          ).then(() => {
            profileState.next();
          });
        }
      });
  };

  const handleDislike = async () => {
    const otherUsers = data.username;
    const otherUsersId = data._id;
    const otherUsersLikes = data.likes;
    const myUserId = appState.values.user_id;
    profileState.next();
  };

  useEffect(() => {
    setData(profileState.currentUser());
  }, [profileState.values.index]);

  if (!profileState.values.loading && data !== null) {
    return (
      <Flex py={3} px={4}>
        <Button
          bg="darkGrey"
          px={3}
          sx={{
            marginRight: "20px",
            borderRadius: "50%",
            lineHeight: "0 !important",
            padding: "25px !important",
            fontSize: "20px !important",
            boxShadow: "0px 10px 20px rgba(14, 20, 52, 0.20)"
          }}
          onClick={handleDislike}
        >
          <IoMdHeartDislike />
        </Button>

        <Box mx="auto" />

        <LoadingButton circular={true} onClick={handleLike}>
          <FaHeart />
        </LoadingButton>
      </Flex>
    );
  }
  return "";
};

const UserInfo = ({ width }) => {
  const appState = useFormContext();
  const profileState = otherUserState();
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(profileState.currentUser());
  }, [profileState.values.index]);
  if (!profileState.values.loading && data !== null) {
    const imageUrl =
      data.datinginfo.user_info.images.length === 0
        ? placeholder
        : data.datinginfo.user_info.images[0].url;

    const name = data.datinginfo.user_info.display_name.split(" ")[0];
    return (
      <Box variant={["box"]} mx={3}>
        <Image src={imageUrl} variant={["boxImage"]} sx={{ width: "100%" }} />
        <Box p={3}>
          <Heading>{name}</Heading>
        </Box>
      </Box>
    );
  }

  return "";
};

const TopTracks = () => {
  const appState = useFormContext();
  const profileState = otherUserState();
  const [data, setData] = useState(null);

  const millisToMinutesAndSeconds = millis => {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  useEffect(() => {
    setData(profileState.currentUser());
  }, [profileState.values.index]);
  if (!profileState.values.loading && data !== null) {
    const topSongs = data.datinginfo.artist_info.items.slice(0, 5);
    const name = data.datinginfo.user_info.display_name.split(" ")[0];
    return (
      <Box mx={3}>
        <Heading>{name}'s Top Tracks</Heading>
        {topSongs.map((value, index) => {
          return (
            <Box py={2}>
              <Link href={value.external_urls.spotify}>
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="row"
                  p={2}
                  variant={["smallbox"]}
                >
                  <Text p={2} sx={{ fontWeight: "bold" }}>
                    0{index + 1}
                  </Text>
                  <Image
                    p={1}
                    src={value.album.images[2].url}
                    variant="smallboxImage"
                  />
                  <Text p={2} sx={{ fontWeight: "bold", marginLeft: "30px" }}>
                    {value.name}
                  </Text>
                  <Box mx="auto" />
                  <Text p={2} color="darkgrey" sx={{ marginRight: "30px" }}>
                    {value.artists[0].name}
                  </Text>
                  <Text p={2} color="darkgrey">
                    {millisToMinutesAndSeconds(value.duration_ms)}
                  </Text>
                </Flex>
              </Link>
            </Box>
          );
        })}
      </Box>
    );
  }

  return "";
};

const TopArtists = () => {
  const appState = useFormContext();
  const profileState = otherUserState();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(profileState.currentUser());
  }, [profileState.values.index]);

  if (!profileState.values.loading && data !== null) {
    const topArtists = data.datinginfo.track_info.items.slice(0, 5);
    const name = data.datinginfo.user_info.display_name.split(" ")[0];
    return (
      <Box my={4} mx={3}>
        <Heading my={3}>{name}'s Top Artists</Heading>
        {topArtists.map((value, index) => {
          return (
            <>
              <Link href={value.external_urls.spotify}>
                <Box variant={["box"]}>
                  <Image
                    src={value.images[1].url}
                    variant={["boxImage"]}
                    sx={{ width: "100%" }}
                  />
                  <Heading p={3}>{value.name}</Heading>
                </Box>
              </Link>
              <Box p={3} />
            </>
          );
        })}
      </Box>
    );
  }

  return "";
};
