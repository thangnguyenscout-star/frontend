export function startSession(
  onWarning: () => void,
  onExpire: () => void,
  onActivity: () => void,
  warningMs = 8 * 60 * 1000,
  timeoutMs = 10 * 60 * 1000,
) {
  let last = Date.now(),
    warned = false;
  const events = ['mousemove', 'keydown', 'click', 'touchstart', 'hr-navigation'];
  const touch = () => {
    last = Date.now();
    if (warned) {
      warned = false;
      onActivity();
    }
  };
  events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
  const timer = window.setInterval(() => {
    const elapsed = Date.now() - last;
    if (elapsed >= timeoutMs) {
      stop();
      onExpire();
    } else if (elapsed >= warningMs && !warned) {
      warned = true;
      onWarning();
    }
  }, 1000);
  function stop() {
    clearInterval(timer);
    events.forEach((e) => window.removeEventListener(e, touch));
  }
  return { stop, touch };
}
