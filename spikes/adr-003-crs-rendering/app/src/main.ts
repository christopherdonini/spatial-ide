import { invoke } from "@tauri-apps/api/core";
import { runM1 } from "./m1-render";
import { runM15 } from "./m1_5-diagnostics";
import { runM2 } from "./m2-precision";

// M0 (ADR-003 spike): report WebGL2/WebGPU availability and GPU adapter
// info from inside the native webview (WebView2 on Windows). No rendering
// happens yet — this only answers "what can this webview actually give us."

interface WebGL2Report {
  supported: boolean;
  reason?: string;
  vendor?: string;
  renderer?: string;
  version?: string;
  shadingLanguageVersion?: string;
  maxTextureSize?: number;
  maxViewportDims?: number[];
  extensionCount?: number;
}

interface WebGPUReport {
  supported: boolean;
  reason?: string;
  adapterInfo?: Record<string, string>;
  isFallbackAdapter?: boolean;
  featureCount?: number;
  features?: string[];
  limits?: Record<string, number>;
}

interface M0Report {
  timestamp: string;
  userAgent: string;
  webviewRuntimeVersion: string;
  webgl2: WebGL2Report;
  webgpu: WebGPUReport;
}

function getWebGL2Report(): WebGL2Report {
  const canvas = document.createElement("canvas");
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl2");
  } catch (err) {
    return { supported: false, reason: String(err) };
  }
  if (!gl) {
    return { supported: false, reason: "getContext('webgl2') returned null" };
  }

  const dbgInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const vendor = dbgInfo
    ? (gl.getParameter(dbgInfo.UNMASKED_VENDOR_WEBGL) as string)
    : (gl.getParameter(gl.VENDOR) as string);
  const renderer = dbgInfo
    ? (gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL) as string)
    : (gl.getParameter(gl.RENDERER) as string);
  const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array;

  return {
    supported: true,
    vendor,
    renderer,
    version: gl.getParameter(gl.VERSION) as string,
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) as string,
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
    maxViewportDims: Array.from(maxViewportDims),
    extensionCount: gl.getSupportedExtensions()?.length ?? 0,
  };
}

// GPUSupportedLimits exposes values via getters, not enumerable own
// properties, so pull only the ones relevant to a large-point-cloud renderer
// rather than trying to enumerate the whole object.
const RELEVANT_WEBGPU_LIMITS = [
  "maxTextureDimension2D",
  "maxBufferSize",
  "maxVertexBuffers",
  "maxVertexAttributes",
  "maxBindGroups",
  "maxColorAttachmentBytesPerSample",
  "maxComputeInvocationsPerWorkgroup",
] as const;

async function getWebGPUReport(): Promise<WebGPUReport> {
  const gpu = (navigator as Navigator & { gpu?: GPU }).gpu;
  if (!gpu) {
    return { supported: false, reason: "navigator.gpu is undefined" };
  }

  let adapter: GPUAdapter | null;
  try {
    adapter = await gpu.requestAdapter();
  } catch (err) {
    return { supported: false, reason: String(err) };
  }
  if (!adapter) {
    return { supported: false, reason: "requestAdapter() resolved to null" };
  }

  // Feature-detect across spec revisions: current spec exposes `.info`
  // directly; older implementations exposed the async `.requestAdapterInfo()`
  // (removed from the spec, but WebView2's Chromium version may predate that).
  let rawInfo: GPUAdapterInfo | undefined;
  const legacy = adapter as GPUAdapter & { requestAdapterInfo?: () => Promise<GPUAdapterInfo> };
  if (adapter.info) {
    rawInfo = adapter.info;
  } else if (typeof legacy.requestAdapterInfo === "function") {
    rawInfo = await legacy.requestAdapterInfo();
  }

  const adapterInfo: Record<string, string> = rawInfo
    ? {
        vendor: rawInfo.vendor,
        architecture: rawInfo.architecture,
        device: rawInfo.device,
        description: rawInfo.description,
      }
    : { note: "no adapter-info API exposed by this adapter" };

  const limits: Record<string, number> = {};
  for (const key of RELEVANT_WEBGPU_LIMITS) {
    const value = (adapter.limits as unknown as Record<string, number>)[key];
    if (value !== undefined) limits[key] = value;
  }

  return {
    supported: true,
    adapterInfo,
    isFallbackAdapter: rawInfo?.isFallbackAdapter,
    featureCount: adapter.features.size,
    features: Array.from(adapter.features),
    limits,
  };
}

function renderReport(report: M0Report) {
  const el = document.querySelector<HTMLPreElement>("#m0-report");
  if (el) el.textContent = JSON.stringify(report, null, 2);

  const summary = document.querySelector<HTMLParagraphElement>("#m0-summary");
  if (summary) {
    const webgl2 = report.webgl2.supported ? "available" : "unavailable";
    const webgpu = report.webgpu.supported ? "available" : "unavailable";
    summary.textContent = `WebGL2: ${webgl2} · WebGPU: ${webgpu}`;
  }
}

async function runM0Report() {
  const [webgl2, webgpu, webviewRuntimeVersion] = await Promise.all([
    Promise.resolve(getWebGL2Report()),
    getWebGPUReport(),
    invoke<string>("webview_runtime_version").catch((err) => `error: ${err}`),
  ]);

  const report: M0Report = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    webviewRuntimeVersion,
    webgl2,
    webgpu,
  };

  console.log("[M0 GPU REPORT]", report);
  renderReport(report);
  await invoke("log_m0_report", { reportJson: JSON.stringify(report, null, 2) });
}

async function maybeRunM15() {
  const shouldRun = await invoke<boolean>("should_run_m1_5").catch(() => false);
  if (shouldRun) await runM15();
}

// M2 runs *instead of* M1, not after it: the precision harness needs only the
// 125-point marker set, and every milestone here shares the single
// #deck-canvas, so letting M1's 10M-point load and 20 s frame-time sweep run
// first would add ~25 s to each M2 run for no measurement value. Default
// (no env var) is still M0 + M1, exactly as committed.
async function runMilestones() {
  const m2 = await invoke<boolean>("should_run_m2").catch(() => false);
  if (m2) {
    const m15 = await invoke<boolean>("should_run_m1_5").catch(() => false);
    if (m15) {
      console.warn("[main] RUN_M2 takes precedence over RUN_M1_5; skipping M1 and M1.5 this run");
    }
    await runM2();
    return;
  }
  await runM1();
  await maybeRunM15();
}

window.addEventListener("DOMContentLoaded", () => {
  void runM0Report();
  void runMilestones();
});
