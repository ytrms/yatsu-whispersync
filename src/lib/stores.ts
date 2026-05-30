import type { BooksDB, BooksDBData, ExtensionData } from './db';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import {
	Tabs,
	type Subtitle,
	type AudioChapter,
	createDialogsStore,
	type PlayLineData,
	type SubtitleChange,
	type ActiveSubtitle,
	type BookMatch,
} from './general';
import type { IDBPDatabase } from 'idb';
import type { MediaInfo } from 'mediainfo.js';
import type { ActionListItem, Settings } from './settings';
import { writable, type Subscriber, type Invalidator, type Unsubscriber } from 'svelte/store';
import { writableBooleanStore } from './writeables/writeable-boolean-store';
import { writableNumberStore } from './writeables/writeable-number-store';
import { writeableArrayStore } from './writeables/writeable-object-store';
import { revertWriteable } from './writeables/writeable-revert-store';
import { writableStringStore } from './writeables/writeable-string-store';

export interface SettingsStore<T> {
	subscribe: (this: void, run: Subscriber<T>, invalidate?: Invalidator<T> | undefined) => Unsubscriber;
	set: (value: T) => void;
	get: () => T;
	key: () => keyof Settings;
	reset: () => void;
}

export const isMobile$ = writable<boolean>(false);

export const filesystemApiEnabled$ = writable<boolean>(false);

export const isLoading$ = revertWriteable<boolean>(true);

export const lastError$ = revertWriteable<string>('');

export const dialogs$ = createDialogsStore();

export const skipKeyListener$ = revertWriteable<boolean>(false);

export const booksDB$ = writable<IDBPDatabase<BooksDB>>();

export const ffmpeg$ = writable<FFmpeg | undefined>();

export const mediaInfo$ = writable<MediaInfo | undefined>();

export const bookData$ = revertWriteable<BooksDBData>({ id: 0, title: '', elementHtml: '', lastBookModified: 0 });

export const bookMatched$ = revertWriteable<BookMatch>({ matchedBy: '', matchedOn: 0 });

export const extensionData$ = revertWriteable<ExtensionData>({ title: '' });

export const currentSubtitleFile$ = revertWriteable<File | undefined>();

export const currentSubtitles$ = revertWriteable<Map<string, Subtitle>>(new Map());

export const currentAudioFile$ = writable<File | undefined>();

export const currentCoverUrl$ = writable<string>('');

export const currentAudioSourceUrl$ = writable<string>('');

export const currentAudioChapters$ = writable<AudioChapter[]>([]);

export const currentAudioLoaded$ = writable<boolean>(false);

export const canExportToAnki$ = writable<boolean>(false);

export const isAnkiconnectAndroid$ = writable<boolean>(false);

export const lastExportedCardId$ = writable<number>(0);

export const exportProgress$ = revertWriteable<number>(0);

export const exportCancelController$ = revertWriteable<AbortController | undefined>();

export const isRecording$ = writable<boolean>(false);

export const togglePlaybackTitle$ = writable<string>('');

export const rewindTitle$ = writable<string>('');

export const altRewindTitle$ = writable<string>('');

export const fastForwardTitle$ = writable<string>('');

export const altFastForwardTitle$ = writable<string>('');

export const previousSubtitleTitle$ = writable<string>('');

export const nextSubtitleTitle$ = writable<string>('');

export const restartPlaybackTitle$ = writable<string>('');

export const togglePlayPauseTitle$ = writable<string>('');

export const togglePlaybackLoopTitle$ = writable<string>('');

export const toggleBookmarkTitle$ = writable<string>('');

export const toggleShowBookmarkedSubtitlesTitle$ = writable<string>('');

export const toggleMergeTitle$ = writable<string>('');

export const toggleShowSubtitlesForMergeTitle$ = writable<string>('');

export const editSubtitleTitle$ = writable<string>('');

export const restoreSubtitleTitle$ = writable<string>('');

export const exportNewTitle$ = writable<string>('');

export const exportUpdateTitle$ = writable<string>('');

export const openLastExportedCardTitle$ = writable<string>('');

export const exportCancelTitle$ = writable<string>('');

export const currentMenuPosition$ = writableStringStore()('yatsu-whispersync-menu-position', 'left');

export const hideFooterActions$ = writableBooleanStore()('yatsu-whispersync-hide-footer-actions', false);

export const currentTab$ = revertWriteable<Tabs>(Tabs.AUDIOBOOK);

export const showBookmarkedSubtitlesOnly$ = writable<boolean>(false);

export const bookmarkedSubtitles$ = revertWriteable<Set<string>>(new Set<string>());

export const showSubtitlesForMergeOnly$ = writable<boolean>(false);

export const subtitlesForMerge$ = revertWriteable<Set<string>>(new Set<string>());

export const activeSubtitle$ = revertWriteable<ActiveSubtitle>({ previous: '', current: '', useTimeFallback: true });

export const readerActionSubtitle$ = revertWriteable<Subtitle | undefined>();

export const paused$ = revertWriteable<boolean>(true);

export const currentTime$ = revertWriteable<number>(0);

export const duration$ = revertWriteable<number>(0);

export const muted$ = revertWriteable<boolean>(false);

export const playbackRate$ = writableNumberStore()('yatsu-whispersync-player-playback-rate', 1);

export const playLine$ = revertWriteable<PlayLineData>();

export const subtitleChange$ = revertWriteable<SubtitleChange>();

export const settings$ = {
	readerLineHighlightColor$: writableStringStore()('yatsu-whispersync-reader-line-highlight-color'),
	readerLineTextHighlightColor$: writableStringStore()('yatsu-whispersync-reader-line-text-highlight-color'),
	readerEnableLineHighlight$: writableBooleanStore()('yatsu-whispersync-reader-enable-line-highlight'),
	readerEnableLineTextHighlight$: writableBooleanStore()('yatsu-whispersync-reader-enable-line-text-highlight'),
	readerEnableAutoReload$: writableBooleanStore()('yatsu-whispersync-reader-enable-auto-reload'),
	readerEnableFilesystemApi$: writableBooleanStore()('yatsu-whispersync-reader-enable-filesystem-api'),
	readerEnableAutoScroll$: writableBooleanStore()('yatsu-whispersync-reader-enable-auto-scroll'),
	readerEnableTrackerAutoPause$: writableBooleanStore()('yatsu-whispersync-reader-enable-tracker-auto-pause'),
	readerEnableVNMode$: writableBooleanStore()('yatsu-whispersync-reader-enable-vn-mode'),
	readerPreventActionOnSelection$: writableBooleanStore()('yatsu-whispersync-reader-prevent-action-on-selection'),
	readerEnableMenuTarget$: writableBooleanStore()('yatsu-whispersync-reader-enable-menu-target'),
	readerScrollMode$: writableStringStore()('yatsu-whispersync-reader-scroll-mode'),
	readerScrollBehavior$: writableStringStore()('yatsu-whispersync-reader-scroll-behavior'),
	readerClickAction$: writableStringStore()('yatsu-whispersync-reader-click-action'),
	readerMenuOpenMode$: writableStringStore()('yatsu-whispersync-reader-menu-open-mode'),
	readerMenuPauseMode$: writableStringStore()('yatsu-whispersync-reader-menu-pause-mode'),
	readerMenuOpenTime$: writableNumberStore()('yatsu-whispersync-reader-menu-open-time'),
	readerTrackerPauseThreshold$: writableNumberStore()('yatsu-whispersync-reader-tracker-pause-threshold'),
	subtitlesEnablePersist$: writableBooleanStore()('yatsu-whispersync-subtitles-enable-persist'),
	subtitlesEnableAutoScroll$: writableBooleanStore()('yatsu-whispersync-subtitles-enable-auto-scroll'),
	subtitlesCopyFontFamily$: writableBooleanStore()('yatsu-whispersync-subtitles-copy-font-family'),
	subtitlesCopyFontSize$: writableBooleanStore()('yatsu-whispersync-subtitles-copy-font-size'),
	subtitlesCopyLineHeight$: writableBooleanStore()('yatsu-whispersync-subtitles-copy-line-height'),
	subtitlePreventActionOnSelection$: writableBooleanStore()('yatsu-whispersync-subtitles-prevent-action-on-selection'),
	subtitlesClickAction$: writableStringStore()('yatsu-whispersync-subtitles-click-action'),
	subtitlesActionsVisibility$: writableStringStore()('yatsu-whispersync-subtitles-actions-visibility'),
	subtitlesActionsVisibilityTime$: writableNumberStore()('yatsu-whispersync-subtitles-actions-visibility-time'),
	subtitlesGlobalStartPadding$: writableNumberStore()('yatsu-whispersync-subtitles-global-start-padding'),
	subtitlesGlobalEndPadding$: writableNumberStore()('yatsu-whispersync-subtitles-global-end-padding'),
	subtitlesFontFamily$: writableStringStore()('yatsu-whispersync-subtitles-font-family'),
	subtitlesFontSize$: writableNumberStore()('yatsu-whispersync-subtitles-font-size'),
	subtitlesLineHeight$: writableNumberStore()('yatsu-whispersync-subtitles-line-height'),
	playerEnableCover$: writableBooleanStore()('yatsu-whispersync-player-enable-cover'),
	playerEnableChapters$: writableBooleanStore()('yatsu-whispersync-player-enable-chapters'),
	playerEnableWakeLock$: writableBooleanStore()('yatsu-whispersync-player-enable-wake-lock'),
	playerEnableSubtitleCopy$: writableBooleanStore()('yatsu-whispersync-player-enable-subtitle-copy'),
	playerEnableDictionaryDetection$: writableBooleanStore()('yatsu-whispersync-player-enable-dictionary-detection'),
	playerAutoPauseMode$: writableStringStore()('yatsu-whispersync-player-auto-pause-mode'),
	playerRewindTime$: writableNumberStore()('yatsu-whispersync-player-rewind-time'),
	playerAltRewindTime$: writableNumberStore()('yatsu-whispersync-player-alt-rewind-time'),
	playerFastForwardTime$: writableNumberStore()('yatsu-whispersync-player-fast-forward-time'),
	playerAltFastForwardTime$: writableNumberStore()('yatsu-whispersync-player-alt-fast-forward-time'),
	playerPlaybackRateDecreaseTime$: writableNumberStore()('yatsu-whispersync-player-playback-rate-decrease-time'),
	playerPlaybackRateIncreaseTime$: writableNumberStore()('yatsu-whispersync-player-playback-rate-increase-time'),
	exportFieldMode$: writableStringStore()('yatsu-whispersync-export-field-mode'),
	exportAudioProcessor$: writableStringStore()('yatsu-whispersync-export-audio-processor'),
	exportAudioFormat$: writableStringStore()('yatsu-whispersync-export-audio-format'),
	exportAudioBitrate$: writableNumberStore()('yatsu-whispersync-export-audio-bitrate'),
	exportCoverFormat$: writableStringStore()('yatsu-whispersync-export-cover-format'),
	exportEnableMergeSelectionAutoClear$: writableBooleanStore()(
		'yatsu-whispersync-export-enable-merge-selection-auto-clear',
	),
	enableFFMPEGLog$: writableBooleanStore()('yatsu-whispersync-enable-ffmpeg-log'),
	ankiAddSubtitleTag$: writableBooleanStore()('yatsu-whispersync-anki-add-subtitle-tag'),
	ankiAddAudioTag$: writableBooleanStore()('yatsu-whispersync-anki-add-audio-tag'),
	ankiAllowEmptyKeyField$: writableBooleanStore()('yatsu-whispersync-anki-allow-empty-key-field'),
	ankiTagList$: writableStringStore()('yatsu-whispersync-anki-tag-list'),
	ankiDuplicateMode$: writableStringStore()('yatsu-whispersync-anki-duplicate-mode'),
	ankiUrl$: writableStringStore()('yatsu-whispersync-anki-url'),
	ankiKey$: writableStringStore()('yatsu-whispersync-anki-key'),
	ankiDeck$: writableStringStore()('yatsu-whispersync-anki-deck'),
	ankiUpdateDeck$: writableStringStore()('yatsu-whispersync-anki-update-deck'),
	ankiModel$: writableStringStore()('yatsu-whispersync-anki-model'),
	ankiUpdateModel$: writableStringStore()('yatsu-whispersync-anki-update-model'),
	ankiSentenceField$: writableStringStore()('yatsu-whispersync-anki-sentence-field'),
	ankiUpdateSentenceField$: writableStringStore()('yatsu-whispersync-anki-update-sentence-field'),
	ankiSoundField$: writableStringStore()('yatsu-whispersync-anki-sound-field'),
	ankiUpdateSoundField$: writableStringStore()('yatsu-whispersync-anki-update-sound-field'),
	ankiCoverField$: writableStringStore()('yatsu-whispersync-anki-cover-field'),
	ankiUpdateCoverField$: writableStringStore()('yatsu-whispersync-anki-update-cover-field'),
	ankiEnableOpenInBrowser$: writableBooleanStore()('yatsu-whispersync-anki-enable-open-in-browser'),
	actionListOfReader$: writeableArrayStore<ActionListItem>()('yatsu-whispersync-action-list-of-reader'),
	actionListOfSubtitles$: writeableArrayStore<ActionListItem>()('yatsu-whispersync-action-list-of-subtitles'),
	actionListOfFooter$: writeableArrayStore<ActionListItem>()('yatsu-whispersync-action-list-of-footer'),
	keybindingsEnableTimeFallback$: writableBooleanStore()('yatsu-whispersync-keybindings-enable-time-fallback'),
	matchLineIgnoreRp$: writableBooleanStore()('yatsu-whispersync-match-line-ignore-rp'),
	matchLineSimilarityThreshold$: writableNumberStore()('yatsu-whispersync-match-line-similarity-threshold'),
	matchLineMaxAttempts$: writableNumberStore()('yatsu-whispersync-match-line-max-attempts'),
};
