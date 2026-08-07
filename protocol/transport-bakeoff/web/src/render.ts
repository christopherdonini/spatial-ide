// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Minimal WebGL2 point renderer — the "first rendered pixels" end of the vertical harness.
 *
 * Deliberately raw WebGL2 and not deck.gl: this must stay small, and adding picking to demonstrate
 * "first pixels" would pull ADR-010 rules 2 and 6 into a harness that has no business carrying
 * them.
 *
 * **ADR-010 rule 3 is the load-bearing detail here.** The offset subtraction happens in f64 and the
 * narrowing to f32 happens last. In JS that is not incidental: `e[i] - ORIGIN_E` is evaluated in
 * f64 (all JS numbers are f64) and only rounds to f32 on assignment into the `Float32Array`. The
 * inverse order — narrowing an absolute EPSG:2056 coordinate to f32 first — is what spike M2's
 * naive-absolute control measured at 0.9494 px against a 0.5 px budget.
 */

// Extent centre, matching the ADR-003 spike's `offset-fixed` origin.
const ORIGIN_E = 2_659_500;
const ORIGIN_N = 1_185_500;
const HALF_E = 174_500;
const HALF_N = 110_500;

const VERT = `#version 300 es
in vec2 pos;
uniform vec2 halfExtent;
void main() {
  gl_Position = vec4(pos.x / halfExtent.x, pos.y / halfExtent.y, 0.0, 1.0);
  gl_PointSize = 1.0;
}`;

const FRAG = `#version 300 es
precision mediump float;
out vec4 color;
void main() { color = vec4(0.24, 0.72, 0.95, 1.0); }`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(`shader: ${gl.getShaderInfoLog(s)}`);
  }
  return s;
}

export class PointRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private buffers: { vbo: WebGLBuffer; count: number }[] = [];
  private posLoc: number;
  /**
   * Bytes this renderer still holds after upload, accumulated across batches.
   *
   * The CPU-side staging array is released immediately, so what remains is GPU-resident vertex
   * data. This is real accounting: an earlier revision declared the field and never assigned it,
   * while the report's "accounted retained bytes" metric returned the largest *single batch* — a
   * figure that documents the batch size and cannot test anything.
   */
  retainedBytes = 0;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) throw new Error('WebGL2 unavailable');
    this.gl = gl;
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error(`link: ${gl.getProgramInfoLog(p)}`);
    }
    this.program = p;
    this.posLoc = gl.getAttribLocation(p, 'pos');
    gl.clearColor(0.05, 0.06, 0.09, 1);
  }

  /**
   * Copy accounting stage 6: the one unavoidable f64->f32 narrowing (WebGL2 has no f64 attributes),
   * followed by stage 7, the physically required CPU-RAM -> VRAM upload.
   */
  addBatch(e: Float64Array, n: Float64Array): void {
    const gl = this.gl;
    const count = e.length;
    const xy = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      // f64 subtraction FIRST; the f32 narrowing happens on store. ADR-010 rule 3.
      xy[i * 2] = e[i] - ORIGIN_E;
      xy[i * 2 + 1] = n[i] - ORIGIN_N;
    }
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, xy, gl.STATIC_DRAW);
    this.buffers.push({ vbo, count });
    this.retainedBytes += xy.byteLength;
    // The staging array is released immediately; nothing on the CPU side retains payload bytes,
    // which is what keeps the consumer's accounted memory bounded.
  }

  draw(): void {
    const gl = this.gl;
    const c = gl.canvas as HTMLCanvasElement;
    gl.viewport(0, 0, c.width, c.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.uniform2f(
      gl.getUniformLocation(this.program, 'halfExtent'),
      HALF_E,
      HALF_N,
    );
    gl.enableVertexAttribArray(this.posLoc);
    for (const b of this.buffers) {
      gl.bindBuffer(gl.ARRAY_BUFFER, b.vbo);
      gl.vertexAttribPointer(this.posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, b.count);
    }
    gl.finish();
  }

  /** True once at least one pixel of real data has been drawn. */
  get hasContent(): boolean {
    return this.buffers.length > 0;
  }

  get batchCount(): number {
    return this.buffers.length;
  }

  reset(): void {
    for (const b of this.buffers) this.gl.deleteBuffer(b.vbo);
    this.buffers = [];
    this.retainedBytes = 0;
  }

  gpuInfo(): string {
    const dbg = this.gl.getExtension('WEBGL_debug_renderer_info');
    return dbg
      ? String(this.gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
      : 'unavailable';
  }
}
