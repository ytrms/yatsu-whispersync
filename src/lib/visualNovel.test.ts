import { describe, expect, it, vi } from 'vitest';
import {
	createVisualNovelPageSubtitleState,
	filterAlreadyStartedLeadingSubtitles,
	filterPreviouslyVisibleLeadingSubtitles,
	getVisualNovelBookContentElement,
	isForwardVisualNovelPageChange,
	shouldPlayVisualNovelPageChange,
} from './visualNovel';

describe('visual novel page changes', () => {
	it('plays only user-initiated visual novel page changes when VN mode is enabled', () => {
		expect(shouldPlayVisualNovelPageChange({ viewMode: 'visual-novel', userInitiated: true }, true)).toBe(true);
		expect(shouldPlayVisualNovelPageChange({ viewMode: 'visual-novel', userInitiated: true }, false)).toBe(false);
		expect(shouldPlayVisualNovelPageChange({ viewMode: 'visual-novel', userInitiated: false }, true)).toBe(false);
		expect(shouldPlayVisualNovelPageChange({ viewMode: 'paginated', userInitiated: true }, true)).toBe(false);
		expect(shouldPlayVisualNovelPageChange(undefined, true)).toBe(false);
	});

	it('stores subtitle ids with the current visual novel page index', () => {
		const detail = { visualNovel: { index: 4 } };
		const subtitles = [{ id: 'sub-1' }, { id: 'sub-2' }];

		expect(createVisualNovelPageSubtitleState(detail, subtitles)).toEqual({
			pageIndex: 4,
			subtitleIds: ['sub-1', 'sub-2'],
		});
		expect(createVisualNovelPageSubtitleState({}, subtitles)).toBeUndefined();
	});

	it('skips subtitles already visible at the end of the previous page when moving forward', () => {
		const previousState = {
			pageIndex: 2,
			subtitleIds: ['sub-10', 'sub-11'],
		};
		const subtitles = [{ id: 'sub-11' }, { id: 'sub-12' }, { id: 'sub-13' }];

		expect(filterPreviouslyVisibleLeadingSubtitles(subtitles, { visualNovel: { index: 3 } }, previousState)).toEqual(
			[{ id: 'sub-12' }, { id: 'sub-13' }],
		);
	});

	it('keeps overlapping subtitles when staying on a page or moving backward', () => {
		const previousState = {
			pageIndex: 2,
			subtitleIds: ['sub-10', 'sub-11'],
		};
		const subtitles = [{ id: 'sub-11' }, { id: 'sub-12' }];

		expect(filterPreviouslyVisibleLeadingSubtitles(subtitles, { visualNovel: { index: 2 } }, previousState)).toBe(
			subtitles,
		);
		expect(filterPreviouslyVisibleLeadingSubtitles(subtitles, { visualNovel: { index: 1 } }, previousState)).toBe(
			subtitles,
		);
	});

	it('identifies forward visual novel page changes', () => {
		const previousState = {
			pageIndex: 2,
			subtitleIds: ['sub-10'],
		};

		expect(isForwardVisualNovelPageChange({ visualNovel: { index: 3 } }, previousState)).toBe(true);
		expect(isForwardVisualNovelPageChange({ visualNovel: { index: 2 } }, previousState)).toBe(false);
		expect(isForwardVisualNovelPageChange({ visualNovel: { index: 1 } }, previousState)).toBe(false);
		expect(isForwardVisualNovelPageChange({ visualNovel: { index: 3 } }, undefined)).toBe(false);
	});

	it('skips leading subtitles that already started before the page flip time', () => {
		const subtitles = [
			{ id: 'sub-10', startSeconds: 12 },
			{ id: 'sub-11', startSeconds: 15 },
			{ id: 'sub-12', startSeconds: 18 },
		];

		expect(filterAlreadyStartedLeadingSubtitles(subtitles, 15.5)).toEqual([
			{ id: 'sub-12', startSeconds: 18 },
		]);
	});

	it('keeps a subtitle that starts at the page flip time', () => {
		const subtitles = [
			{ id: 'sub-10', startSeconds: 15 },
			{ id: 'sub-11', startSeconds: 18 },
		];

		expect(filterAlreadyStartedLeadingSubtitles(subtitles, 15)).toBe(subtitles);
	});

	it('prefers the live visual novel book content over a stale startup element', () => {
		const fallbackElement = {} as HTMLDivElement;
		const pageElement = {} as HTMLDivElement;
		const visualNovelElement = {} as HTMLDivElement;
		const document = {
			querySelector: vi.fn((selector: string) => {
				if (selector === '.book-content[data-yatsu-visual-novel-mode="true"]') {
					return visualNovelElement;
				}

				if (selector === '.book-content') {
					return pageElement;
				}

				return null;
			}),
		} as unknown as Document;

		expect(getVisualNovelBookContentElement(document, fallbackElement)).toBe(visualNovelElement);
	});

	it('falls back to the active page content, then the startup element', () => {
		const fallbackElement = {} as HTMLDivElement;
		const pageElement = {} as HTMLDivElement;
		const documentWithPage = {
			querySelector: vi.fn((selector: string) => (selector === '.book-content' ? pageElement : null)),
		} as unknown as Document;
		const documentWithoutPage = {
			querySelector: vi.fn(() => null),
		} as unknown as Document;

		expect(getVisualNovelBookContentElement(documentWithPage, fallbackElement)).toBe(pageElement);
		expect(getVisualNovelBookContentElement(documentWithoutPage, fallbackElement)).toBe(fallbackElement);
	});
});
