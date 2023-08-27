const zoneElements = document.querySelectorAll(".zone");
const firstForm = document.querySelector("form")
const secondForm = document.querySelector("#retry")
let answer = ""
let aiPlayer = ""
let board = ["", "", "", "", "", "", "", "", ""]

firstForm.addEventListener("submit", (e) => {
    e.preventDefault()
    answer = document.getElementById('answer').value
    aiPlayer = answer.toLowerCase() === "x" ? "0" : "x"
    firstForm.style.display = 'none'
    document.querySelector("#answer").textContent = ""
})

secondForm.addEventListener("submit", (e) => {
    e.preventDefault()
    secondForm.style.display = "none"
    zoneElements.forEach((zoneElement) => {
        zoneElement.textContent = "";
    });
    board = ["", "", "", "", "", "", "", "", ""]
    answer = ""
    setTimeout(() => {firstForm.style.display = "block"})
})

zoneElements.forEach((zoneElement) => {
    let isClicked = false;

    zoneElement.addEventListener("mouseover", (event) => {
        if (!isClicked && event.target.textContent === "") {
            event.target.style.color = "#C5C6D0";
            event.target.textContent = answer;
        }
    });

    zoneElement.addEventListener("mouseout", (event) => {
        if (!isClicked && event.target.textContent !== aiPlayer) {
            event.target.textContent = "";
        }
    });

    zoneElement.addEventListener("click", (event) => {
        isClicked = true;
        event.target.style.color = "#000";
        event.target.textContent = answer;
        board[Array.from(zoneElements).indexOf(event.target)] = answer
        setTimeout(() => {getBestMove(board)})

        if (checkWinner(board, answer)) {
            secondForm.style.display = "block"
            document.querySelector("#result").textContent = "You Win!"
        } else if (!board.includes("")) {
            secondForm.style.display = "block"
            document.querySelector("#result").textContent = "It's a draw!"
        }
    });
});

function checkWinner(board, player) {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winCombos) {
        if (board[combo[0]] === player && board[combo[1]] === player && board[combo[2]] === player) {
            return true;
        }
    }

    return false;
}

function getBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = aiPlayer;
            const score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        board[bestMove] = aiPlayer
        zoneElements[bestMove].style.color = "#000";
        zoneElements[bestMove].textContent = aiPlayer;

        if (checkWinner(board, aiPlayer)) {
            secondForm.style.display = "block"
            document.querySelector("#result").textContent = "AI Win!"
        } else if (!board.includes("")) {
            secondForm.style.display = "block"
            document.querySelector("#result").textContent = "It's a draw!"
        }
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner(board, aiPlayer)) {
        return 10 - depth;
    }

    if (checkWinner(board, answer)) {
        return depth - 10;
    }

    if (!board.includes("")) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = aiPlayer;
                const score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = answer;
                const score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}