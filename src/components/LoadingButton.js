import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

export const LoadingButton = ({
  color = "#F2545B",
  loadingColor = "#A4243B",
  children = "Button",
  loading = false,
  circular = false,
  onClick
}) => {
  return (
    <Button
      onClick={onClick}
      circular={circular}
      color={loading ? loadingColor : color}
      className="button"
    >
      {loading ? <Spinner /> : children}
    </Button>
  );
};

export const Button = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: ${props => (props.circular ? "25px" : "10px 30px")};
  background-color: ${props => props.color};
  color: #fff;
  border: none;
  border-radius: ${props => (props.circular ? "50%" : "15px")};
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  overflow: hidden;
  outline: none;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 12px 24px 0 rgba(233, 92, 97, 0.2);
  }
`;

const Spinner = ({ color = "#fff" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      id="svg"
    >
      <defs>
        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
          <stop stopColor={color} stopOpacity="0" offset="0%" />
          <stop stopColor={color} stopOpacity=".631" offset="63.146%" />
          <stop stopColor={color} offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)">
          <path
            d="M36 18c0-9.94-8.06-18-18-18"
            id="Oval-2"
            stroke="url(#a)"
            strokeWidth="2"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </path>
          <circle fill={color} cx="36" cy="18" r="1">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </svg>
  );
};
