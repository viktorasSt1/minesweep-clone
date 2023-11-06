// Display/UI

import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose,
  } from "./minesweeper.js"
  
  const BOARD_SIZE = 8
  const NUMBER_OF_MINES = 10
  
  const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
  const boardElement = document.querySelector(".board")
  const minesLeftText = document.querySelector("[data-mine-count]")
  const messageText = document.querySelector(".subtext")

  //TODO pakeisti. Trumpalaikis sprendimas pradeti nauja zaidima
  function startNewGame() {
    location.reload(); 
  }
  
  const newGameButton = document.querySelector(".new-game-button"); 
  newGameButton.addEventListener("click", startNewGame); //TODO reikia pakeisti, kad atnaujintu lenta, o nerefreshintu visa puslapi
 
  
  board.forEach(row => {
    row.forEach(tile => {
      boardElement.append(tile.element)
      tile.element.addEventListener("click", () => {
        revealTile(board, tile)
        checkGameEnd()
      })
      tile.element.addEventListener("contextmenu", e => {
        e.preventDefault()
        markTile(tile)
        listMinesLeft()
      })
    })
  })
  boardElement.style.setProperty("--size", BOARD_SIZE)
  minesLeftText.textContent = NUMBER_OF_MINES
  
  function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
      return (
        count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
      )
    }, 0)
  
    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
  }
  
  function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)
  
    if (win || lose) {
      boardElement.addEventListener("click", stopProp, { capture: true })
      boardElement.addEventListener("contextmenu", stopProp, { capture: true })
      
    }

  
    if (win) {
      messageText.textContent = "You escaped succesfully"
    }
    if (lose) {
      messageText.textContent = "You've encoutered a black hole"
      board.forEach(row => {
        row.forEach(tile => {
          if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
          if (tile.mine) revealTile(board, tile)
        })
      })
    }
  }
  
  function stopProp(e) {
    e.stopImmediatePropagation()
  }