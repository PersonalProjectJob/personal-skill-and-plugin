# Performance budgets and verification

## Define what is being promised

Start from the project's existing budgets. Otherwise propose the following **adjustable initial targets for a decorative marketing-page scene**, and record the device, viewport, render scale, refresh rate and measurement method. These are local engineering heuristics, not WebGL limits or platform UI standards.

| Area | Initial target or decision |
| --- | --- |
| Smoothness | Aim for 60 rendered frames/s on the agreed reference device; one refresh interval at 60 Hz is about 16.7 ms, shared with all page work |
| Weak device | Try a lower quality tier; use a deliberate 30 frames/s mode only if visually acceptable, or choose a still |
| Pixel cost | Start with DPR capped at 1.5; lower toward 1 when fill cost dominates; enable higher DPR only after profiling |
| Startup graphics | For a lightweight procedural hero, propose at most 500 KiB compressed incremental graphics JS plus assets before the first graphic frame; record engine, decoder and asset bytes separately |
| Idle state | No continuous graphics loop while offscreen, hidden, manually paused or showing a static fallback |
| Lifecycle | Repeated equivalent mount/unmount cycles should reach a stable resource trend, not grow indefinitely |

The byte suggestion is not appropriate for every 3D product experience. If an existing engine or required model exceeds it, show the measured breakdown and negotiate scope/quality instead of claiming the target passed. Dynamic import changes loading order; it does not erase bytes. Keep a separate budget for total initial page transfer.

For field experience, the good Core Web Vitals thresholds are LCP <= 2.5 s, INP <= 200 ms and CLS <= 0.1 at the 75th percentile. Evaluate relevant device segments. These do not measure WebGL smoothness. Lab interaction traces can diagnose responsiveness; a Lighthouse score or TBT is not measured field INP. See [Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds).

## Build a quality ladder

Define high, low and static states around the same visual composition. Reduce render resolution or costly full-screen passes first when fill-bound; reduce instance count when draw/geometry-bound; simplify shader work when shader-bound. Select the first reduction from measurements rather than applying every optimization blindly.

Use a rolling sample of foreground, visible, active rendering after warmup. Track frame-interval percentiles and long gaps, not only an average FPS. A requestAnimationFrame timestamp is a scheduling signal, not proof that the GPU completed or displayed a frame. Where supported, use nonblocking GPU timer queries, discard disjoint samples, and keep instrumentation out of the hot path. Browser traces and real-device observation remain necessary.

Use hysteresis and a cooldown between quality changes. Ignore hidden-tab delays and initialization when choosing a steady-state tier; measure startup hitches separately. Do not repeatedly raise quality just because the currently reduced tier runs well. User-selected reduced motion or pause wins over automatic quality selection. Render scale changes must update buffers/camera/uniforms coherently without changing CSS layout.

## Find the bottleneck

| Evidence | Investigate first |
| --- | --- |
| Slow first graphic frame, blocking startup tasks | Engine parse/evaluation, compilation, decoder work, image decode and upload; load fewer assets and warm only required shader variants |
| Large gains from lowering render scale | Fragment shader cost, transparency, full-screen postprocessing and render-target size |
| Frame cost rises with object count | Draw calls, repeated materials, scene traversal and geometry; test batching or instancing |
| Typing or clicking stalls during motion | Framework updates, allocations/GC, expensive input handlers and synchronous GPU readback |
| Decline after prolonged use or navigation | Leaked contexts/resources, retained listeners/media, rising workload or device thermal throttling |

Do not move rendering into a worker as a first response to a GPU bottleneck. Do not call CSS filters or video a cheaper fallback without measuring their decode/compositing cost.

## Verification for an implemented page

1. Run the project's actual production build and relevant checks; serve that build for performance measurement. Save the configuration and commands.
2. Compare cold and warm loads under the same browser/device/network conditions, preferably multiple runs. Capture page transfer and the first useful content independently of the first graphic frame. A canvas image may not be the LCP candidate, so also record first graphic readiness.
3. Exercise real navigation, scrolling, pointer/touch input and keyboard controls while the scene runs. Inspect a trace long enough to include sustained motion; include a longer run when thermal behavior matters. Save frame statistics and a trace, not just a score.
4. Verify offscreen pause, hidden-tab resume, manual pause persistence, reduced motion from initial load and while running, resize/orientation and route teardown during loading.
5. Test asset/context initialization failure and context loss. A diagnostic `WEBGL_lose_context` test is fault injection, not evidence of a real user journey; label it accordingly. Content and actions must remain usable after failure.
6. Test at least the agreed desktop and weaker mobile target. Viewport emulation and CPU throttling do not reproduce mobile GPU, memory, Safari or thermal behavior. Report unavailable physical-device checks as unverified.

Before/after results must use the same scenario and distinguish measured values from configured targets. For a new page with no baseline, report its actual values without invented improvement percentages. Check visual quality after lowering the tier; meeting timing targets by removing the intended experience is a tradeoff to disclose.

## Extra checks for independent HTML and iframe mode

- Trace host and child script requests, including vendored engine copies, fonts, media and decoder assets. Attribute bytes to the actual served build; files copied from public assets may bypass the application's bundler and type checks.
- Verify the sequence landing -> detail -> return through real controls. Record whether the same document/context survives, whether all auxiliary work stops while covered, and whether return duplicates any loop. Test a second cycle and a detail route opened before the child finishes loading.
- Confirm navigation still matches the displayed item after a content reorder, deletion, insertion, locale change and an empty snapshot. Test the standalone document separately from embedding.
- Exercise bridge startup with cached loads, delayed data, child reload and failed graphics boot. Malformed messages or a different source/origin must not navigate or apply content. Label protocol fault injection separately from user-flow evidence.
- Report warm-context memory cost as well as return latency. CPU throttling and iframe isolation do not prove an independent GPU or zero frame loss. To compare architectures, hold scene, engine, assets, device and quality settings constant.

## Evidence to return

Report the build, browser/device, viewport, DPR/render tier, loading conditions, scenario, sample duration, measured frame statistics, bytes, responsiveness findings, fallback outcomes and artifact paths. Separate pass/fail from not tested. Screenshots establish appearance; build output establishes compilation; neither establishes frame rate or field Web Vitals.
