
let currentPlayer = 'player';
let board = ['', '', '', '', '', '', '', '', '']; // 棋盘状态
let gameEnded = false; // 游戏结束
let winner = null; // 胜利者
let winCountRed = 0; // 红方胜利次数
let winCountBlue = 0; // 蓝方胜利次数
let winCountPeace = 0; // 平局次数
let timerElement = document.getElementById('timer');
let timeLeft = 3;//倒计时
let timer;

// 启动倒计时
function startTimer() {
    clearInterval(timer);
    timeLeft = 3;
    updateTimerDisplay();
    timer = setInterval(function () {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft === 0) {
            clearInterval(timer);
            handleTimeout(); // 玩家超时处理，例如执行AI的移动
        }
    }, 1000);
}

// 更新倒计时显示
function updateTimerDisplay() {
    timerElement.textContent = `0:0${timeLeft}`;
}

// 落子之后的处理函数
function handleMove(cellIndex) {
    if (currentPlayer === 'player' && board[cellIndex] === '' && !gameEnded) {
        // 玩家落子
        board[cellIndex] = 'player';
        updateBoardDisplay();
        currentPlayer = 'AI';
        clearInterval(timer);
        setTimeout(startTimer, 500);
        startTimer();
        setTimeout(() => {
            computerMove();
            checkGameEnd(); // 确保在所有棋子下完后检查游戏是否结束
        }, 500);
    }
}

// 处理玩家超时
function handleTimeout() {
    if (currentPlayer === 'player' && !gameEnded) {
        currentPlayer = 'AI';
        computerMove();
        checkGameEnd();
    }
}

// 计算机落子（使用Minimax算法）
function computerMove() {
    let bestMove = minimax(board, 'AI');
    board[bestMove.index] = 'AI';
    updateBoardDisplay();
    currentPlayer = 'player'; // 切换回玩家
    setTimeout(() => {
        checkGameEnd(); // 在最后一个棋子落下后检查游戏是否结束
    }, 500);
}

// Minimax算法
function minimax(board, player) {
    let availSpots = emptySquares(board);

    if (checkWin(board, 'player')) {
        return { score: -10 };
    } else if (checkWin(board, 'AI')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        let originalValue = board[availSpots[i]];

        board[availSpots[i]] = player;

        if (player === 'AI') {
            let result = minimax(board, 'player');
            move.score = result.score;
        } else {
            let result = minimax(board, 'AI');
            move.score = result.score;
        }

        board[availSpots[i]] = originalValue;

        moves.push(move);
    }

    let bestMove;
    if (player === 'AI') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// 返回一个空方块的索引的列表
function emptySquares(board) {
    return board.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);
}

// 检查是否有一方胜利
function checkWin(board, player) {
    let winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横排
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖排
        [0, 4, 8], [2, 4, 6] // 对角线
    ];

    for (let condition of winningConditions) {
        let [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

// 检查游戏是否结束
function checkGameEnd() {
    if (gameEnded) {
        return;
    }
    let winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winningConditions) {
        let [a, b, c] = condition;
        if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
            winner = board[a];
            endGame(winner);
            return true;
        }
    }

    if (!board.includes('')) {
        winner = 'draw';
        endGame('draw');
        return true;
    }

    return false;
}

// 结束游戏
function endGame(result) {
    gameEnded = true;
    clearInterval(timer); // 游戏结束时停止计时器

    // 获取弹窗元素
    var popup_computer = document.getElementById("popup_computer");
    var popup_player = document.getElementById("popup_player");
    var popup_peace = document.getElementById("popup_peace");

    function hidePopup_computer() {
        popup_computer.style.display = 'none';
    }

    function hidePopup_player() {
        popup_player.style.display = 'none';
    }
    function hidePopup_peace() {
        popup_peace.style.display = 'none';
    }

    if (result === 'player') {
        updateScore('player');
        popup_player.style.display = 'block';
        setTimeout(hidePopup_player, 500);
    } else if (result === 'AI') {
        setTimeout(() => {
            updateScore('AI');
        }, 500);
        // 显示弹窗
        popup_computer.style.display = 'block';
        setTimeout(hidePopup_computer, 500);
    } else {
        // 更新平局次数
        updateScore('draw');
        popup_peace.style.display = 'block';
        setTimeout(hidePopup_peace, 500);
    }
    // 清空棋盘
    setTimeout(clearBoard, 500);
}

function updateScore(winner) {
    if (winner === 'player') {
        winCountRed++;
        document.querySelector('.win_count_blue').textContent = winCountRed;
    } else if (winner === 'AI') {
        winCountBlue++;
        document.querySelector('.win_count_red').textContent = winCountBlue;
    } else if (winner === 'draw') {
        winCountPeace++;
        document.querySelector('.win_count_peace').textContent = winCountPeace;
    }
}

function clearBoard() {
    board = ['', '', '', '', '', '', '', '', '']; // 重置棋盘状态
    updateBoardDisplay(); // 更新棋盘显示
    currentPlayer = 'player'; // 切换回玩家
    gameEnded = false;
    winner = null;
}


// 更新棋盘显示
function updateBoardDisplay() {
    for (let i = 0; i < 9; i++) {
        let cell = document.getElementById(`cell${i}`);
        cell.innerHTML = ''; // 清空棋盘格子内容
        cell.classList.remove('chess_piece', 'chessAI');
        if (board[i] === 'player') {
            cell.classList.add('chess_piece'); // 添加玩家棋子类
        } else if (board[i] === 'AI') {
            cell.classList.add('chessAI'); // 添加AI棋子类
        }
    }
}

// 初始化游戏
function initializeGame() {
    let cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.addEventListener('click', function () {
            if (currentPlayer === 'player' && board[index] === '' && !gameEnded) {
                handleMove(index);
            }
        });
    });
    startTimer(); // 开始倒计时
}
initializeGame();


//音乐
let volumeIcon = document.getElementById('volumeIcon');
let musicPlaying = true;
let audio = new Audio('img/青石巷.mp3');
audio.loop = true;
audio.play();

volumeIcon.addEventListener('click', function () {
    musicPlaying = !musicPlaying;


    volumeIcon.classList.remove('muted');

    if (!musicPlaying) {

        volumeIcon.classList.add('muted');
        stopMusic();
    } else {
        playMusic();
    }
});

// 停止音乐的函数
function stopMusic() {
    audio.pause();
}

// 播放音乐的函数
function playMusic() {
    audio.play();
}