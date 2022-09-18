/// <reference path="./node_modules/gojs/release/go.d.ts" />
/***************************/
/*		Global Scope		*/
/***************************/
const $ = go.GraphObject.make;
const diagram = new go.Diagram("diagram");
const button = document.getElementById("button");
const fileInputElement = document.getElementById("input");
/////////////////////////////////////////
/***********************/
/*		Pre-Runtime	   	*/
/***********************/
diagram.model = new go.GraphLinksModel([]);
const templateMap = new go.Map();
//	Text file node proto:
//	{	
//		key: String,			Name/title (custom)
//		text: String,			Text/body (custom)
//		category: "textFile" 	Category (fixed)
//	}	
let textFileTemplate = $(go.Node, "Auto", $(go.Shape, {
    fromLinkable: true,
    toLinkable: true,
    portId: "",
    figure: "RoundedRectangle",
    height: 317,
    width: 230,
    fill: "#909090"
}), $(go.Panel, "Vertical", {
    height: 297,
    width: 210,
    background: "#f5f5f5"
}, $(go.TextBlock, {
    text: "Title",
    font: "20px Permanent Marker, cursive",
    margin: new go.Margin(12, 5, 5, 5),
}, new go.Binding("text", "key")), $(go.TextBlock, {
    text: "Document's text",
    font: "7pt courier",
    spacingAbove: 5,
    maxLines: 20,
    margin: new go.Margin(0, 3, 0, 10),
    overflow: go.TextBlock.OverflowEllipsis,
}, new go.Binding("text"))));
//	Image file node proto:
//	{
//		key: String,			Name/label (custom)
//		sourceFile: String,		Base64 URL/Web URL (custom)
//		category: "imageFile"	Category (fixed)
//	}
let imageFileTemplate = $(go.Node, "Vertical", $(go.Panel, "Auto", {
    background: "#f5f5f5",
}, $(go.Shape, {
    fromLinkable: true,
    toLinkable: true,
    portId: "",
    figure: "RoundedRectangle",
    fill: "#909090",
    cursor: "pointer",
}), $(go.Picture, {
    margin: new go.Margin(10),
    imageStretch: go.GraphObject.Uniform
}, new go.Binding("source", "sourceFile"), new go.Binding("width"), new go.Binding("height"))), $(go.TextBlock, {
    text: "Label",
    font: "15px Permanent Marker, cursive",
    margin: new go.Margin(5, 5, 5, 5),
}, new go.Binding("text", "key")));
templateMap.add("textFile", textFileTemplate);
templateMap.add("imageFile", imageFileTemplate);
diagram.nodeTemplateMap = templateMap;
//						   //
//		File Management 	  //
//							 //
class elemFile {
    file;
    name;
    category;
    constructor(file, category) {
        this.file = file;
        this.name = file.name;
        this.category = category;
    }
    get type() {
        return (this.category.slice(0, -4));
    }
    get HTMLTitle() {
        const HTMLTitle = ElementToHTMLConverter.getHTMLTitle(this);
        return (HTMLTitle);
    }
}
let ElementToHTMLConverter = {
    getHTMLTitle(file) {
        const typeOfFile = file.type;
        const textOfTitle = this.capitalizeFilename(file.name);
        const HTMLTitle = this.converteToHTMLTitle(typeOfFile, textOfTitle);
        return (HTMLTitle);
    },
    converteToHTMLTitle(classOfTitle, textOfTitle) {
        return (`<h1 class="${classOfTitle}"><text>${textOfTitle}</h1>`);
    },
    capitalizeFilename(filename) {
        const capitalizedFirstLetter = filename.charAt(0)
            .toUpperCase();
        const remainingWoutExtension = filename.toLowerCase()
            .slice(1, -4);
        return (capitalizedFirstLetter + remainingWoutExtension);
    }
};
const Lists = {
    files: [],
    //	tmpLink: [],
    addToFileList(file) {
        this.files.push(file);
    },
    removeFromFileList(fileName) {
        const indexOfFile = this.findIndexOfFile(fileName);
        if (indexOfFile < 0)
            return;
        this.files.splice(indexOfFile, 1);
    },
    isInFileList(fileName) {
        const indexOfFile = this.findIndexOfFile(fileName);
        if (indexOfFile >= 0)
            return (true);
        return (false);
    },
    findFile(fileName) {
        const indexOfFile = this.findIndexOfFile(fileName);
        return (this.files[indexOfFile]);
    },
    findIndexOfFile(fileName) {
        const result = this.files.findIndex(file => fileName === file.name);
        return (result);
    }
    /*
    addToTmpLinkList(object) {
        const key = object.data.key;
        this.tmpLink.push(key);
    },

    clearTmpLinkList() {
        this.tmpLink.length = 0;
    },

    get numberOfLinkInTmp() {
        return this.tmpLink.length;
    },

    get fromTmpLinkKey() {
        return this.tmpLink[0];
    },

    get toTmpLinkKey() {
        return this.tmpLink[1];
    }*/
};
let getFileFrom = (inputElement) => {
    let file = inputElement.files[0];
    return (file);
};
let resetFileInput = (inputElement) => {
    inputElement.value = '';
};
//////////////////////////////////////////////////////////
/*******************/
/*		Runtime		*/
/*******************/
button.addEventListener("click", () => fileInputElement.click());
fileInputElement.addEventListener("change", addFile);
diagram.addDiagramListener("ObjectDoubleClicked", deleteObject);
diagram.addDiagramListener("ObjectSingleClicked", visualisingProcess);
diagram.addDiagramListener("BackgroundSingleClicked", dumpVisualiser);
function addFile() {
    const fileToAdd = getFileFrom(fileInputElement);
    resetFileInput(fileInputElement);
    if (Lists.isInFileList(fileToAdd.name))
        return;
    if (fileToAdd.type == "text/plain")
        addTextFileToTheDiagram(fileToAdd);
    else if (fileToAdd.type.split('/')[0] == "image")
        addImageFileToTheDiagram(fileToAdd);
}
function deleteObject(elemSelection) {
    const object = elemSelection.subject.part;
    if (object instanceof go.Link)
        removeLinkFromTheDiagram(object);
    else if (object instanceof go.Node)
        removeFileNodeFromTheDiagram(object);
}
function visualisingProcess(elemSelection) {
    const object = elemSelection.subject.part;
    if (object instanceof go.Link)
        dumpVisualiser();
    else
        processFile(object.data.key);
}
function processFile(nameOfFile) {
    const fileToProcess = Lists.findFile(nameOfFile);
    visualiserGlobalObject.toProcess = fileToProcess;
}
function manageBackgroundClick() {
    if (visualiserGlobalObject.isChangingState)
        return;
    else
        dumpVisualiser();
}
function dumpVisualiser() {
    if (visualiserGlobalObject.cache.buffer === undefined)
        return;
    visualiserGlobalObject.dump();
}
function addTextFileToTheDiagram(textFile) {
    const newFile = new elemFile(textFile, "textFile");
    extractTextDataThen(newFile, addTextFileNodeToTheDiagram);
}
function addTextFileNodeToTheDiagram(textElemFile, textOfFile) {
    const newTextFileNode = createTextFileNode({ textElemFile, textOfFile });
    addFileNodeToTheDiagram(textElemFile, newTextFileNode);
}
let createTextFileNode = ({ textElemFile, textOfFile }) => {
    return {
        key: textElemFile.name,
        text: textOfFile,
        category: textElemFile.category
    };
};
function addImageFileToTheDiagram(imageFile) {
    const newElemFile = new elemFile(imageFile, "imageFile");
    extractImageDataThen(newElemFile, addImageFileNodeToTheDiagram);
}
function addImageFileNodeToTheDiagram(imageElemFile, imageData) {
    const newImage = new Image();
    newImage.onload = function () {
        const sizeOfImage = resizeImageProportionally(newImage.width, newImage.height, { width: 256, height: 144 });
        const newImageFileNode = createImageFileNode(imageElemFile, imageData, sizeOfImage);
        addFileNodeToTheDiagram(imageElemFile, newImageFileNode);
    };
    newImage.src = imageData;
}
function resizeImageProportionally(width, height, maxDimension) {
    const ratio = Math.min(maxDimension.width / width, maxDimension.height / height);
    return {
        width: width * ratio,
        height: height * ratio
    };
}
let createImageFileNode = (imageElemFile, imageData, sizeOfImage) => {
    return {
        key: imageElemFile.name,
        sourceFile: imageData,
        category: imageElemFile.category,
        width: sizeOfImage.width,
        height: sizeOfImage.height
    };
};
//						   //
//		Data Management 	  //
//							 //
//	Callback function of extractors proto :
//	function ({
//		file: 		instanceof elemFile	
//		fileData: 	any
//	}): void
//
function extractTextDataThen(elemFile, then) {
    const getTextOfFile = elemFile.file.text();
    getTextOfFile.then((textOfFile) => then(elemFile, textOfFile));
}
function extractImageDataThen(elemFile, then) {
    const reader = new FileReader();
    reader.onload = () => {
        let imageData = reader.result;
        then(elemFile, imageData);
    };
    reader.readAsDataURL(elemFile.file);
}
function addFileNodeToTheDiagram(elemFile, nodeToAdd) {
    Lists.addToFileList(elemFile);
    addNodeToTheDiagram(nodeToAdd);
}
function removeFileNodeFromTheDiagram(fileToDelete) {
    const fileName = fileToDelete.key;
    const elemFileToDelete = Lists.findFile(fileName);
    if (visualiserGlobalObject.cache.file == elemFileToDelete)
        visualiserGlobalObject.dump();
    Lists.removeFromFileList(fileName);
    removeNodeFromTheDiagram(fileToDelete);
}
// General object
// -	Node addition
function addNodeToTheDiagram(nodeToAdd) {
    const description = `Adding a new ${nodeToAdd.category} node to the diagram`;
    diagram.commit(() => {
        addNodeData(nodeToAdd);
    }, description);
}
let addNodeData = (nodeToAdd) => {
    diagram.model.addNodeData(nodeToAdd);
};
// -	Node deletion
function removeNodeFromTheDiagram(nodeToDelete) {
    const description = "Removing a node from the diagram and disconnecting its link(s).";
    diagram.commit(() => {
        if (nodeToDelete.category !== "imageFile")
            deleteConnectedLinkData(nodeToDelete);
        deleteNodeData(nodeToDelete);
    }, description);
}
let deleteNodeData = (nodeToDelete) => {
    diagram.model.removeNodeData(nodeToDelete);
};
/*	Dev Material
function addLinkToTheDiagram() {
    diagram.commit((diagram) => {
        const newLinkData = createLinkData(Lists.fromTmpLinkKey, Lists.toTmpLinkKey);
        diagram.model.addLinkData(newLinkData);
    }, "add new link");
}

let createLinkData = (fromSubject, toSubject) => {
    return { from: fromSubject, to: toSubject };
}*/
// -	Link deletion
function removeLinkFromTheDiagram(linkToDelete) {
    const description = "Removing a link from the diagram.";
    diagram.commit(() => {
        deleteLinkData(linkToDelete);
    }, description);
}
function deleteConnectedLinkData(node) {
    let extractedLinks = [];
    const linksToDelete = node.findLinksConnected();
    linksToDelete.each(link => extractedLinks.push(link));
    extractedLinks.forEach(linkToDelete => deleteLinkData(linkToDelete));
}
let deleteLinkData = (linkToDelete) => {
    diagram.model["removeLinkData"](linkToDelete);
};
//						   //
//		Visu Management 	  //
//							 //
class vBuffer {
    visu;
    buffer;
    constructor(thisVisu) {
        this.visu = thisVisu;
        this.buffer = undefined;
    }
    set file(file) {
        this.buffer = file;
    }
    get isNotEmpty() {
        if (this.buffer === undefined)
            return (false);
        return (true);
    }
    resetBuffer() {
        this.buffer = undefined;
    }
    isInBuffer(file) {
        return (this.buffer === file);
    }
    isNotInBuffer(file) {
        return (this.buffer !== file);
    }
}
class Visualiser {
    //	Utils
    state;
    isChangingState;
    cache;
    element;
    constructor(elementId) {
        this.state = "hidden";
        this.isChangingState = 0;
        this.cache = new vBuffer(this);
        this.element = document.getElementById(elementId);
        const bindedOnEndOfTransition = this.onEndOfTransition.bind(this);
        const bindedOnStartOfTransition = this.onStartOfTransition.bind(this);
        document.addEventListener("transitionend", bindedOnEndOfTransition);
        document.addEventListener("transitionstart", bindedOnStartOfTransition);
    }
    flick() {
        if (this.state === "displayed")
            this.startHideAnimation();
        else
            this.startDisplayAnimation();
    }
    onStartOfTransition() {
        this.startChangingState;
        if (this.isHidden)
            this.onStartOfDisplayTransition();
        else
            this.onStartOfHideTransition();
    }
    startChangingState() {
        this.isChangingState = 1;
    }
    onStartOfDisplayTransition() {
        this.state = "displayed";
    }
    onStartOfHideTransition() {
        this.state = "hidden";
    }
    onEndOfTransition() {
        this.endChangingState();
        if (this.isDisplayed)
            this.onEndOfDisplayTransition();
    }
    endChangingState() {
        this.isChangingState = 0;
    }
    onEndOfDisplayTransition() {
        this.visualiseFile();
    }
    set toProcess(elemFile) {
        if (this.isChangingState)
            this.dump();
        if (this.cache.isInBuffer(elemFile) && this.isDisplayed)
            this.dump();
        else {
            this.reset();
            this.cache.file = elemFile;
            this.loadNewFile();
        }
    }
    loadNewFile() {
        if (this.isHidden)
            this.startDisplayAnimation();
        else
            this.visualiseFile();
    }
    dump() {
        this.cache.resetBuffer();
        this.reset();
        this.startHideAnimation();
    }
    startDisplayAnimation() {
        this.element.style.flex = "1";
    }
    startHideAnimation() {
        this.element.style.flex = "0";
    }
    reset() {
        this.element.innerHTML = "";
    }
    get isDisplayed() {
        return (this.state === "displayed");
    }
    get isHidden() {
        return (this.state === "hidden");
    }
    //	"Vif du sujet"
    visualiseFile() {
        const fileToVisualise = this.cache.buffer;
        if (fileToVisualise === undefined)
            return;
        if (fileToVisualise.category === "textFile")
            this.visualiseTextFile(fileToVisualise);
        else if (fileToVisualise.category === "imageFile")
            this.visualiseImageFile(fileToVisualise);
    }
    // -	Text File utils
    visualiseTextFile(textElemFile) {
        const bindedPutTextFile = this.putText.bind(this);
        this.composeVue(textElemFile, extractTextDataThen, bindedPutTextFile);
    }
    putText(elemFile, textOfFile) {
        this.element.insertAdjacentHTML('beforeend', `<pre>${textOfFile}</pre>`);
    }
    // -	Image File utils
    visualiseImageFile(imageElemFile) {
        const bindedPutImageFile = this.putImage.bind(this);
        this.composeVue(imageElemFile, extractImageDataThen, bindedPutImageFile);
    }
    putImage(elemFile, imageData) {
        this.element.insertAdjacentHTML("beforeend", `<img src=${imageData}></img>`);
    }
    // -	General File utils
    composeVue(elemFile, extractFunction, bindedThen) {
        const HTMLTitle = elemFile.HTMLTitle;
        this.putTitle(HTMLTitle);
        extractFunction(elemFile, bindedThen);
    }
    putTitle(HTMLTitle) {
        this.element.insertAdjacentHTML("afterbegin", HTMLTitle);
    }
}
const visualiserGlobalObject = new Visualiser("visualiser");
