import About from "./components/about/about.js";
import Blog from "./components/blog/blog.js";
import EsTree from "../node_modules/es6-tree/src/es6tree.js";
import React from "react";
import ReactDOM from "react-dom";
import Router from "./services/router.js";
import treeconfig from "./services/treeconfig.js";

const TIMEOUT = 200;
const SCROLLTOP = 50;
const MOBILEHIDETIMEOUT = 100;

class Index {
    constructor() {
        this.init();
    }

    renderAbout() {
        const viewEl = document.getElementById("view");

        ReactDOM.render(
            React.createElement(Blog, {"id": "about"}, null),
            viewEl
        );
    }
    async init() {
        const articleTree = await treeconfig.get();

        this.tree = new EsTree("treeview", articleTree.config, articleTree.nodes);
        this.tree.open("root");
        this.tree.on("select", (node) => {
            if (node.id && !node.children) {
                this.router.navigate(`/blog/${node.id}`);
                this.setDocumentTitle(node.name);
                setTimeout(() => {
                    this.toggleMenu();
                }, TIMEOUT);
            }
        });

        document.addEventListener("blogIdChanged", async (ev) => {
            this.tree.select(ev.detail.id);
            const node = await treeconfig.findNode(ev.detail.id);

            this.setDocumentTitle(node.name);

            const viewEl = document.getElementById("view");

            viewEl.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto"
            });
        });

        const routerConfig = [{
            "path": "/",
            "init": this.renderAbout
        },
        {
            "path": "/blog",
            "content": "<p>Welcome to blog!</p>",
            "subRoute": {
                "path": "/blog/:blogid",
                "reactComponent": Blog
            }
        },
        {
            "path": "/about",
            "reactComponent": About,
        }
        ];

        this.router = new Router(routerConfig);
        this.wholeScreen = document.getElementById("main");

        this.btnMenu = document.getElementById("menu-button");
        this.btnMenu.addEventListener("click", () => {
            this.dontToggle = false;
            this.toggleMenu();
        });

        this.section = document.getElementById("section");
        this.section.addEventListener("scroll", (ev) => {
            if (ev.target.scrollTop > SCROLLTOP) {
                this.wholeScreen.classList.add("scrolled");
            } else {
                this.wholeScreen.classList.remove("scrolled");
                this.dontToggle = true;
                setTimeout(() => {
                    this.wholeScreen.classList.add("mobile-hidden");
                }, MOBILEHIDETIMEOUT);
            }
        });

        // this.registerServiceWorker();
        this.unregisterServiceWorker();
    }
    setDocumentTitle(subTitle) {
        document.title = `Backslash.site - ${subTitle}`;
    }
    toggleMenu() {
        if (this.dontToggle) {
            this.dontToggle = false;
            return;
        }
        if (this.wholeScreen) {
            this.wholeScreen.classList.toggle("mobile-hidden");
        }
    }

    toggleFullScreen() {
        const doc = window.document;
        const docEl = doc.documentElement;
        const requestFullScreen = docEl.requestFullscreen;
        const cancelFullScreen = doc.exitFullscreen;

        if (!doc.fullscreenElement) {
            Reflect.apply(requestFullScreen, doc, []);
        } else {
            Reflect.apply(cancelFullScreen, doc, []);
        }
    }

    registerServiceWorker() {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("/sw.js").
                    then((registration) => {
                        console.log("ServiceWorker registration successful with scope: ", registration.scope);
                    }, (err) => {
                        console.log("ServiceWorker registration failed: ", err);
                    });
            });
        }
    }

    unregisterServiceWorker() {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().
                then((registrations) => {
                    for (const registration of registrations) {
                        registration.unregister();
                    }
                }).
                catch((err) => {
                    console.log("Service Worker registration failed: ", err);
                });
        }
    }
}

export default new Index();
