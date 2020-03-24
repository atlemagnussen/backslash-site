import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
// import postcss from "rollup-plugin-postcss";
import css from "rollup-plugin-css-porter";
import copy from "rollup-plugin-copy";

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
                css.write("public/build/bundle.css");
            }
        }),
        resolve({
            browser: true,
            dedupe: ["svelte"]
        }),
        commonjs(),
        css({dest: "public/build/bundle-ext.css"}),
        copy({
            targets: [
                { src: "articles", dest: "public" },
                { src: "node_modules/prismjs/themes/prism.css", dest: "public/lib" },
                { src: "node_modules/prism-themes/themes/prism-xonokai.css", dest: "public/lib" }
            ]
        }),

        !production && serve(),

        !production && livereload("public"),

        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
                    stdio: ["ignore", "inherit", "inherit"],
                    shell: true
                });
            }
        }
    };
}