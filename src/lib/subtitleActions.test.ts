import { describe, expect, it } from 'vitest';
import { Action, defaultSubtitleActionList } from './settings';
import { getActionItems, getSubtitleOverflowActionGroups, primarySubtitleActionOrder } from './subtitleActions';

function getDefaultSubtitleActionItems() {
	return [...defaultSubtitleActionList].map(([action, enabled]) => ({ action, enabled }));
}

describe('subtitle actions', () => {
	it('shows Anki create and update actions in the primary subtitle action row', () => {
		expect(getActionItems(getDefaultSubtitleActionItems(), primarySubtitleActionOrder).map(({ action }) => action)).toEqual([
			Action.RESTART_PLAYBACK,
			Action.EXPORT_NEW,
			Action.EXPORT_UPDATE,
		]);
	});

	it('moves bookmark and merge actions into the overflow', () => {
		const markerGroup = getSubtitleOverflowActionGroups(getDefaultSubtitleActionItems()).find(
			({ label }) => label === 'Markers',
		);

		expect(markerGroup?.items.map(({ action }) => action)).toEqual([Action.TOGGLE_BOOKMARK, Action.TOGGLE_MERGE]);
	});
});
