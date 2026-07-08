import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Circle, Rect, Path, G, Ellipse } from 'react-native-svg';
import { AvatarConfig } from '@/shared/types/database';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  style?: ViewStyle;
}

export const SKIN_COLORS: Record<string, string> = {
  peach: '#FFD1A9',
  honey: '#E5A65D',
  chocolate: '#8D5524',
  almond: '#F1C27D',
  fair: '#FFE0BD',
};

export const HAIR_COLORS: Record<string, string> = {
  black: '#1A1A1A',
  brown: '#4A2E1B',
  blonde: '#E6C229',
  red: '#C53030',
  purple: '#805AD5',
};

export const CLOTHING_COLORS: Record<string, string> = {
  red: '#E53E3E',
  blue: '#3182CE',
  green: '#38A169',
  yellow: '#D69E2E',
  pink: '#D53F8C',
};

export const Avatar: React.FC<AvatarProps> = ({ config, size = 100, style }) => {
  const skin = SKIN_COLORS[config.skinColor] || SKIN_COLORS.peach;
  const hairColor = HAIR_COLORS[config.hairColor] || HAIR_COLORS.black;
  const clothes = CLOTHING_COLORS[config.clothing] || CLOTHING_COLORS.blue;

  return (
    <View style={[{ width: size, height: size, overflow: 'hidden' }, style]}>
      <Svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* 1. Background / Base Shadow */}
        <Circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />

        {/* 2. Body / Clothing Layer */}
        <Path
          d="M 20 90 Q 50 65 80 90 Z"
          fill={clothes}
          stroke="#0F172A"
          strokeWidth="3"
        />
        {/* Shirt Collar / Neck Detail */}
        <Path
          d="M 40 76 Q 50 85 60 76"
          fill="none"
          stroke="#0F172A"
          strokeWidth="3"
        />

        {/* 3. Neck */}
        <Rect x="45" y="65" width="10" height="12" fill={skin} stroke="#0F172A" strokeWidth="3" />

        {/* 4. Head / Face */}
        <Circle cx="50" cy="45" r="24" fill={skin} stroke="#0F172A" strokeWidth="3" />
        
        {/* Ears */}
        <Circle cx="24" cy="45" r="5" fill={skin} stroke="#0F172A" strokeWidth="3" />
        <Circle cx="76" cy="45" r="5" fill={skin} stroke="#0F172A" strokeWidth="3" />

        {/* 5. Hair Layer */}
        {config.hairStyle === 'short' && (
          <G>
            <Path
              d="M 26 40 Q 50 12 74 40 Q 70 30 60 28 Q 50 32 40 28 Q 30 30 26 40 Z"
              fill={hairColor}
              stroke="#0F172A"
              strokeWidth="3"
            />
          </G>
        )}

        {config.hairStyle === 'spiky' && (
          <G>
            <Path
              d="M 26 40 L 28 26 L 36 18 L 44 26 L 50 14 L 56 26 L 64 18 L 72 26 L 74 40 Q 60 28 50 32 Q 40 28 26 40 Z"
              fill={hairColor}
              stroke="#0F172A"
              strokeWidth="3"
            />
          </G>
        )}

        {config.hairStyle === 'long' && (
          <G>
            {/* Back Hair Strands */}
            <Path
              d="M 26 45 Q 16 55 22 75 Q 26 76 30 70 L 26 45 Z"
              fill={hairColor}
              stroke="#0F172A"
              strokeWidth="3"
            />
            <Path
              d="M 74 45 Q 84 55 78 75 Q 74 76 70 70 L 74 45 Z"
              fill={hairColor}
              stroke="#0F172A"
              strokeWidth="3"
            />
            {/* Top/Front Hair */}
            <Path
              d="M 26 40 Q 50 15 74 40 Q 50 25 26 40 Z"
              fill={hairColor}
              stroke="#0F172A"
              strokeWidth="3"
            />
          </G>
        )}

        {config.hairStyle === 'curly' && (
          <G fill={hairColor} stroke="#0F172A" strokeWidth="3">
            {/* Overlapping puffs */}
            <Circle cx="30" cy="28" r="8" />
            <Circle cx="42" cy="20" r="9" />
            <Circle cx="58" cy="20" r="9" />
            <Circle cx="70" cy="28" r="8" />
            <Circle cx="24" cy="38" r="7" />
            <Circle cx="76" cy="38" r="7" />
            {/* Hide inner overlaps */}
            <Path d="M 26 40 Q 50 22 74 40 Z" fill={hairColor} stroke="none" />
            <Path d="M 26 40 Q 50 22 74 40" fill="none" stroke="#0F172A" strokeWidth="3" />
          </G>
        )}

        {/* 6. Eyes & Expression */}
        {config.expression === 'happy' && (
          <G stroke="#0F172A" strokeWidth="3" fill="none">
            {/* Happy Closed Arcs */}
            <Path d="M 38 42 Q 43 38 46 42" />
            <Path d="M 54 42 Q 57 38 62 42" />
            {/* Cheerful Open Mouth */}
            <Path d="M 42 53 Q 50 63 58 53 Z" fill="#E53E3E" />
          </G>
        )}

        {config.expression === 'smile' && (
          <G stroke="#0F172A" strokeWidth="3" fill="none">
            {/* Simple dot eyes */}
            <Circle cx="42" cy="43" r="2" fill="#0F172A" />
            <Circle cx="58" cy="43" r="2" fill="#0F172A" />
            {/* Simple Smile Curve */}
            <Path d="M 44 54 Q 50 60 56 54" />
          </G>
        )}

        {config.expression === 'determined' && (
          <G stroke="#0F172A" strokeWidth="3" fill="none">
            {/* Determined eyebrows */}
            <Path d="M 38 37 L 46 40" />
            <Path d="M 54 40 L 62 37" />
            {/* Focus Eyes */}
            <Circle cx="42" cy="44" r="2" fill="#0F172A" />
            <Circle cx="58" cy="44" r="2" fill="#0F172A" />
            {/* Straight Mouth Line */}
            <Path d="M 44 55 L 56 55" />
          </G>
        )}

        {config.expression === 'surprised' && (
          <G stroke="#0F172A" strokeWidth="3" fill="none">
            {/* Wide Round Eyes */}
            <Circle cx="42" cy="43" r="3.5" fill="none" />
            <Circle cx="42" cy="43" r="1.5" fill="#0F172A" />
            <Circle cx="58" cy="43" r="3.5" fill="none" />
            <Circle cx="58" cy="43" r="1.5" fill="#0F172A" />
            {/* O-shaped Mouth */}
            <Circle cx="50" cy="55" r="4" fill="#E53E3E" />
          </G>
        )}

        {/* 7. Accessories */}
        {config.accessory === 'glasses' && (
          <G stroke="#0F172A" strokeWidth="3.5" fill="none">
            {/* Left lens */}
            <Circle cx="41" cy="43" r="8" stroke="#3182CE" />
            {/* Right lens */}
            <Circle cx="59" cy="43" r="8" stroke="#3182CE" />
            {/* Bridge */}
            <Path d="M 49 43 L 51 43" />
            {/* Sides */}
            <Path d="M 24 43 L 33 43" />
            <Path d="M 67 43 L 76 43" />
          </G>
        )}

        {config.accessory === 'crown' && (
          <G>
            <Path
              d="M 36 22 L 32 10 L 42 16 L 50 6 L 58 16 L 68 10 L 64 22 Z"
              fill="#D69E2E"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            {/* Little gems on crown */}
            <Circle cx="32" cy="10" r="1.5" fill="#E53E3E" />
            <Circle cx="50" cy="6" r="1.5" fill="#3182CE" />
            <Circle cx="68" cy="10" r="1.5" fill="#48BB78" />
          </G>
        )}

        {config.accessory === 'headphones' && (
          <G stroke="#0F172A" strokeWidth="3" fill="none">
            {/* Headband */}
            <Path d="M 26 42 Q 50 15 74 42" stroke="#805AD5" strokeWidth="4" />
            {/* Ear Cups */}
            <Ellipse cx="25" cy="46" rx="4" ry="7" fill="#805AD5" />
            <Ellipse cx="75" cy="46" rx="4" ry="7" fill="#805AD5" />
          </G>
        )}
      </Svg>
    </View>
  );
};
