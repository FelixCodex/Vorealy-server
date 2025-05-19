export function _toSnakeCase(input) {
	return input.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

export function _toCamelCase(input) {
	return input.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function _convertToCamelCase(obj) {
	const result = {};

	for (const [key, value] of Object.entries(obj)) {
		const camelKey = this._toCamelCase(key);

		// Procesar valores especiales
		if (key === 'tags' && typeof value === 'string') {
			try {
				result[camelKey] = JSON.parse(value);
			} catch (e) {
				result[camelKey] = value;
			}
		} else {
			result[camelKey] = value;
		}
	}

	return result;
}

export function _isValidProperty(propertyName) {
	const validProperties = [
		'id',
		'folder_id',
		'created_by',
		'type',
		'start_date',
		'end_date',
		'assigned_to',
		'state',
		'priority',
		'estimated_time',
		'tags',
	];

	const normalizedProp = _toSnakeCase(propertyName);
	return validProperties.includes(normalizedProp);
}

export function _formatValueForDatabase(propertyName, value) {
	const prop = _toSnakeCase(propertyName);

	switch (prop) {
		case 'start_date':
		case 'end_date':
			if (value instanceof Date) {
				return value.toISOString();
			} else if (typeof value === 'string') {
				const date = new Date(value);
				if (isNaN(date.getTime())) {
					throw new Error(`Invalid date format for ${prop}: ${value}`);
				}
				return date.toISOString();
			}
			return value;

		case 'estimated_time':
			if (typeof value !== 'number') {
				const num = Number(value);
				if (isNaN(num)) {
					throw new Error(`Invalid number format for ${prop}: ${value}`);
				}
				return num;
			}
			return value;

		case 'tags':
			if (Array.isArray(value)) {
				return JSON.stringify(value);
			} else if (typeof value === 'string') {
				try {
					JSON.parse(value);
					return value;
				} catch (e) {
					return JSON.stringify(value.split(',').map(tag => tag.trim()));
				}
			}
			return value;

		case 'priority':
			const validPriorities = ['low', 'medium', 'high', 'urgent'];
			if (
				typeof value === 'string' &&
				!validPriorities.includes(value.toLowerCase())
			) {
				throw new Error(
					`Invalid priority value: ${value}. Must be one of: ${validPriorities.join(
						', '
					)}`
				);
			}
			return value;

		case 'state':
			// Validar estados
			const validStates = ['todo', 'in_progress', 'in_review', 'done'];
			if (
				typeof value === 'string' &&
				!validStates.includes(value.toLowerCase())
			) {
				throw new Error(
					`Invalid state value: ${value}. Must be one of: ${validStates.join(
						', '
					)}`
				);
			}
			return value;

		default:
			return value;
	}
}
