import { describe, it, expect, vi, afterEach } from 'vitest';
import { startSession } from './session.service';
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe('inactivity session', () => {
  it('warns at eight minutes and expires at ten', () => {
    vi.useFakeTimers();
    const target = new EventTarget();
    vi.stubGlobal('window', {
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target),
      setInterval,
      clearInterval,
    });
    const warn = vi.fn(),
      expire = vi.fn();
    const session = startSession(warn, expire, vi.fn());
    vi.advanceTimersByTime(480000);
    expect(warn).toHaveBeenCalledOnce();
    expect(expire).not.toHaveBeenCalled();
    vi.advanceTimersByTime(120000);
    expect(expire).toHaveBeenCalledOnce();
    session.stop();
  });
  it('resets on interaction and cleans up listeners', () => {
    vi.useFakeTimers();
    const target = new EventTarget();
    vi.stubGlobal('window', {
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target),
      setInterval,
      clearInterval,
    });
    const expire = vi.fn();
    const session = startSession(vi.fn(), expire, vi.fn());
    vi.advanceTimersByTime(470000);
    target.dispatchEvent(new Event('keydown'));
    vi.advanceTimersByTime(470000);
    expect(expire).not.toHaveBeenCalled();
    session.stop();
    vi.advanceTimersByTime(600000);
    expect(expire).not.toHaveBeenCalled();
  });
});
