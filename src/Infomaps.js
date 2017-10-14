"use strict";

function createInfomaps(text) {
    return replaceContainers(text).join("\n");
};

function findAllContainers(text) {
    let containers = [];
    let container = {};
    for (let i=0;i<text.length;i++) {
        if((/^:::infomap\s*/gi).test(text[i])) {
            container.startLine = i;
        } else if ((/^:::\s*/gi).test(text[i]) && container.startLine ) {
            container.endLine = i;
            containers.push(container);
            container = {};
        }
    }
    return containers;
}

function convertToTable(container, textStrings) {
    textStrings[container.startLine] = '<table class="infomap">';
    for (let i=container.startLine+1;i<container.endLine;i++) {
        textStrings[i] = convertLinkToRow(textStrings[i]);
    }
    textStrings[container.endLine] = '</table>';
    return textStrings.slice(container.startLine, container.endLine + 1);
}

function replaceContainers(text) {
    let textStrings = text.split("\n");
    let containers = findAllContainers(textStrings);
    containers.forEach(function(item) {
        let convertedContainer = convertToTable(item, textStrings);
        textStrings.splice(item.startLine, convertedContainer.length, ...convertedContainer);
    });
    return textStrings;
}

function convertLinkToRow(link) {
    if (/^\[\]/gi.test(link)) {
        link = link.replace("[]", "[Title of a note]");
    }
    return link.replace(/^\[(.*?)\](.*)/gim, '<tr><td class="infomap label">$1</td><td class="infomap content">' + 
        '<div class="content">[]$2<div class="bottom-hr"><hr /></div></div></td></tr>');
}

module.exports = {
    createInfomaps: createInfomaps,
    _containers: findAllContainers,
    _containerToTable: convertToTable,
    _containersToTable: replaceContainers,
    _convertLinkToRow: convertLinkToRow
};