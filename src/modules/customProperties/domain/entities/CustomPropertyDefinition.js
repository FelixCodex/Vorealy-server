class CustomPropertyDefinition {
	constructor(id, name, type, defaultValue = null, options = null) {
		this.id = id;
		this.name = name;
		this.type = type; // text, number, date, boolean, select, etc.
		this.defaultValue = defaultValue;
		this.options = options; // Para tipos select/multi-select
	}
}
