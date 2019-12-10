import React from "react";
import { LoadingButton } from "../components/LoadingButton.js";
import "@testing-library/jest-dom/extend-expect";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "../index.css";
import "jest-styled-components";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = mount(<LoadingButton />);

it("renders", () => {
  expect(wrapper).toBeDefined();
});

it("default color is correct", () => {
  expect(wrapper).toHaveStyleRule("background-color", "#F2545B");
});

it("default text is correct", () => {
  expect(wrapper.text()).toEqual("Button");
});

it("function has been called", () => {
  const handleClick = jest.fn();
  const wrapper = shallow(<LoadingButton onClick={handleClick} />);
  wrapper.simulate("click");
  expect(handleClick).toHaveBeenCalled();
});

const loading = mount(<LoadingButton loading={true} />);

it("default color for loading background is correct", () => {
  expect(loading).toHaveStyleRule("background-color", "#A4243B");
});

it("loading svg exists inside element only when loading", () => {
  expect(loading.find("#svg").exists()).toEqual(true);
  expect(wrapper.find("#svg").exists()).toEqual(false);
});

const withChildren = mount(
  <LoadingButton color="#07c" loadingColor="#2642A3">
    <p>Hello World</p>
  </LoadingButton>
);

it("button contains child element", () => {
  expect(withChildren.containsMatchingElement(<p>Hello World</p>)).toBeTruthy();
});

it("contains passed background color", () => {
  expect(withChildren).toHaveStyleRule("background-color", "#07c");
});

const circular = mount(
  <LoadingButton circular={true} loading={true} loadingColor="#2642A3">
    <p>Hello World</p>
  </LoadingButton>
);

it("circular item contains loading color", () => {
  expect(circular).toHaveStyleRule("background-color", "#2642A3");
});

it("circular item is round", () => {
  expect(circular).toHaveStyleRule("border-radius", "50%");
});
