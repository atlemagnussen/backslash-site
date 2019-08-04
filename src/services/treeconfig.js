class Config {
    constructor() {
        this.description = "This loads articles/articletree.json";
    }

    get() {
        return new Promise((resolve, reject) => {
            if (this.articleTree) {
                resolve(this.articleTree);
            } else {
                fetch('/articles/articletree.json').
                    then(async (res) => {
                        const json = await res.json();

                        if (json.nodes && Array.isArray(json.nodes) && json.nodes.length > 0) {
                            this.setHref(json.nodes);
                        }
                        return json;
                    }
                    , (err) => {
                        reject(err);
                    }).
                    then((at) => {
                        this.articleTree = at;
                        resolve(this.articleTree);
                    });
            }
        });
    }
    setHref(children) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (child.children) {
                this.setHref(child.children);
            } else if (child.id) {
                child.href = `/blog/${child.id}`;
            }
        }
    }
}
export default new Config();
