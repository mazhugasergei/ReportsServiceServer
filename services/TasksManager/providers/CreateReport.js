export default {
	run: async ({ reportsManager, task }) => {
		const { name, sourceId, link } = task
		const fileId = await reportsManager.createReport({ name, sourceId, taskId: task._id, link })
		return { fileId }
	}
}
