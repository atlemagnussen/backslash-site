import { writable } from "svelte/store";

export const curRoute = writable("/");
export const blogId = writable("");