import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  StatCollectibleCard,
  type CardStat,
  type CardChipInput,
} from 'worldline-card';

const ART = {
  spiderman: require('./assets/cards/spiderman-v2.png'),
  suntzu: require('./assets/cards/suntzu.png'),
  link: require('./assets/cards/selda.png'),
  hermione: require('./assets/cards/harryporter.png'),
  ada: require('./assets/cards/ada.png'),
  ash: require('./assets/cards/ash.png'),
};

const SPIDER_STATS: CardStat[] = [
  {
    label: 'Insight',
    value: 7,
    description: 'How quickly they read people, rooms, and hidden motives.',
  },
  {
    label: 'Charisma',
    value: 6,
    description: 'Presence and persuasion — how easily others lean their way.',
  },
  {
    label: 'Deception',
    value: 5,
    description: 'Skill at misdirection, cover stories, and keeping a mask on.',
  },
  {
    label: 'Strategy',
    value: 6,
    description: 'Long-game planning: setups, contingencies, and tempo control.',
  },
  {
    label: 'Composure',
    value: 5,
    description: 'Staying steady under pressure when plans go sideways.',
  },
  {
    label: 'Boldness',
    value: 8,
    description: 'Willingness to leap first — risk appetite and initiative.',
  },
  {
    label: 'Volatility',
    value: 7,
    description: 'How chaotic their swings are: brilliance and blow-ups alike.',
  },
];

const SPIDER_CHIPS: CardChipInput[] = [
  {
    label: 'Witty',
    description: 'Deflects tension with humor; keeps enemies off-balance.',
  },
  {
    label: 'Loyal',
    description: 'Will burn a lot of energy protecting people they claim.',
  },
  {
    label: 'Impulsive',
    description: 'Acts before the spreadsheet is finished — high upside, high mess.',
  },
];

type DemoGalleryProps = {
  /** Hide the in-phone chrome title when the outer landing already brands the page */
  compactChrome?: boolean;
};

/**
 * Live card gallery used by both the native example and the web phone-frame demo.
 */
export function DemoGallery({ compactChrome = false }: DemoGalleryProps) {
  return (
    <View style={styles.screen}>
      {!compactChrome ? (
        <>
          <Text style={styles.heading}>
            WORLDLINE{'\n'}-CARD
          </Text>
          <Text style={styles.subheading}>
            Tap a dotted trait or underlined stat for an explanation. Drag the
            first card to try the foil shine.
          </Text>
        </>
      ) : (
        <Text style={styles.hint}>Tap stats / traits · foil on first card</Text>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatCollectibleCard
          interactive
          holo="legendary"
          cardStyle="crimson"
          title="Spider-Man"
          artSource={ART.spiderman}
          badge={{
            label: 'Comic',
            color: '#8b3a3a',
            description: 'Source medium — this persona is rooted in comics canon.',
          }}
          franchise="Marvel"
          chips={SPIDER_CHIPS}
          stats={SPIDER_STATS}
          flavor="With great power comes great responsibility."
          footerLeft="Expr 7/10"
          footerRight="ACTIVE"
          active
        />

        <Text style={styles.section}>Card styles</Text>
        <StatCollectibleCard
          cardStyle="gold"
          title="Sun Tzu"
          artSource={ART.suntzu}
          badge={{
            label: 'History',
            color: '#8a6a2a',
            description: 'Drawn from historical / legendary sources.',
          }}
          franchise="History"
          chips={[
            {
              label: 'Strategic',
              description: 'Wins by positioning before the clash.',
            },
            {
              label: 'Calm',
              description: 'Rarely rattled; keeps the board readable.',
            },
          ]}
          stats={[
            {
              label: 'Strategy',
              value: 10,
              description: 'Mastery of tempo, terrain, and force multipliers.',
            },
            {
              label: 'Insight',
              value: 9,
              description: 'Sees the opponent’s plan two moves early.',
            },
            {
              label: 'Composure',
              value: 9,
              description: 'Keeps clarity when the field turns chaotic.',
            },
          ]}
          flavor="Victory is decided before the battle is fought."
          footerLeft="STYLE · GOLD"
        />

        <StatCollectibleCard
          cardStyle="forest"
          title="Link"
          artSource={ART.link}
          badge={{ label: 'Game', color: '#2a5f54' }}
          franchise="Zelda"
          chips={['Brave']}
          stats={[
            { label: 'Boldness', value: 9 },
            { label: 'Strategy', value: 6 },
            { label: 'Composure', value: 7 },
          ]}
          flavor="It's dangerous to go alone."
          footerLeft="STYLE · FOREST"
        />
        <StatCollectibleCard
          cardStyle="silver"
          title="Hermione"
          artSource={ART.hermione}
          badge={{ label: 'Film', color: '#5c4a6e' }}
          franchise="Harry Potter"
          chips={['Clever', 'Loyal']}
          stats={[
            { label: 'Insight', value: 9 },
            { label: 'Strategy', value: 8 },
            { label: 'Charisma', value: 6 },
          ]}
          footerLeft="STYLE · SILVER"
        />
        <StatCollectibleCard
          cardStyle="laser"
          title="Ada"
          artSource={ART.ada}
          badge={{ label: 'Science', color: '#2a6f8f' }}
          franchise="Computing"
          chips={[
            {
              label: 'Analytical',
              description: 'Turns messy systems into clear models.',
            },
            'Visionary',
          ]}
          stats={[
            { label: 'Insight', value: 10, description: 'Sees patterns others miss.' },
            { label: 'Strategy', value: 9 },
            { label: 'Charisma', value: 6 },
          ]}
          flavor="The Analytical Engine weaves algebraic patterns."
          footerLeft="STYLE · LASER"
        />
        <StatCollectibleCard
          cardStyle="classic"
          title="Ash"
          artSource={ART.ash}
          badge={{ label: 'Anime', color: '#c9a227' }}
          franchise="Pokémon"
          chips={['Optimistic', 'Loyal']}
          stats={[
            { label: 'Boldness', value: 8 },
            { label: 'Charisma', value: 7 },
            { label: 'Composure', value: 4 },
          ]}
          flavor="I wanna be the very best."
          footerLeft="STYLE · CLASSIC"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f1419',
    paddingHorizontal: 16,
  },
  heading: {
    color: '#e8eef4',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
    lineHeight: 28,
    letterSpacing: 1,
    ...(Platform.OS === 'web'
      ? {
          fontFamily: '"Big Shoulders Display", "Arial Narrow", sans-serif',
        }
      : null),
  },
  subheading: {
    color: '#8b9aab',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 20,
  },
  hint: {
    color: '#8b9aab',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    color: '#8b9aab',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 8,
  },
});
