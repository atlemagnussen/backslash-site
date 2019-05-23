import Disqus from 'disqus-react';
import React from "react";
import ReactDOM from "react-dom";
import Toc from "../toc/toc.js";
import treeconfig from '../../services/treeconfig.js';

export default class BlogComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            "id": 0,
            "content": "initializing"
        };
        this.id = "blog-component";
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.fetchArticle(this.props.id);
            console.log(`updated to id ${this.props.id}`);
        }
    }

    componentDidMount() {
        this.fetchArticle(this.props.id);
        this.tocDiv = document.getElementById("toc-container");
    }

    renderToc(cont) {
        this.toc = ReactDOM.render(<Toc input={cont}/>, this.tocDiv);
    }

    async fetchArticle(id) {
        const converter = new showdown.Converter();
        const temp = document.createElement("div");

        try {
            const config = await treeconfig.get();
            const rootUrl = config.rootUrl;
            const text = await fetch(`${rootUrl}${id}.md`).then((r) => r.text());

            temp.innerHTML = converter.makeHtml(text);
            const codeElements = temp.querySelectorAll('code');

            this.renderToc(temp.innerHTML);
            if (codeElements && NodeList.prototype.isPrototypeOf(codeElements) && codeElements.length > 0) {
                codeElements.forEach((co) => {
                    Prism.highlightElement(co);
                });
            }
            document.dispatchEvent(new CustomEvent('blogIdChanged', {"detail": {id}}));
            this.setState({
                "content": temp.innerHTML,
                id
            });
        } catch (err) {
            temp.innerHTML = JSON.stringify(err);
        }
    }

    render() {
        const disqusShortname = 'backslash-site';

        const disqusConfig = {
            url: `https://www.backslash.site/blog/${this.state.id}`,
            identifier: this.state.id,
            title: this.state.id,
        };

        return (
            <article id="current-article" dangerouslySetInnerHTML={this.wrapMarkupContent()}></article>
        );
    }

    wrapMarkupContent() {
        return {"__html": this.state.content};
    }
}