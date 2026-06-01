import { Action, type ActionListItem } from './settings';

export interface SubtitleActionGroup {
	label: string;
	items: ActionListItem[];
}

interface SubtitleActionGroupDefinition {
	label: string;
	actions: Action[];
}

export const primarySubtitleActionOrder = [
	Action.RESTART_PLAYBACK,
	Action.EXPORT_NEW,
	Action.EXPORT_UPDATE,
];

export const overflowSubtitleActionGroups: SubtitleActionGroupDefinition[] = [
	{
		label: 'Playback',
		actions: [Action.TOGGLE_PLAY_PAUSE, Action.TOGGLE_PLAYBACK_LOOP],
	},
	{
		label: 'Text',
		actions: [Action.RESTORE_SUBTITLE, Action.EDIT_SUBTITLE],
	},
	{
		label: 'Markers',
		actions: [Action.TOGGLE_BOOKMARK, Action.TOGGLE_MERGE],
	},
	{
		label: 'Filters',
		actions: [Action.TOGGLE_SHOW_BOOKMARKED, Action.TOGGLE_SHOW_FOR_MERGE],
	},
];

export function getActionItems(actionList: ActionListItem[], actions: Action[]) {
	return actions
		.map((action) => actionList.find((item) => item.action === action))
		.filter((item): item is ActionListItem => !!item?.enabled);
}

export function getSubtitleOverflowActionGroups(actionList: ActionListItem[]) {
	const groupedActions = new Set([
		...primarySubtitleActionOrder,
		...overflowSubtitleActionGroups.flatMap(({ actions }) => actions),
	]);
	const actionGroups = overflowSubtitleActionGroups
		.map(({ label, actions }) => ({
			label,
			items: getActionItems(actionList, actions),
		}))
		.filter(({ items }) => items.length);
	const remainingItems = actionList.filter((item) => item.enabled && !groupedActions.has(item.action));

	return remainingItems.length ? [...actionGroups, { label: 'More', items: remainingItems }] : actionGroups;
}
