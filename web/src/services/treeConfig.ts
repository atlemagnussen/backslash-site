import { TreeConfig, TreeNode } from "@common/types"

const treePromise = fetch("/articles/articletree.json").then(res => res.json())

export async function getTree() {
        
    const json = await (treePromise as Promise<TreeConfig>)
    .catch(er => console.error(er))
    if (!json)
        return null

    if (json && json.nodes && Array.isArray(json.nodes) && json.nodes.length > 0) {
        setHref(json.nodes)
    }
    return json
}

function setHref(children: TreeNode[]) {
    for (let i = 0; i < children.length; i++) {
        const child = children[i]

        if (child.children) {
            setHref(child.children)
        } else if (child.id) {
            child.href = `/blog/${child.id}`
        }
    }
}
export async function findNode(id: string) {
    const data = await getTree()
    if (!data)
        return null
    const itemPath = findPath({ id:"root", name: "root", expanded: false, tags:[], children: data.nodes}, id)

    if (!itemPath)
        return false;
    if (!Array.isArray(itemPath) || itemPath.length === 0)
        return false;

    const last = itemPath.pop();

    return last;
}

async function findPath(root: TreeNode, id: string) {
    const found: TreeNode[] = []

    if (root.children && Array.isArray(root.children) && root.children.length > 0) {
        const children = root.children;

        for (let i = 0; i < children.length; i++) {
            const child = children[i]

            if (child.id === id) {
                found.push(child)
                return found
            }
        }
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            const grandChild = findPath(child, id)

            if (grandChild && Array.isArray(grandChild) && grandChild.length > 0) {
                found.push(child)
                found.push(...grandChild)
                return found
            }
        }
    }
    return null
}