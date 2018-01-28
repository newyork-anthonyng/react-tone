import React, { Component } from "react";
import PropTypes from "prop-types";
import createAudioContext from "./createAudioContext";

class Tone extends Component {
  componentDidMount() {
    if (this.props.play) this.playSound();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.play && this.props.play) {
      this.playSound();
    }
  }

  playSound = () => {
    const { audioContext, onStop, length } = this.props;

    const oscillator = this.createOscillator();
    oscillator.start();
    oscillator.stop(audioContext.currentTime + length);
    window.setTimeout(onStop, length * 1000);
  };

  createOscillator = () => {
    const { audioContext, frequency } = this.props;
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.frequency.value = frequency;

    return oscillator;
  };

  render() {
    return null;
  }
}

Tone.propTypes = {
  play: PropTypes.bool,
  length: PropTypes.number,
  audioContext: PropTypes.object,
  frequency: PropTypes.number,
  onStop: PropTypes.func
};

Tone.defaultProps = {
  play: false,
  length: 0.05, // in seconds
  audioContext: createAudioContext(),
  frequency: 400,
  onStop: () => {}
};

export default Tone;
