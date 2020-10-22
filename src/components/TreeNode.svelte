<script>
    import { onMount } from "svelte";
    import { blogId } from "../store";
    import Link from "../components/Link.svelte";
    export let configNode;
    import treeconfig from "../services/treeconfig.js";
    let articleTree;
    let spanNode;
    onMount(async () => {
        articleTree = await treeconfig.get();
    });
    $: if (spanNode) css();

    const css = () => {
        if (!spanNode)
            return;
        if (configNode.type && articleTree.config.types && articleTree.config.types.hasOwnProperty(configNode.type)) {
            const type = this.config.types[configNode.type];
            if (type.css) {
                const classes = type.css.split(' ');
                spanNode.classList.add(...classes);
            }
        } else if (configNode.children) {
            spanNode.classList.add("icon", "icon-file-directory");
        } else {
            spanNode.classList.add("icon", "icon-file");
        }
    }
</script>
<style>
    details {
        margin-left: 1rem;
        cursor: pointer;
    }
    details.leaf > summary{
        list-style: none;
    }
    details.leaf > summary::-webkit-details-marker {
        display: none;
    }
    .node-text::before {
        margin-right: 0.5rem;
    }
    span.selected {
        background-color: var(--selected-color);;
    }
    summary:hover {
        background: var(--hover-color);
    }

    span.node-text.icon-file::before {
        color: var(--main-color);
    }
</style>
{#if articleTree}
    <details class:leaf="{!configNode.children}" open={configNode.expanded}>
        <summary id="{configNode.id}">
            <span id="{configNode.id}" bind:this={spanNode} class="node-text" class:selected={$blogId == configNode.id}>
                
                {#if configNode.href}
                    <Link path={configNode.href} name={configNode.name} />
                {:else}
                    {configNode.name}
                {/if}

            </span>
        </summary>
        {#if configNode.children}
            {#each configNode.children as child}
                <svelte:self configNode={child} />
            {/each}
        {/if}
    </details>
{/if}