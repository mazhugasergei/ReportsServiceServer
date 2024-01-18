import { v1 as uuidv1 } from "uuid"

export default function Manager({ db }) {
	this.getSources = getSources
	this.createSource = createSource
	this.updateSource = updateSource
	this.deleteSource = deleteSource

	async function getSources(searchParams) {
		return await db("sources").find(searchParams).sort({ created: -1 }).toArray()
	}

	async function createSource({ name, cron, link }) {
		const _id = uuidv1()
		await db("sources").insertOne({
			_id,
			created: Date.now(),
			name,
			cron,
			link
		})
		return _id
	}

	async function updateSource(_id, props) {
		await db("sources").updateOne({ _id }, { $set: props })
	}

	async function deleteSource(_id) {
		await db("sources").deleteOne({ _id })
	}
}
