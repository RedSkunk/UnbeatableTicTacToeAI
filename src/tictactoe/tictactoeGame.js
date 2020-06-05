export const GAME_STATE = {
    HUMAN_WON: "HUMAN_WON",
    AI_WON: "AI_WON",
    DRAW: "DRAW",
    ON_GOING: "ON_GOING"
};

export const HUMAN_PLAYER_ID = 1;
export const AI_PLAYER_ID = 2;

class TicTacToeGame {
    constructor(whoMoveFirst) {
        // 0 is unoccupied. Otherwise, 1 (HUMAN_PLAYER_ID) or 2 (AI_PLAYER_ID)
        this.board = [0,0,0, 0,0,0, 0,0,0];
        // each item represents a win condition
        // for example, [0,3,6] means diagonal from top left to bottom right
        this.winConditions = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5],
            [6, 7, 8], [0, 4, 8], [2, 4, 6]];
        // game will be ON_GOING as long as there is still available moves and neither has won
        this.gameState = GAME_STATE.ON_GOING;
        // suprisingly, we only need to track human move to know what is the best move
        this.humanTurn = 1;
        this.humanMoveHistory = [];

        // these will be either 1 (HUMAN_PLAYER_ID) or 2 (AI_PLAYER_ID)
        this.whoMoveFirst = whoMoveFirst;
        this.whoseTurn = whoMoveFirst;

        if (this.whoMoveFirst === AI_PLAYER_ID) {
            this.aiMove();
        }
    }

    // return true if move is successfully made
    playerMove(playerId, position) {
        // if position is invalid, or position is already occupied, 
        // or this is not player's turn, return false
        console.log(playerId +" " + position);
        if (this.gameState !== GAME_STATE.ON_GOING || position === -1 || 
                !(position >= 0 && position <= 8) || 
                this.board[position] !== 0 || playerId !== this.whoseTurn) {
            return false;
        }
        
        this.board[position] = playerId;
        this.whoseTurn = (this.whoseTurn === HUMAN_PLAYER_ID) ? AI_PLAYER_ID:HUMAN_PLAYER_ID;

        if (playerId === HUMAN_PLAYER_ID) {
            this.humanMoveHistory.push(position);
            this.humanTurn++;
        }

        return true;
    }

    humanMove(position) {
        let result = this.playerMove(HUMAN_PLAYER_ID, position);
        this.updateGameStateIfChanged();
        return result;
    }

    aiMove() {
        let result = this.playerMove(AI_PLAYER_ID, this.getAIMove());
        this.updateGameStateIfChanged();
        return result;
    }

    isWon() {
        for (const condition of this.winConditions) {
            if (this.board[condition[0]] === HUMAN_PLAYER_ID && this.board[condition[1]] === HUMAN_PLAYER_ID && this.board[condition[2]] === HUMAN_PLAYER_ID) {
                return HUMAN_PLAYER_ID;
            } else if (this.board[condition[0]] === AI_PLAYER_ID && this.board[condition[1]] === AI_PLAYER_ID && this.board[condition[2]] === AI_PLAYER_ID) {
                return AI_PLAYER_ID;
            }
        }
        
        return 0;
    }

    isWinningMoveExistFor(playerId) {
        for (const condition of this.winConditions) {
            if (this.board[condition[0]] === playerId && this.board[condition[1]] === playerId && this.board[condition[2]] === 0) {
                return condition[2];
            } else if (this.board[condition[0]] === playerId && this.board[condition[1]] === 0 && this.board[condition[2]] === playerId) {
                return condition[1];
            } else if (this.board[condition[0]] === 0 && this.board[condition[1]] === playerId && this.board[condition[2]] === playerId) {
                return condition[0];
            }
        }
        
        return -1;
    }

    getAvailableMoves() {
        let result = []
        let i = 0
        for (const position of this.board) {
            if (position === 0) {
                result.push(i);
            }
            i++;
        }
        return result;
    }

    updateGameStateIfChanged() {
        let isWon = this.isWon();
        if (isWon === 1) {
            this.gameState = GAME_STATE.HUMAN_WON;
        } else if (isWon === 2) {
            this.gameState = GAME_STATE.AI_WON;
        } else if (isWon === 0 && this.getAvailableMoves().length === 0) {
            this.gameState = GAME_STATE.DRAW;
        } else {
            this.gameState = GAME_STATE.ON_GOING;
        }
    }

    moveIsEdge(position) {
        if (position === 1 || position === 3 || position === 5 || position === 7) {
            return true;
        } else {
            return false;
        }
    }

    moveIsCorner(position) {
        if (position === 0 || position === 2 || position === 6 || position === 8) {
            return true;
        } else {
            return false;
        }
    }   

    getAvailableCorners() {
        let availableMoves = this.getAvailableMoves();
        return availableMoves.filter(this.moveIsCorner);
    }

    getAvailableEdges() {
        let availableMoves = this.getAvailableMoves();
        return availableMoves.filter(this.moveIsEdge);
    }

    getRandomCornersThenEdges() {
        let availableMoves = this.getAvailableCorners();
        if (availableMoves.length === 0) {
            availableMoves = this.getAvailableEdges();
        }
        return availableMoves[Math.floor(Math.random()*availableMoves.length)];
    }

    getRandomEdgesThenCorners() {
        let availableMoves = this.getAvailableEdges();
        if (availableMoves.length === 0) {
            availableMoves = this.getAvailableCorners();
        }
        return availableMoves[Math.floor(Math.random()*availableMoves.length)];
    }

    getAIMove() {
        let whoMoveFirst = this.whoMoveFirst;
        let winningMoveForAI = this.isWinningMoveExistFor(AI_PLAYER_ID);
        if (winningMoveForAI !== -1) {
            return winningMoveForAI;
        }

        let winningMoveForPlayer = this.isWinningMoveExistFor(HUMAN_PLAYER_ID);
        if (winningMoveForPlayer !== -1) {
            return winningMoveForPlayer;
        }

        if (whoMoveFirst === AI_PLAYER_ID) {
            if (this.humanTurn === 1) {
                return 4;
            }

            if (this.humanTurn === 2 && this.moveIsEdge(this.humanMoveHistory[0])) {
                if (this.humanMoveHistory[0] === 1) {
                    return 8;
                } else if (this.humanMoveHistory[0] === 3) {
                    return 2;
                } else if (this.humanMoveHistory[0] === 5) {
                    return 6;
                } else if (this.humanMoveHistory[0] === 7) {
                    return 0;
                }
            }

            if (this.humanTurn === 2 && this.moveIsCorner(this.humanMoveHistory[0])) {
                if (this.humanMoveHistory[0] === 0) {
                    return 8;
                } else if (this.humanMoveHistory[0] === 2) {
                    return 6;
                } else if (this.humanMoveHistory[0] === 6) {
                    return 2;
                } else if (this.humanMoveHistory[0] === 8) {
                    return 0;
                }
            }

            if (this.humanTurn === 3 && this.moveIsCorner(this.humanMoveHistory[1]) && 
                this.moveIsEdge(this.humanMoveHistory[2])) {

                if (this.humanMoveHistory[2] === 1) {
                    if (this.board[2] === 1) {
                        return 8;
                    } else if (this.board[0] === 1) {
                        return 6;
                    }
                } else if (this.humanMoveHistory[2] === 3) {
                    if (this.board[0] === 1) {
                        return 2;
                    } else if (this.board[6] === 1) {
                        return 8;
                    }
                } else if (this.humanMoveHistory[2] === 5) {
                    if (this.board[2] === 1) {
                        return 0;
                    } else if (this.board[8] === 1) {
                        return 6;
                    }
                } else if (this.humanMoveHistory[2] === 7) {
                    if (this.board[6] === 1) {
                        return 0;
                    } else if (this.board[8] === 1) {
                        return 2;
                    }
                }
            }
        } else { // ai move second
            if (this.board[4] === 0) {
                return 4;
            }
            // if (this.board[4] === HUMAN_PLAYER_ID) {
            //     return this.getRandomCornersThenEdges();
            // }
            // if (this.board[4] === AI_PLAYER_ID) {
            //     return this.getRandomEdgesThenCorners();
            // }
        }

        return this.getRandomCornersThenEdges();
    }

}

export default TicTacToeGame;