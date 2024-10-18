const Board = (function () {
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const testBoard = [
        ["X", "O", "X"],
        ["X", "X", "O"],
        ["O", "X", "O"]
    ];

    const numBoard = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];

    function getBoard() {
        return gameboard;
    }

    function updateBoard(clickIndex) {
        let row = Number(clickIndex.at(0));
        let column = Number(clickIndex.at(1));
        if (gameboard[row][column] === null) {
            gameboard[row][column] = Game.getPlayerTurn();
            return true;
        } else {
            return false;
        }
    }

    function resetBoard() {
        gameboard = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    function checkBoard() {
        return (checkRows() || checkCols() || checkDiags())
    };

    function checkRows() {
        for (let row = 0; row < gameboard.length; row++) {
            if (!(gameboard[row].includes(null))) {
                if (gameboard[row][0] === gameboard[row][1] && gameboard[row][0] === gameboard[row][2])
                    return true;
            }
        }
    }

    function checkCols() {
        for (let column = 0; column < gameboard.length; column++) {
            let columnSubArray = gameboard.map((row) => row[column]); // Maps array into each column and then checks for sameness
            if (!columnSubArray.includes(null)) {
                if (columnSubArray[0] === columnSubArray[1] && columnSubArray[1] === columnSubArray[2]) {
                    return true;
                }
            }
        }
    }

    function checkDiags() {
        // Check Top-Left to Bottom-Right
        if (gameboard[0][0] !== null) {
            if (gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) {
                return true;
            }
        }
        // Check Bottom-Left to Top-Right
        if (gameboard[2][0] != null) {
            if (gameboard[2][0] === gameboard[1][1] && gameboard[1][1] === gameboard[0][2]) {
                return true;
            }
        }
    }

    return { checkBoard, getBoard, updateBoard, resetBoard };
})();

const Display = (function () {

    // Cache DOM
    const container = document.querySelector(".gameboard");
    const playerOneName = document.querySelector("#player-one-name");
    const playerTwoName = document.querySelector("#player-two-name");
    const editButtons = document.querySelectorAll(".edit-button");
    const playerOneApply = document.querySelector(".player-one-apply");
    const playerTwoApply = document.querySelector(".player-two-apply");
    const resultsContainer = document.querySelector(".results");


    // Event Listeners
    for (const button of editButtons) {
        button.addEventListener("click", editName);
    }
    playerOneApply.addEventListener("click", confirmName);
    playerTwoApply.addEventListener("click", confirmName);

    function render() {
        container.replaceChildren();
        const board = Board.getBoard();

        for (let row = 0; row < board.length; row++) {
            for (let square = 0; square < 3; square++) {
                const newSquare = document.createElement("div");
                newSquare.dataset.index = `${row}${square}`;
                newSquare.classList.add("square");
                newSquare.addEventListener("click", () => Game.playerMove(newSquare.dataset.index));
                newSquare.textContent = board[row][square];
                container.appendChild(newSquare);
            }
        }
    }

    function highlightActivePlayer(player) {
        if (player === "O") {
            if (playerOneName.disabled === true) {
                playerOneName.style.borderBottom = "3px solid var(--grid-lines)";
            }
            playerTwoName.style.borderBottom = "none";
        } else if (player === "X") {
            if (playerTwoName.disabled === true) {
                playerTwoName.style.borderBottom = "3px solid var(--grid-lines)";
            }
            playerOneName.style.borderBottom = "none";
        }
    }

    function editName(e) {
        if (this.classList.contains("player-one-edit")) {
            playerOneName.disabled = false;
            playerOneName.focus();
            this.style.visibility = "hidden";
            playerOneApply.style.visibility = "visible";
        } else {
            playerTwoName.disabled = false;
            playerTwoName.focus();
            this.style.visibility = "hidden";
            playerTwoApply.style.visibility = "visible";
        }
    }

    function confirmName(e) {
        if (this.classList.contains("player-one-edit")) {
            console.log(playerOneName.value);
            if (playerOneName.value != "") {
                Game.playerOne.setName(playerOneName.value);
            }
            playerOneName.disabled = true;
            playerOneApply.style.visibility = "hidden";
            for (const button of editButtons) {
                if (button.classList.contains("player-one-edit")) {
                    button.style.visibility = "visible";
                }
            }
        }
        else if (this.classList.contains("player-two-edit")) {
            console.log(playerTwoName.value);
            if (playerTwoName.value != "") {
                Game.playerTwo.setName(playerTwoName.value);
            }
            playerTwoName.disabled = true;
            playerTwoApply.style.visibility = "hidden";
            for (const button of editButtons) {
                if (button.classList.contains("player-two-edit")) {
                    button.style.visibility = "visible";
                }
            }
        }
    }

    function showResults(winner) {
        if (winner === "X") {
            resultsContainer.textContent = `${Game.playerOne.getName()} wins! Play again?`
        } else if (winner === "O") {
            resultsContainer.textContent = `${Game.playerTwo.getName()} wins! Double or nothing?`
        } else if (winner === "tie") {
            resultsContainer.textContent = `You fought to a draw. War is a pointless endeavor.`
        }
    }

    function clearResults() {
        resultsContainer.textContent = "";
    }

    return { render, showResults, clearResults, highlightActivePlayer };
})();

const Game = (function () {

    function createPlayer(name, marker) {
        let playerName = name;
        const playerMarker = marker;

        function setName(newName) {
            playerName = newName;
        }

        function getName() {
            return playerName;
        }

        function getMarker() {
            return playerMarker;
        }

        return { setName, getName, getMarker, playerName };
    };

    const playerOne = createPlayer("Player One", "X");
    const playerTwo = createPlayer("Player Two", "O");
    let playerTurn = playerOne;
    let turnCount = 0;
    let lastWinner = null;

    // Cache DOM
    let newGameButton = document.querySelector(".new-game");
    newGameButton.addEventListener("click", newGame);

    function getPlayerTurn() {
        return playerTurn.getMarker();
    }

    function playerMove(index) {
        if (playerTurn) {
            if (Board.updateBoard(index)) {
                turnCount++;
                Display.render();
                Display.highlightActivePlayer(getPlayerTurn());
                if (Board.checkBoard()) {
                    Display.showResults(getPlayerTurn());
                    lastWinner = playerTurn;
                    playerTurn = null;
                } else if (turnCount === 9) {
                    console.log("You tied.");
                } else {
                    endTurn();
                }
            }
        }
    }

    function endTurn() {
        Board.checkBoard();
        if (playerTurn === playerOne) {
            playerTurn = playerTwo;
        } else {
            playerTurn = playerOne;
        }
    }

    function newGame() {
        turnCount = 0;
        playerTurn = playerOne;

        Board.resetBoard();
        Display.clearResults();
        Display.highlightActivePlayer("O");
        Display.render();
    }

    return { getPlayerTurn, playerMove, newGame, playerOne, playerTwo, lastWinner, playerTurn }
})();

Game.newGame();