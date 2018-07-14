import { ipcRenderer } from "electron";
import { QifFile } from "./Models/QifFile";

const tableElement = <HTMLTableElement>document.getElementById("table");
let targetFile: QifFile;
let targetFilename: string;

ipcRenderer.on("load", (e, text: string, file: QifFile) => {
    document.title = text;
    targetFile = file;
    targetFilename = text;

    targetFile.lines.forEach(line => {
        const row = tableElement.insertRow();
        line.details.forEach(detail => {
            const cell = row.insertCell();
            cell.innerHTML = detail.value;
            cell.onchange = () => { detail.value = cell.innerHTML; console.log(detail.value); }
        });
        row.insertCell().appendChild(createButton(row));
    });
});

ipcRenderer.on("close", () => {
    ipcRenderer.send("update:file", targetFile, targetFilename);
});

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

    return btnElement
}