// Running-bond brick pattern, generated once at build time.
// Values locked in design/DESIGN.md.
export const BRICK = { width: 56, height: 22, rows: 8, cols: 6, gap: 3, jitter: 0.55, seed: 7 }

export function brickTile() {
    const { width: w, height: h, rows, cols, gap, jitter } = BRICK
    let seed = BRICK.seed
    const rng = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    const rects: string[] = []
    for (let r = 0; r < rows; r++) {
        const offset = (r % 2) * w / 2
        // One shade per column, so the brick cut by the tile edge matches its other half.
        const shade = Array.from({ length: cols }, rng)
        for (let c = -1; c < cols; c++) {
            const v = shade[(c + cols) % cols]
            const opacity = (1 - jitter) * 0.35 + jitter * v * 0.6
            rects.push(`<rect x="${c * w + offset + gap / 2}" y="${r * h + gap / 2}" width="${w - gap}" height="${h - gap}" rx="1.5" fill-opacity="${opacity.toFixed(2)}"/>`)
        }
    }
    return { width: w * cols, height: h * rows, svg: rects.join("") }
}

// Embers: a few bricks that slowly glow and cool, each on its own cycle.
// A separate layer, not part of the repeating tile (that would pulse in sync across the grid).
// Placed on the brick grid over a large area; the edge mask hides those behind the content.
export const EMBER = { count: 48, areaWidth: 2560, areaHeight: 1600, minSeconds: 6, maxSeconds: 15, seed: 42 }

export function embers() {
    const { width: w, height: h, gap } = BRICK
    let seed = EMBER.seed
    const rng = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    const rows = Math.floor(EMBER.areaHeight / h), cols = Math.floor(EMBER.areaWidth / w)
    return Array.from({ length: EMBER.count }, () => {
        const r = Math.floor(rng() * rows), c = Math.floor(rng() * cols)
        const duration = EMBER.minSeconds + rng() * (EMBER.maxSeconds - EMBER.minSeconds)
        return {
            x: c * w + (r % 2) * w / 2 + gap / 2,
            y: r * h + gap / 2,
            width: w - gap,
            height: h - gap,
            // negative delay: each ember starts mid-cycle, so they never fire together on load
            style: `animation-duration:${duration.toFixed(1)}s;animation-delay:-${(rng() * duration).toFixed(1)}s`,
        }
    })
}
