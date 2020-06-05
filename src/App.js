import React from 'react';
import './App.css';

import Grid from './components/grid/grid';
import TictactoeGame, { GAME_STATE, HUMAN_PLAYER_ID, AI_PLAYER_ID} from './tictactoe/tictactoeGame';

import _ from 'lodash';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

library.add(faTimes, faCircle);

class App extends React.Component {
    constructor(props) {
        super(props);

        this.game = new TictactoeGame(HUMAN_PLAYER_ID);
        this.state = {        
            gameBoard: _.cloneDeep(this.game.board), 
            gameState: _.cloneDeep(this.game.gameState),

            whoMoveFirst: _.cloneDeep(this.game.whoMoveFirst), 
            whoseTurn: _.cloneDeep(this.game.whoseTurn)
        };

        this.clickedGrid = this.clickedGrid.bind(this);
        this.clickedPlayAgain = this.clickedPlayAgain.bind(this);
        this.clickedWhoMoveFirst = this.clickedWhoMoveFirst.bind(this);
    }

    clickedGrid(gridId) {
        // the functions are designed to handle
        // 1. no more unoccupied square
        // 2. invalid move
        // 3. game already won
        // properly
        this.game.humanMove(gridId);
        // ai will attempt to move after player moved, 
        // it will fail gracefully if that is not possible
        this.game.aiMove(); 
        
        this.setState({
            gameBoard: _.cloneDeep(this.game.board), 
            gameState: _.cloneDeep(this.game.gameState),
            whoseTurn: _.cloneDeep(this.game.whoseTurn)
        });
    }

    clickedPlayAgain() {
        this.game = new TictactoeGame(this.state.whoMoveFirst);

        this.setState({
            gameBoard: _.cloneDeep(this.game.board), 
            gameState: _.cloneDeep(this.game.gameState),
            whoseTurn: _.cloneDeep(this.game.whoseTurn)
        });
    }
    
    clickedWhoMoveFirst() {
        let newWhoMoveFirst = 
            this.state.whoMoveFirst === HUMAN_PLAYER_ID ? AI_PLAYER_ID:HUMAN_PLAYER_ID;
        this.game = new TictactoeGame(newWhoMoveFirst);

        this.setState({            
            gameBoard: _.cloneDeep(this.game.board), 
            gameState: _.cloneDeep(this.game.gameState),

            whoMoveFirst: _.cloneDeep(this.game.whoMoveFirst), 
            whoseTurn: _.cloneDeep(this.game.whoseTurn)
        });
    }

    render() { 
        const whoMoveFirstClassName = this.state.whoMoveFirst === HUMAN_PLAYER_ID ? "selected":"";
        return (
            <div>
                <div className="top-bar">
                    <button onClick={this.clickedPlayAgain}>Play Again</button>
                    <span className="game-status">
                        {this.state.gameState === GAME_STATE.ON_GOING && "Your Turn"}
                        {this.state.gameState === GAME_STATE.DRAW && "Draw"}
                        {this.state.gameState === GAME_STATE.AI_WON && "CPU WON"}
                        {this.state.gameState === GAME_STATE.HUMAN_WON && "You WON"}
                    </span>
                    <button className={whoMoveFirstClassName} onClick={this.clickedWhoMoveFirst}>
                        {this.state.whoMoveFirst === HUMAN_PLAYER_ID && "Go First"}
                        {this.state.whoMoveFirst === AI_PLAYER_ID && "Go Last"}
                    </button>
                </div>

                <div className="board">
                    <Grid gridId={0} status={this.state.gameBoard[0]} clickedGridHandler={this.clickedGrid}/>
                    <Grid gridId={1} status={this.state.gameBoard[1]} clickedGridHandler={this.clickedGrid}/>
                    <Grid gridId={2} status={this.state.gameBoard[2]} clickedGridHandler={this.clickedGrid}/>
                    <Grid gridId={3} status={this.state.gameBoard[3]} clickedGridHandler={this.clickedGrid}/>
                    <Grid gridId={4} status={this.state.gameBoard[4]} clickedGridHandler={this.clickedGrid}/>
                    <Grid gridId={5} status={this.state.gameBoard[5]} clickedGridHandler={this.clickedGrid}/>
                    <Grid gridId={6} status={this.state.gameBoard[6]} clickedGridHandler={this.clickedGrid}/>
                    <Grid gridId={7} status={this.state.gameBoard[7]} clickedGridHandler={this.clickedGrid}/>
                    <Grid gridId={8} status={this.state.gameBoard[8]} clickedGridHandler={this.clickedGrid}/>
                </div>                
            </div>
        );
    }
}

export default App;
