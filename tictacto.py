import random

humanTurn = 1
humanMoveHistory = []
board = [0,0,0, 0,0,0, 0,0,0]
winConditions = ([0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], \
    [6, 7, 8], [0, 4, 8], [2, 4, 6])

humanId = 1
aiId = 2

# ai has playerId of 2, player has playerId of 1
# position is 0-8
def playerMove(playerId, position):
    if position == -1:
        return

    board[position] = playerId

    if playerId == humanId:
        global humanTurn
        humanMoveHistory.append(position)
        humanTurn = humanTurn + 1

def moveIsEdge(position):
    if position == 1 or position == 3 or position == 5 or position == 7:
        return True

def moveIsCorner(position):
    if position == 0 or position == 2 or position == 6 or position == 8:
        return True

def isWinningMoveExist(player):
    for condition in winConditions:
        if board[condition[0]] == player and board[condition[1]] == player and board[condition[2]] == 0:
            return condition[2]
        elif board[condition[0]] == player and board[condition[1]] == 0 and board[condition[2]] == player:
            return condition[1]
        elif board[condition[0]] == 0 and board[condition[1]] == player and board[condition[2]] == player:
            return condition[0]

    return -1

def isWon():
    for condition in winConditions:
        if board[condition[0]] == 1 and board[condition[1]] == 1 and board[condition[2]] == 1:
            return 1
        elif board[condition[0]] == 2 and board[condition[1]] == 2 and board[condition[2]] == 2:
            return 2
    return 0

def getAvailableMoves():
    result = []
    i = 0
    for position in board:
        if position == 0:
            result.append(i)
        i += 1
    return result

def getAvailableCorners():
    availableMoves = getAvailableMoves()

    return list(filter(moveIsCorner, availableMoves))

def getAvailableEdges():
    availableMoves = getAvailableMoves()

    return list(filter(moveIsEdge, availableMoves))

# get random corner if possible, then get random edge
def getRandomCornersThenEdges():
    availableMoves = getAvailableCorners()
    if len(availableMoves) == 0:
        availableMoves = getAvailableEdges()
    return random.choice(availableMoves)
def getRandomEdgesThenCorners():
    availableMoves = getAvailableEdges()
    if len(availableMoves) == 0:
        availableMoves = getAvailableCorners()
    return random.choice(availableMoves)

def printBoard():
    print(str(board[0]) + "|" + str(board[1]) + "|" + str(board[2]))
    print(str(board[3]) + "|" + str(board[4]) + "|" + str(board[5]))
    print(str(board[6]) + "|" + str(board[7]) + "|" + str(board[8]))
    print("Turn: " + str(humanTurn))
# print(sum(board[4:6]))
# playerMove(0,0)

def getAImove(whoMoveFirst):
    winningMoveForAI = isWinningMoveExist(2)
    if winningMoveForAI != -1:
        return winningMoveForAI
    
    winningMoveForPlayer = isWinningMoveExist(1)
    if winningMoveForPlayer != -1:
        return winningMoveForPlayer

    # ai move first
    if whoMoveFirst == aiId:
        if humanTurn == 1:
            return 4

        if humanTurn == 2 and moveIsEdge(humanMoveHistory[0]):
            if humanMoveHistory[0] == 1:
                return 8
            elif humanMoveHistory[0] == 3:
                return 2
            elif humanMoveHistory[0] == 5:
                return 6
            elif humanMoveHistory[0] == 7:
                return 0

        if humanTurn == 2 and moveIsCorner(humanMoveHistory[0]):
            if humanMoveHistory[0] == 0:
                return 8
            elif humanMoveHistory[0] == 2:
                return 6
            elif humanMoveHistory[0] == 6:
                return 2
            elif humanMoveHistory[0] == 8:
                return 0

        if humanTurn == 3 and moveIsCorner(humanMoveHistory[1]) and moveIsEdge(humanMoveHistory[2]):
            if humanMoveHistory[2] == 1:
                if board[2] == 1:
                    return 8
                elif board[0] == 1:
                    return 6
            elif humanMoveHistory[2] == 3:
                if board[0] == 1:
                    return 2
                elif board[6] == 1:
                    return 8
            elif humanMoveHistory[2] == 5:
                if board[2] == 1:
                    return 0
                elif board[8] == 1:
                    return 6
            elif humanMoveHistory[2] == 7:
                if board[6] == 1:
                    return 0
                elif board[8] == 1:
                    return 2
        # pick random
        return random.choice(getAvailableMoves())
    else: # ai move second
        if board[4] == 0:
            return 4
        if board[4] == humanId:
            return getRandomCornersThenEdges()
        if board[4] == aiId:
            return getRandomEdgesThenCorners()
    
    return -1

whoMoveFirst = int(input("Who goes first? (1 for human, 2 for ai)"))

whoMoveNow = whoMoveFirst
while len(getAvailableMoves()) != 0 and isWon() == 0:
    if whoMoveNow == 1:
        printBoard()
        humanMove = int(input("Enter move"))
        playerMove(humanId, humanMove)
        whoMoveNow = 2
    else:
        playerMove(aiId, getAImove(whoMoveFirst))
        whoMoveNow = 1

printBoard()
endResult = isWon()
if endResult == 0:
    print("draw")
else:
    print(endResult)