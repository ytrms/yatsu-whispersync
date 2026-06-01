import AudioBookMenu from '../components/AudioBookMenu.svelte';
import { Action, defaultFooterActionList, type ActionListItem } from '../lib/settings';
import { APP_PREFIX, getLegacyStorageKey, migrateLocalStorageKey } from '../lib/prefixes';
import { installInstantTooltips } from '../lib/tooltips';
import pageStyles from '../styles.css?inline';

const stylesId = `${APP_PREFIX}-styles`;
const sandboxId = `${APP_PREFIX}-sandbox`;
const footerHostClass = `${APP_PREFIX}-footer-host`;

let wasOnReader = false;
let currentBookId = 0;
let componentMenu: AudioBookMenu | undefined;
let componentContainerElement: HTMLDivElement | undefined;
let footerElement: HTMLDivElement | undefined;
let footerHadJustifyBetween = false;
let isBootstrapping = false;
let observerTimer: number | undefined;

async function observerCallback() {
	if (observerTimer) {
		return;
	}

	observerTimer = window.setTimeout(() => (observerTimer = undefined), 1000);

	const bookId = getReaderBookId();

	if (!bookId) {
		cleanupReader();
		return;
	}

	if (isBootstrapping || (wasOnReader && currentBookId === bookId)) {
		return;
	}

	cleanupReader();
	await mountReader(bookId);
}

function getReaderBookId() {
	const site = new URL(window.location.href);
	const isReaderUrl =
		site.href.startsWith('https://app.yatsu.moe/b') || site.href.startsWith('http://localhost:5173/b');

	if (!isReaderUrl || !site.searchParams.has('id')) {
		return undefined;
	}

	const bookId = Number.parseInt(site.searchParams.get('id') || '', 10);

	return Number.isFinite(bookId) && bookId > 0 ? bookId : undefined;
}

async function mountReader(bookId: number) {
	isBootstrapping = true;

	try {
		const [bookContentElement, footerElm] = await Promise.all([
			waitForElement<HTMLDivElement>('.book-content'),
			waitForElement<HTMLDivElement>('.z-10.flex.h-8.w-full'),
		]);
		const footerInsertionTarget = footerElm?.firstElementChild;

		if (!bookContentElement || !footerElm || !footerInsertionTarget || getReaderBookId() !== bookId) {
			return;
		}

		migrateFooterActions();
		ensurePageStyles();
		installInstantTooltips();
		removeStaleFooterHosts();

		const sandboxElement = await ensureSandboxElement();

		if (getReaderBookId() !== bookId) {
			return;
		}

		const root = document.querySelector<HTMLElement>(':root');

		if (!root) {
			return;
		}

		const { backgroundColor, color } = getReaderColors(bookContentElement);

		componentContainerElement = document.createElement('div');
		componentContainerElement.classList.add(
			footerHostClass,
			'flex',
			'h-full',
			'items-center',
			'justify-center',
			'text-sm',
			'sm:text-lg',
		);
		componentContainerElement.addEventListener('click', stopEventPropagation, false);

		footerElement = footerElm;
		footerHadJustifyBetween = footerElement.classList.contains('justify-between');
		footerElement.classList.remove('justify-between');
		footerInsertionTarget.insertAdjacentElement('beforebegin', componentContainerElement);

		root.style.setProperty(`--${APP_PREFIX}-background-color`, backgroundColor);
		root.style.setProperty(`--${APP_PREFIX}-color`, color);
		root.style.setProperty(
			`--${APP_PREFIX}-yatsu-surface`,
			'var(--surface-strong-color, rgba(255, 255, 255, 0.94))',
		);
		root.style.setProperty(`--${APP_PREFIX}-yatsu-surface-soft`, 'var(--surface-color, rgba(255, 255, 255, 0.78))');
		root.style.setProperty(`--${APP_PREFIX}-yatsu-border`, 'var(--border-color, rgba(148, 163, 184, 0.26))');
		root.style.setProperty(`--${APP_PREFIX}-yatsu-accent`, 'var(--accent-color, #0f766e)');

		componentMenu = new AudioBookMenu({
			target: componentContainerElement,
			props: {
				componentContainerElement,
				bookContentElement,
				sandboxElement,
				currentBookId: bookId,
			},
		});
		currentBookId = bookId;
		wasOnReader = true;
	} catch (error) {
		cleanupReader();
		console.error('Yatsu Whispersync failed to initialize', error);
	} finally {
		isBootstrapping = false;
	}
}

function waitForElement<T extends Element>(selector: string, timeoutMs = 10000) {
	const immediateElement = document.querySelector<T>(selector);

	if (immediateElement) {
		return Promise.resolve(immediateElement);
	}

	return new Promise<T | undefined>((resolve) => {
		let timeoutId = 0;
		const observer = new MutationObserver(() => {
			const element = document.querySelector<T>(selector);

			if (!element) {
				return;
			}

			window.clearTimeout(timeoutId);
			observer.disconnect();
			resolve(element);
		});

		timeoutId = window.setTimeout(() => {
			observer.disconnect();
			resolve(undefined);
		}, timeoutMs);

		observer.observe(document.body, { childList: true, subtree: true });
	});
}

function migrateFooterActions() {
	const readerFooterActionsKey = `${APP_PREFIX}-reader-footer-actions`;
	const actionListOfFooterKey = `${APP_PREFIX}-action-list-of-footer`;
	const footerActions = migrateLocalStorageKey(window.localStorage, readerFooterActionsKey);
	const legacyReaderFooterActionsKey = getLegacyStorageKey(readerFooterActionsKey);

	if (!footerActions) {
		return;
	}

	let actionList: Action[];

	try {
		actionList = JSON.parse(footerActions);
	} catch {
		window.localStorage.removeItem(readerFooterActionsKey);
		window.localStorage.removeItem(legacyReaderFooterActionsKey);
		return;
	}

	const newActionList: ActionListItem[] = [];

	for (let index = 0, { length } = actionList; index < length; index += 1) {
		const action = actionList[index];

		if (defaultFooterActionList.has(action)) {
			newActionList.push({ action, enabled: true });
		}
	}

	window.localStorage.setItem(actionListOfFooterKey, JSON.stringify(newActionList));
	window.localStorage.removeItem(readerFooterActionsKey);

	if (legacyReaderFooterActionsKey) {
		window.localStorage.removeItem(legacyReaderFooterActionsKey);
	}
}

function ensurePageStyles() {
	if (document.getElementById(stylesId)) {
		return;
	}

	const pageStylesElement = document.createElement('style');

	pageStylesElement.id = stylesId;
	pageStylesElement.innerText = pageStyles;

	document.head.appendChild(pageStylesElement);
}

async function ensureSandboxElement() {
	let sandboxElement = document.getElementById(sandboxId) as HTMLIFrameElement | null;

	if (sandboxElement || !window.chrome || !chrome.runtime?.id) {
		return sandboxElement || undefined;
	}

	sandboxElement = document.createElement('iframe');
	sandboxElement.id = sandboxId;
	sandboxElement.style.display = 'none';
	sandboxElement.src = chrome.runtime.getURL('src/sandbox/sandbox.html');

	await new Promise<void>((resolve) => {
		sandboxElement!.addEventListener('load', () => resolve(), { once: true });
		document.body.appendChild(sandboxElement!);
	});

	return sandboxElement;
}

function getReaderColors(bookContentElement: HTMLElement) {
	const contentStyles = getComputedStyle(bookContentElement);
	const bodyStyles = getComputedStyle(document.body);
	const foregroundColor = contentStyles.color || bookContentElement.style.color || 'rgb(0,0,0)';
	const colorParts = (foregroundColor.match(/rgb[a]?\((.+)\)/)?.[1] || '0,0,0')
		.split(',')
		.slice(0, 3)
		.map((x: string) => Number.parseFloat(x.trim()) || 0);
	const [r, g, b] = colorParts;

	return {
		backgroundColor: document.body.style.backgroundColor || bodyStyles.backgroundColor || 'transparent',
		color: `rgb(${r},${g},${b})`,
	};
}

function cleanupReader() {
	componentMenu?.$destroy();
	componentMenu = undefined;

	if (componentContainerElement) {
		componentContainerElement.removeEventListener('click', stopEventPropagation, false);
		componentContainerElement.remove();
		componentContainerElement = undefined;
	}

	if (footerElement && footerHadJustifyBetween) {
		footerElement.classList.add('justify-between');
	}

	footerElement = undefined;
	footerHadJustifyBetween = false;
	currentBookId = 0;
	wasOnReader = false;
}

function removeStaleFooterHosts() {
	for (const element of document.querySelectorAll(`.${footerHostClass}`)) {
		element.remove();
	}
}

function stopEventPropagation(event: Event) {
	event.stopPropagation();
}

const observer = new MutationObserver(observerCallback);

observer.observe(document.body, { attributes: true, childList: true, subtree: true });

observerCallback();
