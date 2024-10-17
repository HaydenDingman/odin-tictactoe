const Board = (function() {
    const gameboard = [
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

    function checkBoard() {
        checkRows();
        checkCols();
        checkDiags();
    };

    function getBoard() {
        return testBoard;
    }

    function checkRows() {
        for (let row = 0; row < gameboard.length; row++) {
            if (!(gameboard[row].includes(null))) {
                if (gameboard[row][0] === gameboard[row][1] && gameboard[row][0] === gameboard[row][2])
                    console.log("You win!");
            }
        }
    }

    function checkCols() {
        for (let column = 0; column < gameboard.length; column++) {
            let columnSubArray = gameboard.map((row) => row[column]); // Maps array into each column and then checks for sameness
            if (!columnSubArray.includes(null)) {
                if (columnSubArray[0] === columnSubArray[1] && columnSubArray[1] === columnSubArray[2]) {
                    console.log("You win!");
                }
            }
        }
    }

    function checkDiags() {
        // Check Top-Left to Bottom-Right
        if (gameboard[0][0] !== null) {
            if (gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) {
                console.log("You win!");
            }
        }
        // Check Bottom-Left to Top-Right
        if (gameboard[2][0] != null) {
            if (gameboard[2][0] === gameboard[1][1] && gameboard[1][1] === gameboard[0][2]) {
                console.log("You win!");
            }
        }
    }

    return {checkBoard, getBoard};
})();

const Display = (function() {

    // Cache DOM
    let container = document.querySelector(".container");
    
    function render() {
        let gridIndex = 1;
        for (const row of Board.getBoard()) {
            for (const square of row) {
                const newSquare = document.createElement("div");
                newSquare.dataset.index = gridIndex;
                newSquare.textContent = square;
                container.appendChild(newSquare);
                gridIndex++;
            }
        }
    }

    return {render};
})();

const Game = (function() {

})();

const Player = {};

Board.checkBoard();
Display.render();