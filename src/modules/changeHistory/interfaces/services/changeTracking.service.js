import { recordChange } from '../../use-cases/recordChange';

export class ChangeTrackingService {
	constructor(changeHistoryRepository) {
		const recordChangeUseCase = recordChange(changeHistoryRepository);
		this.recordChangeUseCase = recordChangeUseCase;
	}

	async trackCreation(
		entityType,
		entityId,
		newEntity,
		userId,
		additionalInfo = null
	) {
		await this.recordChangeUseCase(
			entityType,
			entityId,
			'create',
			userId,
			null,
			null,
			newEntity,
			additionalInfo
		);
	}

	async trackUpdate(
		entityType,
		entityId,
		updatedFields,
		oldValues,
		userId,
		additionalInfo = null
	) {
		for (const [fieldName, newValue] of Object.entries(updatedFields)) {
			const oldValue = oldValues[fieldName];

			if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
				await this.recordChangeUseCase(
					entityType,
					entityId,
					'update',
					userId,
					fieldName,
					oldValue,
					newValue,
					additionalInfo
				);
			}
		}
	}

	async trackDeletion(
		entityType,
		entityId,
		oldEntity,
		userId,
		additionalInfo = null
	) {
		await this.recordChangeUseCase(
			entityType,
			entityId,
			'delete',
			userId,
			null,
			oldEntity,
			null,
			additionalInfo
		);
	}
}
