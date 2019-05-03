import React from "react";
import ReactDOM from "react-dom";

export class Route {
    constructor(path, content, init, subRoute, reactComponent) {
        if (!path) {
            throw new Error("Route can't work without a path");
        }
        this.path = path;

        if (reactComponent) {
            this.reactComponent = reactComponent;
        } else if (content) {
            this.content = content;
        } else {
            this.content = `<h1>Content for ${path}</h1><h2>Enjoy your stay</h2>`;
        }

        if (init) {
            this.init = init;
        }

        if (subRoute) {
            this.subRoute = new Route(subRoute.path, subRoute.content, subRoute.init, subRoute.subRoute, subRoute.reactComponent);
        }
    }
}

export default class Router {
    constructor(config) {
        this.config = config;
        this.routes = [];
        this.config.forEach((c) => {
            const route = new Route(c.path, c.content, c.init, c.subRoute, c.reactComponent);

            c.route = route;
            this.routes.push(route);
        });

        const view = document.getElementById('view');

        if (!view) {
            throw new Error("Need a view");
        }
        this.view = view;

        const activeRoutes = Array.from(document.querySelectorAll('[route]'));

        activeRoutes.forEach((route) => {
            route.addEventListener('click', (e) => {
                this.onClickRoute(e);
            }, false);
        });

        window.onpopstate = (event) => {
            console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
            console.log(`window.location.pathname=${window.location.pathname}`);
            this.navigate(window.location.pathname, true);
        };

        this.navigate(window.location.pathname, true);

        document.addEventListener('routeChange', (e) => {
            this.navigate(e.detail.route);
        });
    }

    pathBreaker(path) {
        const slashes = path.match(/\//ig) || [];

        if (slashes.length === 0) {
            return {"main": "/"};
        } else if (slashes.length === 1) {
            return {"main": path};
        }

        let pathSplit = path.split('/');

        pathSplit = this.clearEmptyElementsInArray(pathSplit);
        const fullPath = `/${pathSplit.join('/')}`;
        const mainPath = `/${pathSplit.splice(0, 1)}`;

        return {
            "main": mainPath,
            "params": pathSplit,
            "full": fullPath
        };
    }
    onClickRoute(event) {
        const routePath = event.target.attributes[0].value;

        this.navigate(routePath);
    }

    clearEmptyElementsInArray(arr) {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (!arr[i]) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }
    navigate(routePath, notPushHistory) {
        const routeObj = this.pathBreaker(routePath);

        const route = this.routes.find((r) => r.path === routeObj.main);

        if (route) {
            if (!notPushHistory) {
                if (routeObj.full) {
                    if (route.subRoute.reactComponent) {
                        window.history.pushState({"path": route.subRoute.path}, this.getNameFromPath(routeObj.full), routeObj.full);
                    } else {
                        window.history.pushState(route.subRoute, this.getNameFromPath(routeObj.full), routeObj.full);
                    }
                } else if (route.reactComponent) {
                    window.history.pushState({"path": route.path}, this.getNameFromPath(route.path), route.path);
                } else {
                    window.history.pushState(route, this.getNameFromPath(route.path), route.path);
                }
            }

            if (route.subRoute && routeObj.params && routeObj.params.length > 0) {
                if (route.subRoute.reactComponent) {
                    const component = route.subRoute.reactComponent;
                    const param = routeObj.params[0];

                    ReactDOM.render(
                        React.createElement(component, {"id": param}, null),
                        this.view
                    );
                } else if (route.subRoute.content) {
                    let content = route.subRoute.content;

                    for (let i = 0; i < routeObj.params.length; i++) {
                        content = content.replace(`{${i}}`, routeObj.params[i]);
                    }
                    this.view.innerHTML = content;
                }
            } else if (route.reactComponent) {
                ReactDOM.render(<route.reactComponent/>, this.view);
            } else if (route.content) {
                this.view.innerHTML = route.content;
            } else {
                this.view.innerHTML = `You have clicked the ${route.path} route`;
            }

            if (route.init) {
                route.init();
            }
        } else {
            window.history.pushState({}, '', 'error');
            this.view.innerHTML = 'No route exists with this path';
        }
    }

    getNameFromPath(path) {
        const pathSplit = path.split('/');

        if (pathSplit[pathSplit.length - 1]) {
            return pathSplit[pathSplit.length - 1];
        }
        return "root";
    }
}
