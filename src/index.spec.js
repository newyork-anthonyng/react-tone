import React from "react";
import { shallow, mount } from "enzyme";
import Tone from "./";

jest.useFakeTimers();

let mockOscillator;
let createOscillator;
let mockAudioContext;
let defaultProps;

beforeEach(() => {
  mockOscillator = {
    connect: jest.fn(),
    frequency: {
      value: undefined
    },
    start: jest.fn(),
    stop: jest.fn()
  };

  createOscillator = jest.fn(() => mockOscillator);

  mockAudioContext = function() {
    return {
      createOscillator,
      destination: "mock-destination",
      currentTime: 123456
    };
  };

  defaultProps = {
    length: 0.42,
    play: false,
    frequency: 42,
    audioContext: new mockAudioContext(),
    onStop: undefined
  };
});

it("should render nothing", () => {
  const wrapper = shallow(<Tone {...defaultProps} />);

  expect(wrapper.html()).toEqual(null);
});

it("should play sound when mounting when props.play=true", () => {
  const wrapper = mount(<Tone {...defaultProps} play />);

  expect(createOscillator).toHaveBeenCalledTimes(1);
  expect(mockOscillator.connect).toHaveBeenCalledTimes(1);
  expect(mockOscillator.frequency.value).toEqual(defaultProps.frequency);
  expect(mockOscillator.start).toHaveBeenCalledTimes(1);
  expect(mockOscillator.stop).toHaveBeenCalledTimes(1);
  expect(mockOscillator.stop.mock.calls[0]).toMatchSnapshot();
});

it("should play sound when changing from props.play=false to props.play=true", () => {
  const wrapper = mount(<Tone {...defaultProps} />);

  expect(createOscillator).not.toHaveBeenCalled();

  wrapper.setProps({
    play: true
  });

  expect(createOscillator).toHaveBeenCalledTimes(1);
  expect(mockOscillator.connect).toHaveBeenCalledTimes(1);
  expect(mockOscillator.frequency.value).toEqual(defaultProps.frequency);
  expect(mockOscillator.start).toHaveBeenCalledTimes(1);
  expect(mockOscillator.stop).toHaveBeenCalledTimes(1);
  expect(mockOscillator.stop.mock.calls[0]).toMatchSnapshot();
});

it("should not play sound when changing from props.play=true to props.play=false", () => {
  const wrapper = mount(<Tone {...defaultProps} play />);

  createOscillator.mockClear();

  wrapper.setProps({
    play: false
  });

  expect(createOscillator).not.toHaveBeenCalled();
});

it("should create a default Audio Context", () => {
  expect(() =>
    mount(<Tone {...defaultProps} audioContext={undefined} play />)
  ).not.toThrow();
});

it("should run callback when Tone has stopped playing", () => {
  const cb = jest.fn();
  mount(<Tone {...defaultProps} play onStop={cb} length={10} />);

  jest.advanceTimersByTime(9999);
  expect(cb).not.toHaveBeenCalled();

  jest.runAllTimers();
  expect(cb).toHaveBeenCalledTimes(1);
});
