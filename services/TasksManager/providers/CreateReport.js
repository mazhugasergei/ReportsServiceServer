export default {
	run: async ({ reportsManager, task }) => {
		const { name, link } = task
		await reportsManager.createReport({ name, link })
		return { result: 100 }
	}
}
