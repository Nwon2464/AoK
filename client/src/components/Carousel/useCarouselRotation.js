import { useState } from "react";

import {
  CAROUSEL_ITEM_COUNT,
  INITIAL_CARD_DISPLAY,
  INITIAL_CENTRAL_INDEX,
  INITIAL_X_POSITIONS,
} from "./carouselConfig";

const rotateLeft = (items) => {
  const nextItems = items.slice();
  nextItems.unshift(nextItems.pop());
  return nextItems;
};

const rotateRight = (items) => {
  const nextItems = items.slice();
  nextItems.push(nextItems.shift());
  return nextItems;
};

const useCarouselRotation = () => {
  const [central, setCentral] = useState(INITIAL_CENTRAL_INDEX);
  const [cardDisplay, setCardDisplay] = useState(INITIAL_CARD_DISPLAY);
  const [xPos, setXPos] = useState(INITIAL_X_POSITIONS);

  const getCardDisplay = (index) => {
    const num = cardDisplay[index];
    return num.display;
  };

  const getSlideStyle = (index) => {
    const num = xPos[index];

    return {
      zIndex: `${num.zIndex}`,
      transform: `translateX(${num.offset}) translateX(${num.correction}) scale(${num.scale})`,
      transition: "all 450ms ease 0s",
    };
  };

  const moveLeft = () => {
    setCentral((currentCentral) => (currentCentral + 1) % CAROUSEL_ITEM_COUNT);
    setCardDisplay(rotateLeft);
    setXPos(rotateLeft);
  };

  const moveRight = () => {
    setCentral((currentCentral) => (
      (currentCentral - 1 + CAROUSEL_ITEM_COUNT) % CAROUSEL_ITEM_COUNT
    ));
    setCardDisplay(rotateRight);
    setXPos(rotateRight);
  };

  return {
    central,
    getCardDisplay,
    getSlideStyle,
    moveLeft,
    moveRight,
  };
};

export default useCarouselRotation;
