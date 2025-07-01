{
  "x-generator": "NSwag v13.10.8.0 (NJsonSchema v10.3.11.0 (Newtonsoft.Json v11.0.0.0))",
  "swagger": "2.0",
  "info": {
    "title": "My Title",
    "version": "1.0.0"
  },
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "paths": {
    "/application/read-location": {
      "get": {
        "tags": [
          "Application"
        ],
        "operationId": "Application_ReadLocationSettings",
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Read location settings, returned interval is in minutes",
            "schema": {
              "$ref": "#/definitions/ApplicationSettingModel"
            }
          }
        }
      }
    },
    "/application/send-location": {
      "get": {
        "tags": [
          "Application"
        ],
        "operationId": "Application_SendLocationSettings",
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Send location settings, returned interval is in minutes",
            "schema": {
              "$ref": "#/definitions/ApplicationSettingModel"
            }
          }
        }
      }
    },
    "/bus-operator/current-state": {
      "get": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_GetCurrentStatus",
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Get current status",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/BusOperatorStateModel"
              }
            }
          }
        }
      }
    },
    "/bus-operator/set-tracking-details": {
      "post": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_SetTrackingDetails",
        "parameters": [
          {
            "name": "model",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/TrackingDetailRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Set tracking details",
            "schema": {
              "$ref": "#/definitions/TrackingDetailModel"
            }
          }
        }
      }
    },
    "/bus-operator/force-set-tracking-details": {
      "post": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_ForceSetTrackingDetails",
        "parameters": [
          {
            "name": "model",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/TrackingDetailRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Force set tracking details",
            "schema": {
              "$ref": "#/definitions/TrackingDetailModel"
            }
          }
        }
      }
    },
    "/bus-operator/delete-tracking": {
      "delete": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_DeleteTrackingDetails",
        "parameters": [
          {
            "name": "model",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/TrackingDetailRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Delete tracking",
            "schema": {
              "$ref": "#/definitions/TrackingDetailModel"
            }
          }
        }
      }
    },
    "/bus-operator/set-current-location": {
      "post": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_SetCurrectLocation",
        "parameters": [
          {
            "name": "model",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/LocationUpdateRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Set current location",
            "schema": {
              "$ref": "#/definitions/ApplicationSettingModel"
            }
          }
        }
      }
    },
    "/bus-operator/set-passenger-data": {
      "post": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_SetPassengerData",
        "parameters": [
          {
            "name": "model",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/PassengerRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Set passenger data",
            "schema": {
              "$ref": "#/definitions/PassengerModel"
            }
          }
        }
      }
    },
    "/bus-operator/get-busses": {
      "get": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_GetBusses",
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Get busses",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/OptionItemModel"
              }
            }
          }
        }
      }
    },
    "/bus-operator/get-routes": {
      "get": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_GetRoutes",
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Get routes",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/OptionItemModel"
              }
            }
          }
        }
      }
    },
    "/bus-operator/get-route": {
      "get": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_GetRoute",
        "parameters": [
          {
            "type": "integer",
            "name": "id",
            "in": "query",
            "required": true,
            "format": "int32",
            "x-nullable": false
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Get route",
            "schema": {
              "$ref": "#/definitions/RouteItemModel"
            }
          }
        }
      }
    },
    "/bus-operator/logout": {
      "delete": {
        "tags": [
          "BusOperator"
        ],
        "operationId": "BusOperator_Logout",
        "responses": {
          "200": {
            "description": "Logout"
          }
        }
      }
    },
    "/clients/getOperators/{name}": {
      "get": {
        "tags": [
          "Clients"
        ],
        "operationId": "Clients_GetOperators",
        "parameters": [
          {
            "type": "string",
            "name": "name",
            "in": "path",
            "required": true,
            "x-nullable": false
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Get operators",
            "schema": {
              "$ref": "#/definitions/OptionItemModel"
            }
          }
        }
      }
    },
    "/clients/getOperator/{id}": {
      "get": {
        "tags": [
          "Clients"
        ],
        "operationId": "Clients_GetOperatorData",
        "parameters": [
          {
            "type": "integer",
            "name": "id",
            "in": "path",
            "required": true,
            "format": "int32",
            "x-nullable": false
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Get operator",
            "schema": {
              "$ref": "#/definitions/BusOperatorSearchModel"
            }
          }
        }
      }
    },
    "/clients/getLocation/{id}": {
      "get": {
        "tags": [
          "Clients"
        ],
        "operationId": "Clients_GetLocation",
        "parameters": [
          {
            "type": "string",
            "name": "id",
            "in": "path",
            "required": true,
            "x-nullable": false
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Get location",
            "schema": {
              "$ref": "#/definitions/LocationModel"
            }
          }
        }
      }
    },
    "/clients/getLocationUsingCode/{routeToken}/{appToken}": {
      "get": {
        "tags": [
          "Clients"
        ],
        "operationId": "Clients_GetLocationUsingCode",
        "parameters": [
          {
            "type": "string",
            "name": "routeToken",
            "in": "path",
            "required": true,
            "x-nullable": false
          },
          {
            "type": "string",
            "name": "appToken",
            "in": "path",
            "required": true,
            "x-nullable": false
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Get location using code",
            "schema": {
              "$ref": "#/definitions/LocationModel"
            }
          }
        }
      }
    },
    "/clients/getLocationByRouteToken": {
      "get": {
        "tags": [
          "Clients"
        ],
        "operationId": "Clients_GetLocationByRouteToken",
        "parameters": [
          {
            "name": "model",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/RouteTokenRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Get location by route token",
            "schema": {
              "$ref": "#/definitions/LocationModel"
            }
          }
        }
      }
    },
    "/clients/startTracking": {
      "post": {
        "tags": [
          "Clients"
        ],
        "operationId": "Clients_StartTracking",
        "parameters": [
          {
            "name": "passangerTokenRequest",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/RouteTrackingRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Start tracking",
            "schema": {
              "$ref": "#/definitions/RouteTokenModel"
            }
          }
        }
      }
    },
    "/clients/stopTracking": {
      "post": {
        "tags": [
          "Clients"
        ],
        "operationId": "Clients_StopTracking",
        "parameters": [
          {
            "name": "requestModel",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/StopTrackingRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "description": "Stop tracking"
          }
        }
      }
    },
    "/scheduler/generateRouteItems": {
      "get": {
        "tags": [
          "Scheduler"
        ],
        "operationId": "Scheduler_GenerateRouteItems",
        "responses": {
          "200": {
            "description": "Get Route Items"
          }
        }
      }
    },
    "/scheduler/requestLocations": {
      "get": {
        "tags": [
          "Scheduler"
        ],
        "operationId": "Scheduler_RequestLocations",
        "responses": {
          "200": {
            "description": "Request Locations"
          }
        }
      }
    },
    "/test/set-current-location": {
      "post": {
        "tags": [
          "Test"
        ],
        "operationId": "Test_SetCurrectLocation",
        "parameters": [
          {
            "name": "model",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/LocationUpdateRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Set current location",
            "schema": {
              "$ref": "#/definitions/LocationModel"
            }
          }
        }
      }
    },
    "/users/login": {
      "post": {
        "tags": [
          "Users"
        ],
        "operationId": "Users_Login",
        "parameters": [
          {
            "name": "logInModel",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/LogInRequestModel"
            },
            "x-nullable": true
          }
        ],
        "responses": {
          "200": {
            "x-nullable": false,
            "description": "Login",
            "schema": {
              "$ref": "#/definitions/LogInModel"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "ApplicationSettingModel": {
      "type": "object",
      "required": [
        "Interval",
        "CreatedOn"
      ],
      "properties": {
        "Interval": {
          "type": "integer",
          "format": "int32"
        },
        "Name": {
          "type": "string"
        },
        "CreatedOn": {
          "type": "string",
          "format": "date-time"
        },
        "ModifiedOn": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "BusOperatorStateModel": {
      "type": "object",
      "required": [
        "VehicleId",
        "RouteItemId",
        "StartingDateTime"
      ],
      "properties": {
        "VehicleId": {
          "type": "integer",
          "format": "int32"
        },
        "VehicleRegistration": {
          "type": "string"
        },
        "RouteItemId": {
          "type": "integer",
          "format": "int32"
        },
        "Route": {
          "type": "string"
        },
        "RouteItemToken": {
          "type": "string"
        },
        "StartingDateTime": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "TrackingDetailModel": {
      "type": "object",
      "required": [
        "VehicleId",
        "RouteItemId"
      ],
      "properties": {
        "VehicleId": {
          "type": "integer",
          "format": "int32"
        },
        "RouteItemId": {
          "type": "integer",
          "format": "int32"
        }
      }
    },
    "TrackingDetailRequestModel": {
      "type": "object",
      "required": [
        "VehicleId",
        "RouteItemId"
      ],
      "properties": {
        "VehicleId": {
          "type": "integer",
          "format": "int32"
        },
        "RouteItemId": {
          "type": "integer",
          "format": "int32"
        },
        "AppToken": {
          "type": "string"
        }
      }
    },
    "LocationUpdateRequestModel": {
      "type": "object",
      "required": [
        "LocationTime"
      ],
      "properties": {
        "Latitude": {
          "type": "string"
        },
        "Longitude": {
          "type": "string"
        },
        "LocationTime": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "PassengerModel": {
      "type": "object",
      "required": [
        "Id",
        "SeatNumber"
      ],
      "properties": {
        "Id": {
          "type": "integer",
          "format": "int32"
        },
        "FirstName": {
          "type": "string"
        },
        "Lastname": {
          "type": "string"
        },
        "SeatNumber": {
          "type": "integer",
          "format": "int32"
        }
      }
    },
    "PassengerRequestModel": {
      "type": "object",
      "required": [
        "Id",
        "RouteItemId",
        "SeatNumber"
      ],
      "properties": {
        "Id": {
          "type": "integer",
          "format": "int32"
        },
        "FirstName": {
          "type": "string"
        },
        "Lastname": {
          "type": "string"
        },
        "RouteItemId": {
          "type": "integer",
          "format": "int32"
        },
        "SeatNumber": {
          "type": "integer",
          "format": "int32"
        }
      }
    },
    "OptionItemModel": {
      "type": "object",
      "required": [
        "Id"
      ],
      "properties": {
        "Id": {
          "type": "integer",
          "format": "int32"
        },
        "Name": {
          "type": "string"
        }
      }
    },
    "RouteItemModel": {
      "type": "object",
      "required": [
        "Id",
        "StartTime"
      ],
      "properties": {
        "Id": {
          "type": "integer",
          "format": "int32"
        },
        "RouteItemToken": {
          "type": "string"
        },
        "ShortDescription": {
          "type": "string"
        },
        "StartTime": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "BusOperatorSearchModel": {
      "type": "object",
      "required": [
        "BusOperatorId",
        "ShowPassengerName",
        "ShowLines"
      ],
      "properties": {
        "BusOperatorId": {
          "type": "integer",
          "format": "int32"
        },
        "BusOperatorName": {
          "type": "string"
        },
        "ShowPassengerName": {
          "type": "boolean"
        },
        "ShowLines": {
          "type": "boolean"
        },
        "Routes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/OptionItemModel"
          }
        },
        "Banners": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/BannerModel"
          }
        }
      }
    },
    "BannerModel": {
      "type": "object",
      "required": [
        "Position"
      ],
      "properties": {
        "ActionUrl": {
          "type": "string"
        },
        "ImageLink": {
          "type": "string"
        },
        "Title": {
          "type": "string"
        },
        "Position": {
          "$ref": "#/definitions/BannerPositionEnum"
        }
      }
    },
    "BannerPositionEnum": {
      "type": "integer",
      "description": "",
      "x-enumNames": [
        "Top",
        "Middle",
        "Bottom",
        "PopUp"
      ],
      "enum": [
        0,
        1,
        2,
        3
      ]
    },
    "LocationModel": {
      "type": "object",
      "required": [
        "LocationTime"
      ],
      "properties": {
        "Latitude": {
          "type": "string"
        },
        "Longitude": {
          "type": "string"
        },
        "VehicleRegistration": {
          "type": "string"
        },
        "LocationTime": {
          "type": "string",
          "format": "date-time"
        },
        "CompanyName": {
          "type": "string"
        },
        "RouteDescription": {
          "type": "string"
        },
        "Banners": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/BannerModel"
          }
        }
      }
    },
    "RouteTokenRequestModel": {
      "type": "object",
      "properties": {
        "applicationToken": {
          "type": "string"
        },
        "routeItemToken": {
          "type": "string"
        }
      }
    },
    "RouteTokenModel": {
      "type": "object",
      "properties": {
        "token": {
          "type": "string"
        },
        "routesToTrack": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/OptionItemModel"
          }
        },
        "locations": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/LocationModel"
          }
        },
        "Banners": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/BannerModel"
          }
        }
      }
    },
    "RouteTrackingRequestModel": {
      "type": "object",
      "required": [
        "operatorId",
        "routeItemId"
      ],
      "properties": {
        "operatorId": {
          "type": "integer",
          "format": "int32"
        },
        "routeItemId": {
          "type": "integer",
          "format": "int32"
        },
        "appToken": {
          "type": "string"
        }
      }
    },
    "StopTrackingRequestModel": {
      "type": "object",
      "properties": {
        "token": {
          "type": "string"
        },
        "appToken": {
          "type": "string"
        }
      }
    },
    "LogInModel": {
      "type": "object",
      "required": [
        "token",
        "userRole"
      ],
      "properties": {
        "userName": {
          "type": "string"
        },
        "firstName": {
          "type": "string"
        },
        "lastName": {
          "type": "string"
        },
        "token": {
          "type": "string",
          "format": "guid"
        },
        "userRole": {
          "$ref": "#/definitions/UserRole"
        }
      }
    },
    "UserRole": {
      "type": "integer",
      "description": "",
      "x-enumNames": [
        "User",
        "BusOperator",
        "LogisticManager",
        "CompanyAdmin",
        "ApplicationAdmin"
      ],
      "enum": [
        0,
        1,
        2,
        11,
        20
      ]
    },
    "LogInRequestModel": {
      "type": "object",
      "properties": {
        "userName": {
          "type": "string"
        },
        "password": {
          "type": "string"
        }
      }
    }
  }
}