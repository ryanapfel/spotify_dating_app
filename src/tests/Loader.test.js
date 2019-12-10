import React from "react";
import Loader from "../components/Loader.js";
import { render, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "../index.css";

Enzyme.configure({ adapter: new Adapter() });

const container = mount(<Loader />);

it("renders", () => {
  expect(container).toBeDefined();
});

it("has lds-ripple class defined", () => {
  expect(container.find("#ripple").hasClass("lds-ripple")).toEqual(true);
});

it("find two internal ripples", () => {
  expect(container.find({ testid: "ring_one" }).hasClass("ring_one")).toEqual(
    true
  );
  expect(container.find({ testid: "ring_two" }).hasClass("ring_two")).toEqual(
    true
  );
});

it("has correct default css property", () => {
  const domNode = container.find({ testid: "ring_one" }).getDOMNode();
  const domNode2 = container.find({ testid: "ring_two" }).getDOMNode();
  const background = getComputedStyle(domNode).getPropertyValue("border");
  const background2 = getComputedStyle(domNode2).getPropertyValue("border");

  expect(background).toBe("4px solid #a4243b");
  expect(background2).toBe("4px solid #a4243b");
});

const passedValue = mount(<Loader color="#07c" />);

it("has correct default css property", () => {
  const domNode = passedValue.find({ testid: "ring_one" }).getDOMNode();
  const domNode2 = passedValue.find({ testid: "ring_two" }).getDOMNode();
  const background = getComputedStyle(domNode).getPropertyValue("border");
  const background2 = getComputedStyle(domNode2).getPropertyValue("border");

  expect(background).toBe("4px solid #07c");
  expect(background2).toBe("4px solid #07c");
});
