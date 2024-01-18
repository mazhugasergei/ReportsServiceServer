export default function ({ cronManager, sourcesManager }) {
	return {
		endpoint: "/api/deleteSource",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({
			_id: string(/.{1,100}/)
		}),

		resSchema: ({ string, object, array, number, any }, {}) => ({}),

		controller: async function ({ body, auth, req, res }) {
			const { _id } = body
			await sourcesManager.deleteSource(_id)
			await cronManager.deleteJob(_id)
		}
	}
}
