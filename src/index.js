import React, { Component } from "react";
import PropTypes from "prop-types";
import createAudioContext from "./createAudioContext";

class Tone extends Component {
  componentDidMount() {
    this.initializeOscillator();

    if (this.props.play) this.playSound();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.play && this.props.play) this.playSound();

    if (prevProps.volume !== this.props.volume) {
      this.gainNode.gain.value = this.props.volume;
    }

    if (prevProps.frequency !== this.props.frequency) {
      this.oscillator.frequency.value = this.props.frequency;
    }
  }

  componentWillUnmount() {
    this.oscillator.disconnect(this.gainNode);
  }

  playSound = () => {
    const { audioContext, onStop, length } = this.props;

    this.oscillator.start();
    this.oscillator.stop(audioContext.currentTime + length);
    window.setTimeout(onStop, length * 1000);
  };

  initializeOscillator = () => {
    const { audioContext, frequency, volume } = this.props;

    this.gainNode = audioContext.createGain();
    this.oscillator = audioContext.createOscillator();

    this.gainNode.gain.value = volume;
    this.oscillator.frequency.value = frequency;

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(audioContext.destination);
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
  onStop: PropTypes.func,
  volume: PropTypes.number
};

Tone.defaultProps = {
  play: false,
  length: 0.05, // in seconds
  audioContext: createAudioContext(),
  frequency: 400,
  onStop: () => {},
  volume: 1
};

export default Tone;
