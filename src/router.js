import { curRoute } from "./store";

class Router {
    to(path) {
        curRoute.set(path);
        window.history.pushState({ path }, "", window.location.origin + path);
    }
}

export default new Router();