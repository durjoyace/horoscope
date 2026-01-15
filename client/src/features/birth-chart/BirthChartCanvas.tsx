/**
 * Birth Chart Canvas - Main SVG visualization component
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BirthChartData,
  PlanetKey,
  PLANET_INFO,
  ZODIAC_INFO,
  ASPECT_INFO,
  type ZodiacSign,
} from './types';

interface BirthChartCanvasProps {
  chart: BirthChartData;
  size?: number;
  showAspects?: boolean;
  showHouses?: boolean;
  onPlanetClick?: (planet: PlanetKey) => void;
  selectedPlanet?: PlanetKey | null;
}

export function BirthChartCanvas({
  chart,
  size = 500,
  showAspects = true,
  showHouses = true,
  onPlanetClick,
  selectedPlanet,
}: BirthChartCanvasProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetKey | null>(null);

  const center = size / 2;
  const outerRadius = size / 2 - 10;
  const zodiacRingWidth = 40;
  const houseRingWidth = 30;
  const planetRingRadius = outerRadius - zodiacRingWidth - houseRingWidth - 30;
  const innerRadius = planetRingRadius - 60;

  // Convert degrees to radians (with 0 at top, going clockwise)
  const degToRad = (deg: number) => ((270 - deg) * Math.PI) / 180;

  // Get point on circle
  const getPoint = (deg: number, radius: number) => ({
    x: center + Math.cos(degToRad(deg)) * radius,
    y: center - Math.sin(degToRad(deg)) * radius,
  });

  // Calculate planet positions with collision detection
  const planetPositions = useMemo(() => {
    const positions: Record<PlanetKey, { x: number; y: number; deg: number }> = {} as any;
    const usedAngles: number[] = [];

    Object.entries(chart.planets).forEach(([key, planet]) => {
      let deg = planet.longitude;

      // Simple collision detection - spread planets that are too close
      for (const usedAngle of usedAngles) {
        const diff = Math.abs(deg - usedAngle);
        if (diff < 8 || diff > 352) {
          deg = (deg + 8) % 360;
        }
      }

      usedAngles.push(deg);
      const point = getPoint(deg, planetRingRadius);
      positions[key as PlanetKey] = { ...point, deg };
    });

    return positions;
  }, [chart.planets, planetRingRadius]);

  // Filter aspects to show
  const aspectsToRender = useMemo(() => {
    if (!showAspects) return [];

    let aspects = [...chart.aspects];

    // If a planet is selected, only show its aspects
    if (selectedPlanet) {
      aspects = aspects.filter(
        (a) => a.planet1 === selectedPlanet || a.planet2 === selectedPlanet
      );
    }

    // If a planet is hovered, highlight its aspects
    if (hoveredPlanet) {
      aspects = aspects.filter(
        (a) => a.planet1 === hoveredPlanet || a.planet2 === hoveredPlanet
      );
    }

    return aspects;
  }, [chart.aspects, showAspects, selectedPlanet, hoveredPlanet]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="birth-chart-canvas"
    >
      {/* Background gradient */}
      <defs>
        <radialGradient id="chartBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--background))" />
          <stop offset="100%" stopColor="hsl(var(--muted))" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="url(#chartBg)"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Zodiac Ring */}
      <ZodiacRing
        center={center}
        outerRadius={outerRadius}
        innerRadius={outerRadius - zodiacRingWidth}
        ascendant={chart.ascendant || 0}
      />

      {/* House Ring */}
      {showHouses && chart.houses.length > 0 && (
        <HouseRing
          center={center}
          outerRadius={outerRadius - zodiacRingWidth}
          innerRadius={outerRadius - zodiacRingWidth - houseRingWidth}
          houses={chart.houses.map((h) => h.cusp)}
        />
      )}

      {/* Aspect Lines */}
      <g className="aspect-lines">
        <AnimatePresence>
          {aspectsToRender.map((aspect, idx) => {
            const p1Pos = planetPositions[aspect.planet1];
            const p2Pos = planetPositions[aspect.planet2];
            const aspectInfo = ASPECT_INFO[aspect.type];

            return (
              <motion.line
                key={`${aspect.planet1}-${aspect.planet2}-${idx}`}
                x1={getPoint(p1Pos.deg, innerRadius).x}
                y1={getPoint(p1Pos.deg, innerRadius).y}
                x2={getPoint(p2Pos.deg, innerRadius).x}
                y2={getPoint(p2Pos.deg, innerRadius).y}
                stroke={aspectInfo?.color || '#666'}
                strokeWidth={selectedPlanet || hoveredPlanet ? 2 : 1}
                strokeOpacity={0.6}
                strokeDasharray={aspect.type === 'opposition' ? '5,5' : aspect.type === 'square' ? '3,3' : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </AnimatePresence>
      </g>

      {/* Inner Circle */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      {/* Planets */}
      <g className="planets">
        {Object.entries(planetPositions).map(([key, pos]) => {
          const planetKey = key as PlanetKey;
          const planet = chart.planets[planetKey];
          const info = PLANET_INFO[planetKey];
          const isSelected = selectedPlanet === planetKey;
          const isHovered = hoveredPlanet === planetKey;

          return (
            <g
              key={planetKey}
              className="planet-group cursor-pointer"
              onClick={() => onPlanetClick?.(planetKey)}
              onMouseEnter={() => setHoveredPlanet(planetKey)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              {/* Planet circle background */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected || isHovered ? 18 : 14}
                fill={isSelected || isHovered ? info.color : 'hsl(var(--card))'}
                stroke={info.color}
                strokeWidth={isSelected ? 3 : 2}
                filter={isSelected || isHovered ? 'url(#glow)' : undefined}
                animate={{
                  r: isSelected || isHovered ? 18 : 14,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              />

              {/* Planet symbol */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isSelected || isHovered ? 16 : 14}
                fill={isSelected || isHovered ? 'white' : info.color}
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                {info.symbol}
              </text>

              {/* Retrograde indicator */}
              {planet.retrograde && (
                <text
                  x={pos.x + 12}
                  y={pos.y - 12}
                  fontSize="10"
                  fill="#FF6B6B"
                  fontWeight="bold"
                >
                  R
                </text>
              )}

              {/* Degree indicator on hover */}
              {isHovered && (
                <motion.text
                  x={pos.x}
                  y={pos.y + 30}
                  textAnchor="middle"
                  fontSize="10"
                  fill="hsl(var(--foreground))"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 30 }}
                >
                  {Math.floor(planet.signDegree)}° {planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)}
                </motion.text>
              )}
            </g>
          );
        })}
      </g>

      {/* Center info */}
      <g className="center-info">
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          fontSize="14"
          fill="hsl(var(--foreground))"
          fontWeight="bold"
        >
          {ZODIAC_INFO[chart.sunSign]?.symbol} {chart.sunSign.charAt(0).toUpperCase() + chart.sunSign.slice(1)}
        </text>
        {chart.risingSign && (
          <text
            x={center}
            y={center + 10}
            textAnchor="middle"
            fontSize="11"
            fill="hsl(var(--muted-foreground))"
          >
            Rising: {ZODIAC_INFO[chart.risingSign]?.symbol}
          </text>
        )}
      </g>
    </svg>
  );
}

// Zodiac Ring Component
function ZodiacRing({
  center,
  outerRadius,
  innerRadius,
  ascendant,
}: {
  center: number;
  outerRadius: number;
  innerRadius: number;
  ascendant: number;
}) {
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  const degToRad = (deg: number) => ((270 - deg) * Math.PI) / 180;

  return (
    <g className="zodiac-ring">
      {signs.map((sign, idx) => {
        const startDeg = (idx * 30 + ascendant) % 360;
        const endDeg = ((idx + 1) * 30 + ascendant) % 360;
        const midDeg = (startDeg + 15) % 360;
        const info = ZODIAC_INFO[sign];

        // Create arc path
        const startOuter = {
          x: center + Math.cos(degToRad(startDeg)) * outerRadius,
          y: center - Math.sin(degToRad(startDeg)) * outerRadius,
        };
        const endOuter = {
          x: center + Math.cos(degToRad(endDeg)) * outerRadius,
          y: center - Math.sin(degToRad(endDeg)) * outerRadius,
        };
        const startInner = {
          x: center + Math.cos(degToRad(endDeg)) * innerRadius,
          y: center - Math.sin(degToRad(endDeg)) * innerRadius,
        };
        const endInner = {
          x: center + Math.cos(degToRad(startDeg)) * innerRadius,
          y: center - Math.sin(degToRad(startDeg)) * innerRadius,
        };

        const path = `
          M ${startOuter.x} ${startOuter.y}
          A ${outerRadius} ${outerRadius} 0 0 0 ${endOuter.x} ${endOuter.y}
          L ${startInner.x} ${startInner.y}
          A ${innerRadius} ${innerRadius} 0 0 1 ${endInner.x} ${endInner.y}
          Z
        `;

        const labelRadius = (outerRadius + innerRadius) / 2;
        const labelPos = {
          x: center + Math.cos(degToRad(midDeg)) * labelRadius,
          y: center - Math.sin(degToRad(midDeg)) * labelRadius,
        };

        return (
          <g key={sign}>
            <path
              d={path}
              fill={`${info.color}15`}
              stroke={info.color}
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="16"
              fill={info.color}
            >
              {info.symbol}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// House Ring Component
function HouseRing({
  center,
  outerRadius,
  innerRadius,
  houses,
}: {
  center: number;
  outerRadius: number;
  innerRadius: number;
  houses: number[];
}) {
  const degToRad = (deg: number) => ((270 - deg) * Math.PI) / 180;

  return (
    <g className="house-ring">
      {houses.map((cusp, idx) => {
        const nextCusp = houses[(idx + 1) % 12];
        const houseNum = idx + 1;

        // Draw house cusp line
        const outerPoint = {
          x: center + Math.cos(degToRad(cusp)) * outerRadius,
          y: center - Math.sin(degToRad(cusp)) * outerRadius,
        };
        const innerPoint = {
          x: center + Math.cos(degToRad(cusp)) * innerRadius,
          y: center - Math.sin(degToRad(cusp)) * innerRadius,
        };

        // House number position
        let midDeg = (cusp + nextCusp) / 2;
        if (nextCusp < cusp) midDeg = (cusp + nextCusp + 360) / 2;
        const labelRadius = (outerRadius + innerRadius) / 2;
        const labelPos = {
          x: center + Math.cos(degToRad(midDeg)) * labelRadius,
          y: center - Math.sin(degToRad(midDeg)) * labelRadius,
        };

        return (
          <g key={`house-${houseNum}`}>
            <line
              x1={outerPoint.x}
              y1={outerPoint.y}
              x2={innerPoint.x}
              y2={innerPoint.y}
              stroke="hsl(var(--border))"
              strokeWidth={[1, 4, 7, 10].includes(houseNum) ? 2 : 1}
              strokeOpacity={[1, 4, 7, 10].includes(houseNum) ? 0.8 : 0.4}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
            >
              {houseNum}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default BirthChartCanvas;
