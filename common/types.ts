export interface TreeConfig {
    rootUrl: string
    nodes: TreeNode[]
}

export interface TreeNode {
    id: string
    name: string
    href?: string
    expanded: boolean
    tags: string[],
    children: TreeNode[]
}