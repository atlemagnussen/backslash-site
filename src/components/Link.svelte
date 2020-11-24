<script>
    import router from "../router.js";
    export let path, name;

    const redirectTo = (event) => {
        router.to(event.currentTarget.pathname)
    }
</script>

<style>
    a {
        color: var(--secondary-text);
    }
</style>

<a href={path} on:click|preventDefault={redirectTo}>
    <slot>{name}</slot>
</a>
