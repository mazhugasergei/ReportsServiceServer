import * as Cron from "node-cron"

export default function Manager({ tasksManager }) {
	const jobs = {}

	this.jobs = jobs
	this.addJob = addJob
	this.updateJob = updateJob
	this.deleteJob = deleteJob

	function addJob({ sourceId, name, link, cron }) {
		jobs[sourceId] = Cron.schedule(cron, async () => {
			await tasksManager.addTask({ name, type: "createReport", link })
		})
	}

	function updateJob(sourceId, { name, link, cron }) {
		deleteJob(sourceId)
		addJob({ sourceId, name, link, cron })
	}

	async function deleteJob(sourceId) {
		jobs[sourceId].stop()
		delete jobs[sourceId]
	}
}
