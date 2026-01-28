//IIFE to generate the JS Board
const Board = (function() {
    let board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    const getBoard = () => {
        return board
    }

    const printBoard = () => {
        console.table(board);
    }

    const resetBoard = () => {
        board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
    }

    function getCellFromIndex(index) {
        //Get a board cell from an index
        return board[Math.floor(index / 3)][index % 3]
    }

    function getCellfromXY(x, y) {
        //Get a board cell from an X and Y coordinate
        return board[x][y]
    }

    function changeCellFromIndex(index, value) {
        //Change a cell value from an index
        board[Math.floor(index / 3)][index % 3] = value;
    }

    function drawSymbol(event) {
        event.target.textContent = gameController.myGame.getTurn().symbol;
    }

    function removeSymbol(event) {
        event.target.textContent = '';
    }

    function selectCell(element, index) {
        gameController.myGame.haveTurn(index);
    }

    function initialise() {
        const boardCells = document.querySelectorAll('.board-cell');
        boardCells.forEach((element, index) => {
            //Add a mouse enter and mouse leave event listener to indicate to show the user where they are going to place
            //Only works on blank cells
            //Show the symbol as the mouse enters
            element.addEventListener('mouseenter', drawSymbol);
            //Remove the symbol as it leaves
            element.addEventListener('mouseleave', removeSymbol);
            //Add a click event listener that changes the board cell's value
            element.addEventListener('click', () => selectCell(element, index));
            //Remove game-end class if it exists
            element.classList.remove('game-end');

        
        });
    }

    //First time initialise
    initialise();

    return {
        getBoard,
        printBoard,
        resetBoard,
        getCellFromIndex,
        getCellfromXY,
        changeCellFromIndex,
        drawSymbol,
        removeSymbol,
        selectCell,
        initialise,
    }

})();

//IIFE that will create a renderer to convert the JS board to the DOM board
const Renderer = (function() {
    const messageDisplay = document.querySelector('h2#message-display')
    let display = document.querySelectorAll('.board-cell');

    function setDisplay() {
        display = document.querySelectorAll('.board-cell')
    }

    function getDisplay() {
        return display;
    }

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

    function renderBoard() {
        //Loop through the collection and replace the text content of each div with its equivalent symbol from the board 
        for(let i = 0; i <=8; i++) {
            // console.log(convertToSymbol(Board.getCellFromIndex(i)));
            display[i].textContent = convertToSymbol(Board.getCellFromIndex(i));
            //Remove mouse hover drawing effects - effectively fixes the symbol - for cells where the value is not 0
            if(Board.getCellFromIndex(i) !== 0) {
                display[i].removeEventListener('mouseenter', Board.drawSymbol);
                display[i].removeEventListener('mouseleave', Board.removeSymbol);
            }
        }
    }

    function renderTurnIndicator(player) {
        //Replace the turn indicator with the player to go next
        //Replace human with 'Your' in single player matches
         if(!(player.name === 'Human' || player.name === 'Computer')) {
            messageDisplay.textContent = player.name + "'s turn!";
        }
    }

    function renderMessage(message) {
        messageDisplay.textContent = message;
    }

    function renderReplayButton() {
        const body = document.querySelector('body');
        const buttonBackground = document.querySelector('#replay-container');
        const replayButton = document.createElement('button');
            replayButton.id = 'replay';
            replayButton.textContent = 'Replay';
            replayButton.addEventListener('click', () => {
                //Reset the board's values and render it
                Board.resetBoard();
                renderBoard();
                Board.initialise();
                //Remove the replay button and render the splash screen
                replayButton.remove();
                renderSplashScreen();
            })

        buttonBackground.appendChild(replayButton);
        body.appendChild(buttonBackground);
    }

    function renderSplashScreen() {
        const body = document.querySelector('body');
        const boardContainer = document.querySelector('.board-container');

        const splashScreen = document.createElement('div');
            splashScreen.classList.add('splash-screen');

            const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('button-container');
                
                const singlePlayerButton = document.createElement('button');
                    singlePlayerButton.id = 'single-player';
                    singlePlayerButton.textContent = 'Single Player';
                const multiPlayerButton = document.createElement('button');
                    multiPlayerButton.id = 'multi-player';
                    multiPlayerButton.textContent = 'Multiplayer';

        splashScreen.appendChild(buttonContainer);
        buttonContainer.appendChild(singlePlayerButton);
        buttonContainer.appendChild(multiPlayerButton);
        body.insertBefore(splashScreen, boardContainer);

        //Single player mode will set the second player as a computer that will make random legal actions
        //Multiplayer mode will allow two human players, alternating control between the players
        function startMultiplayer() {
            //Replace the buttons with a form for entering player names
            const buttonContainer = document.querySelector('.splash-screen .button-container');
            buttonContainer.style.display = 'none';        

            const optionsForm = document.createElement('form');

            const playerOneLabel = document.createElement('label');
                playerOneLabel.setAttribute('for', 'player-one-name');
                playerOneLabel.textContent = 'Player One Name:';
            const playerOneInput = document.createElement('input');
                playerOneInput.setAttribute('name', 'player-one-name');
                playerOneInput.id = 'player-one-name';

            const playerTwoLabel = document.createElement('label');
                playerTwoLabel.setAttribute('for', 'player-two-name');
                playerTwoLabel.textContent = 'Player Two Name:';
            const playerTwoInput = document.createElement('input');
                playerTwoInput.setAttribute('name', 'player-two-name');
                playerTwoInput.id = 'player-two-name';

            const startGameButton = document.createElement('button');
                startGameButton.id = 'start-game';
                startGameButton.textContent = 'Start Game!';
                startGameButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    //Validation to check that the inputs are not empty
                    const inputs = document.querySelectorAll('input');
                    let invalidFlag = false;
                    for (let input of inputs) {
                        if(input.value === '') {
                            input.classList.add('invalid');
                            invalidFlag = true;
                        } else {
                            input.classList.remove('invalid');
                        }
                    }
                    //If the inputs are valid, start the game
                    if(!invalidFlag) {
                        splashScreen.remove();
                        //Return a gameController object that is used to control the flow of the game
                        gameController = createGameController(playerOneInput.value, playerTwoInput.value);
                    }
                });

            const goBackButton = document.createElement('button');
                goBackButton.id = 'go-back';
                goBackButton.textContent = 'Go Back';
                goBackButton.addEventListener('click', () => {
                    optionsForm.remove();
                    buttonContainer.style.display = 'flex';
                });

            optionsForm.appendChild(playerOneLabel);
            optionsForm.appendChild(playerOneInput);
            optionsForm.appendChild(playerTwoLabel);
            optionsForm.appendChild(playerTwoInput);
            optionsForm.appendChild(startGameButton);
            optionsForm.appendChild(goBackButton);

            splashScreen.appendChild(optionsForm);

            playerOneInput.focus();

        }

        //Add events to the single and multiplayer buttons
        singlePlayerButton.addEventListener('click', () => {
            splashScreen.remove();
            gameController = createGameController('Human', 'Computer');
        });
        multiPlayerButton.addEventListener('click', startMultiplayer);
    }

    //Initial splash screen render
    renderSplashScreen();

    return {
        setDisplay,
        getDisplay,
        renderBoard,
        renderTurnIndicator,
        renderMessage,
        renderReplayButton,
        renderSplashScreen,
    }
})();


//Factory function that creates a Game that handles all game logic (turns, checking for winner etc.)
const createGame = function (playerOne, playerTwo) {

    //Is set by the checkBoard function if a winner is found
    let winner = null;

    let playersTurn = playerOne;

    function getTurn() {
        return playersTurn;
    }

    //Player should be an object with a property of 'modifier' where 1 = X and -1 = 0
    //Coords should be an object, {x coord, y coord}
    function haveTurn(cellIndex) {
        //Check that the location is free to be played, if so, then change cell to player's modifier
        if(Board.getCellFromIndex(cellIndex) === 0) {
            Board.changeCellFromIndex(cellIndex, playersTurn.modifier);

            //Render board after a turn
            Renderer.renderBoard();


            //Always check board after a turn
            checkBoard();

            //Change player's turn over
            if(playersTurn === playerOne) {
                playersTurn = playerTwo;
            } else if(playersTurn === playerTwo) {
                playersTurn = playerOne;
            }

            //Render turn indicator
            Renderer.renderTurnIndicator(playersTurn);

            //Check to see if winner has changed
            if(checkWinner() === false) {
                //If it's the computer's turn, take a computer turn
                if(playersTurn.name === 'Computer') {
                    haveComputerTurn();
                }
            }

        } else {
            //Add functionality to throw error or something
            Renderer.renderMessage('That space is already taken, try somewhere else!')
        }
    };

    function haveComputerTurn() {
        while (true) {
            //Select a random cell
            let randomCell = Math.floor(Math.random() * 8);
            let cellValue = Board.getCellFromIndex(randomCell);
            //If it isn't 0, select another until it isn't 0
            if(cellValue === 0) {
                //Otherwise haveTurn on this cell
                haveTurn(randomCell);
                break
            }
        }
    }

    function checkBoard() {
        //Takes a row, column or diagonal and checks if the game has been won by reducing the array and
        //setting the winner if needed
        function checkArray(array) {
            arraySum = array.reduce((sum, current) => sum + current);
            if(arraySum === 3) {
                winner = playerOne;
            } else if(arraySum === -3) {
                winner = playerTwo;
            }
        }
        //Rows are already an array so just check them
        Board.getBoard().forEach(checkArray);
        
        //Columns can be checked by looping through each row and only checking the relevant column value
        for(let i = 0; i < 2; i++) {
            checkArray([
                Board.getBoard()[0][i], 
                Board.getBoard()[1][i], 
                Board.getBoard()[2][i],
            ]);
        }

        //Diagonals must be checked separately as there are two variations, top left to bottom right and the mirror
        checkArray([
            Board.getBoard()[0][0],
            Board.getBoard()[1][1],
            Board.getBoard()[2][2],
        ]);
        checkArray([
            Board.getBoard()[0][2],
            Board.getBoard()[1][1],
            Board.getBoard()[2][0],
        ]);
    }

    function checkWinner() {
        //If a winner is found, end the game
        if(winner != null) {
            endGame()
            return true
        } else {
            //If there is no winner and board is full (i.e. there are no 0s), it's a draw
            let checkDraw = true;
            Board.getBoard().forEach((row) => {
                if(row.includes(0)) {
                    checkDraw = false;
                }
            });
            if(checkDraw) {
                endGame();
                return true
            }
        }

        return false
    }

    function endGame() {
        //Inform user of the result
        if(winner) {
            if (winner.name === 'Human') {
                Renderer.renderMessage('You win!');
            } else if (winner.name === 'Computer') {
                Renderer.renderMessage('You lost... better luck next time!')
            } else {
            Renderer.renderMessage(winner.name + ' wins the game!');
            }
        } else {
            Renderer.renderMessage("It's a draw!");
        }
        //Remove event listeners to prevent further interaction by replacing each div with a clone of itself
        for(let cell of Renderer.getDisplay()) {
            cell.classList.add('game-end');
            cell.replaceWith(cell.cloneNode(true));
            //Reset the display and message
            Renderer.setDisplay();
        }

        //Render restart game button
        Renderer.renderReplayButton();
    }

    return {
        haveTurn,
        getTurn,
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

//Game controller is used to control the flow of the game when the user interacts with the DOM
function createGameController(playerOneName, playerTwoName) {
    //Remove splash screen and start the game!
    const playerOne = createPlayer(playerOneName, 'X');
    const playerTwo = createPlayer(playerTwoName, 'O');
    const myGame = createGame(playerOne, playerTwo);
    Renderer.renderTurnIndicator(playerOne);

     return {
        playerOne,
        playerTwo,
        myGame
    }
}