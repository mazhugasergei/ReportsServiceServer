export default {
	run: async ({ reportsManager, task }) => {
		const { name, sourceId, link, created } = task
		const fileId = await reportsManager.createReport({ name, sourceId, taskId: task._id, link, created })
		return { fileId }
	}
}
