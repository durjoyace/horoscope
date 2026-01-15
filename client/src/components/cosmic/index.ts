/**
 * Cosmic Components
 * Exports all cosmic-themed UI components
 */

// Background effects
export { StarField, MiniStarField } from './StarField';
export { ParticleBackground, RisingParticles, SparkleBurst } from './ParticleBackground';

// Decorative elements
export {
  FloatingOrb,
  OrbitalDecoration,
  FloatingDots,
  GlowRing,
  Constellation,
} from './FloatingOrb';

// Card components
export {
  GlassCard,
  GradientBorderCard,
  SpotlightCard,
  StatsCard,
} from './GlassCard';

// Button components
export {
  CosmicButton,
  CosmicIconButton,
  CosmicButtonGroup,
  CosmicFAB,
  AnimatedGradientButton,
  RippleButton,
} from './CosmicButton';

// Toast notifications
export {
  CosmicToastProvider,
  useCosmicToast,
} from './CosmicToast';

// Achievement celebration
export {
  AchievementCelebration,
  useAchievementCelebration,
} from './AchievementCelebration';

// Re-export default components
export { default as StarFieldDefault } from './StarField';
export { default as ParticleBackgroundDefault } from './ParticleBackground';
export { default as FloatingOrbDefault } from './FloatingOrb';
export { default as GlassCardDefault } from './GlassCard';
export { default as CosmicButtonDefault } from './CosmicButton';
export { default as CosmicToastDefault } from './CosmicToast';
export { default as AchievementCelebrationDefault } from './AchievementCelebration';
