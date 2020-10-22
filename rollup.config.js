import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";

const production = !process.env.ROLLUP_WATCH;

export default {
    input: "src/main.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "public/build/bundle.js"
    },
    plugins: [
        svelte({
            dev: !production,
            css: css => {
                css.write("bundle.css");
            }
        }),

        resolve({
            browser: true,
            dedupe: ["svelte"]
        }),

        commonjs(),

        !production && serve({
            contentBase: "public",
            open: true,
            host: "localhost",
            port: 8000,
            historyApiFallback: true,
        }),

        !production && livereload("public"),

        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};
