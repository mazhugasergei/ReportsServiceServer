export default function ({ cronManager, sourcesManager }) {
	return {
		endpoint: "/api/createSource",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({
			name: string(/.{1,100}/),
			link: string(/.{1,100}/).optional(),
			cron: string(/.{1,100}/).optional()
		}),

		resSchema: ({ string, object, array, number, any }, {}) => ({
			_id: string(/.{1,100}/)
		}),

		controller: async function ({ body, auth, req, res }) {
			const _id = await sourcesManager.createSource(body)
			await cronManager.addJob({ sourceId: _id, ...body })
			return { _id: _id.toString() }
		}
	}
}
