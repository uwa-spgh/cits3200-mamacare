import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { act, create } from 'react-test-renderer';
import ts from 'typescript';
import { createInstance } from 'i18next';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const requirePackage = createRequire(resolve(root, 'package.json'));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Execute real app modules with real React hooks. Only device APIs, navigation,
// graphics and storage are replaced. No application business logic is copied.
export function appHarness({ stored = {}, language = 'en', now = new Date(2026, 9, 9, 12), platform = 'web' } = {}) {
  const values = new Map(Object.entries(stored));
  const writes = [];
  const alerts = [];
  const navigationCalls = [];
  const listeners = new Set();
  const timers = new Map();
  const cache = new Map();
  let clock = now.getTime();
  let timerId = 0;
  const storage = {
    async getItem(key) { return values.get(key) ?? null; },
    async setItem(key, value) { writes.push({ key, value }); values.set(key, value); },
    async removeItem(key) { values.delete(key); },
  };
  const navigation = {
    navigate(...args) { navigationCalls.push(['navigate', ...args]); },
    goBack() { navigationCalls.push(['back']); },
    reset(...args) { navigationCalls.push(['reset', ...args]); },
  };
  const route = { key: 'audit', name: 'Audit', params: {} };
  let plannerRoute = 'PlannerSchedule';
  const i18n = createInstance();
  i18n.init({ lng: language, fallbackLng: 'en', initImmediate: false, interpolation: { escapeValue: false }, resources: {
    en: { translation: JSON.parse(readFileSync(resolve(root, 'src/localization/en.json'), 'utf8')) },
    ne: { translation: JSON.parse(readFileSync(resolve(root, 'src/localization/ne.json'), 'utf8')) },
  } });
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const rn = {
    ...Object.fromEntries(['View', 'Text', 'TextInput', 'Pressable', 'TouchableOpacity', 'ScrollView', 'Modal', 'Switch', 'Image', 'ActivityIndicator'].map(name => [name, name])),
    StyleSheet: { create: value => value, hairlineWidth: 1, absoluteFill: {}, absoluteFillObject: {} },
    Platform: { OS: platform, select: values => values[platform] ?? values.default },
    StatusBar: { currentHeight: 0 },
    Alert: { alert: (...args) => alerts.push(args) },
    AppState: { addEventListener: (_event, callback) => { listeners.add(callback); return { remove: () => listeners.delete(callback) }; } },
    Linking: { openSettings: async () => navigationCalls.push(['settings']), openURL: async url => navigationCalls.push(['url', url]) },
    AccessibilityInfo: { announceForAccessibility: () => {} },
    useWindowDimensions: () => ({ width: 390, height: 844 }),
  };
  const navModule = { useNavigation: () => navigation, useRoute: () => route,
    useFocusEffect: callback => React.useEffect(callback, [callback]) };
  const notificationCalls = [];
  const mocks = new Map([
    ['react-native', rn],
    ['react-native-gesture-handler', { ScrollView: 'ScrollView' }],
    ['react-native-safe-area-context', { SafeAreaView: 'SafeAreaView', useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }],
    ['react-native-size-matters', { s: n => n, vs: n => n }],
    ['@react-native-async-storage/async-storage', storage],
    ['@react-native-community/datetimepicker', { __esModule: true, default: 'DateTimePicker', DateTimePickerAndroid: { open: () => {} } }],
    ['react-native-actions-sheet', { SheetManager: { show: async () => 'Female', hide: async () => {} } }],
    ['expo-router', navModule],
    ['expo-router/react-navigation', navModule],
    ['react-i18next', { useTranslation: () => ({ t: i18n.t.bind(i18n), i18n }) }],
    ['react-native-svg', { __esModule: true, default: 'Svg', Circle: 'Circle', Path: 'Path' }],
    [resolve(root, 'src/localization/i18n.ts'), { __esModule: true, default: i18n }],
    [resolve(root, 'src/components/headers/HomeHeader.tsx'), { __esModule: true, default: () => React.createElement('Header') }],
    [resolve(root, 'src/tutorial/index.ts'), { useTutorialAutoStart() {} }],
  ]);
  mocks.set('expo-router/js-stack', { createStackNavigator: () => ({
    Navigator: ({ children }) => React.Children.toArray(children).find(child => child.props.name === plannerRoute) ?? null,
    Screen: ({ children, component }) => component ? React.createElement(component) : typeof children === 'function' ? children({ navigation, route }) : children,
  }) });
  const providerNotifications = {
    MEDICATION_STORAGE_KEY: 'mamacare:medications', PLANNER_STORAGE_KEY: 'mamacare:planner',
    syncAllNotifications: async () => { notificationCalls.push('sync'); },
  };
  // Tests of the notification service remove this stub and inject its adapter.
  mocks.set(resolve(root, 'src/notifications/notificationService.ts'), providerNotifications);
  function load(filename) {
    filename = resolve(root, filename);
    if (mocks.has(filename)) return mocks.get(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const code = ts.transpileModule(readFileSync(filename, 'utf8'), { fileName: filename,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    function localRequire(name) {
      if (mocks.has(name)) return mocks.get(name);
      if (name.startsWith('@expo/vector-icons/')) return name.split('/').at(-1);
      if (name === '@expo/vector-icons') return Object.fromEntries(['Entypo', 'FontAwesome5', 'FontAwesome6', 'Ionicons', 'MaterialCommunityIcons', 'MaterialIcons'].map(name => [name, name]));
      if (!name.startsWith('.')) return requirePackage(name);
      const base = resolve(dirname(filename), name);
      let target = ['', '.ts', '.tsx', '.json', '/index.ts'].map(suffix => base + suffix).find(path => existsSync(path) && extname(path));
      if (!target) throw new Error(`Unresolved app import ${name} in ${filename}`);
      if (target.endsWith('/DateInput.tsx')) target = target.replace('.tsx', '.web.tsx');
      if (mocks.has(target)) return mocks.get(target);
      if (target.endsWith('.json')) return JSON.parse(readFileSync(target, 'utf8'));
      if (/\.(png|jpg|ttf)$/.test(target)) return target;
      return load(target);
    }
    const context = { module, exports: module.exports, require: localRequire, console, Date: ClockDate,
      setInterval: (callback, delay) => { const id = ++timerId; timers.set(id, { callback, delay }); return id; },
      clearInterval: id => timers.delete(id), setTimeout, clearTimeout, Intl, URL, Promise };
    runInNewContext(code, context, { filename });
    return module.exports;
  }
  async function mount(Component, props = {}) {
    let renderer;
    await act(async () => { renderer = create(React.createElement(Component, props)); });
    return renderer;
  }
  async function flush() { await act(async () => { await new Promise(resolve => setImmediate(resolve)); }); }
  return { load, mocks, storage, values, writes, alerts, navigationCalls, navigation, route, rn, timers, listeners, notificationCalls, i18n, mount, flush,
    setClock(value) { clock = value.getTime(); },
    setPlannerRoute(value, params = {}) { plannerRoute = value; route.params = params; },
    async tick() { await act(async () => { for (const { callback } of [...timers.values()]) callback(); }); },
  };
}

export function text(node) {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(text).join(' ');
  return text(node.children);
}
export function pressWithText(renderer, label, type = 'Pressable') {
  const match = renderer.root.findAllByType(type).find(node => text(node).includes(label) &&
    !node.findAllByType(type).some(child => child !== node && text(child).includes(label)));
  if (!match) throw new Error(`No ${type} contains ${JSON.stringify(label)}`);
  return act(async () => { await match.props.onPress({ stopPropagation() {} }); });
}
export function knownBug(test, id, name, fn) {
  test(`${id}: ${name}`, { todo: process.env.MAMACARE_STRICT_KNOWN_BUGS !== '1' && `Open defect; see docs/BUG_REPORT.md#${id.toLowerCase()}` }, fn);
}
export { React, act };
