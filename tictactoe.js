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
    let container = document.querySelector(".container");

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

    return { render };
})();

const Game = (function () {

    function createPlayer(name, marker) {
        this.name = name;
        this.marker = marker;
        return { name, marker };
    };

    const playerOne = createPlayer("Player One", "X");
    const playerTwo = createPlayer("Player Two", "O");
    let playerTurn = playerOne;

    // Cache DOM
    let newGameButton = document.querySelector(".new-game");
    newGameButton.addEventListener("click", newGame);

    function getPlayerTurn() {
        return playerTurn.marker;
    }

    function playerMove(index) {
        if (playerTurn) {
            if (Board.updateBoard(index)) {
                Display.render();
                if (Board.checkBoard()) {
                    console.log(playerTurn.name + " wins!")
                    playerTurn = null;
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
        console.log("New game");
        playerTurn = playerOne;
        Board.resetBoard();
        Display.render();
    }

    return { getPlayerTurn, playerMove, newGame }
})();

Game.newGame();