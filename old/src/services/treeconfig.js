class Config {
    constructor() {
        this.description = "This loads articles/articletree.json";
    }

    get() {
        return new Promise((resolve, reject) => {
            if (this.articleTree) {
                resolve(this.articleTree);
            } else {
                fetch("/articles/articletree.json").
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
    async findNode(id) {
        const data = await this.get();
        const itemPath = this.findPath({children: data.nodes}, id);

        if (!itemPath)
            return false;
        if (!Array.isArray(itemPath) || itemPath.length === 0)
            return false;

        const last = itemPath.pop();

        return last;
    }

    findPath(root, id) {
        const found = [];

        if (root.children && Array.isArray(root.children) && root.children.length > 0) {
            const children = root.children;

            for (let i = 0; i < children.length; i++) {
                const child = children[i];

                if (child.id === id) {
                    found.push(child);
                    return found;
                }
            }
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const grandChild = this.findPath(child, id);

                if (grandChild && Array.isArray(grandChild) && grandChild.length > 0) {
                    found.push(child);
                    found.push(...grandChild);
                    return found;
                }
            }
        }
        return null;
    }
}
export default new Config();
