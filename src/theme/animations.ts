/**
 * HealthQuest — Animation Presets
 *
 * Reanimated spring/timing configs for consistent, playful animations.
 * All animations target 60fps with bouncy, kid-friendly feel.
 */
import { WithSpringConfig, WithTimingConfig, Easing } from 'react-native-reanimated';

/** Bouncy spring for card entrances, button presses */
export const springBouncy: WithSpringConfig = {
  damping: 12,
  stiffness: 150,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/** Gentle spring for page transitions */
export const springGentle: WithSpringConfig = {
  damping: 20,
  stiffness: 120,
  mass: 1,
};

/** Snappy spring for tab switches, small interactions */
export const springSnappy: WithSpringConfig = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

/** Standard ease-out for progress bars, fills */
export const timingEaseOut: WithTimingConfig = {
  duration: 600,
  easing: Easing.out(Easing.cubic),
};

/** Quick timing for micro-interactions */
export const timingQuick: WithTimingConfig = {
  duration: 200,
  easing: Easing.inOut(Easing.ease),
};

/** Slow timing for celebration animations */
export const timingSlow: WithTimingConfig = {
  duration: 1000,
  easing: Easing.out(Easing.cubic),
};

/** Stagger delay between card animations (ms) */
export const STAGGER_DELAY = 80;

/** Button press scale factor */
export const BUTTON_PRESS_SCALE = 0.92;

/** Card entrance initial offset (translateY) */
export const CARD_ENTRANCE_OFFSET = 30;

/** Animation durations (ms) */
export const durations = {
  instant: 100,
  quick: 200,
  normal: 300,
  slow: 500,
  celebration: 1000,
  xpFill: 800,
} as const;
