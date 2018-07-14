import { ipcRenderer, remote } from "electron";
import { XlsQifParseManager } from "./Managers/XlsQifParseManager";
import { QifDetailType } from "./Models/QifDetail";
import { QifFile, QifFileType } from "./Models/QifFile";
import { IXlsQifSchema } from "./Parsers/IXlsQifSchema";
import { SheetQifParser } from "./Parsers/SheetQifParser";
import { XlsQifParser } from "./Parsers/XlsQifParser";

const dialog = remote.dialog;
const fileListElement = document.getElementById("fileList");
const btnAddElement = document.getElementById("btnAdd");
const btnClearElement = document.getElementById("btnClear");
const btnSaveElement = document.getElementById("btnSave");
const schema: IXlsQifSchema = {};
schema[0] = QifDetailType.D;
schema[1] = QifDetailType.P;
schema[2] = QifDetailType.T;

const manager = new XlsQifParseManager(new XlsQifParser(new SheetQifParser(schema)));

btnAddElement.onclick = addNewFile;
btnClearElement.onclick = removeAllListItems;
btnSaveElement.onclick = save;

const fileList: { [id: string]: QifFile; } = {};

function checkSave() {
    if (fileListElement.firstChild) {
        btnSaveElement.classList.remove("disabled");
        btnSaveElement.classList.add("pulse");
    } else {
        btnSaveElement.classList.add("disabled");
        btnSaveElement.classList.remove("pulse");
    }
}

function save() {
    dialog.showSaveDialog(
        {
            filters: [{name: "Qif format", extensions: ["qif"]}],
        },
        (filename: string) => {
            const files: QifFile[] = [];

            for (const id in fileList) {
                if(fileList.hasOwnProperty(id)){
                    files.push(fileList[id]);
                }
            }

            manager.convertFiles(files, filename);
        },
    );
}

function addNewFile() {
    dialog.showOpenDialog(
        {
            filters: [{ name: "Excel (xlsx)", extensions: ["xlsx"] }],
            properties: ["multiSelections"],
        },
        (filePaths) => {
            importFiles(filePaths);
        },
    );
}

function importFiles(filePaths: string[]) {
    filePaths.forEach((filePath) => {
        const file = manager.import(filePath, QifFileType.Bank);
        importFile(filePath, file);
    });
    checkSave();
}

function importFile(filename: string, file: QifFile) {
    fileList[filename] = file;
    fileListElement.appendChild(createNewListItemElement(filename, file));
}

function removeListItem(item: HTMLElement) {
    fileListElement.removeChild(item);
    checkSave();
}

function removeAllListItems() {
    while (fileListElement.firstChild) {
        removeListItem(fileListElement.firstChild as HTMLElement);
    }
}

function createNewListItemElement(text: string, file: QifFile): HTMLElement {
    const linkElement = document.createElement("a");
    const listItemElement = document.createElement("li");
    const removeBtnElement = createRemoveButton(listItemElement);

    linkElement.innerHTML = text;
    linkElement.onclick = () => ipcRenderer.send("window:detail", text, fileList[text]);
    linkElement.href = "#!";
    listItemElement.appendChild(removeBtnElement);
    listItemElement.appendChild(linkElement);
    listItemElement.classList.add("collection-item");

    return listItemElement;
}

function createRemoveButton(listItemElement: HTMLElement): HTMLElement {
    const removeBtnElement = document.createElement("a");
    const removeIcon = document.createElement("i");

    removeIcon.classList.add("material-icons");
    removeIcon.classList.add("small");
    removeIcon.innerHTML = "delete";
    removeBtnElement.onclick = () => removeListItem(listItemElement);
    removeBtnElement.classList.add("btn-floating");
    removeBtnElement.classList.add("btn-small");
    removeBtnElement.style.marginRight = "10px";
    removeBtnElement.appendChild(removeIcon);

    return removeBtnElement;
}

ipcRenderer.on("update:file", (e, file: QifFile, filename: string) => {
    fileList[filename] = new QifFile(file);
});
