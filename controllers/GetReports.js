export default function ({ reportsManager }) {
	return {
		endpoint: "/api/getReports",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({}),

		resSchema: ({ string, object, array, number, any }, {}) => ({
			reports: array(
				object({
					name: string(/.{1,100}/),
					created: number(/.{1,100}/),
					fileId: string(/.{1,100}/)
				})
			)
		}),

		controller: async function ({ body, auth, req, res }) {
			const reports = (await reportsManager.getReports()).map((report) => {
				const { name, created, fileId } = report
				return { name, created, fileId }
			})
			return { reports }
		}
	}
}
