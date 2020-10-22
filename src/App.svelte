<script>
    import { onMount } from "svelte";
    import { curRoute, blogId } from "./store";

    const TIMEOUT = 200;
    const SCROLLTOP = 50;
    const MOBILEHIDETIMEOUT = 100;

    import LeftNav from "./views/LeftNav.svelte";
    import Container from "./Container.svelte";
    import Link from "./components/Link.svelte"
    import Toc from "./components/Toc.svelte";
    import Meta from "./components/Meta.svelte";
    
    onMount(() => {
        curRoute.set(window.location.pathname);
        if (!history.state) {
            window.history.replaceState({ path: window.location.pathname }, "", window.location.href);
        }
    });
    const handlerBackNavigation = (event) => {
        curRoute.set(event.state.path);
    }
    
    const mainEl = document.querySelector("main#main");

    const toggleMenu = () => {
        mainEl.classList.toggle("mobile-hidden");
    }
    blogId.subscribe((val) => {
        setTimeout(() => {
            toggleMenu();
        }, TIMEOUT);
        const viewEl = document.querySelector("div#view");
        if (viewEl) {
            viewEl.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            });
        }
    });
</script>

<svelte:window on:popstate="{handlerBackNavigation}" />
<Meta />
<header>
    <div class="headerline" id="headerline">
        <div class="menu-button" id="menu-button" on:click="{toggleMenu}">
            <svg xmlns="http://www.w3.org/2000/svg">
                <use xlink:href="#menu-icon" fill="white">
            </svg>
        </div>
        <a href="/" class="headline"><img src="https://storage.googleapis.com/backslash-project.appspot.com/static/backslash-logo.png" alt="backslash logo"></a>
        <a href="/"><div class="subtitle">\</div></a>
    </div>
</header>

<section id="section">
    <aside id="left" class="left mobile-hidden">
        <LeftNav />
        <ul class="external-links">
            <li>
                <a href="https://twitter.com/atlemagnussen?ref_src=twsrc%5Etfw" target="_blank" rel="noreferrer noopener">
                    <svg xmlns="http://www.w3.org/2000/svg">
                        <use xlink:href="#twitter-icon" fill="white">
                    </svg>
                </a>
            </li>
            <li>
                <a href="https://tilde.zone/@avm" target="_blank" rel="me noreferrer noopener">
                    <svg xmlns="http://www.w3.org/2000/svg">
                        <use xlink:href="#mastodon-icon" fill="white">
                    </svg>
                </a>
            </li>
            <li>
                <a href="https://github.com/atlemagnussen" target="_blank" rel="me noreferrer noopener">
                    <svg xmlns="http://www.w3.org/2000/svg">
                        <use xlink:href="#github-icon" fill="white">
                    </svg>
                </a>
            </li>
        </ul>
    </aside>
    <div class="view" id="view">
        <Container />
    </div>
    <aside class="right">
        <Toc></Toc>
    </aside>    
</section>
