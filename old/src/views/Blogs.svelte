<script>
    export let param;
    import Blog from "./Blog.svelte";
</script>

{#if param}
    <Blog id="{param}"></Blog>
{:else}
    <Blog id="about"></Blog>
{/if}