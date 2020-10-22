<script>
    import { onMount } from "svelte";
    import router from "../router.js";
    import TreeNode from "../components/TreeNode.svelte";
    import treeconfig from "../services/treeconfig.js";
    let articleTree = { "rootUrl": "/articles/", nodes: []};
    const buildTree = async () => {
        articleTree = await treeconfig.get();
        // tree = new EsTree("treeview", articleTree.config, articleTree.nodes);
        // tree.on("select", (node) => {
        //     if (node.id && !node.children) {
        //         const path = `/blog/${node.id}`;
        //         router.to(path);
        //     }
        // });
    }
    let tree;
    onMount(() => {
        buildTree();
    });
    

    // document.addEventListener("blogIdChanged", async (ev) => {
    //     tree.select(ev.detail.id);
    //     const node = await treeconfig.findNode(ev.detail.id);

    //     this.setDocumentTitle(node.name);

    //     const viewEl = document.getElementById("view");

    //     viewEl.scrollTo({
    //         top: 0,
    //         left: 0,
    //         behavior: "auto"
    //     });
    // });
</script>

<nav id="treeview" class="treeview">
    {#each articleTree.nodes as node}
        <TreeNode configNode={node} />
    {/each}
</nav>
