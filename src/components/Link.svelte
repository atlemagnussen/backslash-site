<script>
    import router from "../router.js";
    export let page;

    const redirectTo = (event) => {
        router.to(event.currentTarget.pathname)
    }
</script>

<style>
    a {
        padding: 1rem;
        color: var(--secondary-text);
    }
</style>

<a href={page.path} on:click|preventDefault={redirectTo}>
    <slot>{page.name}</slot>
</a>
