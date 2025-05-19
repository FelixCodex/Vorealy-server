import {
	_formatValueForDatabase,
	_toCamelCase,
	_toSnakeCase,
} from '../libs/utils';

export default function updatePropertie(taskRepository) {
	return async function (taskId, propertyName, propertyValue) {
		// Validar que la propiedad sea permitida
		if (!_isValidProperty(propertyName)) {
			throw new Error(`Invalid property: ${propertyName}`);
		}

		try {
			// Iniciar una transacción
			await taskRepository.beginTransaction();

			// Obtener el valor actual para el historial de cambios
			const currentTask = await taskRepository.getById(taskId);
			if (!currentTask) {
				throw new Error(`Task with ID ${taskId} not found`);
			}

			const oldValue = currentTask[_toCamelCase(propertyName)];

			// Formatear el valor según el tipo de propiedad
			const formattedValue = _formatValueForDatabase(
				propertyName,
				propertyValue
			);

			// Convertir el nombre de la propiedad a snake_case para SQL
			const dbPropertyName = _toSnakeCase(propertyName);

			// Actualizar la propiedad
			await taskRepository.update(dbPropertyName, formattedValue, taskId);

			// Completar la transacción
			await taskRepository.commit();

			// Obtener la tarea actualizada
			const updatedTask = await taskRepository.getById(taskId);

			// Devolver la tarea actualizada y el valor anterior para el historial
			return {
				task: updatedTask,
				oldValue,
				newValue: updatedTask[this._toCamelCase(propertyName)],
			};
		} catch (error) {
			// Revertir en caso de error
			await taskRepository.rollback();
			throw error;
		}
	};
}
