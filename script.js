//Gameboard object with an array that represents the columns and rows of the board

const gameBoard = (function () {
    const game = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    //Player should be an object with a property of 'symbol' where 1 = X and -1 = 0
    //Location should be an object, {x coord, y coord}
    const haveTurn = (player, location) => {
        const cell = game[location.x][location.y]
        //Check that the location is free to be played, if so, then change cell to player's symbol
        if(cell != 0) {
            cell = player.symbol;
        } else {
            //Add functionality to throw error or something
        }
    }

    return {
        game,
        haveTurn
    }
})();
