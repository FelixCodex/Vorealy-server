class ChangeRecord {
	constructor(
		id,
		entityType,
		entityId,
		changeType,
		fieldName,
		oldValue,
		newValue,
		userId,
		timestamp = new Date(),
		additionalInfo = null
	) {
		this.id = id;
		this.entityType = entityType;
		this.entityId = entityId;
		this.changeType = changeType;
		this.fieldName = fieldName;
		this.oldValue = oldValue;
		this.newValue = newValue;
		this.userId = userId;
		this.timestamp = timestamp;
		this.additionalInfo = additionalInfo;
	}
}
