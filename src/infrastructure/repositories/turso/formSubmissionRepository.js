import { connect } from './connection.js';

class FormSubmissionRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, HEX(form_id) AS form_id, data, HEX(submitted_by) AS submitted_by, 
                submitted_at, status
                FROM form_submissions 
                WHERE id = UNHEX(?);`,
				[id]
			);

			if (!rows[0]) return null;

			const row = rows[0];
			return new FormSubmission({
				id: row.id,
				formId: row.form_id,
				data: JSON.parse(row.data),
				submittedBy: row.submitted_by,
				submittedAt: new Date(row.submitted_at),
				status: row.status,
			});
		} catch (err) {
			console.error('Error en FormSubmissionRepository.getById:', err);
			throw err;
		}
	}

	async create(submission) {
		const hexId = submission.id.replace(/-/g, '');

		try {
			const result = await this.connection.execute(
				`INSERT INTO form_submissions(id, form_id, data, submitted_by, submitted_at, status)
                VALUES(UNHEX(?), UNHEX(?), ?, UNHEX(?), ?, ?)
                RETURNING HEX(id) AS id, HEX(form_id) AS form_id, data, HEX(submitted_by) AS submitted_by, 
                submitted_at, status;`,
				[
					hexId,
					submission.formId,
					JSON.stringify(submission.data),
					submission.submittedBy,
					submission.submittedAt.toISOString(),
					submission.status,
				]
			);
			return result;
		} catch (err) {
			console.error('Error en FormSubmissionRepository.create:', err);
			throw err;
		}
	}

	async getByFormId(formId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, HEX(form_id) AS form_id, data, HEX(submitted_by) AS submitted_by, 
                submitted_at, status
                FROM form_submissions 
                WHERE form_id = UNHEX(?) 
                ORDER BY submitted_at DESC;`,
				[formId]
			);

			return rows.map(
				row =>
					new FormSubmission({
						id: row.id,
						formId: row.form_id,
						data: JSON.parse(row.data),
						submittedBy: row.submitted_by,
						submittedAt: new Date(row.submitted_at),
						status: row.status,
					})
			);
		} catch (err) {
			console.error('Error en FormSubmissionRepository.getByFormId:', err);
			throw err;
		}
	}

	async update(id, { status = null }) {
		try {
			const updates = [];
			const values = [];

			if (!id) {
				throw new Error('El ID de la submisión es requerido');
			}

			if (status !== null) {
				updates.push('status = ?');
				values.push(status);
			}

			if (updates.length === 0) {
				return null;
			}

			values.push(id);

			const result = await this.connection.execute(
				`UPDATE form_submissions SET ${updates.join(', ')} WHERE id = UNHEX(?)
                RETURNING HEX(id) AS id, HEX(form_id) AS form_id, data, HEX(submitted_by) AS submitted_by, 
                submitted_at, status;`,
				values
			);
			return result;
		} catch (err) {
			console.error('Error en FormSubmissionRepository.update:', err);
			throw err;
		}
	}
}

const FormSubmissionRepository = new FormSubmissionRepositoryClass(
	await connect()
);

export default FormSubmissionRepository;
