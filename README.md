[![Travis build status][travis-badge]][travis-build]
[![Codecov branch][codecov-badge]][codecov]
[![npm][npm-badge]][npm-version]
[![downloads][downloads-badge]][npmcharts]
[![MIT License][license-badge]][license]

[![gzip size][gzip-badge]][unpkg]
[![size][size-badge]][unpkg]

[![Maintainability][code-climate-badge]][code-climate]
[![PRs Welcome][pull-request-badge]](http://makeapullrequest.com)

# react-tone 🎶
A React component that plays a tone from an oscillator.

# Getting started
```
npm install --save react-tone
```

# Why?
`react-tone` is a component that uses a [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode) to play a sound at a given `frequency` and `length`.

You can pass `react-tone` an instance of AudioContext. This solves an issue playing sounds on iOS devices. On iOS devices, a sound is muted until it's created from an interaction event. Using an AudioContext to play a dummy buffer fixes this. [See this issue for more information](https://github.com/cwilso/metronome/issues/14).

# API

| Props | Description | Default |
| ----- | ----------- | ------- |
| play  | (**Boolean**) Play a tone | *false* |
| length | (**Number**) How long the tone should play (in seconds) | *0.05* |
| frequency | (**Number**) [The frequency of the tone](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency) | *400* |
| volume | (**Number**) [The volume of the tone](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate) (0 being silent, and 1 being the loudest) | *1* |
| audioContext | (**Object**) [An instance of AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) | *new AudioContext()* |
| onStop | (**Function**) Callback function to be called when the tone has finished playing | *() => {}* |

```jsx
import React, { Component } from "react";
import Tone from "react-tone";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTonePlaying: false
    };

    this.audioContext = undefined;
    this.iosAudioContextUnlocked = false;
  }

  componentDidMount() {
    this.audioContext = new AudioContext();
  }

  handleClick = () => {
    if (!this.iosAudioContextUnlocked) this.playEmptyBuffer();

    this.setState({ isTonePlaying: true });
  }

  playEmptyBuffer = () => {
    // start an empty buffer with an instance of AudioContext
    const buffer = this.audioContext.createBuffer(1, 1, 22050);
    const node = this.audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    this.iosAudioContextUnlocked = true;
  }

  handleToneStop = () => {
    this.setState({ isTonePlaying: false });
  }

  render() {
    // Pass the same instance of AudioContext that played an empty buffer to <Tone />
    return (
      <div>
        <button onClick={this.handleClick}>Play Tone</button>
        <Tone
          audioContext={this.audioContext}
          play={this.state.isTonePlaying}
          frequency={500}
          volume={0.8}
          length={2}
          onStop={this.handleToneStop}
        />
      </div>
    );
  }
}
```

# Demo
See this [CodeSandbox demo](https://codesandbox.io/s/p736lln107).

[codecov]: https://codecov.io/gh/newyork-anthonyng/react-tone
[codecov-badge]: https://img.shields.io/codecov/c/github/newyork-anthonyng/react-tone/master.svg
[code-climate]: https://codeclimate.com/github/newyork-anthonyng/react-tone/maintainability
[code-climate-badge]: https://api.codeclimate.com/v1/badges/faefec967ef40a030c3e/maintainability
[downloads-badge]: https://img.shields.io/npm/dm/react-tone.svg?style=flat-square
[license]: https://github.com/newyork-anthonyng/react-tone/blob/master/LICENSE
[license-badge]: https://img.shields.io/npm/l/react-tone.svg?style=flat-square
[npmcharts]: https://npmcharts.com/compare/react-tone
[npm-version]:https://www.npmjs.com/package/react-tone
[npm-badge]: https://img.shields.io/npm/v/react-tone.svg?style=flat-square
[pull-request-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[travis-badge]: https://travis-ci.org/newyork-anthonyng/react-tone.svg?branch=master
[travis-build]: https://travis-ci.org/newyork-anthonyng/react-tone
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/react-tone?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/react-tone?label=size&style=flat-square
[unpkg]: https://unpkg.com/react-tone
