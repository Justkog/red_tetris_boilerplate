export const KEY_DOWN = 'KEY_DOWN';

export const keyDown = (e) => ({
	type: KEY_DOWN,
	key: e.key,
});