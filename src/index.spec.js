import React from "react";
import { shallow, mount } from "enzyme";
import Tone from "./";

jest.useFakeTimers();

let mockOscillator;
let mockGain;
let createOscillator;
let createGain;
let mockAudioContext;
let defaultProps;

beforeEach(() => {
  mockOscillator = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    frequency: {
      value: undefined
    },
    start: jest.fn(),
    stop: jest.fn()
  };
  mockGain = {
    gain: {},
    connect: jest.fn()
  };

  createOscillator = jest.fn(() => mockOscillator);
  createGain = jest.fn(() => mockGain);

  mockAudioContext = function() {
    return {
      createOscillator,
      createGain,
      destination: "mock-destination",
      currentTime: 123456
    };
  };

  defaultProps = {
    length: 0.42,
    play: false,
    frequency: 42,
    audioContext: new mockAudioContext(),
    onStop: undefined,
    volume: 0.42
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

  expect(createGain).toHaveBeenCalledTimes(1);
  expect(mockGain.connect).toHaveBeenCalledTimes(1);

  jest.runAllTimers();
  expect(mockOscillator.disconnect).toHaveBeenCalledTimes(1);
  expect(mockOscillator.disconnect.mock.calls[0]).toMatchSnapshot();
});

it("should play sound when changing from props.play=false to props.play=true", () => {
  const wrapper = mount(<Tone {...defaultProps} />);

  expect(mockOscillator.connect).not.toHaveBeenCalled();

  wrapper.setProps({
    play: true
  });

  expect(createOscillator).toHaveBeenCalledTimes(1);
  expect(mockOscillator.connect).toHaveBeenCalledTimes(1);
  expect(mockOscillator.frequency.value).toEqual(defaultProps.frequency);
  expect(mockOscillator.start).toHaveBeenCalledTimes(1);

  expect(createGain).toHaveBeenCalledTimes(1);
  expect(mockGain.connect).toHaveBeenCalledTimes(1);

  jest.runAllTimers();
  expect(mockOscillator.disconnect).toHaveBeenCalledTimes(1);
  expect(mockOscillator.disconnect.mock.calls[0]).toMatchSnapshot();
});

it("should not play sound when changing from props.play=true to props.play=false", () => {
  const wrapper = mount(<Tone {...defaultProps} play />);

  expect(mockOscillator.connect).toHaveBeenCalledTimes(1);
  mockOscillator.connect.mockClear();

  wrapper.setProps({
    play: false
  });

  expect(mockOscillator.connect).not.toHaveBeenCalled();
});

it("should stop playing when unmounting", () => {
  const wrapper = mount(<Tone {...defaultProps} />);

  wrapper.unmount();

  expect(mockOscillator.stop).toHaveBeenCalledTimes(1);
});

it("should update frequency when props.frequency changes", () => {
  const wrapper = mount(<Tone {...defaultProps} />);
  const newFrequency = 100;

  wrapper.setProps({
    frequency: newFrequency
  });

  expect(mockOscillator.frequency.value).toEqual(newFrequency);
});

it("should update volume when props.volume changes", () => {
  const wrapper = mount(<Tone {...defaultProps} />);
  const newVolume = 0.8;

  wrapper.setProps({
    volume: newVolume
  });

  expect(mockGain.gain.value).toEqual(newVolume);
});

it("should run callback when Tone has stopped playing", () => {
  const cb = jest.fn();
  mount(<Tone {...defaultProps} play onStop={cb} length={10} />);

  jest.advanceTimersByTime(9999);
  expect(cb).not.toHaveBeenCalled();

  jest.runAllTimers();
  expect(cb).toHaveBeenCalledTimes(1);
});

it("should create a default Audio Context", () => {
  expect(() =>
    mount(<Tone {...defaultProps} audioContext={undefined} play />)
  ).not.toThrow();
});
