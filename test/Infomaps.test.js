"use strict";

let assert = require("assert");
let Infomaps = require("../src/Infomaps");

suite("Infomaps Tests", function() {
    let textSingleContainer = [
        "This is a huge amount of text",
        "written especially for testing",
        "",
        "::: infomap",
        "[Summary title](include(z:1234567890123))",
        "[1st block](include(z:1234567890124))",
        "[2nd block](include(z:1234567890125))",
        "[3rd block](include(z:1234567890126))",
        "[4th block](include(z:1234567890127))",
        ":::"
    ].join("\n");

    let textTwoContainers = [
        "# Header",
        "::: infomap",
        "[Summary title](include(z:1234567890123))",
        ":::",
        "## Subheader",
        "::: infomap",
        "[1st block](include(z:1234567890124))",
        ":::",
        "### Footer"
    ].join("\n");

    let links = [
        "[Summary title](include(z:1234567890123))",
        "[1st block](include(z:1234567890124))",
        "[](include(z:1234567890127))"
    ];

    test("Find a single container", function() {
        let containers = Infomaps._containers(textSingleContainer.split("\n"));
        assert.equal(containers.length, 1);
        assert.equal(containers[0].startLine, 3);
        assert.equal(containers[0].endLine, 9);
    });

    test("Find two containers", function() {
        let containers = Infomaps._containers(textTwoContainers.split("\n"));
        assert.equal(containers.length, 2);
        assert.equal(containers[0].startLine, 1);
        assert.equal(containers[0].endLine, 3);
        assert.equal(containers[1].startLine, 5);
        assert.equal(containers[1].endLine, 7);
    });

    
    test("Wrap single container in a table", function() {
        let container = Infomaps._containers(textSingleContainer.split("\n"))[0];
        let actual = Infomaps._containerToTable(container, textSingleContainer.split("\n")).join("\n");
        let expected = [
            '<table class="infomap">', 
            '<tr><td class="infomap-label">Summary title</td><td>[](include(z:1234567890123))</td></tr>',
            '<tr><td class="infomap-label">1st block</td><td>[](include(z:1234567890124))</td></tr>',
            '<tr><td class="infomap-label">2nd block</td><td>[](include(z:1234567890125))</td></tr>',
            '<tr><td class="infomap-label">3rd block</td><td>[](include(z:1234567890126))</td></tr>',
            '<tr><td class="infomap-label">4th block</td><td>[](include(z:1234567890127))</td></tr>',
            '</table>'].join("\n");
        assert.equal(actual, expected);
    });

    test("Wrap two containers in tables", function() {
        let containers = Infomaps._containers(textTwoContainers.split("\n"));
        let expected  = [
            "# Header",
            '<table class="infomap">',
            '<tr><td class="infomap-label">Summary title</td><td>[](include(z:1234567890123))</td></tr>',
            "</table>",
            "## Subheader",
            '<table class="infomap">',
            '<tr><td class="infomap-label">1st block</td><td>[](include(z:1234567890124))</td></tr>',
            "</table>",
            "### Footer"
        ].join("\n");
        let actual = Infomaps._containersToTable(textTwoContainers).join("\n");
        assert.equal(actual, expected);
    });

    test("Convert link to table row", function() {
        links.forEach(function(link, index, array) {
            array[index] = Infomaps._convertLinkToRow(link);
        });
        let expected = [
            '<tr><td class="infomap-label">Summary title</td><td>[](include(z:1234567890123))</td></tr>',
            '<tr><td class="infomap-label">1st block</td><td>[](include(z:1234567890124))</td></tr>',
            '<tr><td class="infomap-label">Title of a note</td><td>[](include(z:1234567890127))</td></tr>'
        ];
        assert.equal(links.join("\n"), expected.join("\n"));
    });
    
});