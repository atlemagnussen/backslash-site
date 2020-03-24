
<script>
    import { onMount } from "svelte"; //onDestroy 
    import { blogId } from "../store";
    import blogService from "../services/blogService.js";
    export let id;
    let blogHtml = "";
    let getBlog = async () => {
        blogHtml = await blogService.get(id);
        blogId.set(id);
        
        const metaDescription = document.querySelector("meta[name='description']");
        if (metaDescription) {
            var blogDesc = await blogService.getArticleDescription(id);
            metaDescription.setAttribute("content", `Backslash.site - ${blogDesc}`);
        }
    }
    onMount(async () => {
        //blogHtml = await getBlog(id)
    });
    $: if (id) {
        getBlog(id);
    }
</script>

<article id="{id}">{@html blogHtml}</article>