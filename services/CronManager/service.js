import * as Cron from "node-cron"

export default function Manager({ tasksManager }) {
	const jobs = {}

	this.jobs = jobs
	this.addJob = addJob
	this.updateJob = updateJob
	this.deleteJob = deleteJob

	function addJob({ _id, name, link, cron }) {
		jobs[_id] = Cron.schedule(cron, async () => {
			await tasksManager.addTask({ name, type: "createReport", link })
		})
	}

	function updateJob(_id, { name, link, cron }) {
		deleteJob(_id)
		addJob({ _id, name, link, cron })
	}

	async function deleteJob(_id) {
		jobs[_id].stop()
		delete jobs[_id]
	}
}
