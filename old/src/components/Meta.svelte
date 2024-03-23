<script>
    import { blogId } from "../store";
    import blogService from "../services/blogService.js";
    let metadata = {};
    blogId.subscribe((id) => {
        if (id) getMeta(id);
    });
    let getMeta = async (id) => {
        metadata = await blogService.getArticleMetaData(id);
    };
</script>

<svelte:head>

    {#if metadata.name}
        <title>Backslash.site - {metadata.name}</title>
    {:else}
        <title>Backslash.site</title>
    {/if}

    {#if metadata.id}
        <link rel="canonical" href="https://www.backslash.site/blog/{metadata.id}">
    {:else if metadata.canonical}
        <link rel="canonical" href="https://www.backslash.site{metadata.canonical}">
    {:else}
        <link rel="canonical" href="https://www.backslash.site">
    {/if}

    {#if metadata.desc}
        <meta name="description" content="{metadata.desc}" />
    {:else}
        <meta name="description" content="Backslash.site is a technical blog about web development, operating systems and network">
    {/if}
</svelte:head>