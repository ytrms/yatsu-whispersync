import { dirname, join } from 'path';

import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { writeFileSync } from 'fs';

const outDir = 'violent_monkey';
const outName = 'yatsu-whispersync.user.js';
const header = `// ==UserScript==
// @author      Original author: Renji-xD, with modifications by ryzusaku and ytrms
// @name        Yatsu Whispersync
// @namespace   https://github.com/Renji-XD
// @match       https://app.yatsu.moe/*
// @match       http://localhost:5173/*
// @version     1.0.17
// @description Listen to audiobooks with Yatsu Reader
// @icon https://docs.yatsu.moe/assets/ya.svg
// @resource mediaInfo https://cdn.jsdelivr.net/npm/mediainfo.js@0.2.1/dist/MediaInfoModule.wasm
// @resource ffmpeg-core.js https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js
// @resource ffmpeg-core.wasm https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm
// @run-at      document-idle
// @noframes
// @grant       GM_getResourceURL
// @updateURL   https://github.com/ytrms/yatsu-whispersync/releases/latest/download/yatsu-whispersync.user.js
// @downloadURL https://github.com/ytrms/yatsu-whispersync/releases/latest/download/yatsu-whispersync.user.js
// @supportURL  https://docs.yatsu.moe/ttu-whispersync/
// @homepageURL https://github.com/ytrms/yatsu-whispersync
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, outDir, outName);

export default defineConfig((config) => {
	return {
		build: {
			outDir,
			emptyOutDir: true,
			lib: {
				name: 'yatsuWhispersync',
				entry: './src/content/content.ts',
				formats: ['iife'],
				fileName: () => 'yatsu-whispersync.user.js',
			},
			minify: config.mode === 'production',
		},
		plugins: [
			nodePolyfills(),
			svelte({ emitCss: false }),
			viteSingleFile(),
			(() => {
				{
					return {
						name: 'copy-header',
						writeBundle(_, id: any) {
							writeFileSync(filePath, `${header}\n${id[outName].code}`, { encoding: 'utf-8' });
						},
					};
				}
			})(),
		],
	};
});
