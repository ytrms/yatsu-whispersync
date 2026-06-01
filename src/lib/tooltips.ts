import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

const tooltipAttribute = 'data-yatsu-whispersync-tooltip';
const tooltipContainerClass = 'yatsu-whispersync-container';
const tooltipClass = 'tooltip';
const tooltipScopeSelector = '.yatsu-whispersync-container';
const tooltipTargetSelector = `[title],[${tooltipAttribute}]`;

let cleanupPosition: (() => void) | undefined;
let tooltipElement: HTMLDivElement | undefined;
let activeElement: HTMLElement | undefined;
let installed = false;

export function installInstantTooltips() {
	if (installed) {
		return;
	}

	installed = true;

	document.addEventListener('pointerenter', onTooltipEnter, true);
	document.addEventListener('pointerleave', onTooltipLeave, true);
	document.addEventListener('focusin', onTooltipEnter, true);
	document.addEventListener('focusout', onTooltipLeave, true);
	document.addEventListener('keydown', onTooltipKeyDown, true);
	document.addEventListener('scroll', hideTooltip, true);
}

function onTooltipEnter(event: Event) {
	const element = getTooltipTarget(event);
	const text = element && consumeTooltipText(element);

	if (!element || !text) {
		return;
	}

	showTooltip(element, text);
}

function onTooltipLeave(event: Event) {
	const element = getTooltipTarget(event);

	if (element && element === activeElement) {
		hideTooltip();
	}
}

function onTooltipKeyDown(event: KeyboardEvent) {
	if (event.key === 'Escape') {
		hideTooltip();
	}
}

function getTooltipTarget(event: Event) {
	if (!(event.target instanceof Element)) {
		return undefined;
	}

	const element = event.target.closest<HTMLElement>(tooltipTargetSelector);

	if (!element?.closest(tooltipScopeSelector)) {
		return undefined;
	}

	return element;
}

function consumeTooltipText(element: HTMLElement) {
	const title = element.getAttribute('title');

	if (title !== null) {
		element.removeAttribute('title');

		if (title.trim()) {
			element.setAttribute(tooltipAttribute, title);

			if (!element.hasAttribute('aria-label')) {
				element.setAttribute('aria-label', title);
			}
		}
	}

	return element.getAttribute(tooltipAttribute)?.trim() || '';
}

async function showTooltip(element: HTMLElement, text: string) {
	hideTooltip();

	activeElement = element;
	tooltipElement = document.createElement('div');
	tooltipElement.classList.add(tooltipContainerClass, tooltipClass);
	tooltipElement.role = 'tooltip';
	tooltipElement.textContent = text;

	document.body.appendChild(tooltipElement);

	cleanupPosition = autoUpdate(element, tooltipElement, updateTooltipPosition);
	await updateTooltipPosition();
}

async function updateTooltipPosition() {
	if (!activeElement || !tooltipElement) {
		return;
	}

	const { x, y } = await computePosition(activeElement, tooltipElement, {
		placement: 'top',
		middleware: [offset(8), flip({ fallbackPlacements: ['bottom', 'right', 'left'] }), shift({ padding: 8 })],
	});

	tooltipElement.style.left = `${x}px`;
	tooltipElement.style.top = `${y}px`;
}

function hideTooltip() {
	cleanupPosition?.();
	cleanupPosition = undefined;
	activeElement = undefined;
	tooltipElement?.remove();
	tooltipElement = undefined;
}
