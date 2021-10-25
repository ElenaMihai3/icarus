import Icarus from './classes/Icarus.js'
import Platform from './classes/Platform.js'
import { loadImage } from "./functions/lib.js"

    const $loading = document.querySelector(`.loading`);
    const $result = document.querySelector(`.result`);
    const $canvas = document.querySelector(`.canvas`);
    const daedalus = document.querySelector(`.instructions__daedalus`);
    const button = document.querySelector(`.game__button`);
    const ctx = $canvas.getContext("2d");
    const instructions = document.querySelector(`.instructions__text`);
    const audio = document.querySelector(`.audio`);
    const scorePlacement = document.querySelector(`.game__score`);

    let platformWidth;
    const gridHeight = 700;
    const gridWidth = 750;
    const icarusWidth = 100;
    const icarusHeight = 50;
    const sunWidth = 100;
    const sunHeight = 100;
    const featherWidth = 50;
    const featherHeight = 100;

{
    let platforms = [];
    let outcome;

    let imageSun;
    let imageIcarus;
    let imageFeather;
    let imageBasket;

    let video;
    let poseNet;
    let pose;

    let basket;
    let icarus;

    let firstGame = true;
    let secondGame = false;
    let thirdGame = false;

    let gameNumber;
    
    let loss = 0;
    let scoreFirst = 0;
    let scoreThird = 0;
    
    let speed;
    let rightWristDistances = [];
    let currentPosition;
    let xPositionNose;
    let lastPosition
    let startPoint = gridHeight-150;
    const platformAmount = 3;
    let isGameOver = false;
    
    let speedPlatforms = 0.5;

    window.setup = function setup() {
        video = createCapture(VIDEO);
        video.hide();
        video.size(750, 700);
        poseNet = ml5.poseNet(video, { flipHorizontal: true }, modelLoaded);
    }

    function gotPoses(poses) {
        if (poses.length > 0) {
            pose = poses[0].pose;
        }
    }

    function modelLoaded() {
        poseNet.on('pose', gotPoses);
        $loading.style.display = 'none';
        $result.style.display = 'grid';
    }

    window.draw = function draw() {
        
        if (pose) {
            setInterval(function () {
                var newWristPosition = {
                    newRightWristX: pose.rightElbow.x,
                    newRightWristY: pose.rightElbow.y,
                };
                rightWristDistances.push(newWristPosition);
                xPositionNose = pose.nose.x;
            }, 1000);
        }
        calculateSpeed();
    }

    const playMusic = () => {
        audio.play();
    }

    const changeInstructions = (gameNumber) => {
        if(gameNumber == 1) {
            cancelAnimationFrame(drawFirstGame);
            button.addEventListener('click', function() {
                instructions.textContent = `Flap your arms up and down to fly up.`;
                button.textContent = `start`;
                button.addEventListener("click", startSecond);
            }) 
        } else if(gameNumber == 2) {
            cancelAnimationFrame(drawSecondGame);
            button.addEventListener('click', function () {
                instructions.textContent = `I used wax to glue the feathers, so avoid the sun while flying. Try to avoid the sun long enough until we arrive on Sicily and we'll be free. Control Icarus by moving your head left and right.`;
                button.textContent = `start`;
                button.addEventListener("click", startThird);
            })
        } 
    }

    const calculateSpeed = () => {
        if (pose) {
            currentPosition = rightWristDistances[rightWristDistances.length - 1];
            lastPosition = rightWristDistances[rightWristDistances.length - 2];

            if (currentPosition != undefined && lastPosition != undefined) {
                speed = dist(currentPosition.newRightWristX, currentPosition.newRightWristY, lastPosition.newRightWristX, lastPosition.newRightWristY);
                speed = speed / 2;
            }
        }
    }
    
    const createSuns = () => {
        for (let i = 0; i < platformAmount; i++) {
            const platformGap = gridHeight / platformAmount;
            const newPlatformBottom = 25 + (i * platformGap)/2;
            const newPlatform = new Platform(i, Math.random() * (gridWidth - platformWidth), newPlatformBottom, ctx, imageSun, "game3");
            platforms.push(newPlatform);
        } 
    }

    const createFeathers = () => {
        for (let i = 0; i < platformAmount; i++) {
            const platformGap = gridHeight / platformAmount;
            const newPlatformBottom = 25 + (i * platformGap)/2;
            const newPlatform = new Platform(i, Math.random() * (gridWidth - platformWidth), newPlatformBottom, ctx, imageFeather, "game1");
            platforms.push(newPlatform);
        }
    }

    const calculatePlatforms = () => {
        speedPlatforms = speedPlatforms + 0.07;
    }

    const drawFirstGame = () => {
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        basket.draw(xPositionNose, 0, gameNumber);

        if (platforms.length == platformAmount) {
                platforms.forEach(platform => {
                    if (platform.y > gridHeight) {
                        platform.y = 0;
                        platform.x = Math.random() * (gridWidth - platformWidth);
                        loss++
                    }
                    if (basket.x - (icarusWidth / 2) >= platform.x + (featherWidth / 2) || basket.y + (icarusHeight / 2) <= platform.y - (featherHeight / 2) ||
                        basket.x + (icarusWidth / 2) <= platform.x - (featherWidth / 2) || basket.y - (icarusHeight / 2) >= platform.y + (featherHeight / 2)) {
                    } else {
                        scoreFirst++
                        scorePlacement.textContent = `${scoreFirst}/20`
                        platform.y = 0;
                        platform.x = Math.random() * (gridWidth - platformWidth);
                    }
                    platform.draw(speedPlatforms);
                }
            );
        }

        if(loss >= 3) {
            outcome = "failed";
            gameOver(1);
        } 
        
        if(scoreFirst == 20) {
            outcome = "succeeded";
            gameOver(1);
        }

        if (firstGame == true) {
            requestAnimationFrame(drawFirstGame);
        } else {
            cancelAnimationFrame(drawFirstGame);
        }
    }

    const drawSecondGame = () => {
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        $canvas.style.background = `url(../assets/img/background__game2.jpg) no-repeat`;
        $canvas.style.backgroundSize= `120%`;

        if (icarus.y != undefined) {
            if (icarus.y >= 0) {
                icarus.draw($canvas.width / 2 - 50, speed, gameNumber);
            } else {
                gameOver(2);
                secondGame = false;
            }
        }

        if(secondGame == true) {
            requestAnimationFrame(drawSecondGame);
        } else {
            cancelAnimationFrame(drawSecondGame);
        }
    }

    const drawThirdGame = () => {
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        icarus.draw(xPositionNose, 0, gameNumber);

        if(platforms.length == 3) {
                platforms.forEach(platform => {
                if (platform.y > gridHeight) {
                    platform.y = 0;
                    platform.x = Math.random() * (gridWidth - platformWidth);
                    scoreThird++
                    scorePlacement.textContent = `${scoreThird}/20`
                }
                    if (icarus.x - (icarusWidth / 2) >= platform.x + (sunWidth / 2) || icarus.y + (icarusHeight / 2) <= platform.y - (sunHeight / 2) ||
                        icarus.x + (icarusWidth / 2) <= platform.x - (sunWidth / 2) || icarus.y - (icarusHeight / 2) >= platform.y + (sunHeight / 2)) {
                } else {
                    if (scoreThird >= 20) {
                        outcome = "succeeded";
                    } else {
                        outcome = "failed";
                    }
                    gameOver(3);
                    cancelAnimationFrame(drawThirdGame)
                    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
                }
                platform.draw(speedPlatforms);
            }
            );
        }

        if (thirdGame == true) {
            requestAnimationFrame(drawThirdGame);
        } else {
            cancelAnimationFrame(drawThirdGame);
        }
    }

    const startFirst = () => {
        gameNumber = 1;
        loss = 0;
        scoreFirst = 0;
        clearInterval(calculatePlatforms);
        speedPlatforms = 0.5;
        
        button.classList.add('hide');
        isGameOver = false;

        if (!isGameOver) {
            button.classList.add('hide');
            daedalus.src = `assets/img/daedalus.png`
            createFeathers();
            setInterval(calculatePlatforms, 1000);
            drawFirstGame();
        }
    }

    const startSecond = () => {
        scorePlacement.classList.add('hide');
            gameNumber = 2;
            button.classList.add('hide');

                    isGameOver = false;
                    daedalus.src = `assets/img/daedalus.png`

                    if (!isGameOver) {
                        drawSecondGame();
                    }
        
    }

    const startThird = () => {
        scorePlacement.classList.remove('hide');
        scorePlacement.textContent = `0/20`
        gameNumber = 3;
        platformWidth = 100;
        thirdGame = true;
        clearInterval(calculatePlatforms);
        speedPlatforms = 0.5;

        $canvas.style.background = `url(../assets/img/background__game3.jpg) no-repeat`;
        $canvas.style.backgroundSize = `120%`;
        instructions.textContent = `As I used wax to glue the feathers, you should avoid the sun while flying. Try to avoid the sun long enough until we arrive on Sicily, where we can finally be free.`;

        isGameOver = false;
        if (!isGameOver) {
            button.classList.add('hide');
            daedalus.src = `assets/img/daedalus.png`
            createSuns();
            setInterval(calculatePlatforms, 1000);
            drawThirdGame();
        }
    }

    const gameOver = (gameNumber) => {
        switch (gameNumber) {
            case 1:
                if (outcome == "succeeded") {
                    cancelAnimationFrame(drawFirstGame);
                    isGameOver = true;
                    firstGame = false;
                    secondGame = true;
                    instructions.textContent = `Good job! you caught ${scoreFirst} feathers! This is enough to build two pairs of wings for me and my son.`;
                    button.textContent = `next`;
                    button.removeEventListener('click', startFirst);
                    button.addEventListener('click', changeInstructions(gameNumber));
                } else if (outcome == "failed") {
                    scoreFirst = 0;
                    cancelAnimationFrame(drawFirstGame);
                    instructions.textContent = `Try to drop less feathers!`;
                    button.textContent = `try again`;
                }
                break;
            case 2:
                cancelAnimationFrame(drawSecondGame);
                secondGame = false;
                thirdGame = true;
                instructions.textContent = `Good job! you flew up!`;
                button.removeEventListener('click', startSecond);
                button.addEventListener('click', changeInstructions(gameNumber));
                break;
            case 3:
                if (outcome == "succeeded") {
                    cancelAnimationFrame(drawThirdGame);
                    isGameOver = true;
                    thirdGame = false;
                    instructions.textContent = `Good job! We arrived in Sicily after you avoided ${scoreThird} suns!`;
                    $canvas.style.background = `url(../assets/img/background__final.jpg) no-repeat`;
                    $canvas.style.backgroundSize = `120%`;
                    button.removeEventListener('click', startThird);
                    button.remove();
                } else if (outcome == "failed") {
                    scoreThird = 0;
                    thirdGame = false;
                    cancelAnimationFrame(drawThirdGame);
                    instructions.textContent = `Icarus touched a sun and fell in the ocean.`;
                    button.textContent = `try again`;
                    $canvas.style.background = `url(../assets/img/background__fall.jpg) no-repeat`;
                    $canvas.style.backgroundSize = `120%`;
                    button.addEventListener('click', startThird);
                }
                break;
        }


        button.classList.remove('hide');
        clearInterval(calculatePlatforms);
        speedPlatforms = 0.5;
        isGameOver = true;
        platforms = [];
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        daedalus.src = `assets/img/daedalus__talking.png`
    }

    const init = async () => {
        document.body.style.background = "url('../assets/img/background__game.jpg') no-repeat";
        document.body.style.backgroundSize = "90%";
        document.body.style.backgroundPosition = "center";
        $result.style.display = 'none';

        imageSun = await loadImage('./assets/img/sun.png');
        imageIcarus = await loadImage('./assets/img/icarus.png');
        imageFeather = await loadImage('./assets/img/feather.png');
        imageBasket = await loadImage('./assets/img/basket.png');
        
        basket = new Icarus($canvas, ($canvas.width / 2)-50, startPoint, ctx, imageBasket);
        icarus = new Icarus($canvas, ($canvas.width / 2)-50, startPoint, ctx, imageIcarus);
        
        if(firstGame = true) {
            button.addEventListener('click', startFirst);
            platformWidth = 50;
        }

        window.addEventListener('click', playMusic)
    };

    init();
}