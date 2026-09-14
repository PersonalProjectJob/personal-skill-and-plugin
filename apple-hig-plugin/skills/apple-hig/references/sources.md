# Official Apple Sources

Reference date: 2026-07-28. Re-check the live page whenever a requirement depends on an OS version or a
recent API.

## HIG root

- Human Interface Guidelines — https://developer.apple.com/design/human-interface-guidelines
- Design principles — https://developer.apple.com/design/human-interface-guidelines/design-principles
- Foundations — https://developer.apple.com/design/human-interface-guidelines/foundations
- Patterns — https://developer.apple.com/design/human-interface-guidelines/patterns
- Components — https://developer.apple.com/design/human-interface-guidelines/components

## Foundations

- Accessibility — https://developer.apple.com/design/human-interface-guidelines/accessibility
- Layout — https://developer.apple.com/design/human-interface-guidelines/layout
- Typography — https://developer.apple.com/design/human-interface-guidelines/typography
- Color — https://developer.apple.com/design/human-interface-guidelines/color
- Dark Mode — https://developer.apple.com/design/human-interface-guidelines/dark-mode
- Materials — https://developer.apple.com/design/human-interface-guidelines/materials
- Icons — https://developer.apple.com/design/human-interface-guidelines/icons
- Motion — https://developer.apple.com/design/human-interface-guidelines/motion
- Privacy — https://developer.apple.com/design/human-interface-guidelines/privacy
- Writing — https://developer.apple.com/design/human-interface-guidelines/writing

## Patterns

- Navigation and search — https://developer.apple.com/design/human-interface-guidelines/navigation-and-search
- Modality — https://developer.apple.com/design/human-interface-guidelines/modality
- Loading — https://developer.apple.com/design/human-interface-guidelines/loading
- Feedback — https://developer.apple.com/design/human-interface-guidelines/feedback
- Entering data — https://developer.apple.com/design/human-interface-guidelines/entering-data
- Gestures — https://developer.apple.com/design/human-interface-guidelines/gestures
- Launching — https://developer.apple.com/design/human-interface-guidelines/launching

## Components

- Buttons — https://developer.apple.com/design/human-interface-guidelines/buttons
- Text fields — https://developer.apple.com/design/human-interface-guidelines/text-fields
- Search fields — https://developer.apple.com/design/human-interface-guidelines/search-fields
- Sheets — https://developer.apple.com/design/human-interface-guidelines/sheets
- Progress indicators — https://developer.apple.com/design/human-interface-guidelines/progress-indicators
- Tab bars — https://developer.apple.com/design/human-interface-guidelines/tab-bars

## Developer implementation

- SwiftUI — https://developer.apple.com/swiftui/
- NavigationStack — https://developer.apple.com/documentation/swiftui/navigationstack
- NavigationSplitView — https://developer.apple.com/documentation/swiftui/navigationsplitview
- SafeAreaRegions — https://developer.apple.com/documentation/swiftui/safearearegions
- Accessibility fundamentals — https://developer.apple.com/documentation/swiftui/accessibility-fundamentals
- Apple Design Resources — https://developer.apple.com/design/resources/
- Adopting Liquid Glass — https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass

## Web-mode supplements

HIG does not cover web accessibility. For `web_apple_inspired` work, pair the above with:

- WCAG 2.2 — https://www.w3.org/TR/WCAG22/
- ARIA Authoring Practices — https://www.w3.org/WAI/ARIA/apg/

## How to use these sources

- `MUST` prefer an official Apple URL over a secondary summary.
- `MUST` check API availability against the project's minimum OS version.
- `MUST NOT` infer an API from the HIG — HIG describes experience, Developer Documentation describes
  implementation.
- `MUST` supplement with web/WCAG sources for web projects.
- `MUST` record the access date in any long-lived specification.
- `MUST NOT` copy long passages. Interpret, then link.
