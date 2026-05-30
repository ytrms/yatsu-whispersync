export interface VisualNovelPageChangeDetail {
	viewMode?: unknown;
	userInitiated?: unknown;
	visualNovel?: {
		index?: unknown;
	};
}

export interface VisualNovelPageSubtitleState {
	pageIndex: number;
	subtitleIds: string[];
}

type BookContentDocument = Pick<Document, 'querySelector'>;
type SubtitleLike = { id: string };
type TimedSubtitleLike = SubtitleLike & { startSeconds: number };

const alreadyStartedSubtitleToleranceSeconds = 0.25;

export function shouldPlayVisualNovelPageChange(
	detail: VisualNovelPageChangeDetail | undefined,
	vnModeEnabled: boolean,
) {
	return vnModeEnabled && detail?.viewMode === 'visual-novel' && detail.userInitiated === true;
}

export function getVisualNovelBookContentElement(document: BookContentDocument, fallback: HTMLDivElement) {
	return (
		document.querySelector<HTMLDivElement>('.book-content[data-yatsu-visual-novel-mode="true"]') ||
		document.querySelector<HTMLDivElement>('.book-content') ||
		fallback
	);
}

export function getVisualNovelPageIndex(detail: VisualNovelPageChangeDetail | undefined) {
	const index = detail?.visualNovel?.index;

	return typeof index === 'number' && Number.isFinite(index) ? index : undefined;
}

export function createVisualNovelPageSubtitleState<T extends SubtitleLike>(
	detail: VisualNovelPageChangeDetail | undefined,
	subtitles: T[],
): VisualNovelPageSubtitleState | undefined {
	const pageIndex = getVisualNovelPageIndex(detail);

	if (pageIndex === undefined) {
		return undefined;
	}

	return {
		pageIndex,
		subtitleIds: subtitles.map((subtitle) => subtitle.id),
	};
}

export function filterPreviouslyVisibleLeadingSubtitles<T extends SubtitleLike>(
	subtitles: T[],
	detail: VisualNovelPageChangeDetail | undefined,
	previousState: VisualNovelPageSubtitleState | undefined,
) {
	const pageIndex = getVisualNovelPageIndex(detail);

	if (pageIndex === undefined || !previousState || pageIndex <= previousState.pageIndex) {
		return subtitles;
	}

	const previouslyVisibleIds = new Set(previousState.subtitleIds);
	const firstNewSubtitleIndex = subtitles.findIndex((subtitle) => !previouslyVisibleIds.has(subtitle.id));

	return firstNewSubtitleIndex === -1 ? [] : subtitles.slice(firstNewSubtitleIndex);
}

export function isForwardVisualNovelPageChange(
	detail: VisualNovelPageChangeDetail | undefined,
	previousState: VisualNovelPageSubtitleState | undefined,
) {
	const pageIndex = getVisualNovelPageIndex(detail);

	return pageIndex !== undefined && !!previousState && pageIndex > previousState.pageIndex;
}

export function filterAlreadyStartedLeadingSubtitles<T extends TimedSubtitleLike>(
	subtitles: T[],
	currentTime: number,
) {
	if (!Number.isFinite(currentTime)) {
		return subtitles;
	}

	const firstNotAlreadyStartedIndex = subtitles.findIndex(
		(subtitle) => subtitle.startSeconds > currentTime - alreadyStartedSubtitleToleranceSeconds,
	);

	if (firstNotAlreadyStartedIndex <= 0) {
		return firstNotAlreadyStartedIndex === -1 ? [] : subtitles;
	}

	return subtitles.slice(firstNotAlreadyStartedIndex);
}
