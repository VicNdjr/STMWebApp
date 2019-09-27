
function displaylines() {
    for (var i = 0; i < lines.length; i ++) {
        document.getElementById("allLines").innerHTML += '<li id="line-' + lines[i].id + '-' + lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
            lines[i].direction + ')' + '</li>';

        if (lines[i].category === 'local'){
            document.getElementById("localLines").innerHTML += '<li>' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }

        else if (lines[i].category === 'night'){
            document.getElementById("nightLines").innerHTML += '<li>' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }
        else if (lines[i].category === 'express'){
            document.getElementById("expressLines").innerHTML += '<li>' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }

        else if (lines[i].category === 'dedicated'){
            document.getElementById("shuttleLines").innerHTML += '<li>' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }

        else if (lines[i].category === 'shuttleOr'){
            document.getElementById("shuttleOrLines").innerHTML += '<li>' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }

        console.log(lines[i].category);
    }


}

function openLine(line) {
    console.log(line);
    var splitted = line.split("-");
    console.log(splitted);
    displayOneLine(splitted[1], splitted[2])
}

function displayOneLine(lineId, direction) {
    let line;
    for (line of lines)
        if (line.id === lineId && line.direction === direction)
            document.getElementById("chosenLine").innerText = line.id + ' '+ line.name + ' ' + line.direction;
    let dir;
    if (direction.charAt(0) === "O")
        dir = 'W';
    else
        dir = direction.charAt(0);

    const str = lineId + '-' + dir;
    for (let line in stops) {
        if (line === str) {
            console.log("Found " + str);
            console.log(stops[line]);
            document.getElementById("allStops").innerHTML = '';
            for (let i = 0; i < stops[line].length; i++){
                document.getElementById("allStops").innerHTML += '<tr> <td class="stop">' + stops[line][i].name+
                    '</td>' + '<td class="code">' + stops[line][i].id + '<td class="time"><a href="#times-tab">[...]</a></td> <td class="fav">+</td>';
            }
        }
    }
}
