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

// Funciones auxiliares para verificar si una pieza es blanca o negra
function isWhitePiece(piece) {
  return Object.values(whitePieces).includes(piece);
}

function isBlackPiece(piece) {
  return Object.values(BlackPieces).includes(piece);
}

/**
 * BUG: Se agregan piezas duplicadas en el tablero a seleccionar una pieza de diferente color.
 
 * Función para seleccionar las piezas del tablero.
 * Solo una pieza puede estar seleccionada a la vez.
 * Si una pieza de diferente color es seleccionada, se mueve la pieza.
 * Si una pieza del mismo color es seleccionada, se deselecciona la pieza anterior.
 * Si una casilla vacía es seleccionada, se mueve la pieza usando la función ExecuteMove().
 */
function selectedPieces() {
  const cells = document.querySelectorAll(".box");

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const piece = cell.querySelector(".piece");
     
      // si la casilla no contiene una pieza, no hacer nada
      if (!piece) return; 

      // determinar el color de la pieza seleccionada
      const currentColor = isBlackPiece(piece.textContent) ? "black" : "white";
      
      // obtener la pieza y la casilla seleccionada
      const selectedPiece = document.querySelector(".piece.selected");
      const selectedBox = document.querySelector(".box.selected");

      // si hay una pieza seleccionada, determinar su color
      if (selectedPiece) {
        const selectedColor = isBlackPiece(selectedPiece.textContent) ? "black" : "white";

        // Obtener la última casilla seleccionada si existe
        let lastMove = document.getElementById(sessionStorage.getItem("lastMove"));

        // Verificar si la pieza seleccionada es de diferente color
        if (currentColor !== selectedColor) {
          // Otro color - Mover la pieza a la nueva casilla
          cell.innerHTML = selectedPiece.outerHTML;
          lastMove.innerHTML = ""; // Limpiar la casilla anterior
          
          // Deseleccionar la pieza y la casilla
          cell.children[0].classList.remove("selected");
          selectedPiece.classList.remove("selected");
          selectedBox.classList.remove("selected");
        } else {
          // Mismo color - Deseleccionar la pieza y la casilla
          selectedPiece.classList.remove("selected");
          selectedBox.classList.remove("selected");
        }
      }

      // Select new piece if not capturing
      if (!cell.contains(selectedPiece)) {
        piece.classList.add("selected");
        cell.classList.add("selected");
      }

      // Guardar la última casilla seleccionada
      sessionStorage.setItem("lastMove", cell.id);
    });
  });
}

/**
 * Función para mover piezas seleccionadas en el tablero.
 */
function ExecuteMove() {
  const cells = document.querySelectorAll(".box");

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      // Verificar si la casilla clicada está vacía
      if (cell.querySelector(".piece")) {
        return; // No hacer nada si la casilla contiene
      }

      // Obtener la pieza seleccionada y su casilla
      const selectedPiece = document.querySelector(".piece.selected");
      const selectedBox = document.querySelector(".box.selected");

      if (selectedPiece && selectedBox) {
        // Mover la pieza a la nueva casilla
        cell.innerHTML = selectedPiece.outerHTML;

        // Limpiar la casilla original
        selectedBox.innerHTML = "";

        // Deseleccionar la pieza y la casilla
        cell.children[0].classList.remove("selected");
        selectedPiece.classList.remove("selected");
        selectedBox.classList.remove("selected");
      }
    });
  });
}

// Evento principal: Ejecutar las funciones al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  CreateBoard();
  SetupBoardPieces();
  selectedPieces();
  ExecuteMove();
});
