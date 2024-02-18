let mainContainer = document.querySelector('.container');
let hangmanDraw = document.querySelector('.hangman-draw');
let lettersContainer = document.querySelector('.container .letters');
let lettersGuess = document.querySelector('.letters-guess');
let randomValue;
let wrongTries = 0;
let rightTries = 0;

setTimeout(() => {
    document.getElementById("start").play();
    document.querySelector('.intro').style.opacity = '0';
    document.querySelector('.intro').style.zIndex = '-1';
}, 3000);

const letters = Array.from('abcdefghijklmnopqrstuvwxyz');

letters.forEach((letter) => {
    let span = document.createElement('span');
    span.className = 'letter-box';
    span.appendChild(document.createTextNode(letter));
    lettersContainer.appendChild(span);
})

fetch("words-categories.json").then((result) => {
    let finalData = result.json();
    return finalData;
}).then((words) => {
    let allKeys = Object.keys(words);
    let randomNum = Math.floor(Math.random() * allKeys.length);
    let randomCategoryName = allKeys[randomNum];
    // Random Category
    let randomCategory = words[randomCategoryName];

    let randomNumber = Math.floor(Math.random() * randomCategory.length);
    // Random Word From Category
    randomValue = randomCategory[randomNumber];

    document.querySelector('.game-info .category span').innerHTML = randomCategoryName;

    let randomValueArr = Array.from(randomValue.toLowerCase());
    
    randomValueArr.forEach((letter) => {
        let span = document.createElement('span');
        if (letter === ' ') span.classList.add("with-space");
        lettersGuess.appendChild(span);
    })

    let guessSpans = document.querySelectorAll('.letters-guess span');

    document.addEventListener("click", (e) => {

        let theStauts = false;

        if (e.target.classList.contains("letter-box")) {
            e.target.classList.add("clicked");
            let clickedLetter = e.target.innerHTML.toLowerCase();

            randomValueArr.forEach((wordLetter, wordIndex) => {
                if (wordLetter === clickedLetter) {
                    theStauts = true;
                    guessSpans.forEach((letter, letterIndex) => {
                        if (wordIndex === letterIndex) {
                            letter.innerHTML = clickedLetter;
                        }
                    })
                }
            })

            if (theStauts !== true) {
                wrongTries++;
                document.getElementById("lose").play();

                hangmanDraw.classList.add(`wrong-${wrongTries}`);

                if (wrongTries === 8) {
                    lettersContainer.classList.add("finish");
                    gameOver();
                }
                
            } else {
                rightTries++;
                document.getElementById("win").play();
                let wordValue = [...new Set(randomValue.toLowerCase())];
                let choosenWord = wordValue.toString().match(/[a-z]/ig).join("");
                if (choosenWord.length === rightTries) {
                    lettersContainer.classList.add("finish");
                    congrats();
                }
            }
        }
    })
});

function gameOver() {
    let div = document.createElement('div');
    div.classList.add("game-over");
    div.appendChild(document.createTextNode("GAME OVER"));

    let divSpan = document.createElement('span');
    divSpan.appendChild(document.createTextNode(`You Tried ${wrongTries} Times`))
    divSpan.classList.add("wrong-tries-num");

    let divSpanWord = document.createElement('span');
    divSpanWord.appendChild(document.createTextNode(`The Word Is ${randomValue}`))
    divSpanWord.classList.add("right-answer");

    div.appendChild(divSpan);
    div.appendChild(divSpanWord);
    mainContainer.prepend(div);

    document.getElementById("gameover").play();

    setTimeout(() => {
        let span = document.createElement('span');
        span.classList.add("start-again");
        span.appendChild(document.createTextNode('START AGAIN'));
        div.innerHTML = '';
        div.appendChild(span);

        span.addEventListener("click", () => {
            window.location.reload();
        });
    }, 4000)
}


function congrats() {
    let div = document.createElement('div');
    div.classList.add("congrats");
    div.appendChild(document.createTextNode("CONGRATULATIONS"));
    mainContainer.prepend(div);

    document.getElementById("congrats").play();

    setTimeout(() => {
        let span = document.createElement('span');
        span.classList.add("start-again");
        span.appendChild(document.createTextNode('START AGAIN'));
        div.innerHTML = '';
        div.appendChild(span);

        span.addEventListener("click", () => {
            window.location.reload();
        });
    }, 2000)
}