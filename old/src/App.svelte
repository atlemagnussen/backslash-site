<script>
    import { onMount } from "svelte";
    import { curRoute, blogId } from "./store";

    const TIMEOUT = 200;
    const SCROLLTOP = 50;
    const MOBILEHIDETIMEOUT = 100;

    import LeftNav from "./views/LeftNav.svelte";
    import Container from "./Container.svelte";
    import Toc from "./components/Toc.svelte";
    import Meta from "./components/Meta.svelte";

    import { writeToClipBoard } from "./services/clipboardService"
    
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

    document.addEventListener("click", (e) => {
        const target = e.target;
        if (target.tagName === "CODE") {
            e.preventDefault();
            const text = target.innerText;
            const parent = target.parentNode;
            if (parent.tagName == "PRE") {
                target.classList.add("flash")
                setTimeout(() => {
                    target.classList.remove("flash")
                }, 1000);
                console.log("code", target.outerHTML)
                writeToClipBoard(text);
            }
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
    </aside>
    <div class="view" id="view">
        <Container />
    </div>
    <aside class="right">
        <Toc></Toc>
    </aside>    
</section>
