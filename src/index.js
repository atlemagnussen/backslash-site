import About from "./components/about/about.js";
import Blog from "./components/blog/blog.js";
import EsTree from '../node_modules/es6-tree/src/es6tree.js';
import React from "react";
import ReactDOM from "react-dom";
import Router from "./services/router.js";
import treeconfig from './services/treeconfig.js';

const TIMEOUT = 200;
const SCROLLTOP = 50;
const MOBILEHIDETIMEOUT = 100;

class Index {
    constructor() {
        treeconfig.get().
            then((config) => {
                this.config = config;
                this.init(config);
            });
    }

    renderAbout() {
        const viewEl = document.getElementById('view');

        ReactDOM.render(
            React.createElement(Blog, {"id": "about"}, null),
            viewEl
        );
    }
    init(config) {

        this.tree = new EsTree("treeview", config.config, config.nodes);
        this.tree.open('root');
        this.tree.on("select", (node) => {
            if (node.id && !node.children) {
                this.router.navigate(`/blog/${node.id}`);
                setTimeout(() => {
                    this.toggleMenu();
                }, TIMEOUT);
            }
        });

        document.addEventListener('blogIdChanged', (ev) => {
            this.tree.select(ev.detail.id);
        });

        const routerConfig = [{
            "path": "/",
            "init": this.renderAbout
        },
        {
            "path": "/blog",
            "content": `<p>Welcome to blog!</p>`,
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

        this.section = document.getElementById('section');
        this.section.addEventListener('scroll', (ev) => {
            if (ev.target.scrollTop > SCROLLTOP) {
                this.wholeScreen.classList.add('scrolled');
            } else {
                this.wholeScreen.classList.remove('scrolled');
                this.dontToggle = true;
                setTimeout(() => {
                    this.wholeScreen.classList.add('mobile-hidden');
                }, MOBILEHIDETIMEOUT);
            }
        });

        // window.scrollTo(0, 1);

        // this.registerServiceWorker();
        this.unregisterServiceWorker();
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
        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            Reflect.apply(requestFullScreen, doc);
        } else {
            Reflect.apply(cancelFullScreen, doc);
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').
                    then((registration) => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, (err) => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }
    }

    unregisterServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().
                then((registrations) => {
                    for (const registration of registrations) {
                        registration.unregister();
                    }
                }).
                catch((err) => {
                    console.log('Service Worker registration failed: ', err);
                });
        }
    }
}

export default new Index();
