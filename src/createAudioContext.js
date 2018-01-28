/* istanbul ignore next */
const createAudioContext = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) return new AudioContext();

  return undefined;
};

export default createAudioContext;
