import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { TreeConfig } from "@common/types"
import { getTree } from "@app/services/treeConfig"
import "./treeNode"

@customElement('blog-menu')
export class BlogMenu extends LitElement {

    @state()
    config: TreeConfig | null = null
    
    connectedCallback(): void {
        super.connectedCallback()
        this.fetchTree()
    }
    async fetchTree() {
        const tree = await getTree()
        this.config = tree
    }
    render() {
        if (!this.config || !this.config.nodes)
            return html`<span>loading</span>`
        
        return html`
            ${this.config.nodes.map(n => html`
                <tree-node .node=${n}></tree-node>
            `)}
        `
    }
}
