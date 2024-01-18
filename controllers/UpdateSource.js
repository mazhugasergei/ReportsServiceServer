export default function ({ cronManager, sourcesManager }) {
	return {
		endpoint: "/api/updateSource",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({
			_id: string(/.{1,100}/),
			name: string(/.{1,100}/).optional(),
			link: string(/.{1,100}/).optional(),
			cron: string(/.{1,100}/).optional()
		}),

		resSchema: ({ string, object, array, number, any }, {}) => ({}),

		controller: async function ({ body, auth, req, res }) {
			const { _id, ...props } = body
			await sourcesManager.updateSource(_id, props)
			await cronManager.updateJob(_id, props)
		}
	}
}
