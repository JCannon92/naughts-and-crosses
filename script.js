//Gameboard object with an array that represents the columns and rows of the board
const Game = (function () {
    const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    //Is set by the checkBoard function if a winner is found
    let winner = null;

    //Player should be an object with a property of 'modifier' where 1 = X and -1 = 0
    //Coords should be an object, {x coord, y coord}
    const haveTurn = (Player, Coords) => {
        //Check that the location is free to be played, if so, then change cell to player's modifier
        if(board[Coords.x][Coords.y] === 0) {
            board[Coords.x][Coords.y] = Player.modifier;
        } else {
            //Add functionality to throw error or something
            return 'That space is already filled, try somewhere else.'
        }

        //Always check board after a turn
        checkBoard();

        //If a winner is found, end the game
        if(winner != null) {
            endGame();
        }

        //If there is no winner and board is full (i.e. there are no 0s), it's a draw
        let checkDraw;
        board.forEach((row) => {
            if(row.includes(0)) {
                checkDraw = false;
            }
        });

        if(checkDraw) {
            endGame();
        }
    };

    const checkBoard = () => {
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

    function endGame() {
        //Some functionality that ends the game
        if(winner) {
            console.log(winner + ' wins the game!');
        } else {
            console.log("It's a draw!");
        }
    }

    return {
        board,
        haveTurn,
        checkBoard,
    }
})();

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

const John = createPlayer('John', 'X');
const Jack = createPlayer('Jack', 'O');

Game.haveTurn(John, createCoords(0,0));
Game.haveTurn(John, createCoords(0,1));
Game.haveTurn(John, createCoords(0,2));

