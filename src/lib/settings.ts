export enum Action {
	NONE = 'None',
	TOGGLE_PLAYBACK = 'Toggle playback',
	REWIND = 'Rewind',
	REWIND_ALT = 'Rewind #2',
	FAST_FORWARD = 'Fast-Forward',
	FAST_FORWARD_ALT = 'Fast-Forward #2',
	PREVIOUS_SUBTITLE = 'Go to previous subtitle',
	NEXT_SUBTITLE = 'Go to next subtitle',
	RESTART_PLAYBACK = 'Restart playback',
	TOGGLE_PLAY_PAUSE = 'Toggle play and pause',
	TOGGLE_PLAYBACK_LOOP = 'Toggle playback loop',
	TOGGLE_BOOKMARK = 'Toggle bookmark',
	TOGGLE_SHOW_BOOKMARKED = 'Toggle menu bookmark filter',
	TOGGLE_MERGE = 'Toggle for merge',
	TOGGLE_SHOW_FOR_MERGE = 'Toggle menu merge filter',
	ALIGN_SUBTITLE = 'Align with book text',
	EDIT_SUBTITLE = 'Edit subtitle',
	RESTORE_SUBTITLE = 'Restore original text and time',
	COPY_SUBTITLE = 'Copy subtitle',
	EXPORT_NEW = 'Create new card',
	EXPORT_UPDATE = 'Update last created card',
	OPEN_LAST_EXPORTED_CARD = 'Open last exported card',
	CANCEL_EXPORT = 'Cancel Export',
}

export const defaultReaderActionList = new Map<Action, boolean>([
	[Action.COPY_SUBTITLE, true],
	[Action.TOGGLE_PLAYBACK, true],
	[Action.RESTART_PLAYBACK, true],
	[Action.TOGGLE_PLAY_PAUSE, true],
	[Action.TOGGLE_PLAYBACK_LOOP, true],
	[Action.TOGGLE_BOOKMARK, true],
	[Action.TOGGLE_SHOW_BOOKMARKED, false],
	[Action.TOGGLE_MERGE, true],
	[Action.TOGGLE_SHOW_FOR_MERGE, false],
	[Action.EDIT_SUBTITLE, true],
	[Action.RESTORE_SUBTITLE, true],
	[Action.EXPORT_NEW, true],
	[Action.EXPORT_UPDATE, true],
	[Action.OPEN_LAST_EXPORTED_CARD, true],
]);

export const defaultSubtitleActionList = new Map<Action, boolean>([
	[Action.RESTART_PLAYBACK, true],
	[Action.TOGGLE_BOOKMARK, true],
	[Action.TOGGLE_SHOW_BOOKMARKED, false],
	[Action.RESTORE_SUBTITLE, true],
	[Action.TOGGLE_PLAY_PAUSE, true],
	[Action.TOGGLE_MERGE, true],
	[Action.TOGGLE_SHOW_FOR_MERGE, false],
	[Action.EXPORT_NEW, true],
	[Action.TOGGLE_PLAYBACK_LOOP, true],
	[Action.EDIT_SUBTITLE, true],
	[Action.EXPORT_UPDATE, true],
]);

export const defaultFooterActionList = new Map<Action, boolean>([
	[Action.TOGGLE_PLAYBACK, true],
	[Action.REWIND_ALT, false],
	[Action.REWIND, false],
	[Action.FAST_FORWARD, false],
	[Action.FAST_FORWARD_ALT, false],
	[Action.PREVIOUS_SUBTITLE, false],
	[Action.NEXT_SUBTITLE, false],
	[Action.RESTART_PLAYBACK, false],
	[Action.TOGGLE_PLAY_PAUSE, false],
	[Action.TOGGLE_PLAYBACK_LOOP, false],
	[Action.TOGGLE_BOOKMARK, false],
	[Action.TOGGLE_SHOW_BOOKMARKED, false],
	[Action.TOGGLE_MERGE, false],
	[Action.TOGGLE_SHOW_FOR_MERGE, false],
	[Action.EDIT_SUBTITLE, false],
	[Action.RESTORE_SUBTITLE, false],
	[Action.COPY_SUBTITLE, false],
	[Action.EXPORT_NEW, false],
	[Action.EXPORT_UPDATE, false],
	[Action.OPEN_LAST_EXPORTED_CARD, false],
]);

export interface ActionListItem {
	action: Action;
	enabled: boolean;
}

export type Settings = {
	'yatsu-whispersync-menu-position': string;
	'yatsu-whispersync-hide-footer-actions': boolean;
	'yatsu-whispersync-reader-line-highlight-color': string;
	'yatsu-whispersync-reader-line-text-highlight-color': string;
	'yatsu-whispersync-reader-enable-line-highlight': boolean;
	'yatsu-whispersync-reader-enable-line-text-highlight': boolean;
	'yatsu-whispersync-reader-enable-auto-reload': boolean;
	'yatsu-whispersync-reader-enable-filesystem-api': boolean;
	'yatsu-whispersync-reader-enable-auto-scroll': boolean;
	'yatsu-whispersync-reader-enable-tracker-auto-pause': boolean;
	'yatsu-whispersync-reader-enable-vn-mode': boolean;
	'yatsu-whispersync-reader-prevent-action-on-selection': boolean;
	'yatsu-whispersync-reader-enable-menu-target': boolean;
	'yatsu-whispersync-reader-scroll-mode': ReaderScrollMode;
	'yatsu-whispersync-reader-scroll-behavior': ReaderScrollBehavior;
	'yatsu-whispersync-reader-click-action': Action;
	'yatsu-whispersync-reader-menu-open-mode': ReaderMenuOpenMode;
	'yatsu-whispersync-reader-menu-pause-mode': ReaderMenuPauseMode;
	'yatsu-whispersync-reader-menu-open-time': number;
	'yatsu-whispersync-reader-tracker-pause-threshold': number;
	'yatsu-whispersync-subtitles-enable-persist': boolean;
	'yatsu-whispersync-subtitles-enable-auto-scroll': boolean;
	'yatsu-whispersync-subtitles-copy-font-family': boolean;
	'yatsu-whispersync-subtitles-copy-font-size': boolean;
	'yatsu-whispersync-subtitles-copy-line-height': boolean;
	'yatsu-whispersync-subtitles-prevent-action-on-selection': boolean;
	'yatsu-whispersync-subtitles-click-action': Action;
	'yatsu-whispersync-subtitles-actions-visibility': SubtitleActionsVisibility;
	'yatsu-whispersync-subtitles-actions-visibility-time': number;
	'yatsu-whispersync-subtitles-global-start-padding': number;
	'yatsu-whispersync-subtitles-global-end-padding': number;
	'yatsu-whispersync-subtitles-font-family': string;
	'yatsu-whispersync-subtitles-font-size': number;
	'yatsu-whispersync-subtitles-line-height': number;
	'yatsu-whispersync-player-enable-cover': boolean;
	'yatsu-whispersync-player-enable-chapters': boolean;
	'yatsu-whispersync-player-enable-wake-lock': boolean;
	'yatsu-whispersync-player-enable-subtitle-copy': boolean;
	'yatsu-whispersync-player-enable-dictionary-detection': boolean;
	'yatsu-whispersync-player-auto-pause-mode': AutoPauseMode;
	'yatsu-whispersync-player-rewind-time': number;
	'yatsu-whispersync-player-alt-rewind-time': number;
	'yatsu-whispersync-player-fast-forward-time': number;
	'yatsu-whispersync-player-alt-fast-forward-time': number;
	'yatsu-whispersync-player-playback-rate': number;
	'yatsu-whispersync-player-playback-rate-decrease-time': number;
	'yatsu-whispersync-player-playback-rate-increase-time': number;
	'yatsu-whispersync-export-field-mode': ExportFieldMode;
	'yatsu-whispersync-export-audio-processor': AudioProcessor;
	'yatsu-whispersync-export-audio-format': AudioFormat;
	'yatsu-whispersync-export-audio-bitrate': number;
	'yatsu-whispersync-export-cover-format': ImageFormat;
	'yatsu-whispersync-export-enable-merge-selection-auto-clear': boolean;
	'yatsu-whispersync-enable-ffmpeg-log': boolean;
	'yatsu-whispersync-anki-add-subtitle-tag': boolean;
	'yatsu-whispersync-anki-add-audio-tag': boolean;
	'yatsu-whispersync-anki-enable-open-in-browser': boolean;
	'yatsu-whispersync-anki-allow-empty-key-field': boolean;
	'yatsu-whispersync-anki-tag-list': string;
	'yatsu-whispersync-anki-duplicate-mode': AnkiDuplicateMode;
	'yatsu-whispersync-anki-url': string;
	'yatsu-whispersync-anki-key': string;
	'yatsu-whispersync-anki-deck': string;
	'yatsu-whispersync-anki-update-deck': string;
	'yatsu-whispersync-anki-model': string;
	'yatsu-whispersync-anki-update-model': string;
	'yatsu-whispersync-anki-sentence-field': string;
	'yatsu-whispersync-anki-update-sentence-field': string;
	'yatsu-whispersync-anki-sound-field': string;
	'yatsu-whispersync-anki-update-sound-field': string;
	'yatsu-whispersync-anki-cover-field': string;
	'yatsu-whispersync-anki-update-cover-field': string;
	'yatsu-whispersync-action-list-of-reader': ActionListItem[];
	'yatsu-whispersync-action-list-of-subtitles': ActionListItem[];
	'yatsu-whispersync-action-list-of-footer': ActionListItem[];
	'yatsu-whispersync-keybindings-enable-time-fallback': boolean;
	'yatsu-whispersync-match-line-ignore-rp': boolean;
	'yatsu-whispersync-match-line-similarity-threshold': number;
	'yatsu-whispersync-match-line-max-attempts': number;
};

export enum SettingsMenu {
	NONE = 'none',
	READER = 'Reader',
	SUBTITLES = 'Subtitles',
	PLAYER = 'Player',
	EXPORT = 'Export',
	ANKI = 'Anki',
	KEYBINDINGS = 'Keybindings',
	READER_ACTIONS = 'Reader actions',
	SUBTITLE_ACTIONS = 'Subtitle actions',
	FOOTER_ACTIONS = 'Footer actions',
}

export enum AnkiSettingssMode {
	CREATE = 'Create card',
	UPDATE = 'Update card',
}

export enum ReaderScrollMode {
	ALWAYS = 'Always',
	PAGE = 'Page',
}

export enum ReaderScrollBehavior {
	AUTO = 'auto',
	INSTANT = 'instant',
	SMOOTH = 'smooth',
}

export enum ReaderMenuOpenMode {
	DISABLED = 'Disabled',
	CLICK = 'On click',
	HOLD = 'On hold',
}

export enum ReaderMenuPauseMode {
	DISABLED = 'Disabled',
	PAUSE = 'Pause on open',
}

export enum SubtitleActionsVisibility {
	HIDDEN = 'Hidden',
	ALWAYS = 'Always visible',
	HOVER = 'On hover',
	TOGGLE = 'Toggle on hold',
}

export enum AutoPauseMode {
	DISABLED = 'Disabled',
	MODERATE = 'Moderate',
	STRICT = 'Strict',
}

export enum AudioProcessor {
	RECORDER = 'Recorder',
	FFMPEG = 'FFMPEG',
}

export enum AudioFormat {
	MP3 = 'mp3',
	OGG = 'ogg',
	OPUS = 'opus',
}

export enum ImageFormat {
	AUTO = 'auto',
	JPEG = 'jpeg',
	PNG = 'png',
	WEBP = 'webp',
}

export enum ExportFieldMode {
	BEFORE = 'Insert before',
	AFTER = 'Insert after',
	REPLACE = 'Replace',
}

export enum AnkiDuplicateMode {
	DISABLED = 'Disabled',
	DECK = 'Deck',
	SUBDECK = 'Deck and children',
	COLLECTION = 'Collection',
}

export function getDefaultSettings(): Settings {
	return {
		'yatsu-whispersync-menu-position': 'left',
		'yatsu-whispersync-hide-footer-actions': false,
		'yatsu-whispersync-reader-line-highlight-color': '#ccfbf1',
		'yatsu-whispersync-reader-line-text-highlight-color': '#0f172a',
		'yatsu-whispersync-reader-enable-line-highlight': true,
		'yatsu-whispersync-reader-enable-line-text-highlight': true,
		'yatsu-whispersync-reader-enable-auto-reload': true,
		'yatsu-whispersync-reader-enable-filesystem-api': true,
		'yatsu-whispersync-reader-enable-auto-scroll': true,
		'yatsu-whispersync-reader-enable-tracker-auto-pause': true,
		'yatsu-whispersync-reader-enable-vn-mode': false,
		'yatsu-whispersync-reader-prevent-action-on-selection': true,
		'yatsu-whispersync-reader-enable-menu-target': true,
		'yatsu-whispersync-reader-scroll-mode': ReaderScrollMode.ALWAYS,
		'yatsu-whispersync-reader-scroll-behavior': ReaderScrollBehavior.INSTANT,
		'yatsu-whispersync-reader-click-action': Action.NONE,
		'yatsu-whispersync-reader-menu-open-mode': ReaderMenuOpenMode.CLICK,
		'yatsu-whispersync-reader-menu-pause-mode': ReaderMenuPauseMode.PAUSE,
		'yatsu-whispersync-reader-menu-open-time': 500,
		'yatsu-whispersync-reader-tracker-pause-threshold': 500,
		'yatsu-whispersync-subtitles-enable-persist': false,
		'yatsu-whispersync-subtitles-enable-auto-scroll': true,
		'yatsu-whispersync-subtitles-copy-font-family': true,
		'yatsu-whispersync-subtitles-copy-font-size': false,
		'yatsu-whispersync-subtitles-copy-line-height': false,
		'yatsu-whispersync-subtitles-prevent-action-on-selection': true,
		'yatsu-whispersync-subtitles-click-action': Action.RESTART_PLAYBACK,
		'yatsu-whispersync-subtitles-actions-visibility': SubtitleActionsVisibility.HOVER,
		'yatsu-whispersync-subtitles-actions-visibility-time': 500,
		'yatsu-whispersync-subtitles-global-start-padding': 0,
		'yatsu-whispersync-subtitles-global-end-padding': 0,
		'yatsu-whispersync-subtitles-font-family': 'Noto Serif JP',
		'yatsu-whispersync-subtitles-font-size': 20,
		'yatsu-whispersync-subtitles-line-height': 1.65,
		'yatsu-whispersync-player-enable-cover': true,
		'yatsu-whispersync-player-enable-chapters': true,
		'yatsu-whispersync-player-enable-wake-lock': false,
		'yatsu-whispersync-player-enable-subtitle-copy': false,
		'yatsu-whispersync-player-enable-dictionary-detection': false,
		'yatsu-whispersync-player-auto-pause-mode': AutoPauseMode.DISABLED,
		'yatsu-whispersync-player-rewind-time': 5,
		'yatsu-whispersync-player-alt-rewind-time': 10,
		'yatsu-whispersync-player-fast-forward-time': 5,
		'yatsu-whispersync-player-alt-fast-forward-time': 10,
		'yatsu-whispersync-player-playback-rate': 1,
		'yatsu-whispersync-player-playback-rate-decrease-time': 0.05,
		'yatsu-whispersync-player-playback-rate-increase-time': 0.05,
		'yatsu-whispersync-export-field-mode': ExportFieldMode.AFTER,
		'yatsu-whispersync-export-audio-processor': AudioProcessor.RECORDER,
		'yatsu-whispersync-export-audio-format': AudioFormat.MP3,
		'yatsu-whispersync-export-audio-bitrate': 128,
		'yatsu-whispersync-export-cover-format': ImageFormat.AUTO,
		'yatsu-whispersync-export-enable-merge-selection-auto-clear': false,
		'yatsu-whispersync-enable-ffmpeg-log': false,
		'yatsu-whispersync-anki-add-subtitle-tag': false,
		'yatsu-whispersync-anki-add-audio-tag': false,
		'yatsu-whispersync-anki-enable-open-in-browser': false,
		'yatsu-whispersync-anki-allow-empty-key-field': false,
		'yatsu-whispersync-anki-tag-list': '',
		'yatsu-whispersync-anki-duplicate-mode': AnkiDuplicateMode.DISABLED,
		'yatsu-whispersync-anki-url': 'http://localhost:8765',
		'yatsu-whispersync-anki-key': '',
		'yatsu-whispersync-anki-deck': '',
		'yatsu-whispersync-anki-update-deck': '',
		'yatsu-whispersync-anki-model': '',
		'yatsu-whispersync-anki-update-model': '',
		'yatsu-whispersync-anki-sentence-field': '',
		'yatsu-whispersync-anki-update-sentence-field': '',
		'yatsu-whispersync-anki-sound-field': '',
		'yatsu-whispersync-anki-update-sound-field': '',
		'yatsu-whispersync-anki-cover-field': '',
		'yatsu-whispersync-anki-update-cover-field': '',
		'yatsu-whispersync-keybindings-enable-time-fallback': false,
		'yatsu-whispersync-action-list-of-reader': transformToActionList(defaultReaderActionList),
		'yatsu-whispersync-action-list-of-subtitles': transformToActionList(defaultSubtitleActionList),
		'yatsu-whispersync-action-list-of-footer': transformToActionList(defaultFooterActionList),
		'yatsu-whispersync-match-line-ignore-rp': false,
		'yatsu-whispersync-match-line-similarity-threshold': 0.9,
		'yatsu-whispersync-match-line-max-attempts': 50,
	};
}

export function getDefaultSetting<T>(key: keyof Settings) {
	return defaultSettings[key] as T;
}

const defaultSettings = getDefaultSettings();

function transformToActionList(data: Map<Action, boolean>) {
	const actionList: ActionListItem[] = [];
	const entries = [...data.entries()];

	for (let index = 0, { length } = entries; index < length; index += 1) {
		const [action, enabled] = entries[index];

		actionList.push({ action, enabled });
	}

	return actionList;
}
