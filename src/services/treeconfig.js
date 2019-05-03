class Config {
    constructor() {
        this.description = "This loads articles/articletree.json";
    }

    get() {
        return new Promise((resolve, reject) => {
            if (this.config) {
                resolve(this.config);
            } else {
                fetch('/articles/articletree.json').
                    then((res) => res.json(), (err) => {
                        reject(err);
                    }).
                    then((articleTree) => {
                        this.config = articleTree;
                        resolve(this.config);
                    });
            }
        });
    }

    isBlog(id) {
        const itemPath = this.findPath({children: this.config.nodes}, id);

        if (!itemPath)
            return false;
        if (!Array.isArray(itemPath) || itemPath.length === 0)
            return false;

        const last = itemPath.pop();

        return !last.hasOwnProperty('children');
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
