export const ChessGui = {

  displayNewBoard(container) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        container.appendChild(square);
        square.classList.add('board-square');
        if ((row + col) % 2 === 0) {
          square.classList.add('light-square');
        } else {
          square.classList.add('dark-square');
        }

        const onclickSquare = function() {
          console.log(row, col);
        }

        square.addEventListener('click', onclickSquare);
      }
    }

  },
}

export default ChessGui;