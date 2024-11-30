var cells = document.getElementsByClassName('cell');
var isRedTurn = true; // 用于跟踪当前应该添加的棋子颜色
var board = Array(9).fill(null); // 用于追踪棋盘状态
var countdown = 5; // 倒计时初始时间
var countdownInterval; // 用于存储倒计时的 setInterval ID
var gameEnded = false; // 用于标记游戏是否结束

var redWins = 0; // 红方胜利次数
var blueWins = 0; // 蓝方胜利次数
var draws = 0; // 平局次数

// 倒计时函数
function startCountdown() {
    clearInterval(countdownInterval); // 清除任何现有的倒计时间隔
    countdown = 5; // 重置倒计时时间
    document.querySelector('.text').textContent = countdown;
    countdownInterval = setInterval(function () {
        countdown--;
        document.querySelector('.text').textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            endGame('倒计时结束'); // 触发时间到事件
        }
    }, 1000);
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // 返回获胜者 ('red' 或 'blue')
        }
    }
    return null;
}

function isBoardFull() {
    return board.every(cell => cell !== null);
}

function showResultMessage(message) {
    alert(message);
}

function clearBoard() {
    // 清空棋盘状态和界面
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = ''; // 清空单元格的内容
        board[i] = null; // 重置棋盘状态
    }
}

function endGame(winner) {
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
    gameEnded = true;

    setTimeout(function () {
        if (winner === 'red') {
            // showResultMessage('红方胜利!');
            popup_computer.style.display = 'block';
            setTimeout(hidePopup_computer, 500);
            redWins++; // 增加红方胜利次数
        } else if (winner === 'blue') {
            // showResultMessage('蓝方胜利!');
            popup_player.style.display = 'block';
            setTimeout(hidePopup_player, 500);
            blueWins++; // 增加蓝方胜利次数
        } else if (winner === 'draw') {
            // showResultMessage('平局!');
            popup_peace.style.display = 'block';
            setTimeout(hidePopup_peace, 500);
            draws++; // 增加平局次数
        } else {
            showResultMessage(winner); // 处理倒计时结束或其他情况
        }

        updateScoreboard(); // 更新界面上的得分显示

        clearBoard(); // 清空棋盘
        gameEnded = false; // 重置游戏结束状态
        isRedTurn = true; // 重置轮到的玩家为红色
        startCountdown(); // 重新开始倒计时
    }, 500); // 设置延迟时间为0.5秒（500毫秒）
}

function updateScoreboard() {
    // 更新红方胜利次数
    document.querySelector('.win_count_red').textContent = redWins;

    // 更新蓝方胜利次数
    document.querySelector('.win_count_blue').textContent = blueWins;

    // 更新平局次数
    document.querySelector('.win_count_peace').textContent = draws;
}

function cellClickHandler(event) {
    if (gameEnded) {
        return; // 如果游戏已经结束，则不做处理
    }

    var index = Array.prototype.indexOf.call(cells, event.target);
    if (board[index] !== null) {
        return; // 如果单元格已经有棋子，则不做处理
    }

    // 添加新棋子
    var chessPiece = document.createElement('div');
    chessPiece.className = isRedTurn ? 'chessAI' : 'chess_piece';
    event.target.appendChild(chessPiece);

    // 更新棋盘状态
    board[index] = isRedTurn ? 'red' : 'blue';

    // 检查是否有赢家
    var winner = checkWinner();
    if (winner) {
        endGame(winner);
        return;
    }

    // 检查是否平局
    if (isBoardFull()) {
        endGame('draw');
        return;
    }

    // 切换到下一次点击应添加的棋子颜色
    isRedTurn = !isRedTurn;

    // 开始或重置倒计时
    startCountdown();
}

// 为每个单元格添加点击事件监听器
for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', cellClickHandler);
}

// 初始开始倒计时
startCountdown();


//音乐
let volumeIcon = document.getElementById('volumeIcon');
let musicPlaying = true; // 初始音乐播放状态为开启
// 创建一个音频对象并加载音乐文件
let audio = new Audio('img/青石巷.mp3');
audio.loop = true; // 设置音乐循环播放
audio.play(); // 开始播放音乐
// 点击音量图标切换状态
volumeIcon.addEventListener('click', function () {
    musicPlaying = !musicPlaying; // 切换音乐播放状态

    // 移除所有可能的类
    volumeIcon.classList.remove('muted');

    if (!musicPlaying) {
        // 添加静音类
        volumeIcon.classList.add('muted');
        stopMusic(); // 调用停止音乐的函数
    } else {
        playMusic(); // 调用播放音乐的函数
    }
});

// 停止音乐的函数
function stopMusic() {
    audio.pause(); // 暂停音乐
}

// 播放音乐的函数
function playMusic() {
    audio.play(); // 恢复音乐播放
}