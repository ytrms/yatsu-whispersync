<script lang="ts">
	import { autoUpdate, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';
	import { clickOutside } from '../lib/actions';
	import { portalToBody } from '../lib/portal';
	import { onDestroy, tick } from 'svelte';

	export let placement: Placement = 'left';
	export let fallbackPlacements: Placement[] = ['right', 'top', 'left'];
	export let mode: 'click' | 'hover' = 'click';

	export function hide() {
		clearCloseTimer();
		cleanup?.();
		isOpen = false;
	}

	let triggerElement: HTMLButtonElement;
	let popoverElement: HTMLDivElement;
	let isOpen = false;
	let cleanup: () => void;
	let closeTimer: number | undefined;

	onDestroy(hide);

	async function onTogglePopover() {
		if (mode === 'hover' && isOpen) {
			return;
		}

		if (isOpen) {
			return hide();
		}

		await showPopover();
	}

	async function showPopover() {
		clearCloseTimer();

		if (isOpen) {
			return;
		}

		isOpen = true;

		await tick();

		cleanup?.();
		cleanup = autoUpdate(triggerElement, popoverElement, updatePosition);
	}

	function onHoverOpen() {
		if (mode === 'hover') {
			showPopover();
		}
	}

	function onHoverClose() {
		if (mode !== 'hover') {
			return;
		}

		clearCloseTimer();
		closeTimer = window.setTimeout(hide, 80);
	}

	function clearCloseTimer() {
		if (closeTimer) {
			window.clearTimeout(closeTimer);
			closeTimer = undefined;
		}
	}

	function updatePosition() {
		computePosition(triggerElement, popoverElement, {
			placement,
			middleware: [offset(5), flip({ fallbackPlacements }), shift()],
		})
			.then(({ x, y }) => {
				popoverElement.style.left = `${x}px`;
				popoverElement.style.top = `${y}px`;
			})
			.catch(() => {
				// no-op
			});
	}
</script>

<div class="flex">
	<button
		bind:this={triggerElement}
		on:click={onTogglePopover}
		on:focus={onHoverOpen}
		on:blur={onHoverClose}
		on:pointerenter={onHoverOpen}
		on:pointerleave={onHoverClose}
	>
		<slot name="icon" />
	</button>
	{#if isOpen}
		<div
			class="yatsu-whispersync-container popover"
			bind:this={popoverElement}
			use:portalToBody
			on:pointerenter={clearCloseTimer}
			on:pointerleave={onHoverClose}
			use:clickOutside={({ target }) => {
				if (!(target instanceof Element)) {
					return;
				}

				if (target !== triggerElement && !triggerElement.contains(target)) {
					hide();
				}
			}}
		>
			<slot />
		</div>
	{/if}
</div>
