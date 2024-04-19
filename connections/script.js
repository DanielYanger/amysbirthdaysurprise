!function() {
    let e;
    var r;
    (e = {
        sortable: Sortable.create(document.querySelector("#puzzle"), {
            disabled: !0,
            animation: 500
        }),
        answers: [
            {
                category: 'Places Amy\'s Lived',
                words: ['Katy', 'Gimpo', 'West Campus', 'West Loop'],
                color: 'orange'
            },
            {
                category: 'Amy\'s Favorites',
                words: ['Cat', 'Danny', 'Howl', 'Tulip'],
                color: 'green'
            },
            {
                category: 'AMY\'S BIRTH',
                words: ['23rd St Mural', 'April Fools', 'Finding Nemo (2003)', 'Korea Town'],
                color: 'blue'
            },
            {
                category: 'START OF AMY\'S CHILDHOOD SHOWS',
                words: ['Cray', 'Detect', 'Poke', 'Suga'],
                color: 'purple'
            }
        ],
        selected: {},
        solved: [],
        attempts: [],
        results: [],
        summary: [],
        tries: 4
    }).words = (r = e.answers.reduce((e,s)=>[...e, ...s.words], []),
    r.sort((e,s)=>.5 - Math.random())),
    document.querySelectorAll("#puzzle .block:not(.correct)").forEach((t,l)=>{
        t.setAttribute("data-id", e.words[l]),
        t.addEventListener("click", t=>(function t(l) {
            if (l.target.classList.contains("disabled"))
                return;
            let r = document.querySelectorAll("#puzzle .block.selected")
                , d = document.querySelector("#submit");
            if (l.target.classList.contains("selected") ? (l.target.classList.remove("selected"),
            e.selected[l.target.getAttribute("data-id")] = !1) : r.length < 4 && (l.target.classList.add("selected"),
            e.selected[l.target.getAttribute("data-id")] = !0),
            (r = document.querySelectorAll("#puzzle .block.selected")).length >= 4) {
                let c = s().join(",");
                e.attempts.includes(c) || d.classList.remove("disabled")
            } else
                d.classList.add("disabled")
        }
        )(t))
    }
    ),
    e.tries > 0 && (document.querySelector("#tries").innerHTML = Array(1 + e.tries).join('<span class="try"></span>')),
    document.querySelector("#deselect").addEventListener("click", ()=>(document.querySelectorAll("#puzzle .block.selected").forEach(e=>e.classList.remove("selected")),
    e.selected = {},
    void document.querySelector("#submit").classList.add("disabled"))),
    document.querySelector("#shuffle").addEventListener("click", ()=>(function e() {
        let s = document.querySelectorAll("#puzzle .block.solved").length
            , t = document.querySelector("#puzzle");
        for (let l = t.children.length; l >= s; l--)
            t.appendChild(t.children[Math.random() * (l - s) + s | 0])
    }
    )()),
    document.querySelector("#submit").addEventListener("click", l=>{
        l.target.classList.contains("disabled") || (l.target.classList.add("disabled"),
        function l() {
            let r = s();
            if (r.every(s=>e.answers[0].words.includes(s)) || r.every(s=>e.answers[1].words.includes(s)) || r.every(s=>e.answers[2].words.includes(s)) || r.every(s=>e.answers[3].words.includes(s))) {
                var d;
                if (r.every(s=>e.answers[0].words.includes(s)) ? e.solved.push(0) : r.every(s=>e.answers[1].words.includes(s)) ? e.solved.push(1) : r.every(s=>e.answers[2].words.includes(s)) ? e.solved.push(2) : r.every(s=>e.answers[3].words.includes(s)) && e.solved.push(3),
                e.tries > 0) {
                    let c = r.join(",");
                    e.attempts.push(c)
                }
                let a, i, o, n, u;
                return d = r,
                a = document.querySelector("#puzzle").querySelectorAll(".block.solved"),
                i = e.sortable.toArray(),
                (o = document.querySelectorAll("#puzzle .block.selected")).forEach((e,s)=>{
                    e.classList.add("solved"),
                    e.classList.remove("selected");
                    let t = e.getAttribute("data-id");
                    i.splice(s + a.length, 0, i.splice(i.indexOf(t), 1))
                }
                ),
                e.sortable.sort(i, !0),
                n = "",
                u = "#2980b9",
                e.answers.forEach((e,s)=>{
                    e.words.includes(d[0]) && (n = e.category,
                    u = e.color)
                }
                ),
                setTimeout(()=>{
                    let e = document.querySelector("#solved")
                        , s = document.createElement("div");
                    s.innerHTML = `<div><h3 class="category">${n}</h3><div class="words">${d.join(", ")}</div></div>`,
                    s.classList.add("block", u),
                    e.appendChild(s),
                    s.classList.add("pulse"),
                    o.forEach(e=>{
                        e.classList.add("hide")
                    }
                    )
                }
                , 500),
                a.length >= 12 && e.tries > 0 && t(),
                !0
            }
            {
                let p = r.join(",");
                e.attempts.push(p);
                let y = document.querySelectorAll("#puzzle .block.selected");
                return y.forEach(e=>e.classList.add("wiggle")),
                setTimeout(()=>{
                    y.forEach(e=>e.classList.remove("wiggle"))
                }
                , 500),
                e.tries <= 1 && setTimeout(()=>{
                    document.querySelectorAll("#puzzle .block").forEach(e=>{
                        e.classList.add("disabled"),
                        e.classList.remove("selected")
                    }
                    ),
                    e.unsolved = [0, 1, 2, 3].filter(s=>!e.solved.includes(s)),
                    function s() {
                        if (e.unsolved.length > 0) {
                            let r = e.unsolved.pop();
                            if (e.answers[r].words.forEach(e=>{
                                document.querySelector(`#puzzle .block[data-id="${e}"]`).classList.add("selected")
                            }
                            ),
                            l(),
                            e.unsolved.length <= 0) {
                                t();
                                return
                            }
                            setTimeout(()=>{
                                s()
                            }
                            , 2e3)
                        }
                    }()
                }
                , 1e3),
                e.tries -= 1,
                document.querySelectorAll("#tries .try")[e.tries].classList.add("blink"),
                !1
            }
        }())
    }
    ),
    MicroModal.init(),
    new ClipboardJS("#clipboard")

    function s() {
        let e = document.querySelectorAll("#puzzle .block.selected")
          , s = [];
        return e.forEach(e=>{
            s.push(e.getAttribute("data-id"))
        }
        ),
        s.sort()
    }
    function t() {
        setTimeout(()=>{
            alert("Congrats! You're in for a special surprise!")
            window.location.href = "video.html";
        }, 2e3)
    }
}();
