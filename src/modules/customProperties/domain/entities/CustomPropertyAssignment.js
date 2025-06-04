class CustomPropertyAssignment {
	constructor(
		id,
		definitionId,
		entityType,
		entityId,
		value,
		isInherited = false,
		overrideParent = false,
		parentEntityType = null,
		parentEntityId = null
	) {
		this.id = id;
		this.definitionId = definitionId;
		this.entityType = entityType; // 'workspace', 'project', 'folder', 'list', 'task'
		this.entityId = entityId;
		this.value = value;
		this.isInherited = isInherited;
		this.overrideParent = overrideParent;
		this.parentEntityType = parentEntityType;
		this.parentEntityId = parentEntityId;
	}
}
