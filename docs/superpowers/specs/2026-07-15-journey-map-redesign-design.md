# Journey Map Redesign

- **Date:** 2026-07-15
- **Status:** Approved correction to the Luka-inspired profile direction
- **Routes:** `/profile/`, `/de/profile/`, `/zh/profile/`

## Problem

The current profile map uses two abstract polygons. It communicates a route, but it does not read as a real world map and therefore misses the geographic character of the referenced Luka homepage. The correction must make the three-city journey immediately legible without adding visitor tracking or a heavy interactive map library.

## Approaches considered

1. **Embed ClustrMaps:** closest to the reference visitor map, but adds third-party requests, tracking, and a visual language that implies live analytics.
2. **Use Leaflet and map tiles:** geographically rich and interactive, but unnecessarily heavy for a three-stop personal journey and dependent on external tiles.
3. **Self-host a real world map (selected):** render public-domain Natural Earth land geometry as inline SVG, then layer the verified route and restrained motion on top. This preserves privacy, speed, and the site's visual system while fixing the core geographic problem.

## Map design

- Use a compact equirectangular world projection with recognizable continent outlines from Natural Earth 1:110m land data.
- Keep oceans as the page surface, land as a quiet blue tint, and add a subtle longitude/latitude graticule for geographic structure.
- Plot the journey in this confirmed order:
  1. Florence — start
  2. Wenzhou — second stop
  3. Heilbronn — current stop
- Render two separate route legs so their direction and animation order are clear.
- Mark stops with numbered points inside the map. Florence is the start, Wenzhou the midpoint, and Heilbronn receives a restrained current-location ring.
- Keep the localized ordered list below the map as the readable text equivalent and as a compact legend.
- Do not add fake visitor dots, analytics counts, country borders, interactive controls, or map tiles.

## Motion

- Draw the Florence-to-Wenzhou leg first, then the Wenzhou-to-Heilbronn leg.
- Reveal stop markers in route order and use a slow, low-amplitude pulse only on the current stop.
- Animate only transform, opacity, and SVG stroke offset.
- Under `prefers-reduced-motion: reduce`, show the completed route and all markers immediately with no pulse.

## Responsive and accessible behavior

- The SVG scales to the identity rail width without horizontal overflow down to 320 CSS pixels.
- Numbered markers remain distinguishable at mobile size; full place names remain in the ordered list rather than being squeezed into the map.
- The SVG remains decorative because the localized ordered list exposes the same information in document order.
- The map makes no external requests and remains fully available offline after the site build.

## Component boundary

- Extract the map and its styles into `JourneyMap.astro` so `ProfileIdentity.astro` remains focused on identity and contact actions.
- Pass the existing localized journey-stop strings into the map component; do not duplicate localized content.
- Preserve the existing `data-profile-journey`, `data-journey-route`, and `data-journey-stop` hooks while adding explicit hooks for land, route legs, map stops, and the current stop.

## Verification

- Built HTML contains substantial self-hosted land geometry, two route legs, three map markers, one current stop, and no ClustrMaps or external map embed.
- Desktop browser tests confirm route animation and that every marker remains inside the SVG bounds.
- Reduced-motion tests confirm both route legs are complete and animation-free.
- Mobile browser tests confirm no horizontal overflow and readable route legend.
- Full Astro, unit, build, accessibility, and Playwright verification passes before pushing to `main`.
