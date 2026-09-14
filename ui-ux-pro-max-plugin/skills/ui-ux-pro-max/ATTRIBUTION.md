# Attribution & data provenance

This skill ships two kinds of data:

1. **Original design guidance** — style taxonomy, product/palette reasoning, typography pairing,
   UX guidelines, motion presets, chart-type selection, and per-stack (React, Vue, SwiftUI, WPF, …)
   implementation guidelines. Authored and curated for this skill; not copied from a third-party
   catalog. `data/data-provenance.json` records, per record, which source rows it was derived
   from and when it was last verified (`freshnessPolicy`: re-review after 90–365 days).

2. **Third-party reference metadata** — pulled from the two upstream projects below, used only to
   look up names/licenses/versions, not to redistribute the assets themselves:

   | File | Source | License of the referenced assets |
   |---|---|---|
   | `data/google-fonts.csv`, `data/google-font-licenses.json` | [google/fonts](https://github.com/google/fonts), `METADATA.pb`, pinned at commit `038b637da7b3fd956a4ed93ffc607c3d5e4ce172` | Each font is SIL Open Font License or Apache License 2.0, as recorded per-family in `google-font-licenses.json`. Google Fonts are designed to be freely redistributed and used, including commercially. |
   | `data/phosphor-icons-upstream.json`, `data/icons.csv` | [@phosphor-icons/core](https://github.com/phosphor-icons/core) v2.1.1 / `@phosphor-icons/react` v2.1.10 | MIT License |

`data/catalog-summary.json` records a SHA-256 snapshot hash of each of these upstream-derived files
at the time they were last verified, so a stale snapshot is detectable rather than silently trusted.

If you fork this skill and update the upstream snapshots, re-verify the license field per family/icon
set — upstream licensing can change between releases, and this file only reflects the pinned revision
above.
