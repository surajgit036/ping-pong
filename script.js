var ball = document.getElementById('ball');
var topPaddle = document.getElementById('topPaddle');
var bottomPaddle = document.getElementById('bottomPaddle');
var topScore = document.getElementById('rod1');
var bottomScore = document.getElementById('rod2')


const nameStored = "PPName";
const scoreStored = "PPMaxScore";
const topPaddleName = "PLAYER 1";
const bottomPaddleName = "PLAYER 2";


let scoreTop,
    scoreBottom,
    maxScore,
    movement,
    rod,
    SpeedX = 2.5,
    SpeedY = 2.5;

let gameOn = false;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;


// welcome function.............................//
(function () {
    rod = localStorage.getItem(nameStored);
    maxScore = localStorage.getItem(scoreStored);

    if (rod === "null" || maxScore === "null") {
        alert("You're Playing for the first time. Let's GO..!");
        maxScore = 0;
        rod = "topPaddle"
    } else {
        alert(rod + " has maximum score of " + maxScore * 100);
    }

    resetGame(rod);
})();

//reset function------------------------------------------------------------------------//

function resetGame(rodName) {

    topPaddle.style.left = (window.innerWidth - topPaddle.offsetWidth) / 2 + 'px';
    bottomPaddle.style.left = (window.innerWidth - bottomPaddle.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';


    // Lossing player gets the ball
    if (rodName === bottomPaddleName) {
        ball.style.top = (topPaddle.offsetTop + topPaddle.offsetHeight) + 'px';
        SpeedY = 2;
    } else if (rodName === topPaddleName) {
        ball.style.top = (bottomPaddle.offsetTop - bottomPaddle.offsetHeight) + 'px';
        SpeedY = -2;
    }

    scoreTop = 0;
    topScore.innerText=0;
    bottomScore.innerText=0;
    scoreBottom = 0;
    gameOn = false;

}


//storing scores in local storage-------------------------------//
function storeWin(rod, score) {

    if (scoreTop > maxScore) {
        maxScore = scoreTop;
        localStorage.setItem(nameStored, rod);
        localStorage.setItem(scoreStored, maxScore);
    }
    else
    {
        maxScore = scoreBottom;
        localStorage.setItem(nameStored, rod);
        localStorage.setItem(scoreStored, maxScore);
    }

    clearInterval(movement);
    resetGame(rod);

    alert(rod + " wins with a score of " + (score * 100) + ". Max score is: " + 
        (maxScore * 100));

}


// keypress Bindings.........................................................//
window.addEventListener('keypress', function (event) {
    let rodSpeed = 25;

    let rodRect = topPaddle.getBoundingClientRect();


    if (event.code === "KeyD" && ((rodRect.x + rodRect.width) < window.innerWidth)) {
        topPaddle.style.left = (rodRect.x) + rodSpeed + 'px';
        bottomPaddle.style.left = topPaddle.style.left;
    } else if (event.code === "KeyA" && (rodRect.x > 0)) {
        topPaddle.style.left = (rodRect.x) - rodSpeed + 'px';
        bottomPaddle.style.left = topPaddle.style.left;
    }


    if (event.code === "Enter") {

        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let topPaddleHeight = topPaddle.offsetHeight;
            let bottomPaddleHeight = bottomPaddle.offsetHeight;
            let topPaddleWidth = topPaddle.offsetWidth;
            let bottomPaddleWidth = bottomPaddle.offsetWidth;


            movement = setInterval(function () {
                // Move ball 
                ballX += SpeedX;
                ballY += SpeedY;

                topPaddleX = topPaddle.getBoundingClientRect().x;
                bottomPaddleX = bottomPaddle.getBoundingClientRect().x;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';


                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    SpeedX = -SpeedX; // Reverses the direction
                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for PLAYER 1
                if (ballY <= topPaddleHeight) {
                    SpeedY = -SpeedY; // Reverses the direction
                    scoreTop++;
                    topScore.innerText=scoreTop*100;

                    // Check if the game ends
                    if ((ballPos < topPaddleX) || (ballPos > (topPaddleX + topPaddleWidth))) {
                        storeWin(bottomPaddleName, scoreTop);
                        topScore.innerText=score
                       
                    }
                }

                // Check for PLAYER 2
                else if ((ballY + ballDia) >= (windowHeight - bottomPaddleHeight)) {
                    SpeedY = -SpeedY; // Reverses the direction
                    scoreBottom++;
                    bottomScore.innerText = scoreBottom*100;

                    // Check if the game ends
                    if ((ballPos < bottomPaddleX) || (ballPos > (bottomPaddleX + bottomPaddleWidth))) {
                        storeWin(topPaddleName, scoreBottom);
                                         

                    }
                }

            }, 10);

        }
    }

});