# App icon assets

The flower comes from `assets/mamaCare_Logo.svg`, confirmed by the user as Merab’s artwork. The flower’s pixels, colours and transparency are retained from the PNG embedded in that SVG; the wordmark is outside the crop. The original logo and splash assets are preserved.

| Asset | Use | Export |
| --- | --- | --- |
| `assets/flower-icon.png` | iOS and default launcher icon | 1024 × 1024, opaque `#FFF8F7` background |
| `assets/flower-adaptive-foreground.png` | Android adaptive icon | 1024 × 1024, transparent foreground with room for launcher masks |
| `assets/flower-monochrome.png` | Android themed icon | 1024 × 1024, white flower silhouette with transparency |
| `assets/flower-favicon.png` | Web browser icon | 64 × 64, opaque `#FFF8F7` background |

`app.json` points at these exports. Android uses the cream background colour; its old template background image was removed from configuration so it cannot override that colour.

## Export details

The embedded original image is 1536 × 1024. Its flower region is clipped at x=500, y=175, width=536, height=355, excluding the wordmark. SVG transforms centre that region at (512,512) on the 1024-square export: scale 1.55 for the standard icon and favicon, and 1.05 for Android foreground and monochrome variants. The monochrome variant uses the same flower alpha as a mask. SVG exports were rendered to PNG without redrawing the artwork.

## Seeing the changed icon

Rebuild and reinstall the native app to update its launcher icon. Refreshing JavaScript in an existing development build does not replace the installed native icon. For web, refresh the exported site; browser favicon caching may require reopening the tab.

Configuration follows the [Expo SDK 57 app icon and adaptive icon fields](https://docs.expo.dev/versions/v57.0.0/config/app/). Native launcher appearance and Android themed-icon rendering still need a check on installed builds.
