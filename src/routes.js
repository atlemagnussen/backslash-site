import Home from "./views/Home.svelte";
import About from "./views/About.svelte";

export default [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "about",
        name: "About",
        component: About,
    }
];
