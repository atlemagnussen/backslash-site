
<script>
    import { onMount } from "svelte"; //onDestroy 
    import { blogId } from "../store";
    import blogService from "../services/blogService.js";
    export let id;
    let blogHtml = "";
    let getBlog = async () => {
        blogHtml = await blogService.get(id);
        blogId.set(id);
        
        blogService.setMetaData(id);
    }
    onMount(async () => {
        //blogHtml = await getBlog(id)
    });
    $: if (id) {
        getBlog(id);
    }
</script>

<article id="{id}">{@html blogHtml}</article>