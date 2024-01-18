export default function ({ tasksManager }) {
	return {
		endpoint: "/api/getTasks",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({}),

		resSchema: ({ string, object, array, number, any }, {}) => ({
			tasks: array(
				object({
					_id: string(/.{1,100}/),
					name: string(/.{1,100}/),
					status: string(/.{1,100}/),
					created: number(/.{1,100}/),
					type: string(/.{1,100}/),
					link: string(/.{1,100}/),
					result: number(/.{1,100}/).optional()
				})
			)
		}),

		controller: async function ({ body, auth, req, res }) {
			const tasks = await tasksManager.getTasks()
			console.log(tasks)
			return { tasks }
		}
	}
}
