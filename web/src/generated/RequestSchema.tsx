export const RequestSchema = {
	"PingRequest": {
		"options": {
			"(data_id)": 0
		},
		"fields": {
			"message": {
				"type": "string",
				"id": 1
			}
		}
	},
	"PingResponse": {
		"options": {
			"(data_id)": 1
		},
		"fields": {
			"message": {
				"type": "string",
				"id": 1
			}
		}
	},
	"dataId": {
		"type": "int32",
		"id": 50000,
		"extend": "google.protobuf.MessageOptions"
	}
};