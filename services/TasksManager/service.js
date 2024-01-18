import { v1 as uuidv1 } from "uuid"
import createReport from "./providers/CreateReport.js"

export default function Manager({ reportsManager, db }) {
	this.getProviders = getProviders
	this.addTask = addTask
	this.getTasks = getTasks
	this.updateTask = updateTask
	this.deleteTask = deleteTask
	this.execActiveTasks = execActiveTasks
	const providers = { createReport }

	async function getProviders() {
		return Object.keys(providers).reduce((model, key) => {
			const provider = providers[key]

			if (provider.name && provider.params) {
				model[key] = {
					name: provider.name,
					params: provider.params
				}
			}

			return model
		}, {})
	}

	async function getTasks() {
		return db("tasks").find().sort({ created: -1 }).toArray()
	}

	async function addTask({ name, sourceId, type, link }) {
		const _id = uuidv1()
		await db("tasks").insertOne({
			_id,
			name,
			status: "waiting",
			created: Date.now(),
			sourceId,
			type,
			link
		})
		return _id
	}

	async function updateTask(searchParams, fields) {
		await db("tasks").updateOne(searchParams, { $set: fields })
	}

	async function deleteTask(searchParams) {
		await db("tasks").deleteOne(searchParams)
	}

	async function execActiveTasks() {
		const tasks = await db("tasks").find({ status: "waiting" }).toArray()
		const scope = { reportsManager }

		for (let task of tasks) {
			try {
				const { result, inProgress } = await providers[task.type].run({ ...scope, task })
				await updateTask(
					{ _id: task._id },
					{
						status: inProgress ? "waiting" : "success",
						result: result
					}
				)
			} catch (e) {
				console.log(e)
				await updateTask(
					{ _id: task._id },
					{
						status: "errored",
						result: 0
					}
				)
			}
		}
	}
}
