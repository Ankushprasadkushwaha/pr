class NoizyNumber {
  constructor(
  templateElement,
  { duplicatesCount = 20, fps = 24, noizeRadius = 30 } = {})
  {
    this.templateElement = templateElement;
    this.element = this.templateElement.cloneNode(true);
    this.pathElement = this.element.querySelector("path");
    this.originalPath = this.pathElement.getAttribute("d");
    this.originalPathList = this.originalPath.split(" ");

    this.element.id = this.element + Math.random();

    this.pathElementsStore = [this.pathElement];
    this.timeoutStore = null;

    this.duplicatesCount = duplicatesCount;
    this.fps = fps;
    this.delay = 1000 / this.fps;
    this.noizeRadius = noizeRadius;

    this.init();

    return this;
  }

  createDuplicatePaths() {
    Array(this.duplicatesCount).
    fill().
    forEach(() => {
      const cloneElement = this.pathElement.cloneNode();
      cloneElement.setAttribute("data-is-clone", true);

      this.element.appendChild(cloneElement);
      this.pathElementsStore.push(cloneElement);
    });
  }

  noizePath(pathElement) {
    const result = this.originalPathList.
    map(position => {var _position$match;
      const command = ((_position$match = position.match(/[a-z]/i)) === null || _position$match === void 0 ? void 0 : _position$match[0]) || "";
      const radius = Math.random() * this.noizeRadius;
      const noize = Math.round(Math.random() * (radius * 2) - radius);
      const value = parseInt(position.slice(command ? 1 : 0));

      return `${command}${value + noize}`;
    }).
    join(" ");

    const scale = 0.7 + Math.random() * 0.5;
    const opacity = 0.5 + Math.random() * 0.5;
    const blur = Math.floor(Math.random() * 2);
    const color = [
    "209, 69, 14",
    "253, 116, 39",
    "255, 149, 60",
    "255, 141, 0"][
    Math.round(Math.random() * 4)];
    pathElement.style.transform = `scale(${scale})`;
    pathElement.style.transformOrigin = `center`;
    pathElement.style.filter = `blur(${blur}px)`;
    pathElement.style.stroke = `rgba(${color}, ${opacity})`;
    pathElement.setAttribute("d", result);
  }

  handleTick() {
    this.pathElementsStore.forEach(this.noizePath.bind(this));

    const scale = 1 + Math.random() * 0.2;
    this.element.style.transform = `scale(${scale})`;
    this.element.style.transformOrigin = `center`;
  }

  animate() {
    clearTimeout(this.timeoutStore);

    this.handleTick();

    this.timeoutStore = setTimeout(this.animate.bind(this), this.delay);
  }

  init() {
    this.createDuplicatePaths();
    this.animate();
  }}


class Countdown {
  constructor({ initialSeconds = 10, onTick, onDone } = {}) {
    this.date = new Date();
    this.lastTick = Date.now();
    this.time = {
      dd: 0,
      hh: 0,
      mm: 0,
      ss: initialSeconds };


    this.onTick = onTick;
    this.onDone = onDone;
  }

  tick() {
    const now = Date.now();

    if (now - this.lastTick < 1000) {
      return setTimeout(this.tick.bind(this), 50);
    } else {
      this.lastTick = now;
    }

    --this.time.ss;

    if (this.time.ss < 0) {
      --this.time.mm;
      this.time.ss = 0;
    }

    if (this.time.mm < 0) {
      --this.time.hh;
      this.time.mm = 0;
    }

    if (this.time.hh < 0) {
      --this.time.dd;
      this.time.hh = 0;
    }

    const isDone =
    this.time.dd === 0 &&
    this.time.hh === 0 &&
    this.time.mm === 0 &&
    this.time.ss === 0;

    if (isDone) {var _this$onDone;
      (_this$onDone = this.onDone) === null || _this$onDone === void 0 ? void 0 : _this$onDone.call(this, this.time);
    } else {var _this$onTick;
      (_this$onTick = this.onTick) === null || _this$onTick === void 0 ? void 0 : _this$onTick.call(this, this.time);

      requestAnimationFrame(() => {
        this.tick();
      });
    }
  }

  start() {
    this.tick();
  }}


const normalizeDigits = digits => {
  digits.toString();
};

const countdownElement = document.querySelector(".countdown");
const countdownDDElement = countdownElement.querySelector(".dd");
const countdownHHElement = countdownElement.querySelector(".hh");
const countdownMMElement = countdownElement.querySelector(".mm");
const countdownSSElement = countdownElement.querySelector(".ss");
let previousTime;

const timeToArray = (timeNumber = 0) =>
[...timeNumber.toString().split("").reverse(), "0"].splice(0, 2).reverse();

const dayDigitElements = document.querySelectorAll(".countdown .dd .digit");
const hourDigitElements = document.querySelectorAll(".countdown .hh .digit");
const minuteDigitElements = document.querySelectorAll(".countdown .mm .digit");
const secondDigitElements = document.querySelectorAll(".countdown .ss .digit");
const dividerElements = document.querySelectorAll(".countdown .divider");
const dividerTemplateElement = document.querySelector(`#number-divider`);

const timeTypesList = ["dd", "hh", "mm", "ss"];
const digitElementsMap = {
  dd: dayDigitElements,
  hh: hourDigitElements,
  mm: minuteDigitElements,
  ss: secondDigitElements };


const setChildren = (parentElement, childrenElement) => {
  try {
    parentElement.innerHTML = "";
    parentElement.appendChild(childrenElement);
  } catch (e) {
    console.error(e);
  }

  return parentElement;
};

const setNoizyNumber = (parentElement, templateElement) => {
  const noizyNumber = new NoizyNumber(templateElement);

  setChildren(parentElement, noizyNumber.element);
};

const renderCountdown = (time, isInit) => {
  timeTypesList.forEach(timeType => {var _previousTime;
    if (isInit || ((_previousTime = previousTime) === null || _previousTime === void 0 ? void 0 : _previousTime[timeType]) !== time[timeType]) {var _previousTime2, _previousTime3;
      const previousTimeArray = (_previousTime2 = previousTime) !== null && _previousTime2 !== void 0 && _previousTime2[timeType] ?
      timeToArray((_previousTime3 = previousTime) === null || _previousTime3 === void 0 ? void 0 : _previousTime3[timeType]) :
      [];
      const timeArray = timeToArray(time[timeType]);

      if (!previousTime) {
        previousTime = {};
      }
      previousTime[timeType] = time[timeType];

      timeArray.forEach((timeValue, index) => {
        if (isInit || previousTimeArray[index] != parseInt(timeValue)) {
          const templateElement = document.querySelector(
          `#number-${timeValue}`);


          digitElementsMap[timeType][index].classList.add("animate-transition");
          setTimeout(() => {
            digitElementsMap[timeType][index].classList.remove(
            "animate-transition");

          }, 250);

          setNoizyNumber(digitElementsMap[timeType][index], templateElement);
        }
      });
    }
  });

  if (isInit) {
    dividerElements.forEach(dividerElement => {
      setNoizyNumber(dividerElement, dividerTemplateElement);
    });

    previousTime = time;
  }
};

const countdown = new Countdown({
  onDone: time => console.log(time),
  onTick: time => {
    renderCountdown(time);
  } });


renderCountdown({ dd: 0, hh: 0, mm: 0, ss: 10 }, true);
countdown.start();

const calculateBgPosition = e => {
  const deltaX = 1 / window.innerWidth * e.pageX;
  const deltaY = 1 / window.innerHeight * e.pageY;
  const range = 25;
  const x = range * deltaX - range;
  const y = range * deltaY - range;

  return {
    x,
    y };

};

const setBgPosition = ({ x, y }) => {
  document.documentElement.style.setProperty("--bg-x", x + "%");
  document.documentElement.style.setProperty("--bg-y", y + "%");
};

const handleMousemove = e => {
  const newBgPosition = calculateBgPosition(e);
  setBgPosition(newBgPosition);
};

window.addEventListener("mousemove", handleMousemove);