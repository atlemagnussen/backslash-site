import Home from "./views/Home.svelte";
import About from "./views/About.svelte";
import Blog from "./views/Blogs.svelte";

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
    },
    {
        path: "blog",
        name: "Blog",
        component: Blog,
    }
];
