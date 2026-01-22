//Factory function that creates a Game that handles all game logic (turns, checking for winner etc.)
const Game = function (playerOne, playerTwo) {
    const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    //Is set by the checkBoard function if a winner is found
    let winner = null;

    let playersTurn = playerOne;

    const printBoard = () => {
        console.table(board);
    }

    const getBoard = () => {
        return board
    }

    //Player should be an object with a property of 'modifier' where 1 = X and -1 = 0
    //Coords should be an object, {x coord, y coord}
    function haveTurn(Player, Coords) {
        //Check if its the player's turn
        if(playersTurn === Player) {
            //Check that the location is free to be played, if so, then change cell to player's modifier
            if(board[Coords.x][Coords.y] === 0) {
                board[Coords.x][Coords.y] = Player.modifier;
            } else {
                //Add functionality to throw error or something
                return 'That space is already filled, try somewhere else.'
            }

            //Render board after a turn
            Renderer.renderDisplay();

            //Always check board after a turn
            checkBoard();

            //Check to see if winner has changed
            checkWinner();

            //Change player's turn over
            if(Player = playerOne) {
                playersTurn = playerTwo;
            } else {
                playersTurn = playerOne;
            }

        } else {
            return "It's not your turn yet!"
        }
    };

    function checkBoard() {
        //Takes a row, column or diagonal and checks if the game has been won by reducing the array and
        //setting the winner if needed
        function checkArray(array) {
            arraySum = array.reduce((sum, current) => sum + current);
            if(arraySum === 3) {
                winner = 'X';
            } else if(arraySum === -3) {
                winner = 'O';
            }
        }
        //Rows are already an array so just check them
        board.forEach(checkArray);
        
        //Columns can be checked by looping through each row and only checking the relevant column value
        for(let i = 0; i < 2; i++) {
            checkArray([
                board[0][i], 
                board[1][i], 
                board[2][i],
            ]);
        }

        //Diagonals must be checked separately as there are two variations, top left to bottom right and the mirror
        checkArray([
            board[0][0],
            board[1][1],
            board[2][2],
        ]);
        checkArray([
            board[0][2],
            board[1][1],
            board[2][0],
        ]);
    }

    function checkWinner() {
        //If a winner is found, end the game
        if(winner != null) {
            endGame();
        }

        //If there is no winner and board is full (i.e. there are no 0s), it's a draw
        let checkDraw = true;
        board.forEach((row) => {
            if(row.includes(0)) {
                checkDraw = false;
            }
        });

        if(checkDraw) {
            endGame();
        }
    }

    function endGame() {
        //Some functionality that ends the game
        if(winner) {
            console.log(winner + ' wins the game!');
        } else {
            console.log("It's a draw!");
        }
    }

    return {
        printBoard,
        getBoard,
        haveTurn,
    }
}

//Factory function creates Player object that stores properties of each player
function createPlayer(name, symbol) {
    let modifier;
    if(symbol === 'X') {
        modifier = 1;
    } else if(symbol === 'O') {
        modifier = -1;
    } else {
        return 'Not a valid symbol, please provide "X" or "O".'
    }

    return {
        name,
        symbol,
        modifier,
    }
}

//Factory Function that creates basic Coords object
function createCoords(x, y) {
    return {
        x,
        y,
    }
}

//Renderer factory that will create an object to convert the JS board to the DOM board
const Renderer = function(Game) {
    //Get the game board
    const board = Game.getBoard();

    //Convert the array numbers to their symbols
    function convertToSymbol(num) {
        if(num === 1) {
            return 'X'
        } else if(num === -1) {
            return 'O'
        } else {
            return ''
        }
    }

    function renderDisplay() {
        //Get the display-board divs and convert the collection to an array
        const display = document.querySelectorAll('.board-cell');

        //Loop through the collection and replace the text content of each div with its equivalent symbol from the board 
        for(let i = 0; i <=8; i++) {
            display[i].children[0].textContent = convertToSymbol(board[Math.floor(i / 3)][i % 3]);
        }
    }

    return {
        renderDisplay,
    }
};
