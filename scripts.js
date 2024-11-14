let length = parseInt(localStorage.getItem('length') || '5', 10)
let width = parseInt(localStorage.getItem('width') || '5', 10)

$("#table-length").val(length)
$("#table-width").val(width)

document.getElementById("table-length").addEventListener("input", function () {
    if (this.value > 20) this.value = 20
});

document.getElementById("table-width").addEventListener("input", function () {
    if (this.value > 20) this.value = 20
});

function createBoard() {
    length = parseInt($("#table-length").val(), 10) || 5
    width = parseInt($("#table-width").val(), 10) || 5

    let container = document.getElementById("game-container")
    if (!container) {
        container = document.createElement("div")
        container.setAttribute("id", "game-container")
        document.body.appendChild(container)
    } else {
        container.innerHTML = ''
    }

    let numbers = Array.from({ length: length * width }, (_, i) => i)

    // Fisher–Yates Shuffle algorithm
    let currentIndex = numbers.length
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [numbers[currentIndex], numbers[randomIndex]] = [numbers[randomIndex], numbers[currentIndex]]
    }

    let zeroIndex = [Math.floor(numbers.indexOf(0) / length), numbers.indexOf(0) % length]

    let game = []
    for (let i = 0; i < width * length; i += length) {
        game.push(numbers.slice(i, i + length))
    }

    const table = document.createElement("table")
    for (let r = 0; r < width; r++) {
        const row = document.createElement("tr")
        for (let c = 0; c < length; c++) {
            const cell = document.createElement("td");
            cell.innerText = game[r][c] === 0 ? "" : game[r][c]
            cell.setAttribute('location', `${r},${c}`)

            if (game[r][c] === 0) {
                cell.setAttribute("id", "zero")
                zeroIndex = [r, c]
            }

            $(cell).click(function() {
                const zeroElement = document.getElementById("zero")
                if (zeroElement) {
                    const clickedLoc = cell.getAttribute('location').split(',').map(n => parseInt(n))

                    if ((Math.abs(clickedLoc[0] - zeroIndex[0]) === 1 && clickedLoc[1] === zeroIndex[1]) ||
                        (Math.abs(clickedLoc[1] - zeroIndex[1]) === 1 && clickedLoc[0] === zeroIndex[0])) {
                        
                        zeroElement.innerText = cell.innerText
                        cell.innerText = ""

                        zeroElement.removeAttribute('id')
                        cell.setAttribute('id', 'zero')
                        
                        zeroIndex = clickedLoc

                        if (checkWin()) {
                            displayWinScreen()
                        }
                    }
                }
            });

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    container.appendChild(table);

    localStorage.setItem('length', length)
    localStorage.setItem('width', width)
}

function checkWin() {
    let count = 1;
    for (let r = 0; r < width; r++) {
        for (let c = 0; c < length; c++) {
            const cell = document.querySelector(`[location="${r},${c}"]`)
            if (r === width - 1 && c === length - 1) {
                if (cell.innerText !== "") return false
            } else {
                if (parseInt(cell.innerText, 10) !== count) return false
                count++;
            }
        }   
    }
    return true;
}

function displayWinScreen() {
    const winMessage = document.createElement("div");
    winMessage.setAttribute("id", "win-message");
    winMessage.innerText = "Congratulations! You've completed the puzzle!";
    document.body.appendChild(winMessage);
}

createBoard();