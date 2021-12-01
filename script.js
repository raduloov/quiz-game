'use strict';

///////////////////////////////////////////////////////////////////
// Database
import {
  scienceObj,
  historyObj,
  geographyObj,
  philosophyObj,
  sportsObj,
  randomObj,
} from './database.js';

let science = JSON.parse(JSON.stringify(scienceObj));
let history = JSON.parse(JSON.stringify(historyObj));
let geography = JSON.parse(JSON.stringify(geographyObj));
let philosophy = JSON.parse(JSON.stringify(philosophyObj));
let sports = JSON.parse(JSON.stringify(sportsObj));
let random = JSON.parse(JSON.stringify(randomObj));

///////////////////////////////////////////////////////////////////
// Getting elements & declaring variables
const categories = document.querySelectorAll('.card');
const startButton = document.getElementById('begin-btn');
const settingsButton = document.getElementById('settings-btn');
const okayButton = document.getElementById('okay-btn');
const applyButton = document.getElementById('apply-btn');
const newGameButton = document.getElementById('new-game-btn');
const difficultyButtons = document.querySelectorAll('input[name="diff"]');
const buttons = document.querySelectorAll('.answer-btn');
const settingsMenu = document.getElementById('settings');
const gameMenu = document.getElementById('game-menu');
const welcomeMenu = document.getElementById('welcome');
const questionHTML = document.getElementById('question');
const detailsHTML = document.getElementById('game-details');
const correctHTML = document.getElementById('correct');
const incorrectHTML = document.getElementById('incorrect');
const endGameMenu = document.getElementById('endgame');
const finalCorrect = document.getElementById('correct-answers');
const finalIncorrect = document.getElementById('incorrect-answers');
const totalScore = document.getElementById('score');
const happyEmoji = document.getElementById('happy-emoji');
const sadEmoji = document.getElementById('sad-emoji');
const display = document.getElementById('timer');
const timerBox = document.querySelector('.timer-box');
const releaseNotes = document.getElementById('release-notes');

let answer;
let category;
let question;
let options;
let mode;
let index = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let questionsArr;
let length;
let countdown;
let duration = 15;
let isFinished = false;

///////////////////////////////////////////////////////////////////
// Force app to reset initial position on reload
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

///////////////////////////////////////////////////////////////////
// Categories selection
categories.forEach(panel => {
  panel.addEventListener('click', () => {
    removeActiveClasses();
    panel.classList.add('active');
  });
});

///////////////////////////////////////////////////////////////////
// Buttons
startButton.addEventListener('click', () => {
  playAudio('click');

  scrollTo(gameMenu);

  categories.forEach(panel => {
    if (panel.classList.contains('active')) category = panel.id;
  });

  category = parseCategory(category);
  questionsArr = generateQuestion(category);
  setDifficulty();
  nextQuestion(category);
  length = questionsArr.length;
});

buttons.forEach(button =>
  button.addEventListener('click', function () {
    selectAnswer(button);
  })
);

difficultyButtons.forEach(button => {
  button.addEventListener('click', () => {
    playAudio('click');
  });
});

newGameButton.addEventListener('click', () => {
  playAudio('click');
  newGame();
});
settingsButton.addEventListener('click', () => {
  playAudio('click');
  settingsMenu.classList.remove('hidden');
});
applyButton.addEventListener('click', () => {
  playAudio('click');
  settingsMenu.classList.add('hidden');
});
okayButton.addEventListener('click', () => {
  playAudio('click');
  releaseNotes.classList.add('hidden');
});

///////////////////////////////////////////////////////////////////
// Functions
function scrollTo(section) {
  section.scrollIntoView({ behavior: 'smooth' });
}

function removeActiveClasses() {
  categories.forEach(panel => {
    panel.classList.remove('active');
  });
}

function parseCategory(category) {
  if (category === 'random') {
    category = random[Math.floor(Math.random() * random.length)];
    mode = 'Random';
  }

  switch (category) {
    case 'science':
      category = science;
      mode = 'Science';
      break;
    case 'history':
      category = history;
      mode = 'History';
      break;
    case 'sports':
      category = sports;
      mode = 'Sports';
      break;
    case 'geography':
      category = geography;
      mode = 'Geography';
      break;
    case 'philosophy':
      category = philosophy;
      mode = 'Philosophy';
      break;
    default:
      break;
  }

  return category;
}

function generateQuestion(category) {
  return Object.keys(category).sort((a, b) => 0.5 - Math.random());
}

function setDifficulty() {
  difficultyButtons.forEach(button => {
    if (button.checked) {
      switch (button.id) {
        case 'easy':
          duration = 30;
          break;
        case 'normal':
          duration = 15;
          break;
        case 'hard':
          duration = 5;
          break;
      }
    }
  });
}

function selectAnswer(button) {
  if (button.textContent === answer) {
    playAudio('correct-sound');
    correctAnswers++;
  } else {
    playAudio('wrong-sound');
    incorrectAnswers++;
  }

  if (index < length - 1) {
    index++;
  } else {
    endGame();
  }

  clearInterval(countdown);
  nextQuestion(category);
}

function nextQuestion(category) {
  question = questionsArr[index];
  answer = category[question][0];
  options = category[question].sort((a, b) => 0.5 - Math.random());
  console.log(answer);
  questionHTML.textContent = question;
  buttons.forEach((button, index) => (button.textContent = options[index]));
  detailsHTML.textContent = `${mode} - Question ${index + 1} of ${Object.keys(category).length}`;
  correctHTML.textContent = correctAnswers;
  incorrectHTML.textContent = incorrectAnswers;

  startTimer(duration);
}

function endGame() {
  endGameMenu.classList.remove('hidden');
  const score = Math.round((correctAnswers / length) * 100);
  finalCorrect.textContent = `${correctAnswers} correct`;
  finalIncorrect.textContent = `${incorrectAnswers} incorrect`;
  totalScore.textContent = `${score}%`;

  if (score > 50) {
    totalScore.style.color = '#00ff15';
    happyEmoji.classList.remove('hidden');
    sadEmoji.classList.add('hidden');
    playAudio('victory');
  } else {
    totalScore.style.color = 'red';
    happyEmoji.classList.add('hidden');
    sadEmoji.classList.remove('hidden');
    playAudio('defeat');
  }

  isFinished = true;
}

function newGame() {
  endGameMenu.classList.add('hidden');

  isFinished = false;

  index = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;

  science = JSON.parse(JSON.stringify(scienceObj));
  history = JSON.parse(JSON.stringify(historyObj));
  geography = JSON.parse(JSON.stringify(geographyObj));
  philosophy = JSON.parse(JSON.stringify(philosophyObj));
  sports = JSON.parse(JSON.stringify(sportsObj));
  random = JSON.parse(JSON.stringify(randomObj));

  clearInterval(countdown);

  scrollTo(welcomeMenu);
}

function playAudio(audio) {
  stopAudio();
  const sound = document.getElementById(audio);
  sound.play();
}

function stopAudio() {
  const sounds = ['wrong-sound', 'correct-sound', 'clock-tick-sound'];

  sounds.forEach(sound => {
    const s = document.getElementById(sound);

    s.pause();
    s.currentTime = 0;
  });
}

function startTimer(duration) {
  let timer = duration;
  let minutes = 0;
  let seconds = 0;

  countdown = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    // minutes = minutes < 10 ? '0' + minutes : minutes;
    // seconds = seconds < 10 ? '0' + seconds : seconds;

    // display.textContent = minutes + ':' + seconds;
    display.textContent = seconds;

    if (seconds >= 10) {
      display.style.color = '#00ff15';
      timerBox.style.borderColor = '#00ff15';
    } else if (seconds > 6) {
      display.style.color = '#ffa600';
      timerBox.style.borderColor = '#ffa600';
    } else if (seconds < 6) {
      display.style.color = 'red';
      timerBox.style.borderColor = 'red';
      playAudio('clock-tick-sound');
    }

    if (isFinished) {
      clearInterval(countdown);
      stopAudio();
    }

    if (--timer < 0) {
      clearInterval(countdown);

      playAudio('wrong-sound');
      incorrectAnswers++;

      console.log(index);
      if (index < length - 1) {
        index++;
        clearInterval(countdown);
        nextQuestion(category);
      } else {
        clearInterval(countdown);
        endGame();
      }
    }
  }, 1000);
}
