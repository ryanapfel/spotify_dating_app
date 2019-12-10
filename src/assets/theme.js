// example theme.js
export default {
  breakpoints: ["40em", "52em", "64em"],
  colors: {
    background: "black",
    primary: "#2642A3",
    blue: "#07c",
    darkgrey: "#A4ADC8",
    lightgray: "#F9FAFE",
    red: "#F2545B",
    darkRed: "#A4243B"
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25
  },
  shadows: {
    small: "0 0 4px rgba(0, 0, 0, .125)",
    large: "0 0 24px rgba(0, 0, 0, .125)"
  },
  variants: {
    avatar: {
      borderRadius: "50%",
      boxShadow: "0px 20px 20px rgba(14, 20, 52, 0.20)"
    },
    box: {
      borderRadius: "15px",
      boxShadow: "0px 10px 20px rgba(14, 20, 52, 0.20)"
    },
    smallbox: {
      borderRadius: "6px",
      boxShadow: "0px 10px 20px rgba(14, 20, 52, 0.20)"
    },
    smallboxImage: {
      borderRadius: "8px",
      height: "57px",
      width: "57px"
    },
    boxImage: {
      borderRadius: "15px 15px 0 0"
    },
    iconButton: {
      lineHeight: "0 !important",
      padding: "25px !important",
      fontSize: "20px !important"
    }
  },
  heading: {
    text: ["geomanist"]
  },
  text: {},
  forms: {
    input: {
      borderRadius: "4px",
      borderColor: "primary",
      borderWidth: "2px",
      marginTop: "4px"
    },
    label: {
      textTransform: "uppercase",
      color: "primary",
      fontWeight: "bold"
    }
  },
  buttons: {
    primary: {
      color: "white",
      bg: "primary",
      cursor: "pointer"
    },
    secondary: {
      color: "white",
      bg: "grey",
      cursor: "pointer"
    }
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    fontWeight: "bold"
  }
};
