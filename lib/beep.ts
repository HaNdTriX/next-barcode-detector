export default function beep(ms = 100) {
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  oscillator.type = "square";
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, ms);
}
