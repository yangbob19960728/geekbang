var assert = require("assert");
import {parserHTML} from "../src/parser";

describe("parse html: ", () => {
    it("<a></a>", () => {
        let tree = parserHTML("<a></a>");
        // console.log(tree);
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    })
    it('<a href="//google.com"></a>', () => {
        let tree = parserHTML('<a href="//google.com"></a>');
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].attributes[0].name, "href");
        assert.equal(tree.children[0].attributes[0].value, "//google.com");
        assert.equal(1, 1);
    })

    it('<a href="//google.com"></a>', () => {
        let tree = parserHTML('<a href="//google.com"></a>');
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].attributes[0].name, "href");
        assert.equal(tree.children[0].attributes[0].value, "//google.com");
    })

    it('<a href="//google.com" id></a>', () => {
        let tree = parserHTML('<a href="//google.com"></a>');
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].attributes[0].name, "href");
        assert.equal(tree.children[0].attributes[0].value, "//google.com");
    })

    it('<a href=\'google.com\' id></a>', () => {
        let tree = parserHTML('<a href=\'google.com\' id></a>');
        assert.equal(tree.children.length, 0);
    })

    it('<a href></a>', () => {
        let tree = parserHTML('<a href></a>');
        console.log(tree.children[0].attributes);
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].attributes[0].name, "href");
        assert.equal(tree.children[0].attributes[0].value, "");
        assert.equal(1, 1);
    })

    it('<a href id></a>', () => {
        let tree = parserHTML('<a href id></a>');
        console.log(tree.children[0].attributes);
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].attributes[0].name, "href");
        assert.equal(tree.children[0].attributes[0].value, "");
        assert.equal(tree.children[0].attributes[1].name, "id");
        assert.equal(tree.children[0].attributes[1].value, "");
        assert.equal(1, 1);
    })

    it('<a id=asdas ></a>', () => {
        let tree = parserHTML('<a id=asdas ></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    })

    it('<a   id=asdas ></a>', () => {
        let tree = parserHTML('<a   id=asdas ></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    })

    it('<a   id=asdas > asd sad</a>', () => {
        let tree = parserHTML('<a   id=asdas > asd sad</a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 1);
    })

    it('<>', () => {
        let tree = parserHTML('<>');
    })

    it('<img/>', () => {
        let tree = parserHTML('<img/>');
        console.log(tree);
        assert.equal(tree.children[0].tagName, "img");
        assert.equal(1, 1);
    })

    it('<img /> a', () => {
        let tree = parserHTML('<img />');
        console.log(tree);
        assert.equal(tree.children[0].tagName, "img");
        assert.equal(1, 1);
    })

    it('<img src=asd/>', () => {
        let tree = parserHTML('<img src=asd/>');
        console.log(tree);
        assert.equal(tree.children[0].tagName, "img");
        assert.equal(1, 1);
    })

    it('<img src="asd" />', () => {
        let tree = parserHTML('<img src="asd" />');
        console.log(tree);
        assert.equal(tree.children[0].tagName, "img");
        assert.equal(1, 1);
    })

    it('<img src= "asd" />', () => {
        let tree = parserHTML('<img src= "asd" />');
        console.log(tree);
        assert.equal(tree.children[0].tagName, "img");
        assert.equal(1, 1);
    })

    it('<img src=\'asd\' />', () => {
        let tree = parserHTML('<img src=\'asd\' />');
        assert.equal(tree.children.length, 0);
    })

    it('<img src= \'asd\' />', () => {
        let tree = parserHTML('<img src= \'asd\' />');
        assert.equal(tree.children.length, 0);
    })

    it('<style src= \'asd\' ></>', () => {
        let tree = parserHTML('<style src= \'asd\' ></>');
        console.log(tree);
        assert.equal(tree.children.length, 0);
    })

    // it('<style> .asd {  color: "red"}</style>', () => {
    //     let tree = parserHTML('<style> .asd {  color: "red"}</style>');
    //     console.log(tree);
    //     assert.equal(tree.children.length, 0);
    // })




})