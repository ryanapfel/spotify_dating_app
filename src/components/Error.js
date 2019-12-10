import React from "react";
import { Box, Text } from "rebass";

export default ({ error }) => {
  return (
    <Box bg="red" color="darkRed" p={3} mx={{ borderRadius: "4px" }}>
      {error}
    </Box>
  );
};
