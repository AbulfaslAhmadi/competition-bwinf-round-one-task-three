const fs = require("fs")
let data = fs.readFileSync("./tests/zauberschule5.txt", {encoding: "utf-8"})

// speichern der Felder in verschatelte Arrays
let floors = [[] /* i=0 ist die oberer Ebene */, [] /* i=1 ist die untere Ebene */] /* Äußere Klammer beinhaltet alle ebenen */
let temp = []
temp = data.replace(/\r/g, "").split("\n") // jede zeile wird in temp gespeichert

for(let i=1; i<temp.indexOf(""); i++) {
    floors[0].push(temp[i].split("")) // untere ebene wird in floors[0] gespeichert und in jede Spalte einer Zeile bekommt ein index
}

for(let i=temp.indexOf("")+1; i<temp.length; i++) {
    floors[1].push(temp[i].split("")) // obere ebene wird in floors[1] gespeichert und in jede Spalte einer Zeile bekommt ein index
}

// Positionen vom sStart (A) und Ziel (B) finden und in indexofA bzw indexofB speichern
let indexOfA = []
let indexOfB = []

for(i in floors) {
    for(j of floors[i]) {
        for(k of j) {
            if(k == "A") {
                indexOfA.push(parseInt(i), floors[i].indexOf(j), j.indexOf(k))
            }
            if(k == "B") {
                indexOfB.push(parseInt(i), floors[i].indexOf(j), j.indexOf(k))
            }
        }
    }
}

// Funktion zum finden des schnellsten Weges mit Dijkstra's Algorithmus
// s = start, g = goal(ziel)
function dijkstra(s, g) {
    let ebene = s[0]
    let zeile = s[1]
    let spalte = s[2]
    floors[ebene][zeile][spalte] = 0 // Anfangsknoten (A) mit 0 markieren
    floors[g[0]][g[1]][g[2]] = Infinity // Zielknoten (B) mit ∞ markieren
    
    let toSearch = [[ebene, zeile, spalte, 0]]
    
    function conditions() {
        let length = toSearch.length
        for(i of toSearch) {
            if((floors[i[0]][i[1]][i[2]-1] == ".") || (floors[i[0]][i[1]][i[2]-1] > (i[3]+1))) { // nach links
                floors[i[0]][i[1]][i[2]-1] = i[3]+1 // entfernung zum Knoten schreiben
                toSearch.push([i[0], i[1], i[2]-1, i[3]+1]) // Knoten in toSearch schreiben um nach weiteren Knoten zu suchen
            }
            if((floors[i[0]][i[1]][i[2]+1] == ".") || (floors[i[0]][i[1]][i[2]+1] > (i[3]+1))) { // nach rechts
                floors[i[0]][i[1]][i[2]+1] = i[3]+1 // entfernung zum Knoten schreiben
                toSearch.push([i[0], i[1], i[2]+1, i[3]+1]) // Knoten in toSearch schreiben um nach weiteren Knoten zu suchen
            }
            if((floors[i[0]][i[1]-1][i[2]] == ".") || (floors[i[0]][i[1]-1][i[2]] > (i[3]+1))) { // nach oben
                floors[i[0]][i[1]-1][i[2]] = i[3]+1 // entfernung zum Knoten schreiben
                toSearch.push([i[0], i[1]-1, i[2], i[3]+1]) // Knoten in toSearch schreiben um nach weiteren Knoten zu suchen
            }
            if((floors[i[0]][i[1]+1][i[2]] == ".") || (floors[i[0]][i[1]+1][i[2]] > (i[3]+1))) { // nach unten
                floors[i[0]][i[1]+1][i[2]] = i[3]+1 // entfernung zum Knoten schreiben
                toSearch.push([i[0], i[1]+1, i[2], i[3]+1]) // Knoten in toSearch schreiben um nach weiteren Knoten zu suchen
            }
            if(floors[i[0]+1]) { // ebene nach unten
                if((floors[i[0]+1][i[1]][i[2]] == ".") || (floors[i[0]+1][i[1]][i[2]] > (i[3]+3))) {
                    floors[i[0]+1][i[1]][i[2]] = i[3]+3 // entfernung zum Knoten schreiben
                    toSearch.push([i[0]+1, i[1], i[2], i[3]+3]) // Knoten in toSearch schreiben um nach weiteren Knoten zu suchen
                }
            }
            if(floors[i[0]-1]) { // ebene nach oben
                if((floors[i[0]-1][i[1]][i[2]] == ".") || (floors[i[0]-1][i[1]][i[2]] > (i[3]+3))) {
                    floors[i[0]-1][i[1]][i[2]] = i[3]+3 // entfernung zum Knoten schreiben
                    toSearch.push([i[0]-1, i[1], i[2], i[3]+3]) // Knoten in toSearch schreiben um nach weiteren Knoten zu suchen
                }
            }
        }
        toSearch.splice(0, length) // bereits durchsuchte Knoten aus toSearch löschen
        
        if(toSearch.length > 0) { // wenn toSearch nicht leer ist, es also weitere zu untersuchende Pukte gibt, werden die fknt rekursiv aufgerufen um die nächsten Punkte zu untersuchen
            conditions()
        }
    }
    conditions();
}
dijkstra(indexOfA, indexOfB);

// Funktion, die den (von der Dijkstra Funktion gegebenen) schnellsten Weg visuell darstellt mit <; >; ^; v; !
let time = 0
function showPath(s) {
    let ebene = s[0]
    let zeile = s[1]
    let spalte = s[2]
    time = floors[ebene][zeile][spalte] // Die von der djikstra Funktion berechnete Zeit wird gespeichtert
    floors[ebene][zeile][spalte] = "B" // Zeit wird wieder mit B überschrieben
    let temp = time

    function reverseSearching() {
        if(floors[ebene][zeile][spalte+1] === (temp-1)) { // nach rechts 
            temp = floors[ebene][zeile][spalte+1]
            floors[ebene][zeile][spalte+1] = "<"
            spalte++
        }

        if(floors[ebene][zeile][spalte-1] === (temp-1)) { // nach links
            temp = floors[ebene][zeile][spalte-1]
            floors[ebene][zeile][spalte-1] = ">"
            spalte--
        }
        if(floors[ebene][zeile+1][spalte] === (temp-1)) { // nach unten
            temp = floors[ebene][zeile+1][spalte]
            floors[ebene][zeile+1][spalte] = "^"
            zeile++
        }
        if(floors[ebene][zeile-1][spalte] === (temp-1)) { // nach oben
            temp = floors[ebene][zeile-1][spalte]
            floors[ebene][zeile-1][spalte] = "v"
            zeile--
        }
        if(floors[ebene+1]) {
            if(floors[ebene+1][zeile][spalte] === (temp-3)) { // nach oben
                temp = floors[ebene+1][zeile][spalte]
                floors[ebene+1][zeile][spalte] = "!"
                ebene++
            }
        }
        if(floors[ebene-1]) {
            if(floors[ebene-1][zeile][spalte] === (temp-3)) { // nach oben
                temp = floors[ebene-1][zeile][spalte]
                floors[ebene-1][zeile][spalte] = "!"
                ebene--
            }
        }
        if(temp > 0) {
            reverseSearching()
        }
    }
    reverseSearching()

    // Berechnete distanzen wieder mit "." überschreiben
    for(i of floors) {
        for(j of i) {
            for(k of i) {
                for(l of k) {
                    if(typeof(l) == "number") {
                        k[k.indexOf(l)] = "."
                    }
                }
            }
        }
    }
}

showPath(indexOfB);

// Ausgabe der Felder
for(i of floors) {
    for(j of i) {
        let tempText = "";
        for(k of j) {
            tempText += k;
        }
        console.log(tempText)
    }
    console.log("")
}

// Ausgabe der Zeit
if(time > 60) {
    console.log(`Ron braucht mindestens ${Math.floor(time/60)}min und ${time%60}s, um von A nach B zu kommen`)
} else {
    console.log(`Ron braucht ${time}s, um von A nach B zu kommen`)
}