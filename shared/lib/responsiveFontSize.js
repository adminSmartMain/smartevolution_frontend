const responsiveFontSize = (fontSize = 16, vw = 2.2, lowerBoundFactor = 3.25) =>
  `clamp(${fontSize - lowerBoundFactor}px, ${vw}vw, ${fontSize}px)`;

export default responsiveFontSize;
