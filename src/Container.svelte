<script>
    import { onDestroy } from "svelte";
    import { curRoute } from "./store";
    import routes from "./routes";
    import pathBreaker from "./services/pathBreaker.js";

    let routeName, component, param;

    const findComponent = (name) => {
        const r = routes.filter(r => r.path === name);
        if (!r || r.length === 0)
            return routes[0].component;
        return r[0].component;
    };

    const unsubscribe = curRoute.subscribe(value => {
        var route = pathBreaker.getRoute(value);
        component = findComponent(route.name);
        param = route.param;
    });

    onDestroy(unsubscribe);

</script>

<style>

</style>

<svelte:component this={component} param={param} />

