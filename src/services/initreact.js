import About from "./components/about/about.js";
import React from "react";
import ReactDOM from "react-dom";
const viewEl = document.getElementById('view');

export default class initReact {
    do() {
        ReactDOM.render(<About/>, viewEl);
    }
}
