# worldline-card

Open-source **React Native** components for **collectible / trading-card** UIs on phone — framed stat cards, composable slots, **touch tilt**, and **holo / metal foil** (Reanimated + Gesture Handler + optional Skia shaders).

Inspired by TCG-style web frameworks and the character card UI from [Worldline](https://github.com/worldline-dev/worldline-app), packaged so any app can drop in polished cards without game-specific logic.

## Features

- **`StatCollectibleCard`** — one prop-driven layout (badge, art, stats, flavor) like a Pokémon-style card
- **`CollectibleCard` + `CardParts`** — compose headers, art, chips, stat bars, footers yourself
- **`TiltCard`** — drag to tilt in 3D; optional **`CardHoloOverlay`** (`common` | `rare` | `legendary`)
- **`CardThemeProvider`** — dark theme defaults; override colors to match your app
- **`cardStyle`** — physical TCG looks: `classic` | `crimson` | `forest` | `royal` | `ocean` | `amber` | `gold` | `silver` | `laser` | `diamond` | `matte` | `obsidian`
- **Foil finishes** — Skia RuntimeEffect shaders for metal / crystal / matte / glass (falls back to CSS gradients). Optional `metalTexture` image shade when you have foil assets.

Skia is an **optional** peer — install `@shopify/react-native-skia` for shader metals; without it, CSS / view fallbacks still work. No WebView.

## Install

```bash
pnpm add worldline-card react-native-reanimated react-native-gesture-handler @shopify/react-native-skia
```

Peer dependencies: `react`, `react-native`, `react-native-reanimated`, `react-native-gesture-handler`. Optional: `@shopify/react-native-skia` (metal shaders).

Expo: enable Reanimated in `babel.config.js`:

```js
plugins: ['react-native-reanimated/plugin'],
```

Wrap your app root with `GestureHandlerRootView` (see `example/App.tsx` pattern via expo entry).

## Quick start

```tsx
import {
  CardThemeProvider,
  StatCollectibleCard,
} from 'worldline-card';

export function MyScreen() {
  return (
    <CardThemeProvider>
      <StatCollectibleCard
        interactive
        holo="rare"
        cardStyle="crimson"
        title="Spider-Man"
        badge={{
          label: 'Comic',
          color: '#8b3a3a',
          description: 'Source medium for this persona.',
        }}
        franchise="Marvel"
        chips={[
          { label: 'Witty', description: 'Deflects tension with humor.' },
          'Loyal',
        ]}
        stats={[
          {
            label: 'Boldness',
            value: 8,
            description: 'Willingness to leap first.',
          },
          { label: 'Insight', value: 7 },
        ]}
        flavor="With great power comes great responsibility."
        footerLeft="Expr 7/10"
      />
    </CardThemeProvider>
  );
}
```

Pass a single localized `title` from the caller (e.g. `"蜘蛛侠"` or `"Spider-Man"`). Optional `subtitle` is for a secondary line like a role or epithet — not a second language.

Metal styles (`cardStyle="gold" | "silver" | "laser" | "diamond" | "matte" | "obsidian"`) drive a Skia foil wash that tracks tilt. Shade with a real texture when you have one:

```tsx
<StatCollectibleCard
  cardStyle="gold"
  metalTexture={require('./assets/foil-gold.png')}
  /* ... */
/>
```

## Compose your own

```tsx
import {
  CollectibleCard,
  CardHeader,
  CardArt,
  CardTitle,
  CardStatList,
  CardFlavor,
  TiltCard,
} from 'worldline-card';

<TiltCard holo="legendary">
  <CollectibleCard active>
    <CardHeader badge={{ label: 'Rare' }} trailing={/* ... */} />
    <CardArt imageUri="https://..." />
    <CardTitle title="Custom" subtitle="Subtitle" />
    <CardStatList stats={[{ label: 'Power', value: 9 }]} />
    <CardFlavor text="Flavor text." />
  </CollectibleCard>
</TiltCard>
```

## Monorepo

| Package | Description |
|---------|-------------|
| `packages/worldline-card` | Library (publishable to npm) |
| `example` | Expo demo — **iOS / Android / web** |

```bash
pnpm install
pnpm example:web      # browser demo (phone-frame landing page)
pnpm example          # Expo start (pick platform)
pnpm example:ios      # native iOS simulator
pnpm build            # build library with react-native-builder-bob
pnpm typecheck
```

### Web demo

`pnpm example:web` opens a docs-style landing page with the live card gallery inside a phone bezel — so developers can try tilt / holo without a simulator. Export a static site with `pnpm example:export-web` (output under `example/dist`) for GitHub Pages or any static host.

On native, the same gallery runs full-screen via `DemoGallery`.

## Relationship to Worldline

[Worldline](https://github.com/worldline-dev/worldline-app) uses a richer **character card schema** (identity anchors, goals, etc.) for player avatars. **worldline-card** is only the **presentation layer** — bring your own data model.

## License

MIT — see [LICENSE](./LICENSE).

## Contributing

Issues and PRs welcome. Please run `pnpm typecheck` before submitting.
