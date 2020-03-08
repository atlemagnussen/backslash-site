<script>
    import { onMount } from "svelte";
    import { curRoute } from "./store";
    import LeftNav from "./views/LeftNav.svelte";
    import Container from "./Container.svelte";
    import Link from "./components/Link.svelte"
    onMount(() => {
        curRoute.set(window.location.pathname);
        if (!history.state) {
            window.history.replaceState({ path: window.location.pathname }, "", window.location.href);
        }
    });
    const handlerBackNavigation = (event) => {
        curRoute.set(event.state.path);
    }
</script>

<svelte:window on:popstate="{handlerBackNavigation}" />
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
    <Link page="{{ path: '/about', name: 'About' }}" />
</aside>
<Container />
<aside class="right">
    <div id="toc-container"></div>
</aside>