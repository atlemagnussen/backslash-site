
<script>
    import { onMount } from "svelte"; //onDestroy 
    import { blogId } from "../store";
    import blogService from "../services/blogService.js";
    export let id;
    let blogHtml = "";
    let getBlog = async () => {
        blogHtml = await blogService.get(id);
        blogId.set(id);
        
        const blogMetaData = await blogService.getArticleMetaData(id);
        document.title = `Backslash.site - ${blogMetaData.name}`;

        const metaDescription = document.querySelector("meta[name='description']");
        if (metaDescription) {
            metaDescription.setAttribute("content", `Backslash.site - ${blogMetaData.desc}`);
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