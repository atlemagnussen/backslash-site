<script>
    import { onDestroy } from "svelte"; //onMount
    import blogService from "../services/blogService.js";
    import { blogId } from "../store";
    let id = "";
    let tocHtml = "";
    let getToc = async () => {
        const blogHtml = await blogService.getHtml(id);
        tocHtml = await blogService.getToc(blogHtml);
    };
    const unsubscribe = blogId.subscribe(value => {
        id = value;
        getToc();
    });

    onDestroy(unsubscribe);
</script>

<div id="toc-container">
    <div id="toc-menu">{@html tocHtml}</div>
</div>