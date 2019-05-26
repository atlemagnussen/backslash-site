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
                    then((res) => res.json(), (err) => {
                        reject(err);
                    }).
                    then((at) => {
                        this.articleTree = at;
                        resolve(this.articleTree);
                    });
            }
        });
    }
}
export default new Config();
