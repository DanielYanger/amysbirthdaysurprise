var CLICKED = false
var SELECTED = []
var COMPLETED = []
var order_completed = []
var WORDS_DONE = 0

const adjacent = (id1, id2) => {
    const i1 = Number(id1.slice(1))
    const i2 = Number(id2.slice(1))
    const dxs = [-1, 0, 1]
    const dys = [-6, 0, 6]
    
    for (let i = 0; i < dxs.length; i++) {
        const dx = dxs[i];
        for (let j = 0; j < dys.length; j++) {
            const dy = dys[j];
            if (i1 + dx + dy == i2){
                return true
            }
        }
    }

    return false
}

const touchmove = (e, source, atx, aty) => {
    const rect = source.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.width / 2

    if (CLICKED && Math.abs(atx - cx) > rect.width / 3 || Math.abs(aty - cy) > rect.width / 3){
        // Diagonal Sensitivity
        return 
    }

    if (COMPLETED.includes(source.id)){
        return
    }

    if (!CLICKED){
        clear_canvas("hoverCanvas")
        drawTransparentCircleAboveEntry(source.id, "hoverCanvas", 'rgb(210, 210, 210)',  0.2)
    }
    
    if (CLICKED){
        if (SELECTED.length == 0 || (!SELECTED.includes(source.id) && adjacent(SELECTED[SELECTED.length - 1], source.id))){
            SELECTED.push(source.id)
        }
        clear_canvas("selectedCanvas")
        const c_selection = []
        SELECTED.forEach(element_id => {
            drawTransparentCircleAboveEntry(element_id, "selectedCanvas", 'rgb(210, 210, 210)',  1)
            c_selection.push(document.getElementById(element_id).textContent)
        });

        for (let i = 0; i < SELECTED.length - 1; i++) {
            drawLineBetweenEntries(SELECTED[i], SELECTED[i+1], "selectedCanvas", 'rgb(210, 210, 210)',  1)
        }

        document.getElementById("selected").textContent = c_selection.join("")

    }
}

const mousemove = (e) => {
    const source = e.srcElement
    touchmove(e, source, e.x, e.y)
}

const mousedown = (e) => {
    clear_canvas("hoverCanvas")
    CLICKED = true
    mousemove(e)
}

const mouseup = (e, solutions, spangram) => {
    document.getElementById("selected").textContent = ""
    const coords = []
    const letters = []
    SELECTED.forEach(element_id => {
        letters.push(document.getElementById(element_id).textContent)
        coords.push(element_id.slice(1))
    })
    
    const key = letters.join("")
    const val = coords.join("|")
    
    if (key in solutions && solutions[key] === val && key !== ""){ // GOOD
        let color = ''
        if(key === spangram){
            color = 'rgb(255, 234, 0)'
            document.getElementById("selected").textContent = "SPANGRAM!!!"
            order_completed.push("S")
        }
        else{
            color = 'rgb(173, 216, 230)'
            order_completed.push("W")
        }
        order_completed.push(key)
        SELECTED.forEach(element_id => {
            COMPLETED.push(element_id)
            drawTransparentCircleAboveEntry(element_id, "permanentCanvas", color, 1)
        });

        for (let i = 0; i < SELECTED.length - 1; i++) {
            drawLineBetweenEntries(SELECTED[i], SELECTED[i+1], "permanentCanvas", color, 1)
        }
        WORDS_DONE = WORDS_DONE + 1
    }
    else if (key in solutions && key !== ""){ // Make it correct
        const to_set = []
        solutions[key].split("|").forEach(a => {
            to_set.push("p" + a)
        })
        SELECTED = to_set
        mouseup(e, solutions, spangram) // Re run with a faux selected
        return
    }
    else { // WRONG GUESS

    }


    CLICKED = false
    SELECTED = []
    clear_canvas("selectedCanvas")

    if (COMPLETED.length == 48){
        document.getElementById("selected").textContent = "You win"
        sprayConfetti()
        reveal_share()
    }
    document.getElementById("a").textContent = WORDS_DONE
}

const reveal_share = () => {
    const shareButton = document.getElementById('share-button');
    shareButton.hidden = false
    shareButton.addEventListener('click', async () => {
        const theme = document.getElementById('theme').innerText;
        const BC = "🔵"
        const YC = "🟡"
    
        const to_append = []
        order_completed.forEach((w) => {
            if(w === "S"){
                to_append.push(YC)
            }
            if(w === "W"){
                to_append.push(BC)
            }
        })
        const textToShare = theme + ": \n" + to_append.join("");
        if (navigator.share) {
            try {
                await navigator.share({
                    text: textToShare
                });
            } catch (error) {
                console.error('Error sharing text:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(textToShare);
                document.getElementById("selected").textContent = "Text Copied to Clipboard"
            } catch (error) {
                console.error('Error copying text to clipboard:', error);
            }
        }
    });
}

const mouseup_outside = (e, solutions, spangram) => {
    if (CLICKED) {
        mouseup(e, solutions, spangram)
    }
}

const mouseleave = (e) => {
    clear_canvas("hoverCanvas")
}

const set_canvas = () => {
    const canvases = ["hoverCanvas", "permanentCanvas", "selectedCanvas", "hoverCanvas", "permanentCanvas"] // UNCLEAR WHY I NEED MORE
    canvases.forEach(cs => {
        const canvas = document.getElementById(cs);
        const table = document.getElementById("table")
        const rect = table.getBoundingClientRect()
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.top = `${rect.top + window.scrollY}px`
        canvas.style.left = `${rect.left + window.scrollX}px`
    });
}

const set_temp = () => {
    const canvas = document.getElementById("tempCanvas");
    const table = document.getElementById("table")
    const rect = table.getBoundingClientRect()
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.top = `${rect.top + window.scrollY}px`
    canvas.style.left = `${rect.left + window.scrollX}px`
}

const copy_canvas = (from, into) => {
    const fromCanvas = document.getElementById(from)
    const intoCanvas = document.getElementById(into)

    ctx = intoCanvas.getContext("2d")
    ctx.drawImage(fromCanvas, 0, 0);
}

const resize = () => {
    copy_canvas("permanentCanvas", "tempCanvas")
    set_canvas()
    copy_canvas("tempCanvas", "permanentCanvas")
    clear_canvas("tempCanvas")
}

const clear_canvas = (canvas_id) => {
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawTransparentCircleAboveEntry(entryId, canvas_id, color, opacity) {
    const entry = document.getElementById(entryId);
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext('2d');
    const table = document.getElementById("table")

    // Calculate the position of the entry
    const rect = entry.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();

    radius = rect.width / 2.75
    const x = rect.left + rect.width / 2 - tableRect.left;
    const y = rect.top - tableRect.top + rect.height / 2; // Position the circle above the entry

    // Set the transparency
    ctx.globalAlpha = opacity;

    // Draw the circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    // Reset the transparency
    ctx.globalAlpha = 1.0;
}
function drawLineBetweenEntries(entry1Id, entry2Id, canvasId, color, opacity) {
    const entry1 = document.getElementById(entry1Id);
    const entry2 = document.getElementById(entry2Id);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Adjust canvas size to match the table
    const table = document.getElementById("table")

    // Calculate positions
    const rect1 = entry1.getBoundingClientRect();
    const rect2 = entry2.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - tableRect.left;
    const y1 = rect1.top + rect1.height / 2 - tableRect.top;
    const x2 = rect2.left + rect2.width / 2 - tableRect.left;
    const y2 = rect2.top + rect2.height / 2 - tableRect.top;
    ctx.globalAlpha = opacity;
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = rect1.width / 4
    ctx.stroke();
    ctx.globalAlpha = 1.0;
}

function sprayConfetti() {
    alert("Congrats! You've won a My Melody Woobles Kit!");
    window.location.href = "/index.html"
}