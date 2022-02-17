//player factory
const Player = (name, id) => {
    return {
        name: name,
        getName() {
            return name.length? name: "Player " + id;
        }
    }
}

// set up the game controller iife
const gameController = (() => {
    let controller = true;
    let player1, player2;
    
    const getActivePlayer = () => {
        return controller ? player1: player2;
    }
    
    const getFiller = () => {
        return controller? "X": "O";
    }
    const toggleFiller = () => {
        controller = !controller;
    }

    //start button listener
    const startButtonListener = (event) => {
        console.log("Start button has been clicked");
        player1 = Player(document.getElementById("player1").value, 1).getName();
        player2 = Player(document.getElementById("player2").value, 2).getName();

        gameBoard.turnMessage.innerHTML = "It is " + gameController.getActivePlayer() + "'s turn";
        document.getElementById('sidebar-1').innerHTML = player1 + ": X";
        document.getElementById('sidebar-2').innerHTML = player2 + ": O";
        document.getElementById('overlay').style.opacity = 0;
        document.getElementById('overlay').style.zIndex = -1;
    }

    const restartButtonListener = (event) => {
        console.log("Restart button has been clicked.");
        location.reload();
    }

    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const player2Input = document.getElementById('player2');

    startButton.addEventListener('click', ev => startButtonListener(ev));
    restartButton.addEventListener('click', ev => restartButtonListener(ev));
    // listen to ENTER button on 2nd input box
    player2Input.addEventListener('keyup', ev => {
        if(ev.key === 'Enter') startButton.click();
    });

    return {getFiller, toggleFiller, getActivePlayer};
})();

// set up the gameboard iife
const gameBoard = (() => {
    console.log("Setting up the game.");
    const turnMessage = document.getElementById('turn-message');
    const matchMessage = document.getElementById('game-message');

    //track remaining cells
    let cellsRemaining = 9;
    let clickedCells = {}

    const cellMap = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const id_xy_map = {
        1: [0,0],
        2: [0,1],
        3: [0,2],
        4: [1,0],
        5: [1,1],
        6: [1,2],
        7: [2,0],
        8: [2,1],
        9: [2,2],
    }
   
    //check if game board is full
    function isGameBoardFull() {
        return cellsRemaining == 0;
    }

    function fillCell(id, symbol) {
        cellsRemaining--;
        clickedCells[id] = true;
        cellMap[id_xy_map[id][0]][id_xy_map[id][1]] = symbol;
    }

    function isCellFilled(id) {
        return clickedCells[id]? true: false;
    }

    function displayCellMap() {
        console.log(cellMap);
    }

    function checkWinner(cellId) {
        r = id_xy_map[cellId][0];
        c = id_xy_map[cellId][1];
        console.log("Clicked index: ", r, c);
        if( (cellMap[r][0] == cellMap[r][1] && cellMap[r][0] == cellMap[r][2]) ||
            (cellMap[0][c] == cellMap[1][c] && cellMap[0][c] == cellMap[2][c]) ||
            (cellMap[0][0] == cellMap[1][1] && cellMap[0][0] == cellMap[2][2]) ||
            (cellMap[0][2] == cellMap[1][1] && cellMap[0][2] == cellMap[2][0])
        ) {
            console.log("Winner You Are Sir");
            return true;
        } else return false;
    }

    const gridCellClickListener = (event) => {
        matchMessage.innerHTML = "";
        const cellId = event.target.id;
        
        if(isCellFilled(cellId)) {
            console.log("Cell is already filled.")
            matchMessage.innerHTML = "Please choose another cell";
            return;
        }
    
        //fill grid cell and mark the cell clicked
        const filler = gameController.getFiller();
        event.target.innerHTML = filler;
        fillCell(cellId, filler);
        displayCellMap();
        
        //either a tie or a winner   
        if(checkWinner(cellId)) matchMessage.innerHTML = "Congrats " + gameController.getActivePlayer() + ", You Won !!";
        if(isGameBoardFull()) matchMessage.innerHTML = "Game is tied!!";
        
        if(checkWinner(cellId) || isGameBoardFull()) {
            console.log("Somebody won or there was a tie.")
            turnMessage.innerHTML = "";
            //disable click area
            document.getElementById('play-area').style.pointerEvents = 'none';
            //show reset button
            const restartButton = document.getElementById('restart-button');
            restartButton.style.opacity = 1;
            restartButton.style.zIndex = 0;
        }
        else {
            //toggle filler and active player
            console.log("Game controller was toggled.");
            gameController.toggleFiller();
            turnMessage.innerHTML = "It is " + gameController.getActivePlayer() + "'s turn";
        }
    }
    
    //attach grid cell click listeners
    const gridCell = document.getElementsByClassName('grid-cell');
    for (let ii = 0; ii < gridCell.length; ii++) {
        gridCell[ii].addEventListener('click', gridCellClickListener);
    }

    return {isGameBoardFull, fillCell, isCellFilled, displayCellMap, checkWinner, turnMessage, matchMessage};
})();