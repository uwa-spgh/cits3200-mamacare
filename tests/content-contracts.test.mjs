import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { appHarness, root, act, knownBug } from './helpers/app-harness.mjs';
import { ARTICLES, estimateReadTime } from '../src/constants/articles.ts';
import { EDUCATION_TOPICS } from '../src/constants/health-education.ts';
import { DANGER_SIGNS, GENERAL_DANGER_SIGN_IDS, ANC_CONTACT_DANGER_SIGNS } from '../src/constants/danger-signs.ts';
import { TUTORIAL_STEPS, stepTranslationKeys } from '../src/tutorial/steps.ts';

const translations = Object.fromEntries(['en', 'ne'].map(language => [language, JSON.parse(readFileSync(resolve(root, `src/localization/${language}.json`), 'utf8'))]));
function get(object, path) { return path.split('.').reduce((value, key) => value?.[key], object); }
function leaves(object, path = '') {
  if (typeof object !== 'object' || object === null) return { [path]: object };
  return Object.fromEntries(Object.entries(object).flatMap(([key, value]) => Object.entries(leaves(value, path ? `${path}.${key}` : key))));
}
test('all Library topics have a unique matching article and text in both languages', () => {
  assert.equal(new Set(EDUCATION_TOPICS.map(topic => topic.id)).size, EDUCATION_TOPICS.length);
  assert.equal(Object.keys(ARTICLES).length, EDUCATION_TOPICS.length);
  for (const topic of EDUCATION_TOPICS) {
    assert.equal(ARTICLES[topic.id].id, topic.id);
    assert.ok(ARTICLES[topic.id].sections.length > 0);
    for (const language of ['en', 'ne']) {
      for (const field of ['title', 'description']) assert.ok(get(translations[language], `libraryScreen.topics.${topic.id}.${field}`)?.trim());
      assert.ok(get(translations[language], `articles.${topic.id}.title`)?.trim());
    }
  }
});
test('article section translations retain every paragraph/list and use registered link destinations', () => {
  for (const article of Object.values(ARTICLES)) for (const language of ['en', 'ne']) {
    for (const [index, section] of article.sections.entries()) {
      for (const field of ['heading', 'intro', 'body', 'note', 'bullets']) {
        if (!section[field]) continue;
        const translated = get(translations[language], `articles.${article.id}.sections.${index}.${field}`);
        assert.ok(translated, `${language} ${article.id} section ${index} ${field}`);
        if (Array.isArray(section[field])) assert.equal(translated.length, section[field].length);
      }
      if (section.link) assert.ok(['DangerSigns', 'Article', 'AddMedication'].includes(section.link.screen));
    }
  }
});
test('all danger sign references and eight ANC contact translations resolve', () => {
  assert.deepEqual(ANC_CONTACT_DANGER_SIGNS.map(contact => contact.contact), [1, 2, 3, 4, 5, 6, 7, 8]);
  for (const id of [...GENERAL_DANGER_SIGN_IDS, ...ANC_CONTACT_DANGER_SIGNS.flatMap(contact => contact.signIds)]) {
    assert.equal(DANGER_SIGNS[id]?.id, id);
    assert.ok(['hospital', 'emergency'].includes(DANGER_SIGNS[id].urgency));
    for (const language of ['en', 'ne']) assert.ok(get(translations[language], `dangerSignsScreen.signs.${id}`)?.trim());
  }
  for (const contact of ANC_CONTACT_DANGER_SIGNS) for (const language of ['en', 'ne']) assert.ok(get(translations[language], `dangerSignsScreen.contacts.${contact.contact}`)?.trim());
});
test('article read time has a one-minute minimum and counts section/note/good-to-know text', () => {
  assert.equal(estimateReadTime({ id: 'fixture', title: 'Fixture', sections: [] }), 1);
  assert.equal(estimateReadTime({ id: 'fixture', title: 'Fixture', sections: [{ heading: 'Fixture', body: 'word '.repeat(600) }] }), 3);
  assert.equal(estimateReadTime({ id: 'fixture', title: 'Fixture', sections: [{ heading: 'Fixture', note: 'word '.repeat(300) }], goodToKnow: { heading: 'Fixture', bullets: ['word '.repeat(300)] } }), 3);
});
test('matching localization keys have the same interpolation variables', () => {
  const en = leaves(translations.en), ne = leaves(translations.ne);
  const variables = value => typeof value === 'string' ? [...value.matchAll(/{{\s*([^},]+)[^}]*}}/g)].map(match => match[1].trim()).sort() : [];
  for (const key of Object.keys(ne)) assert.deepEqual(variables(en[key]), variables(ne[key]), key);
});
test('tutorial contains five unique targets with complete English text', () => {
  assert.equal(TUTORIAL_STEPS.length, 5);
  assert.equal(new Set(TUTORIAL_STEPS.map(step => step.target)).size, 5);
  for (const step of TUTORIAL_STEPS) for (const key of stepTranslationKeys(step)) assert.ok(get(translations.en, key)?.trim(), key);
});
test('both icon renderers support every AppIcon family and FontAwesome style', async t => {
  const h = appHarness();
  const components = [h.load('src/components/health-education/danger-sign-icon.tsx').DangerSignIconView, h.load('src/components/health-education/app-icon.tsx').AppIconView];
  for (const Component of components) for (const [family, expected, name] of [
    ['ionicons', 'Ionicons', 'water-outline'], ['entypo', 'Entypo', 'water'], ['material', 'MaterialIcons', 'pregnant-woman'],
    ['material-community', 'MaterialCommunityIcons', 'stomach'], ['font-awesome-5', 'FontAwesome5', 'baby-carriage'], ['font-awesome-6', 'FontAwesome6', 'baby'],
  ]) {
    for (const style of family.startsWith('font-awesome') ? ['solid', 'regular', 'brand'] : [undefined]) {
      const renderer = await h.mount(Component, { icon: { family, name, style }, size: 20, color: '#123456' });
      const icon = renderer.root.findByType(expected);
      assert.equal(icon.props.name, name);
      assert.equal(icon.props.size, 20);
      assert.equal(icon.props.color, '#123456');
      if (style) assert.equal(icon.props[style], true);
      await act(async () => renderer.unmount());
    }
  }
});
knownBug(test, 'BUG-13', 'Nepali includes all English localization keys', () => {
  const missing = Object.keys(leaves(translations.en)).filter(key => get(translations.ne, key) === undefined);
  assert.equal(missing.length, 0, `Missing Nepali keys: ${missing.join(', ')}`);
});
