const VIDEO_HOVER_COLORS = [
  "hsla(265, 100%, 50%, 0.7)",
  "hsla(200, 100%, 60.8%, 0.84)",
  "hsla(330, 93%, 54.9%, 0.83)",
  "hsla(145, 100%, 58.6%, 0.94)",
  "hsla(30, 100%, 55.1%, 0.88)",
  "hsla(48, 100%, 58%, 0.86)",
];

export const applyRandomCardHoverColor = (event) => {
  const element = event.currentTarget;
  const currentColor = element.style.getPropertyValue("--plate");
  const availableColors = VIDEO_HOVER_COLORS.filter((color) => color !== currentColor);
  const nextColor = availableColors[Math.floor(Math.random() * availableColors.length)];

  element.style.setProperty("--plate", nextColor);
};

export const applyRandomVideoHoverColor = applyRandomCardHoverColor;
