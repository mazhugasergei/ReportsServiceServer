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
					link: string(/.{1,80000}/),
					created: number(/.{1,100}/)
				})
			)
		}),

		controller: async function ({ body, auth, req, res }) {
			const tasks = (await tasksManager.getTasks()).map((task) => {
				const { _id, name, status, link, created } = task
				return { _id: _id.toString(), name, status, link, created }
			})
			return { tasks }
		}
	}
}
