import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import {classMap} from "lit/directives/class-map.js"
import { TreeNode } from "@common/types"

@customElement('tree-node')
export class TreeNodeEl extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
        a {
            color: white;
        }
        details {
            margin-left: 1rem;
        }
    `
    
    @property({attribute: false})
    node: TreeNode | undefined
    
    render() {
        if (!this.node)
            return html`<span>...</span>`
        const isLeaf = !this.node.children
        const classes = {
            leaf: isLeaf
        }

        return html`
            <details class=${classMap(classes)} .open=${this.node.expanded}>
                <summary id="${this.node.id}">
                    <span id="${this.node.id}" class="node-text">
                        ${this.node.href ? html`
                            <a href="${this.node.href}">${this.node.name}</a>
                        ` : html`
                            ${this.node.name}
                        `}
                    </span>
                </summary>
                ${isLeaf ? html`` : html`
                    ${this.node.children.map(c => {
                        return html`<tree-node .node=${c}></tree-node>`
                    })}
                `}
            </details>
        `
    }
}
