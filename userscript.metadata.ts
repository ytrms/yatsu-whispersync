import packageJson from './package.json';

export type UserscriptManager = 'tampermonkey' | 'violentmonkey';

interface UserscriptOutput {
	outDir: string;
	outName: string;
}

interface UserscriptResource {
	name: string;
	url: string;
}

const repositoryUrl = 'https://github.com/ytrms/yatsu-whispersync';
const docsUrl = 'https://docs.yatsu.moe/ttu-whispersync/';
const iconUrl = 'https://docs.yatsu.moe/assets/ya.svg';

const commonResources: UserscriptResource[] = [
	{
		name: 'mediaInfo',
		url: 'https://cdn.jsdelivr.net/npm/mediainfo.js@0.2.1/dist/MediaInfoModule.wasm',
	},
	{
		name: 'ffmpeg-core.js',
		url: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
	},
];

const managerResources: Record<UserscriptManager, UserscriptResource[]> = {
	tampermonkey: [],
	violentmonkey: [
		{
			name: 'ffmpeg-core.wasm',
			url: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
		},
	],
};

export const userscriptOutputs: Record<UserscriptManager, UserscriptOutput> = {
	tampermonkey: {
		outDir: 'tamper_monkey',
		outName: 'yatsu-whispersync.tm.user.js',
	},
	violentmonkey: {
		outDir: 'violent_monkey',
		outName: 'yatsu-whispersync.user.js',
	},
};

export function createUserscriptHeader(manager: UserscriptManager) {
	const { outName } = userscriptOutputs[manager];
	const resources = [...commonResources, ...managerResources[manager]]
		.map(({ name, url }) => `// @resource ${name} ${url}`)
		.join('\n');

	return `// ==UserScript==
// @name        Yatsu Whispersync
// @namespace   https://github.com/Renji-XD
// @version     ${packageJson.version}
// @description Listen to audiobooks with Yatsu Reader
// @icon ${iconUrl}
// @grant       GM_getResourceURL
// @author      Original author: Renji-xD, with modifications by ytrms
// @homepageURL ${repositoryUrl}
${resources}
// @match       https://app.yatsu.moe/*
// @match       http://localhost:5173/*
// @run-at      document-idle
// @noframes
// @updateURL   ${repositoryUrl}/releases/latest/download/${outName}
// @downloadURL ${repositoryUrl}/releases/latest/download/${outName}
// @supportURL  ${docsUrl}
// ==/UserScript==
//
// Yatsu Whispersync is adapted from ttu-whispersync:
// https://github.com/Renji-XD/ttu-whispersync
//
// MIT License
//
// Copyright (c) 2024 Renji-xD
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.`;
}
