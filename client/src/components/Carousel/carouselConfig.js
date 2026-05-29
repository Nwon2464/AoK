export const CAROUSEL_ITEM_COUNT = 5;

export const INITIAL_CENTRAL_INDEX = 2;

export const INITIAL_CARD_DISPLAY = [
  { display: "none" },
  { display: "none" },
  { display: "" },
  { display: "none" },
  { display: "none" },
];

export const INITIAL_X_POSITIONS = [
  {
    offset: "-40vw",
    correction: "50%",
    scale: "0.7",
    zIndex: "1",
  },
  {
    offset: "-20vw",
    correction: "25%",
    scale: "0.85",
    zIndex: "2",
  },
  {
    offset: "0vw",
    correction: "0%",
    scale: "1",
    zIndex: "3",
  },
  {
    offset: "20vw",
    correction: "-25%",
    scale: "0.85",
    zIndex: "2",
  },
  {
    offset: "40vw",
    correction: "-50%",
    scale: "0.7",
    zIndex: "1",
  },
];
