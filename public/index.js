class Index {
    constructor() {
        this.me = "index";
    }

    greet(id) {
        let msg = `Hello from ${this.me} to ${id}`;
        let el = document.getElementById(id);
        el.innerHTML = msg;
    }
}

export const index = new Index();
