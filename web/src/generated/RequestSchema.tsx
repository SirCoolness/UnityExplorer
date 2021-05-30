export const RequestSchema = {
	"PingRequest": {
		"options": {
			"(data_id)": 0,
			"(had_data)": true
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
			"(data_id)": 0,
			"(had_data)": true
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
	},
	"hadData": {
		"type": "bool",
		"id": 50001,
		"extend": "google.protobuf.MessageOptions"
	},
	"CommandRequest": {
		"oneofs": {
			"_data": {
				"oneof": [
					"data"
				]
			}
		},
		"fields": {
			"tracker": {
				"type": "int32",
				"id": 1
			},
			"dataId": {
				"type": "int32",
				"id": 2
			},
			"data": {
				"type": "bytes",
				"id": 3,
				"options": {
					"proto3_optional": true
				}
			}
		}
	},
	"CommandResponse": {
		"oneofs": {
			"_data": {
				"oneof": [
					"data"
				]
			}
		},
		"fields": {
			"tracker": {
				"type": "int32",
				"id": 1
			},
			"data": {
				"type": "bytes",
				"id": 2,
				"options": {
					"proto3_optional": true
				}
			}
		}
	}
};