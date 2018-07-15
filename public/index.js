class Index {
    constructor() {
        this.me = "index";

        window.onpopstate = (event) => {
            console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
            console.log(`window.location.pathname=${window.location.pathname}`);
            this.navigate(window.location.pathname, true);
        };
    }

    greet(id) {
        let msg = `Hello from ${this.me} to ${id}`;
        msg += `<br />`;
        msg += `Route: ${window.location.pathname}`;
        let el = document.getElementById(id);
        el.innerHTML = msg;
    }
}

export const index = new Index();
