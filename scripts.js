length = parseInt(localStorage.getItem('length') || '5', 10);
width = parseInt(localStorage.getItem('width') || '5', 10);

$("#table-length").val(length);
$("#table-width").val(width);

document.getElementById("table-length").addEventListener("input", function () {
    if (this.value > 20) this.value = this.value = 20;
});

document.getElementById("table-width").addEventListener("input", function () {
    if (this.value > 20) this.value = this.value = 20;
});


function createBoard() {
    length = parseInt($("#table-length").val(), 10) || 5;
    width = parseInt($("#table-width").val(), 10) || 5;

    let container = document.getElementById("game-container");
    if (!container) {
        container = document.createElement("div");
        container.setAttribute("id", "game-container");
        document.body.appendChild(container);
    } else {
        container.innerHTML = '';
    }

    let numbers = Array.from({ length: length * width }, (_, i) => i);

    // Fisher–Yates Shuffle algorithm (I did not make this)
    let currentIndex = numbers.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [numbers[currentIndex], numbers[randomIndex]] = [numbers[randomIndex], numbers[currentIndex]];
    }
    zeroIndex = [Math.floor(numbers.indexOf(0) / length), numbers.indexOf(0) % length]

    game = [];
    for (let i = 0; i < width * length; i += length) {
        game.push(numbers.slice(i, i + length));
    }
    
    const table = document.createElement("table");
    for (let r = 0; r < width; r++) {
        const row = document.createElement("tr");
        for (let c = 0; c < length; c++) {
            const e = document.createElement("td");
            e.innerText = game[r][c];
            if (e.innerText == '0') {
                e.setAttribute("id", "zero")
                zeroIndex = [r, c]
            }
            e.setAttribute('location', [r,c])
            $(e).click(function() {
                zeroElement = document.getElementById("zero") || null
                if (zeroElement != null) {
                    eLoc = e.getAttribute('location').split(',').map(n => parseInt(n))
                    console.log(eLoc)
                    console.log(zeroIndex)
                    console.log((Math.abs(eLoc[0] - zeroIndex[0]) == 1 && eLoc[1] == zeroIndex[1]) || 
                                (Math.abs(eLoc[1] - zeroIndex[1]) == 1 && eLoc[0] == zeroIndex[0]))
                    if ((Math.abs(eLoc[0] - zeroIndex[0]) == 1 && eLoc[1] == zeroIndex[1]) || 
                        (Math.abs(eLoc[1] - zeroIndex[1]) == 1 && eLoc[0] == zeroIndex[0])) {   
                        zeroElement.innerText = e.innerText
                        e.innerText = 0

                        zeroElement.setAttribute('location', eLoc)
                        zeroElement.removeAttribute('id')
                        e.setAttribute('id', 'zero')
                        e.setAttribute('location', zeroIndex)

                        zeroIndex = eLoc
                    }
                }
            })
            
            row.appendChild(e);
        }
        table.appendChild(row);
    }
    container.appendChild(table);
    
    localStorage.setItem('length', length)
    localStorage.setItem('width', width)
}

createBoard();