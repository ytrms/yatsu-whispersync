import { describe, expect, it } from 'vitest';
import {
	Action,
	AudioProcessor,
	ReaderMenuOpenMode,
	ReaderScrollBehavior,
	SubtitleActionsVisibility,
	getDefaultSetting,
	getDefaultSettings,
} from './settings';

describe('default settings', () => {
	it('keeps Yatsu reader integration defaults stable', () => {
		const defaults = getDefaultSettings();

		expect(defaults['yatsu-whispersync-reader-line-highlight-color']).toBe('#ccfbf1');
		expect(defaults['yatsu-whispersync-reader-line-text-highlight-color']).toBe('#0f172a');
		expect(defaults['yatsu-whispersync-reader-enable-auto-reload']).toBe(true);
		expect(defaults['yatsu-whispersync-reader-enable-filesystem-api']).toBe(true);
		expect(defaults['yatsu-whispersync-reader-enable-vn-mode']).toBe(false);
		expect(defaults['yatsu-whispersync-reader-scroll-behavior']).toBe(ReaderScrollBehavior.INSTANT);
		expect(defaults['yatsu-whispersync-reader-menu-open-mode']).toBe(ReaderMenuOpenMode.CLICK);
		expect(defaults['yatsu-whispersync-subtitles-actions-visibility']).toBe(SubtitleActionsVisibility.HOVER);
		expect(defaults['yatsu-whispersync-export-audio-processor']).toBe(AudioProcessor.RECORDER);
		expect(defaults['yatsu-whispersync-anki-url']).toBe('http://localhost:8765');
		expect(defaults['yatsu-whispersync-match-line-similarity-threshold']).toBe(0.9);
	});

	it('returns individual defaults by storage key', () => {
		expect(getDefaultSetting('yatsu-whispersync-player-rewind-time')).toBe(5);
		expect(getDefaultSetting('yatsu-whispersync-reader-click-action')).toBe(Action.NONE);
		expect(getDefaultSetting('yatsu-whispersync-subtitles-font-family')).toBe('Noto Serif JP');
	});

	it('exposes the expected reader action defaults', () => {
		const defaults = getDefaultSettings();

		expect(defaults['yatsu-whispersync-action-list-of-reader']).toEqual(
			expect.arrayContaining([
				{ action: Action.COPY_SUBTITLE, enabled: true },
				{ action: Action.TOGGLE_PLAYBACK, enabled: true },
				{ action: Action.TOGGLE_SHOW_BOOKMARKED, enabled: false },
				{ action: Action.EXPORT_NEW, enabled: true },
			]),
		);
	});

	it('keeps footer controls opt-in except playback', () => {
		const defaults = getDefaultSettings();
		const footerActions = defaults['yatsu-whispersync-action-list-of-footer'];

		expect(footerActions.find(({ action }) => action === Action.TOGGLE_PLAYBACK)?.enabled).toBe(true);
		expect(footerActions.find(({ action }) => action === Action.REWIND)?.enabled).toBe(false);
		expect(footerActions.find(({ action }) => action === Action.COPY_SUBTITLE)?.enabled).toBe(false);
		expect(footerActions.find(({ action }) => action === Action.EXPORT_NEW)?.enabled).toBe(false);
	});

	it('creates fresh action list arrays for callers that need to mutate a copy', () => {
		const first = getDefaultSettings();
		const second = getDefaultSettings();

		first['yatsu-whispersync-action-list-of-reader'][0].enabled = false;

		expect(second['yatsu-whispersync-action-list-of-reader'][0].enabled).toBe(true);
	});
});
