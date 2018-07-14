import { ipcRenderer } from "electron";
import { QifFile } from "./Models/QifFile";

const tableElement = document.getElementById("table") as HTMLTableElement;
const btnReverseAllElement = <HTMLTableElement>document.getElementById("btnReverseAll");

btnReverseAllElement.onclick = changeWholeFile;

let targetFile: QifFile;
let targetFilename: string;

ipcRenderer.on("load", (e, text: string, file: QifFile) => {
    document.title = text;
    targetFile = file;
    targetFilename = text;

    targetFile.lines.forEach((line) => {
        const row = tableElement.insertRow();
        line.details.forEach((detail) => {
            const cell = row.insertCell();
            cell.innerHTML = detail.value;
            changeRowColor(cell, row);
            cell.onchange = () => { 
                detail.value = cell.innerHTML; 
                changeRowColor(cell, row);
            };
        });
        row.insertCell().appendChild(createButton(row));
    });
});

function changeRowColor(cell: HTMLTableCellElement, row: HTMLTableRowElement) {
    if((+cell.innerHTML) < 0) {
        row.classList.add("red");
        row.classList.add("lighten-4");
    }
    else {
        row.classList.remove("red");
        row.classList.remove("lighten-4");
    }
}

ipcRenderer.on("close", () => {
    ipcRenderer.send("update:file", targetFile, targetFilename);
});

function changeWholeFile(){
    for(let i = 1; i < tableElement.rows.length; i++){
        (tableElement.rows[i].cells[3].firstChild as HTMLLinkElement).onclick(null);
    }
}

function createButton(row: HTMLTableRowElement): HTMLElement {
    const btnElement = document.createElement("a");
    const iconElement = document.createElement("i");

    iconElement.classList.add("material-icons");
    iconElement.classList.add("small");
    iconElement.innerHTML = "autorenew";
    btnElement.onclick = () => {
        row.cells[2].innerHTML = (-row.cells[2].innerHTML).toString();
        row.cells[2].onchange(null);
    };
    btnElement.classList.add("btn-floating");
    btnElement.classList.add("btn-small");
    btnElement.appendChild(iconElement);

    return btnElement;
}
