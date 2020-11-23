export const trim = (string, at, trailing = '...') => {
	if (string && string.length > at) {
		return `${string.substring(0, at).trim()}${trailing}`;
	}

	return string;
};
