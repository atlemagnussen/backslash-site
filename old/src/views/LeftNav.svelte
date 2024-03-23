<script>
    import { onMount } from "svelte";
    import TreeNode from "../components/TreeNode.svelte";
    import treeconfig from "../services/treeconfig.js";
    let articleTree = { "rootUrl": "/articles/", nodes: []};
    const buildTree = async () => {
        articleTree = await treeconfig.get();
    }
    let tree;
    onMount(() => {
        buildTree();
    });
    

</script>

<nav id="treeview" class="treeview">
    {#each articleTree.nodes as node}
        <TreeNode configNode={node} />
    {/each}
</nav>
