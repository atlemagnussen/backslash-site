import React from "react";

export default class TocComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            "input": "",
            "content": ""
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.input !== prevProps.input) {
            this.parseArticle(this.props.input);
        }
    }

    componentDidMount() {
    }

    async parseArticle(input) {
        const temp = document.createElement("div");

        try {
            temp.innerHTML = input;
            const menuConfig = this.parse(temp, 1, 3);
            const menuHtml = this.generateMenu(menuConfig);

            this.setState({
                "content": menuHtml
            });
        } catch (err) {
            temp.innerHTML = JSON.stringify(err);
        }
    }
    generateMenu(conf) {
        let html = "<ul class='toc-list'>";

        for (let i = 0; i < conf.length; i++) {
            const c = conf[i];

            html += `<li><a class="${c.tag}" href="#${c.id}">${c.text}</a></li>`;
        }
        html += "</ul>";
        return html;
    }

    parse(artdom, hi, lo) {
        const htags = [];

        for (const el of artdom.children) {
            if (el.tagName.startsWith("H") && el.tagName.length === 2) {
                const num = parseInt(el.tagName.charAt(1), 10);

                if (!isNaN(num) && num >= hi && num <= lo) {
                    const id = el.getAttribute("id");

                    if (id) {
                        htags.push(
                            {
                                id,
                                "tag": el.tagName,
                                "text": el.innerText
                            });
                    }
                }
            }
        }

        return htags;
    }

    render() {

        return (
            <div id="toc-menu" dangerouslySetInnerHTML={this.wrapMarkupContent()}></div>
        );
    }

    wrapMarkupContent() {
        return {"__html": this.state.content};
    }
}
