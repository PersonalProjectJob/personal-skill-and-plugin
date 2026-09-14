# Evidence behind the reusable architecture

Read this only when extracting a reusable pattern from an existing authored experience. Source inspection: portfolio-workspace, revision `d4721f68471b3b3bb170539596df09a600afc63b`, 2026-09-14. This is a bounded record of code observations, not a performance benchmark or a claim that every behavior was exercised in a browser.

| Observed in the inspected source | Reusable decision or gap |
| --- | --- |
| The React application keeps its landing iframe mounted under detail overlays for its 3D variant | Put scene ownership above temporary detail routes; keep iframe identity stable |
| The HTML owns the scene, DOM interactions and an adaptive resolution loop | Separate graphics and presentation from host state; preserve measured quality controls |
| Host CMS hooks send settings/projects/language; child reports navigation, language and analytics | Normalize a public content contract and semantic messages instead of embedding backend/framework APIs |
| Detail overlays use opacity and pointer-events; child handles document visibility but has no host pause message | Add host occlusion state and a shared lifecycle for graphics, cursor, cloth and media; test keyboard focus as well |
| Both message directions use wildcard destinations and listeners omit source/origin checks | Validate both endpoints, envelope and payload before applying commands |
| Ready state follows iframe load; bridge registration occurs in the successful graphics startup path | Separate bridge/content boot from GPU boot and distinguish load, data applied and visual readiness |
| Project labels are assigned to existing cards by index; card actions still use fixed project identifiers | Render and patch content/actions by stable ID; cover insertion, deletion, reorder and empty snapshots |
| Some CMS experience/skill strings are interpolated into innerHTML; child also reads host-shaped storage keys | Use safe content rendering and an explicit ownership/freshness model |
| The npm dependency is Three.js 0.185.1, while the active HTML loads a local r149 runtime | Inspect delivered scripts and licenses; do not assume npm version or unused nearby modules describe the live renderer |
| The fallback removes the startup lock, but several content/bridge controls are registered later in successful startup | Exercise fallback navigation and data updates, not just the disappearance of a spinner |
| A historical performance report describes earlier bundles; source contains multiple animation schedulers | Verify present behavior and all active work before claiming speed or inactivity |

The new skill generalizes these findings through [architecture](html-host-architecture.md) and [message protocol](message-protocol.md). It does not copy the authored scene, personal branding, business routes, CMS schema or asset inventory. Exact reproduction of a named authored experience is a different task from creating a new website based on this architecture.

When reusing this pattern, compare an equivalently optimized direct-component implementation before attributing a performance gain solely to iframe isolation. Keep device, scene, engine revision, DPR, assets, cold/warm state and route sequence constant. Report startup, frame timing, hidden-scene work and retained memory separately.
