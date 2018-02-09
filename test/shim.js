global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

global.AudioContext = function AudioContext() {
  return {
    createOscillator: () => ({
      connect: () => {},
      frequency: {},
      start: () => {},
      stop: () => {}
    }),
    createGain: () => ({
      gain: {},
      connect: () => {}
    })
  };
};
