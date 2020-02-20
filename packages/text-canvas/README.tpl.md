# ${pkg.banner}

[![npm version](https://img.shields.io/npm/v/${pkg.name}.svg)](https://www.npmjs.com/package/${pkg.name})
![npm downloads](https://img.shields.io/npm/dm/${pkg.name}.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

<!-- TOC -->

## About

${pkg.description}

${status}

${supportPackages}

${relatedPackages}

${blogPosts}

## Installation

```bash
yarn add ${pkg.name}
```

${pkg.size}

## Dependencies

${pkg.deps}

${examples}

## API

${docLink}

### Format identifiers

![format bit layout](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/text-canvas/format-layout.png)

TODO

### Output formatter presets

- `FMT_ANSI16`
- `FMT_ANSI_RAW`
- `FMT_HTML_INLINE_CSS`
- `FMT_HTML_TACHYONS`

### Built-in stroke style presets

- `STYLE_ASCII`
- `STYLE_THIN`
- `STYLE_THIN_ROUNDED`
- `STYLE_DASHED`
- `STYLE_DASHED_ROUNDED`
- `STYLE_DOUBLE`

### Drawing functions

TODO

### Tables

TODO

![table](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/text-canvas/table-border-all.png)

![table](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/text-canvas/table-border-none.png)

![table](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/text-canvas/table-border-h.png)

![table](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/text-canvas/table-border-v.png)

![table](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/text-canvas/table-border-frame.png)

![table](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/text-canvas/table-border-frame-h.png)

![table](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/text-canvas/table-border-frame-v.png)

### Basic example

```text
       ┌───┐
  ┌──────────────────────┐
  │ @thi.ng/text-canvas  │
  │ wireframe example    │++++++++++
  │                      │          +++++++++++    ┌───┐
  │ x: 0.42              │                     ++++│ 6 │
  │ y: 0.30              │        ┌───┐ ++++++++   └───┘
  └──────────────────────┘++++++++│ 7 │+           +
           +         └───┘        └───┘            +
            +          +           +              +
            +          +           +              +
             +         +           +             +
             +         +          +              +
             +          +         +              +
              +         +         +             +
              +         +         +             +
               +        +        ┌───┐         +
               +         +      +│ 3 │         +
                +       ┌───┐+++ └───┘        +
                +       │ 0 │       +         +
                 +      └───┘        +        +
                 +       +            +      +
                 +       +             +     +
                  +     +               +   +
                  +     +                +  +
                   +    +                 ┌───┐
                   +    +                 │ 2 │
                    +   +               ++└───┘
                    +   +            +++
                     + +           ++
                     + +        +++
                      ++      ++
````

```ts
import * as geom from "@thi.ng/geom";
import * as mat from "@thi.ng/matrices";
import * as tc from "../src";

const W = 64;
const H = 32;

// create text canvas
const canvas = new tc.Canvas(W, H, tc.BG_BLACK, tc.STYLE_THIN);

const cube = geom.vertices(geom.center(geom.aabb(1))!);

// edge list (vertex indices)
// prettier-ignore
const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6],
    [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]
];

// animated parameters
let rotx = 0;
let roty = 0;

// transformation matrices
const view = mat.lookAt([], [0, 0, 1], [0, 0, 0], [0, 1, 0]);
const proj = mat.perspective([], 90, W / H, 0.1, 10);
const viewp = mat.viewport([], 0, W, H, 0);

setInterval(() => {
    tc.clear(canvas, true);
    // model rotation matrix
    const model = mat.concat(
        [],
        mat.rotationX44([], (rotx += 0.01)),
        mat.rotationY44([], (roty += 0.03))
    );
    // combined model-view-projection matrix
    const mvp = mat.concat([], proj, view, model);
    // draw cube instances
    // project 3D points to 2D viewport (canvas coords)
    const pts = cube.map((p) => mat.project([], mvp, viewp, [...p, 1]));
    // draw cube edges
    for (let e of edges) {
        const a = pts[e[0]];
        const b = pts[e[1]];
        tc.line(canvas, a[0], a[1], b[0], b[1], "+", tc.FG_WHITE | tc.BG_RED);
    }
    // draw vertex labels
    canvas.format = tc.FG_WHITE | tc.BG_BLUE;
    for (let i = 0; i < 8; i++) {
        const p = pts[i];
        tc.textBox(canvas, p[0] - 1, p[1] - 1, 5, 3, ` ${i} `);
    }
    tc.textBox(
        canvas,
        2, 1, 24, -1,
        `@thi.ng/text-canvas wireframe example\n\nx: ${rotx.toFixed(2)}\ny: ${roty.toFixed(2)}`,
        {
            format: tc.FG_BLACK | tc.BG_BRIGHT_CYAN,
            padding: [1, 0]
        }
    );
    // draw canvas
    console.clear();
    console.log(tc.toFormattedString(canvas, tc.FMT_ANSI16));
    // console.log(tc.toString(canvas));
}, 15);
```

## Authors

${authors}

## License

&copy; ${copyright} // ${license}