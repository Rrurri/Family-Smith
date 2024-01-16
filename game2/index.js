let timeForForward = 0; // большее время из пары
const audio = document.getElementById('audio');
audio.volume = .1;
const leftGround = document.querySelector('.left-ground');
const rightGround = document.querySelector('.right-ground');

const timer = document.getElementById("timer");
const scoreBoard = document.querySelector('.score-board');
const message = document.querySelector('.message');

const playButton = document.getElementById('play-button');
const goButton = document.getElementById('go-button');
const againButton = document.getElementById('try-again-button');
const playground = document.querySelector('.ground');
const scoreTable = document.querySelector('.results');

let tryNumber = localStorage.getItem('try')-0;

if(!tryNumber) {
    localStorage.setItem('try', 0);
    tryNumber = localStorage.getItem('try')-0;
}

const tryContainer = document.querySelector('.try');
const turnCounter = document.querySelector('.turn');

tryContainer.innerHTML = `Попытка ${ tryNumber }`;

const summer = {
    seconds: 3,
    entity: document.getElementById('Summer'),
    state: false,
    isPrepared: false
}

const jerry = {
    seconds: 12,
    entity: document.getElementById('Jerry'),
    state: false,
    isPrepared: false
}

const bet = {
    seconds: 5,
    entity: document.getElementById('Bet'),
    state: false,
    isPrepared: false
}

const rick = {
    seconds: 7,
    entity: document.getElementById('Rick'),
    state: false,
    isPrepared: false
}

const morty = {
    seconds: 1,
    entity: document.getElementById('Morty'),
    state: false,
    isPrepared: false
}

const container = {
    entity: document.getElementById('container'),
    state: false,
    places: 2
}

const humans = [ summer, jerry, bet, rick, morty ];

humans.forEach(human => {
    // отобразить время
    const time = document.createElement('div');
    time.setAttribute('class', 'human-time');
    time.innerHTML = human.seconds;
    human.entity.appendChild(time);

    human.entity.addEventListener('click', () => {
        if (human.state === container.state) {
            if (!human.isPrepared && container.places > 0) { // встать в пару
                container.entity.appendChild(human.entity);
                human.isPrepared = true;
                container.places -= 1;
            } else if (human.isPrepared) { // выйти из пары
                if (human.state) {
                    rightGround.appendChild(human.entity);
                } else {
                    leftGround.appendChild(human.entity);
                }

                human.isPrepared = false;
                container.places += 1;
            }
        }
    });
});

const checkResults = () => {
    for(let i = 0; i <= tryNumber-0; i++) {
        const tries = localStorage.getItem(`try-${i}`);
        if(tries === 'winner') {
            const span = document.createElement('span');
            span.textContent = `Попытка ${i}: \n Победа!`;
            scoreTable.appendChild(span);
        }
    }
}

againButton.addEventListener('click', () => {
    location.reload();
});

goButton.addEventListener('click', () => {
    if (container.places < 2) {
        startTimer();
        goButton.setAttribute('disabled', true);
    
        humans.forEach(human => {
            if (human.isPrepared) {
                if (human.seconds > timeForForward) {
                    timeForForward = human.seconds;
                }
            }
        })
    
        container.entity.style.transition = `${timeForForward}s linear`;
    
        if(container.state) {
            container.entity.style.left = "25%";
        } else {
            container.entity.style.left = "70%";
        }
    
        setTimeout(() => {
            stopTimer();
            timeForForward = 0;
    
            if (!container.state) {
                container.state = true;
            } else {
                container.state = false;
            }
    
            container.places = 2;
    
            humans.forEach(human => {
                if(human.isPrepared) {
                    if (!human.state) {
                        human.state = true;
                        rightGround.appendChild(human.entity);
                    } else {
                        human.state = false;
                        leftGround.appendChild(human.entity);
                    }
    
                    human.isPrepared = false;
                }
            });

            if (humans.filter(human => human.state).length >= 5 ) { // Победа
                localStorage.setItem(`try-${tryNumber}`, 'winner');
                checkResults();
                playground.classList.add('hidden');
                goButton.classList.add('hidden');
                scoreTable.classList.remove('hidden');
                againButton.classList.remove('hidden');
                tryContainer.textContent = 'ПОБЕДА!!';
            }

            goButton.removeAttribute('disabled');
        }, timeForForward * 1000);
    }
});

playButton.addEventListener('click', () => {
    tryNumber += 1;
    tryContainer.innerHTML = `Попытка ${ tryNumber }`;
    localStorage.setItem('try', tryNumber);

    playground.classList.remove('hidden');
    goButton.classList.remove('hidden');
    playButton.classList.add('hidden');
});

let timeRemaining = 30;

let timerId;

function countdown() {
    timeRemaining--;
    timer.innerHTML = timeRemaining;
    if (timeRemaining <= 0) { // поражение
        checkResults();
        tryContainer.textContent = 'ПОРАЖЕНИЕ!!';
        playground.classList.add('hidden');
        goButton.classList.add('hidden');
        scoreTable.classList.remove('hidden');
        againButton.classList.remove('hidden');
        clearInterval(timerId);
    }
}

const stopTimer = () => clearInterval(timerId);

const startTimer = () => timerId = setInterval(countdown, 1000);
