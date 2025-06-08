import { connect } from './connection.js';

class CustomPropertyRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async createPropertyDefinition({ name, type, defaultValue, options }) {
		const result = await this.connection.execute(
			`INSERT INTO custom_property_definitions 
            (name, type, default_value, options) 
            VALUES (?, ?, ?, ?)`,
			[name, type, defaultValue, options ? JSON.stringify(options) : null]
		);

		return { ...propertyDefinition, id: result.lastInsertRowid };
	}

	async assignProperty({
		definitionId,
		entityType,
		entityId,
		value,
		isInherited,
		overrideParent,
		parentEntityType,
		parentEntityId,
	}) {
		const result = await this.connection.execute(
			`INSERT INTO custom_property_assignments
       (definition_id, entity_type, entity_id, value, is_inherited, override_parent, parent_entity_type, parent_entity_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				definitionId,
				entityType,
				entityId,
				value,
				isInherited ? 1 : 0,
				overrideParent ? 1 : 0,
				parentEntityType,
				parentEntityId,
			]
		);

		// Si esta asignación debe propagarse a los descendientes
		if (!isInherited) {
			await this.propagateProperties(definitionId, entityType, entityId);
		}

		return { ...assignment, id: result.lastInsertRowid };
	}

	async getEntityProperties(entityType, entityId, includeInherited = true) {
		// Construir la consulta según si incluimos heredadas o no
		let query = `
      SELECT cpa.*, cpd.name, cpd.type, cpd.default_value, cpd.options
      FROM custom_property_assignments cpa
      JOIN custom_property_definitions cpd ON cpa.definition_id = cpd.id
      WHERE cpa.entity_type = ? AND cpa.entity_id = ?
    `;

		if (!includeInherited) {
			query += ' AND cpa.is_inherited = 0';
		}

		const assignments = await db.all(query, [entityType, entityId]);

		return assignments.map(row => ({
			id: row.id,
			definitionId: row.definition_id,
			entityType: row.entity_type,
			entityId: row.entity_id,
			value: row.value,
			isInherited: Boolean(row.is_inherited),
			overrideParent: Boolean(row.override_parent),
			parentEntityType: row.parent_entity_type,
			parentEntityId: row.parent_entity_id,
			definition: {
				id: row.definition_id,
				name: row.name,
				type: row.type,
				defaultValue: row.default_value,
				options: row.options ? JSON.parse(row.options) : null,
			},
		}));
	}

	async getInheritedProperties(entityType, entityId) {
		// Este método devuelve las propiedades que este objeto heredaría de su padre
		// basado en la jerarquía workspace -> project -> folder -> list -> task

		// Primero necesitamos encontrar el padre de esta entidad
		const hierarchyMap = {
			task: 'list',
			list: 'folder',
			folder: 'project',
			project: 'workspace',
		};

		const parentType = hierarchyMap[entityType];
		if (!parentType) return []; // No hay padre (es un workspace)

		// Asumimos que hay una columna parent_id en cada tabla de entidad
		// que apunta a su padre directo
		let parentId;
		switch (entityType) {
			case 'project':
				const project = await db.get(
					'SELECT workspace_id FROM projects WHERE id = ?',
					[entityId]
				);
				parentId = project ? project.workspace_id : null;
				break;
			case 'folder':
				const folder = await db.get(
					'SELECT project_id FROM folders WHERE id = ?',
					[entityId]
				);
				parentId = folder ? folder.project_id : null;
				break;
			case 'list':
				const list = await db.get('SELECT folder_id FROM lists WHERE id = ?', [
					entityId,
				]);
				parentId = list ? list.folder_id : null;
				break;
			case 'task':
				const task = await db.get('SELECT list_id FROM tasks WHERE id = ?', [
					entityId,
				]);
				parentId = task ? task.list_id : null;
				break;
		}

		if (!parentId) return [];

		// Ahora obtenemos las propiedades personalizadas del padre
		return this.getEntityProperties(parentType, parentId, true);
	}
	async propagateProperties(definitionId, sourceEntityType, sourceEntityId) {
		// Conseguir la propiedad original
		const [sourceProperty] = await db.all(
			`SELECT * FROM custom_property_assignments 
       WHERE definition_id = ? AND entity_type = ? AND entity_id = ?`,
			[definitionId, sourceEntityType, sourceEntityId]
		);

		if (!sourceProperty) return;

		// Determinar qué entidades hijas deberían heredar esta propiedad
		let childEntities = [];
		switch (sourceEntityType) {
			case 'workspace':
				// Obtener todos los proyectos del workspace
				childEntities = await db.all(
					'SELECT id, "project" as type FROM projects WHERE workspace_id = ?',
					[sourceEntityId]
				);
				break;
			case 'project':
				// Obtener todas las carpetas del proyecto
				childEntities = await db.all(
					'SELECT id, "folder" as type FROM folders WHERE project_id = ?',
					[sourceEntityId]
				);
				break;
			case 'folder':
				// Obtener todas las listas de la carpeta
				childEntities = await db.all(
					'SELECT id, "list" as type FROM lists WHERE folder_id = ?',
					[sourceEntityId]
				);
				break;
			case 'list':
				// Obtener todas las tareas de la lista
				childEntities = await db.all(
					'SELECT id, "task" as type FROM tasks WHERE list_id = ?',
					[sourceEntityId]
				);
				break;
		}

		// Para cada entidad hija, propagar la propiedad si no tiene un override
		for (const child of childEntities) {
			// Verificar si la entidad hija ya tiene un override para esta propiedad
			const existingOverride = await db.get(
				`SELECT * FROM custom_property_assignments 
         WHERE definition_id = ? AND entity_type = ? AND entity_id = ? AND override_parent = 1`,
				[definitionId, child.type, child.id]
			);

			if (existingOverride) {
				// Si tiene override, no propagamos y respetamos la configuración del usuario
				continue;
			}

			// Eliminar cualquier valor heredado anterior para crear uno nuevo
			await this.connection.execute(
				`DELETE FROM custom_property_assignments 
         WHERE definition_id = ? AND entity_type = ? AND entity_id = ? AND is_inherited = 1`,
				[definitionId, child.type, child.id]
			);

			// Crear un nuevo valor heredado
			await this.connection.execute(
				`INSERT INTO custom_property_assignments
         (definition_id, entity_type, entity_id, value, is_inherited, override_parent, parent_entity_type, parent_entity_id)
         VALUES (?, ?, ?, ?, 1, 0, ?, ?)`,
				[
					definitionId,
					child.type,
					child.id,
					sourceProperty.value,
					sourceEntityType,
					sourceEntityId,
				]
			);

			// Recursivamente propagar a los hijos de este hijo
			await this.propagateProperties(definitionId, child.type, child.id);
		}
	}
}

const CustomPropertyRepository = new CustomPropertyRepositoryClass(
	await connect()
);
export default CustomPropertyRepository;
