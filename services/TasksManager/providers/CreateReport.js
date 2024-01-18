export default {
	run: async ({ reportsManager, task }) => {
		await reportsManager.createReport(task.link)
		return { result: 100 }
	}
}
