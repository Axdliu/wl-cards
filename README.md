# worldline-card

Open-source **React Native** components for **collectible / trading-card** UIs — framed stat cards, composable slots, **realistic touch tilt**, **holo shine**, **Skia foil finishes**, and **AmbientKit-inspired living backgrounds**.

Inspired by TCG-style layouts and the character card UI from [Worldline](https://github.com/worldline-dev/worldline-app). Ambient motion draws from [AmbientKit](https://github.com/Axdliu/AmbientKit).

## Features

- **`StatCollectibleCard`** — one prop-driven layout (badge, art, stats, flavor)
- **`CollectibleCard` + `CardParts`** — compose headers, art, chips, stat bars, footers
- **`TiltCard`** — spring-smoothed 3D tilt with inertia, lift, and light-aware shadows; optional **`CardHoloOverlay`** (`common` | `rare` | `legendary`)
- **`CardThemeProvider`** — theme defaults; override colors per app or per card
- **`cardStyle`** — named looks (paper, foil, and ambient) — see below
- **Foil finishes** — Skia RuntimeEffect shaders (`gold` / `silver` / `laser` / `diamond` / `matte` / `obsidian`) with CSS / view fallbacks; optional `metalTexture`
- **Ambient backgrounds** — AmbientKit-style drifting orbs / stars (`aurora` / `cosmic` / `ember` / `tide`), tilt-reactive

Skia is an **optional** peer (`@shopify/react-native-skia`). Without it, foil and ambient still fall back to CSS / Views. No WebView.

## Card styles

| Group | `cardStyle` values |
|-------|--------------------|
| Paper frames | `classic` `crimson` `forest` `royal` `ocean` `amber` |
| Foil / finish | `gold` `silver` `laser` `diamond` `matte` `obsidian` |
| Ambient | `aurora` `cosmic` `ember` `tide` |

All styles share a consistent frame width. Foil and ambient styles respond to tilt when `interactive` is set.

## Install

```bash
pnpm add worldline-card react-native-reanimated react-native-gesture-handler @shopify/react-native-skia
```

Peers: `react`, `react-native`, `react-native-reanimated`, `react-native-gesture-handler`. Optional: `@shopify/react-native-skia` (foil shaders + ambient orbs).

Expo — enable Reanimated in `babel.config.js`:

```js
plugins: ['react-native-reanimated/plugin'],
```

Wrap the app root with `GestureHandlerRootView` (see `example/App.tsx`).

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

Pass a single localized `title` (e.g. `"蜘蛛侠"` or `"Spider-Man"`). Optional `subtitle` is a role/epithet — not a second language.

### Foil + texture

```tsx
<StatCollectibleCard
  interactive
  cardStyle="gold"
  metalTexture={require('./assets/foil-gold.png')}
  title="Sun Tzu"
  stats={[{ label: 'Strategy', value: 10 }]}
/>
```

### Ambient background

```tsx
<StatCollectibleCard
  interactive
  cardStyle="aurora"
  title="Spider-Man"
  stats={[{ label: 'Boldness', value: 8 }]}
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

`pnpm example:web` opens a docs-style landing page with the live card gallery inside a phone bezel — tilt, foil, and ambient styles without a simulator. Export with `pnpm example:export-web` (output under `example/dist`).

On native, the same gallery runs full-screen via `DemoGallery`.

## Relationship to Worldline

[Worldline](https://github.com/worldline-dev/worldline-app) uses a richer **character card schema** for player avatars. **worldline-card** is only the **presentation layer** — bring your own data model.

## License

MIT — see [LICENSE](./LICENSE).

## Contributing

Issues and PRs welcome. Please run `pnpm typecheck` before submitting.
