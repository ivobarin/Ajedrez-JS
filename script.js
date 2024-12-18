/**
 * Crea un tablero de ajedrez en HTML y lo muestra en el navegador.
 * Genera IDs para cada casilla del tablero y las colorea alternando entre blanco y negro
 *
 */
function CreateBoard() {
  let boardHTML = "";
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const id = `${letters[j]}${8 - i}`; // Genera IDs como "a1", "b2", etc.
      const color = (i + j) % 2 === 0 ? "white" : "black"; // Alterna colores
      boardHTML += `<div class="box ${color}" id="${id}"></div>`;
    }
  }

  const board = document.querySelector("#board");
  board.innerHTML = boardHTML;
}

/**
 * Funcion que va a recibir la posicion incial de cada pieza (id) y su color
 * y va a agregarlas por id al tablero
 * @param {object} posicion
 * @param {object} color
 */
function AddPieces(posicion, color) {
  for (const [pos, piece] of Object.entries(posicion)) {
    const cell = document.getElementById(pos);
    if (cell) {
      cell.innerHTML = `<span class="piece">${color[piece]}</span>`;
    }
  }
}

/**
 * Funcion que va a crear las piezas del tablero y luego las coloca en sus posiciones iniciales
 * Determina las posiciones iniciales de las piezas blancas y negras
 */
function SetupBoardPieces() {
  const whitePieces = {
    rook: "♖",
    knight: "♘",
    bishop: "♗",
    queen: "♕",
    king: "♔",
    pawn: "♙",
  };

  const BlackPieces = {
    rook: "♜",
    knight: "♞",
    bishop: "♝",
    queen: "♛",
    king: "♚",
    pawn: "♟",
  };

  // Posiciones iniciales de las piezas blancas
  const whitePos = [
    "a8",
    "b8",
    "c8",
    "d8",
    "e8",
    "f8",
    "g8",
    "h8",
    ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  ].reduce((acc, pos) => {
    pos === "a8" || pos === "h8" ? (acc[pos] = "rook") : "";
    pos === "b8" || pos === "g8" ? (acc[pos] = "knight") : "";
    pos === "c8" || pos === "f8" ? (acc[pos] = "bishop") : "";
    pos === "d8" ? (acc[pos] = "queen") : "";
    pos === "e8" ? (acc[pos] = "king") : "";
    Array.isArray(pos) ? pos.forEach((p) => (acc[p] = "pawn")) : "";
    return acc;
  }, {});

  // Posiciones iniciales de las piezas negras
  const blackPos = [
    "a1",
    "b1",
    "c1",
    "d1",
    "e1",
    "f1",
    "g1",
    "h1",
    ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  ].reduce((acc, pos) => {
    pos === "a1" || pos === "h1" ? (acc[pos] = "rook") : "";
    pos === "b1" || pos === "g1" ? (acc[pos] = "knight") : "";
    pos === "c1" || pos === "f1" ? (acc[pos] = "bishop") : "";
    pos === "d1" ? (acc[pos] = "queen") : "";
    pos === "e1" ? (acc[pos] = "king") : "";
    Array.isArray(pos) ? pos.forEach((p) => (acc[p] = "pawn")) : "";
    return acc;
  }, {});

  AddPieces(whitePos, whitePieces);
  AddPieces(blackPos, BlackPieces);
}

/**
 * Funcion que va a seleccionar las piezas del tablero solo una a la vez.
 * Al seleccionar una pieza, esta se va a resaltar con un borde de color.
 * Si se selecciona otra pieza, la anterior pierde el borde y se desealecciona.
 */
function SelectPieces() {
  const cells = document.querySelectorAll(".box");
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      const piece = e.target;
      if (
        piece.classList.contains("piece") &&
        !piece.classList.contains("selected") 
      ) {
        piece.classList.add("selected");
        piece.parentElement.classList.add("selected");
      } else {
        piece.classList.remove("selected");
        piece.parentElement.classList.remove("selected");
      }
    });
  });
}

// Evento principal
// Ejecuta las funciones al cargar el DOM
if (window.location.pathname.includes("index.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    CreateBoard();
    SetupBoardPieces();
    SelectPieces();
  });
}
