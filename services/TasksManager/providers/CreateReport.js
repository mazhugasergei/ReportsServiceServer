export default {
	run: async ({ reportsManager, task }) => {
		const { _id, name, sourceId, link } = task
		const filename = await reportsManager.createReport({ name, sourceId, taskId: _id, link })
		return { filename }
	}
}
