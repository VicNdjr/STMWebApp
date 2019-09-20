
function displaylines() {
    for (var i = 0; i < lines.length; i ++) {
        document.getElementById("allLines").innerHTML += '<li>' + lines[i].id + ' ' + lines[i].name + ' (' +
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
