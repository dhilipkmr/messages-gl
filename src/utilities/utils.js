import {
  TIME_YEAR,
  TIME_MONTH,
  TIME_DAYS,
  TIME_HOURS,
  TIME_MINUTES,
  TIME_SECONDS
} from "../constants";

export const createLoadingObserver = ($elt, cb) => {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, observer) => {
    if (entries[0] && entries[0].isIntersecting) {
      cb(entries, observer);
    }
  }, options);
  observer.observe($elt);
  return observer;
};

export const calculateTimeDifference = (date1, date2) => {
  const differenceInMicroSeconds = date1.getTime() - date2.getTime();
  const secondsPassed = differenceInMicroSeconds / 1000;
  if (secondsPassed < 60) {
    return Math.floor(secondsPassed) + ` ${TIME_SECONDS}`;
  }
  const minutesPassed = parseInt(secondsPassed, 10) / 60;
  if (minutesPassed < 60) {
    return Math.floor(minutesPassed) + ` ${TIME_MINUTES}`;
  }
  const hoursPassed = parseInt(minutesPassed, 10) / 60;
  if (minutesPassed < 60) {
    return Math.floor(hoursPassed) + ` ${TIME_HOURS}`;
  }
  const daysPassed = parseInt(hoursPassed, 10) / 24;
  if (daysPassed < 30) {
    return Math.floor(daysPassed) + ` ${TIME_DAYS}`;
  }
  const monthsPassed = parseInt(daysPassed, 10) / 30;
  if (monthsPassed < 12) {
    return Math.floor(monthsPassed) + ` ${TIME_MONTH}`;
  }
  const yearsPassed = parseInt(monthsPassed, 10) / 12;
  return Math.floor(yearsPassed) + ` ${TIME_YEAR}`;
};
