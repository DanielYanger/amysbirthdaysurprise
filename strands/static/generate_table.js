const ROWS = 8
const COLS = 6

const place = (letters, loc, grid) => {
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i]
        const at = loc[i]
        const rn = Math.floor(at / COLS)
        const cn = Math.floor(at % COLS)
        grid[rn][cn] = letter
    }
}

const delete_hidden = () => {
    document.getElementById("spangram").remove()
    document.getElementById("spangramloc").remove()
    document.getElementById("words").remove()
    document.getElementById("loc").remove()
}

const get_info = () => {
    const spangram = document.getElementById("spangram").innerHTML
    const spangramloc = document.getElementById("spangramloc").innerHTML
    const words = document.getElementById("words").innerHTML
    const loc = document.getElementById("loc").innerHTML

    const arr_sloc = spangramloc.split("|")

    const arr_loc = loc.split("|")
    const raw_words = words.replaceAll("|","")

    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(""))

    place(spangram, arr_sloc, grid)
    place(raw_words, arr_loc, grid)

    const solutions = {}
    const arr_words = words.split("|")

    arr_words.forEach(word => {
        solutions[word] = ""
        const temp = []
        word.split("").forEach(_ => {
            temp.push(arr_loc.shift())
        });
        solutions[word] = temp.join("|")
    });

    solutions[spangram] = spangramloc

    delete_hidden()

    return [grid, solutions, spangram]
}

const generate_table = () => {
    const [grid, solutions, spangram] = get_info()
    document.getElementById("a").textContent = 0
    document.getElementById("b").innerHTML = Object.keys(solutions).filter(key => solutions[key] !== "").length
    const table = document.getElementById("table")
    for (let i = 0; i < ROWS; i++) {
        const new_element = document.createElement('tr')
        for (let j = 0; j < COLS; j++) {
            const entry = document.createElement('td')
            entry.textContent = grid[i][j]
            entry.id = `p${i*6+j}`

            entry.addEventListener("mousemove", mousemove)
            entry.addEventListener("mouseleave", mouseleave)
            entry.addEventListener("mousedown", mousedown)
            entry.addEventListener("mouseup", (e) => {
                mouseup(e, solutions, spangram)
            })

            entry.addEventListener("touchmove", (e) => {
                e.preventDefault()

                const cand = document.getElementsByTagName("td")
                const x = e.touches[0].clientX
                const y = e.touches[0].clientY

                let mindist = 100000
                let at = ""
                for (let i = 0; i < cand.length; i++) {
                    const element = cand[i];
                    const rect = element.getBoundingClientRect()
                    const cx = rect.left + rect.width / 2
                    const cy = rect.top + rect.width / 2

                    const dist = Math.abs(cx - x) + Math.abs(cy - y)
                    if (mindist > dist){
                        at = element
                        mindist = dist
                    }
                }

                touchmove(e, at, x, y)
            })
            entry.addEventListener("touchcancel", mouseleave)
            entry.addEventListener("touchstart", mousedown)
            entry.addEventListener("touchend", (e) => {
                mouseup(e, solutions, spangram)
            })

            new_element.appendChild(entry)
        }
        table.appendChild(new_element)
    }
    document.addEventListener("mouseup", (e) => {
        mouseup_outside(e, solutions, spangram)
    })
    document.addEventListener("touchend", (e) => {
        mouseup_outside(e, solutions, spangram)
    })

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', resize)
    set_temp()

    set_canvas()
    resize()
    resize()
}

document.addEventListener("DOMContentLoaded", generate_table)
