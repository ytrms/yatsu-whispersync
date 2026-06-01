const normalizeRegex = /[\p{punct}\s]/u;

export function normalizeMatchText(value: string | null, toLowerCase = false) {
	const cleanValue = (value || '').replace(/\s/g, '').trim();

	return toLowerCase ? cleanValue.toLowerCase() : cleanValue;
}

export function getNormalizedMatchLength(value: string) {
	return [...normalizeMatchText(value)].length;
}

export function getMatchTextForComparison(currentText: string, targetLength: number) {
	const characters = [...currentText];

	if (characters.length === targetLength) {
		return currentText;
	}

	let textForComparison = '';
	let textForComparisonLength = 0;

	for (let index = 0, { length } = characters; index < length; index += 1) {
		const character = characters[index];

		textForComparison += character;

		const trimmedCharacter = character.trim();

		if (trimmedCharacter && !normalizeRegex.test(trimmedCharacter)) {
			textForComparisonLength += 1;
		}

		if (textForComparisonLength === targetLength) {
			break;
		}
	}

	return textForComparison;
}

export function getLineSimilarity(str1: string, str2: string) {
	const string1 = normalizeMatchText(str1, true);
	const string2 = normalizeMatchText(str2, true);
	const string1Length = [...string1].length;
	const string2Length = [...string2].length;
	const substringLength = string1Length < 5 ? 1 : 2;

	if (string1 === string2) {
		return 1;
	}

	if (string1Length < substringLength || string2Length < substringLength) {
		return 0;
	}

	const map = new Map<string, number>();

	for (let index = 0; index < string1Length - (substringLength - 1); index += 1) {
		const substring1 = [...string1].slice(index, index + substringLength).join('');

		map.set(substring1, map.has(substring1) ? map.get(substring1)! + 1 : 1);
	}

	let match = 0;

	for (let index = 0; index < string2Length - (substringLength - 1); index += 1) {
		const substring2 = [...string2].slice(index, index + substringLength).join('');
		const count = map.has(substring2) ? map.get(substring2)! : 0;

		if (count > 0) {
			map.set(substring2, count - 1);

			match += 1;
		}
	}

	return (match * 2) / (string1Length + string2Length - (substringLength - 1) * 2);
}
