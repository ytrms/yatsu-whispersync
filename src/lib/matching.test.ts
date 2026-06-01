import { describe, expect, it } from 'vitest';
import {
	getLineSimilarity,
	getMatchTextForComparison,
	getNormalizedMatchLength,
	normalizeMatchText,
} from './matching';

describe('subtitle matching helpers', () => {
	it('normalizes whitespace and case for matching', () => {
		expect(normalizeMatchText(' A b \n C ')).toBe('AbC');
		expect(normalizeMatchText(' A b \n C ', true)).toBe('abc');
		expect(getNormalizedMatchLength(' A b \n C ')).toBe(3);
	});

	it('keeps punctuation in comparison text while counting only content characters', () => {
		expect(getMatchTextForComparison('ab, cd', 3)).toBe('ab, c');
		expect(getMatchTextForComparison('abc', 3)).toBe('abc');
	});

	it('scores exact, similar, and unrelated lines predictably', () => {
		expect(getLineSimilarity('Hello world', 'hello world')).toBe(1);
		expect(getLineSimilarity('abcdef', 'abcxef')).toBeGreaterThan(0.5);
		expect(getLineSimilarity('abcdef', 'uvwxyz')).toBe(0);
	});
});
