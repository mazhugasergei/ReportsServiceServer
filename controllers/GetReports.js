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
					file: string(/.{1,100}/)
				})
			)
		}),

		controller: async function ({ body, auth, req, res }) {
			const reports = (await reportsManager.getReports()).map((report) => {
				const { name, created, file } = report
				return { name, created, file }
			})
			return { reports }
		}
	}
}
