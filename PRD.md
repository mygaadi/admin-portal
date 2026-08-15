# User v1.0

**Product Requirements Document (PRD)**   
**Product:** Vehicle Service Management Platform   
**Document Version**: 1.0  
**Status**: Draft  
**Audience**: Product, Engineering, Design, QA, Operations  
**Primary Goal**: Build a complete vehicle servicing ecosystem connecting customers, service stations, mechanics, inventory management, billing, and payments.   
---

# **1\. Product Overview**

## **1.1 Vision**

Create a digital platform that enables customers to easily request vehicle services, locate service stations, manage vehicles, track service progress, make payments, and receive invoices.

The platform enables service stations to manage operations, assign mechanics, maintain spare part inventory, and process service requests efficiently.

---

# **2\. User Roles**

The system supports the following roles:

| Role | Description |
| ----- | ----- |
| Customer | Vehicle owner who creates service requests, manages vehicles, locations, payments, and invoices. |
| Mechanic | Performs assigned service jobs and updates service progress. |
| Station Manager | Manages assigned service station operations, mechanics, inventory, and service requests. |
| Admin | Full platform administration including master data and station management. |

# **3\. Authentication & Account Management**

## **3.1 Registration**

Users can create an account.

### **Requirements**

* Create a user profile.  
* Assign role.  
* Store authentication credentials securely.

### **API**

 /api/auth/register

{  
	firstName \- First name must not exceed 100 characters \- \*,  
	lastname \- Last name must not exceed 100 characters \- \*,  
	email \- Email must not exceed 255 characters \- valid,  
	phoneNumber \- Phone number must be valid \- \*,  
	password \- password must be between 8 and 100 characters  
}

### Response 

{  
	accessToken,  
	tokenType=”Bearer”,  
	userId,  
	firstName,  
	lastname,  
	role  
}

## 3.2 Login

Users can authenticate and access authorized features.

### **Requirements**

* Validate user credentials.  
* Create authenticated session/token.  
* Apply role-based authorization.

### **API**

 /api/auth/login  
{  
phoneNumber \- is required,  
Password \- is required,   
}

### Response 

{  
	accessToken,  
	tokenType=”Bearer”,  
	userId,  
	firstName,  
	lastname,  
	role  
}

# 

# 

# 

# **4\. User Profile Management**

## **4.1 Get Profile**

### **API**

GET /api/users/me

### Response 

{  
	id,  
	firstName,  
	lastName,  
	email,  
	phoneNumber,  
	role

}

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 4.2 Update Profile

### Requirements

Users can update:

* First name  
* Last name

### Restrictions

Cannot update:

* Email  
* Phone number  
* Role

### API

 PUT /api/user/me/profile  
{  
firstName \-First name must not exceed 100 character,  
lastName \- Last name must not exceed 100 character,   
}

### Response 

{  
	accessToken,  
	tokenType=”Bearer”,  
	userId,  
	firstName,  
	lastname,  
	role  
}

# 5\. Account Security

## 5.1 Change Password

Users can change their password.

### Requirements

* Validate current password.  
* Validate new password.  
* Securely store updated passwords.

### **API**

PUT /api/users/me/password  
{  
	currentPassword \- current password is required \- \*,  
	newPassword \- Password must be between 8 and 100 characters \- \*  
}

### Response 

{  
	Message \- Password updated successfully / Current Password is incorrect  
}

## 

## 5.2 Email Change

### Requirements

Initiate Email Change  
  ↓  
Send OTP  
  ↓  
Verify OTP  
  ↓  
Update Email

### API

 POST /api/user/me/email/initiate  
{  
newEmail \- Email must not exceed 255 characters \- Email must be valid \- \*,  
currentPassword \- Current password is required to confirm this change \- \*,   
}

### Response 

{  
	message \- Current password is incorrect / New email must be different from current email / Email already in use / OTP sent to email\_id…@gmail.com  
}

### API

 POST /api/user/me/email/verify  
{  
otpCode \- OTP code is required \- \*  
}

### Response 

{  
	id,  
	firstName,  
	lastName,  
	email,  
	phoneNumber,  
	role  
}

## 5.3 Phone Number Change

### Requirements

Initiate Phone Number Change  
  ↓  
Send OTP  
  ↓  
Verify OTP  
  ↓  
Update Phone Number

### API

 POST /api/user/me/phone/initiate  
{  
newPhoneNumber \- New phone number is required \- Phone number must be valid \- \*,  
currentPassword \- Current password is required to confirm this change \- \*,   
}

### Response 

{  
	message \- Current password is incorrect / New phone number must be different from current phone number / Phone number already in use / OTP sent to email\_id…@gmail.com  
}

### API

 POST /api/user/me/phone/verify  
{  
otpCode \- OTP code is required \- \*  
}

### Response 

{  
	id,  
	firstName,  
	lastName,  
	email,  
	phoneNumber,  
	role  
}

## 5.4 Delete Account

Users can delete their account.

### Requirements

* Authenticate user.  
* Remove/disable account.  
* Invalidate active sessions.

### API

 DELETE /api/user/me  
{  
currentPassword \- current password is required to confirm account deletion \- \*  
}

### Response 

{  
	message \- Current password is incorrect / Account deleted successfully  
}

# 6\. Location Management

### Requirements

* Users can manage saved locations.

## 6.1 Current / Default Location

### Requirements

* Most recently added location.  
* Most recently updated location.  
* Returns null if no location exists.

### API

 GET /api/users/me/locations/default

### Response 

{  
id,  
addressLine,  
city,  
state,  
latitude,  
longitude,  
isDetected,  
createdAt,  
updatedAt	  
}

## 

## 6.2 Locations List

### Requirements

* View all recent added or updated locations (Up to 4 latest locations)

### API

 GET /api/users/me/locations/{id}

### Response 

\[{  
id,  
addressLine,  
city,  
state,  
latitude,  
longitude,  
isDetected,  
createdAt,  
updatedAt	  
}\]

## 

## 6.3 Location 

### Requirements

* This may not be required

### API

 GET /api/users/me/locations/{id}

### Response 

{  
id,  
addressLine,  
city,  
state,  
latitude,  
longitude,  
isDetected,  
createdAt,  
updatedAt	  
}

## 6.4 Add Location

### Requirements

* Users can save new locations.

### API

 POST /api/users/me/locations  
{  
addressLine \- Address line must not exceed 255 characters  
city \- City is required \- city must not exceed 100 characters \- \*  
state \- State is required \- State must not exceed 100 characters \- \*  
latitude \- Latitude must be between \-90 and 90  
longitude \- Longitude must be between \-180 and 180  
isDetected   
}

### Response 

{  
id,  
addressLine,  
city,  
state,  
latitude,  
longitude,  
isDetected,  
createdAt,  
updatedAt	  
}

## 

## 6.5 Update Location

### Requirements

* Users can update locations. (This also can be skipped)

### API

 PUT /api/users/me/locations/{id}  
{  
addressLine \- Address line must not exceed 255 characters  
city \- City is required \- city must not exceed 100 characters \- \*  
state \- State is required \- State must not exceed 100 characters \- \*  
latitude \- Latitude must be between \-90 and 90  
longitude \- Longitude must be between \-180 and 180  
isDetected   
}

### Response 

{  
id,  
addressLine,  
city,  
state,  
latitude,  
longitude,  
isDetected,  
createdAt,  
updatedAt	  
}

## 6.6 Delete Location

### Requirements

* Users can delete locations. 

### API

 DELETE /api/users/me/locations/{id}

### Response 

{  
void	  
}

# Vehicle v1.0

# **7\. Vehicle Management**

Customers can manage the vehicles associated with their account.

## **7.1 Get My Vehicles**

### **Requirements**

* Users can view all vehicles associated with their account.  
* The API must return only vehicles owned or registered by the authenticated user.  
* Users must not be able to view vehicles belonging to another user.  
* The response must include the vehicle details along with its associated model and variant information.  
* The API must return an empty list if the user has no vehicles.

### **API**

**GET** `/api/users/me/vehicles`

### **Response**

\[  
  {  
    "id": 1,  
    "name": "My Car",  
    "modelId": 101,  
    "variantId": 501,  
    "variantColor": "Pearl White",  
    "variantImageUrl": "https://example.com/images/vehicle.png",  
    "purchaseDate": "2026-01-15",  
    "createdAt": "2026-01-20T10:00:00Z",  
    "updatedAt": "2026-01-20T10:00:00Z"  
  }  
\]

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the vehicle |
| `name` | User-defined name or display name of the vehicle |
| `modelId` | Unique identifier of the vehicle model |
| `variantId` | Unique identifier of the vehicle variant |
| `variantColor` | Color of the selected vehicle variant |
| `variantImageUrl` | Image URL of the selected vehicle variant |
| `purchaseDate` | Date on which the vehicle was purchased |
| `createdAt` | Timestamp when the vehicle was added |
| `updatedAt` | Timestamp when the vehicle details were last updated |

### **Access Control**

* The authenticated user can view only vehicles associated with their own account.  
* The user identity must be derived from the authenticated session/token and must not be supplied as a request parameter.

## **7.2 Get Vehicle**

### **Requirements**

* Users can view the details of a specific vehicle associated with their account.  
* The vehicle must be identified using the `id` path parameter.  
* The specified vehicle must belong to the authenticated user.  
* Users must not be able to view vehicles belonging to another user.  
* The response must include the vehicle details along with its associated model and variant information.

### 

### 

### 

### 

### **API**

**GET** `/api/users/me/vehicles/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the vehicle to be retrieved |

### **Response**

{  
  "id": 1,  
  "name": "My Car",  
  "modelId": 101,  
  "variantId": 501,  
  "variantColor": "Pearl White",  
  "variantImageUrl": "https://example.com/images/vehicle.png",  
  "purchaseDate": "2026-01-15",  
  "createdAt": "2026-01-20T10:00:00Z",  
  "updatedAt": "2026-01-20T10:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the vehicle |
| `name` | User-defined name or display name of the vehicle |
| `modelId` | Unique identifier of the vehicle model |
| `variantId` | Unique identifier of the vehicle variant |
| `variantColor` | Color of the selected vehicle variant |
| `variantImageUrl` | Image URL of the selected vehicle variant |
| `purchaseDate` | Date on which the vehicle was purchased |
| `createdAt` | Timestamp when the vehicle was added |
| `updatedAt` | Timestamp when the vehicle was last updated |

### 

### 

### **Access Control**

* The authenticated user can view only vehicles associated with their own account.  
* The API must validate that the requested vehicle belongs to the authenticated user.

### **Error Handling**

* Return **404 Not Found** if the vehicle does not exist.  
* Return **404 Not Found** or an appropriate authorization response if the vehicle does not belong to the authenticated user.

## **7.3 Add Vehicle to Garage**

### **Requirements**

* Users can add vehicles to their garage.  
* The vehicle is automatically associated with the authenticated user's account.  
* The `name` is mandatory and must not exceed 150 characters.  
* The `modelId` is mandatory and must reference an existing vehicle model.  
* The `variantId` is optional. If provided, it must reference an existing vehicle variant associated with the specified `modelId`.  
* The `purchaseDate` is optional and must represent a valid purchase date.  
* The system must generate a unique identifier for the vehicle upon successful creation.  
* The `createdAt` and `updatedAt` timestamps must be generated by the system.  
* The selected variant's `color` and `imageUrl` must be returned in the response.  
* The newly added vehicle must be available through the user's vehicle listing API.

### **API**

**POST** `/api/users/me/vehicles`

### **Request Body**

{  
  "name": "My Car",  
  "modelId": 101,  
  "variantId": 501,  
  "purchaseDate": "2026-01-15"  
}

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `name` | Yes | Must not exceed 150 characters |
| `modelId` | Yes | Must reference an existing vehicle model |
| `variantId` | No | When provided, must reference a valid variant belonging to the specified model |
| `purchaseDate` | No | Must be a valid date |

### **Response**

{  
  "id": 1,  
  "name": "My Car",  
  "modelId": 101,  
  "variantId": 501,  
  "variantColor": "Pearl White",  
  "variantImageUrl": "https://example.com/images/vehicle.png",  
  "purchaseDate": "2026-01-15",  
  "createdAt": "2026-01-20T10:00:00Z",  
  "updatedAt": "2026-01-20T10:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the vehicle |
| `name` | User-defined name or display name of the vehicle |
| `modelId` | Unique identifier of the vehicle model |
| `variantId` | Unique identifier of the selected vehicle variant; may be `null` |
| `variantColor` | Color of the selected vehicle variant; may be `null` |
| `variantImageUrl` | Image URL of the selected vehicle variant; may be `null` |
| `purchaseDate` | Date on which the vehicle was purchased; may be `null` |
| `createdAt` | Timestamp when the vehicle was added |
| `updatedAt` | Timestamp when the vehicle was last updated |

### **Access Control**

* The vehicle must be associated with the authenticated user.  
* The user identity must be derived from the authenticated session/token and must not be supplied in the request body.

### **Error Handling**

* Return **400 Bad Request** if a required field is missing or invalid.  
* Return **404 Not Found** if the specified `modelId` does not exist.  
* Return **404 Not Found** if the specified `variantId` does not exist.  
* Return **400 Bad Request** if the specified variant does not belong to the selected model.

## **7.4 Update Vehicle Details**

### **Requirements**

* Users can update the details of a vehicle associated with their account.  
* The vehicle to be updated must be identified using the `id` path parameter.  
* The specified vehicle must belong to the authenticated user.  
* The `name` is mandatory and must not exceed 150 characters.  
* The `modelId` is mandatory and must reference an existing vehicle model.  
* The `variantId` is optional. If provided, it must reference an existing vehicle variant associated with the specified `modelId`.  
* The `purchaseDate` is optional and must be a valid date.  
* The `createdAt` timestamp must remain unchanged during the update.  
* The `updatedAt` timestamp must be updated after a successful modification.  
* The selected variant's color and image URL must be returned in the response.

### **API**

**PUT** `/api/users/me/vehicles/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the vehicle to be updated |

### **Request Body**

{  
  "name": "My Updated Car",  
  "modelId": 101,  
  "variantId": 502,  
  "purchaseDate": "2026-02-10"  
}

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `name` | Yes | Must not exceed 150 characters |
| `modelId` | Yes | Must reference an existing vehicle model |
| `variantId` | No | When provided, must reference a valid variant belonging to the specified model |
| `purchaseDate` | No | Must be a valid date |

### **Response**

{  
  "id": 1,  
  "name": "My Updated Car",  
  "modelId": 101,  
  "variantId": 502,  
  "variantColor": "Midnight Blue",  
  "variantImageUrl": "https://example.com/images/vehicle-updated.png",  
  "purchaseDate": "2026-02-10",  
  "createdAt": "2026-01-20T10:00:00Z",  
  "updatedAt": "2026-08-09T11:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the vehicle |
| `name` | Updated name or display name of the vehicle |
| `modelId` | Unique identifier of the vehicle model |
| `variantId` | Unique identifier of the selected vehicle variant; may be `null` |
| `variantColor` | Color of the selected vehicle variant; may be `null` |
| `variantImageUrl` | Image URL of the selected vehicle variant; may be `null` |
| `purchaseDate` | Date on which the vehicle was purchased; may be `null` |
| `createdAt` | Original creation timestamp of the vehicle |
| `updatedAt` | Timestamp when the vehicle was last updated |

### **Access Control**

* The authenticated user can update only vehicles associated with their own account.  
* The user identity must be derived from the authenticated session/token.

### **Error Handling**

* Return **400 Bad Request** if a required field is missing or invalid.  
* Return **404 Not Found** if the vehicle does not exist or does not belong to the authenticated user.  
* Return **404 Not Found** if the specified `modelId` does not exist.  
* Return **404 Not Found** if the specified `variantId` does not exist.  
* Return **400 Bad Request** if the specified variant does not belong to the selected model.

## **7.5 Delete Vehicle from Garage**

### **Requirements**

* Users can remove a vehicle from their garage.  
* The vehicle to be removed must be identified using the `id` path parameter.  
* The specified vehicle must belong to the authenticated user.  
* Removing a vehicle must not affect the vehicle model or variant master data.  
* The system must prevent deletion if the vehicle has active service requests or bookings that require the vehicle to remain available, unless deletion is explicitly allowed by the business rules.  
* The vehicle must no longer appear in the user's vehicle list after successful deletion.

### **API**

**DELETE** `/api/users/me/vehicles/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the vehicle to be removed |

### **Response**

* **HTTP 204 No Content** on successful deletion.  
* The response body must be empty.

### 

### 

### **Access Control**

* The authenticated user can delete only vehicles associated with their own account.  
* The user identity must be derived from the authenticated session/token.

### **Error Handling**

* Return **404 Not Found** if the vehicle does not exist or does not belong to the authenticated user.  
* Return an appropriate **4xx** response if the vehicle cannot be deleted because it has active service requests or bookings.

# **8\. Vehicle Model Management (Admin)**

Administrators manage the vehicle model catalog available in the system.

## **8.1 Create Vehicle Model**

### **Requirements**

* Admins can create a new vehicle model.  
* The `name` is mandatory and must not exceed 150 characters.  
* The `name` must be unique among active vehicle models.  
* The `releaseDate` is optional. If provided, it must be a valid date.  
* The system must generate a unique identifier for the vehicle model upon successful creation.  
* The system must generate the `createdAt` timestamp automatically.  
* Newly created vehicle models must be available for selection when creating or updating vehicle variants.  
* Only authenticated Admin users can create vehicle models.

### **API**

**POST** `/api/vehicle-models`

### 

### **Request Body**

{  
  "name": "Tesla Model Y",  
  "releaseDate": "2025-01-15"  
}

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `name` | Yes | Must not exceed 150 characters and must be unique |
| `releaseDate` | No | Must be a valid date |

### **Response**

{  
  "id": 1,  
  "name": "Tesla Model Y",  
  "releaseDate": "2025-01-15",  
  "createdAt": "2026-08-09T10:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the vehicle model |
| `name` | Name of the vehicle model |
| `releaseDate` | Official release date of the vehicle model; may be `null` |
| `createdAt` | Timestamp when the vehicle model was created |

### **Access Control**

* Only authenticated Admin users can create vehicle models.

### **Error Handling**

* Return **400 Bad Request** if the model name is missing or exceeds 150 characters.  
* Return **400 Bad Request** if the release date is invalid.  
* Return **409 Conflict** if a vehicle model with the same name already exists.

## **8.2 Update Vehicle Model**

### **Requirements**

* Admins can update an existing vehicle model.  
* The vehicle model to be updated must be identified using the `id` path parameter.  
* The `name` is mandatory and must not exceed 150 characters.  
* The updated `name` must be unique among active vehicle models, excluding the current model.  
* The `releaseDate` is optional. If provided, it must be a valid date.  
* The `createdAt` timestamp must remain unchanged during the update.  
* The `updatedAt` timestamp should be maintained if the vehicle model entity supports an update timestamp.  
* Updating a vehicle model must not remove or modify its existing vehicle variants.  
* Only authenticated Admin users can update vehicle models.

### **API**

**PUT** `/api/vehicle-models/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the vehicle model to be updated |

### **Request Body**

{  
  "name": "Tesla Model Y Updated",  
  "releaseDate": "2025-02-01"  
}  
**Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `name` | Yes | Must not exceed 150 characters and must be unique |
| `releaseDate` | No | Must be a valid date |

### **Response**

{  
  "id": 1,  
  "name": "Tesla Model Y Updated",  
  "releaseDate": "2025-02-01",  
  "createdAt": "2026-08-09T10:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the vehicle model |
| `name` | Updated name of the vehicle model |
| `releaseDate` | Release date of the vehicle model; may be `null` |
| `createdAt` | Original timestamp when the vehicle model was created |

### **Access Control**

* Only authenticated Admin users can update vehicle models.

### **Error Handling**

* Return **400 Bad Request** if the model name is missing or exceeds 150 characters.  
* Return **400 Bad Request** if the release date is invalid.  
* Return **404 Not Found** if the specified vehicle model does not exist.  
* Return **409 Conflict** if another active vehicle model already uses the specified name.

## **8.3 Delete Vehicle Model**

### **Requirements**

* Admins can delete an existing vehicle model.  
* The vehicle model to be deleted must be identified using the `id` path parameter.  
* The specified vehicle model must exist.  
* A vehicle model must not be deleted if it is referenced by existing vehicle variants or customer vehicles, unless the business rules explicitly allow cascading deletion or reassignment.  
* Deleting a vehicle model must not affect unrelated vehicle models or their associated data.  
* If soft deletion is used, the deleted model must no longer be available for selection in vehicle or variant creation.  
* Only authenticated Admin users can delete vehicle models.

### **API**

**DELETE** `/api/vehicle-models/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the vehicle model to be deleted |

### **Response**

* **HTTP 204 No Content** on successful deletion.  
* The response body must be empty.

### **Access Control**

* Only authenticated Admin users can delete vehicle models.

### **Error Handling**

* Return **404 Not Found** if the specified vehicle model does not exist.  
* Return **409 Conflict** if the vehicle model is referenced by existing vehicle variants or customer vehicles and cannot be deleted.  
* Return an appropriate authorization error if a non-Admin user attempts to delete a vehicle model.

## **8.4 View Vehicle Models**

### **Requirements**

* Users can view all available vehicle models.  
* The API must return only active/non-deleted vehicle models.  
* Vehicle models must be available for selection when users add or update a vehicle in their garage.  
* The API must return an empty list if no vehicle models are available.  
* The response must include the model name, release date, and creation timestamp.  
* Authenticated users can access the vehicle model catalog.

### **API**

**GET** `/api/vehicle-models`

### **Response**

\[  
  {  
    "id": 1,  
    "name": "Tesla Model Y",  
    "releaseDate": "2025-01-15",  
    "createdAt": "2026-08-09T10:00:00Z"  
  }  
\]

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the vehicle model |
| `name` | Name of the vehicle model |
| `releaseDate` | Release date of the vehicle model; may be `null` |
| `createdAt` | Timestamp when the vehicle model was created |

# **9\. Vehicle Variant Management (Admin)**

Admin manages vehicle catalog.

## **9.1 Create Vehicle Variants**

### **Requirements**

* Admin can create a new variant for an existing vehicle model.  
* Each variant must be associated with a valid vehicle model using `modelId`.  
* The variant `color` is mandatory and must not exceed 50 characters.  
* The `imageUrl` is optional, but when provided, it must not exceed 500 characters.  
* The `price` is mandatory and must be greater than or equal to `0`.  
* A variant must not be created if the specified `modelId` does not exist.  
* On successful creation, the system must generate a unique identifier for the variant and store the creation timestamp.

### **API**

**POST** `/api/vehicle-variants`

#### **Request Body**

{  
  "modelId": 1,  
  "color": "Pearl White",  
  "imageUrl": "https://example.com/images/pearl-white.png",  
  "price": 1250000  
}

#### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `modelId` | Yes | Must reference an existing vehicle model |
| `color` | Yes | Must not exceed 50 characters |
| `imageUrl` | No | Must not exceed 500 characters when provided |
| `price` | Yes | Must be greater than or equal to `0` |

### 

### **Response**

{  
  "id": 1,  
  "modelId": 1,  
  "modelName": "Model Name",  
  "color": "Pearl White",  
  "imageUrl": "https://example.com/images/pearl-white.png",  
  "price": 1250000,  
  "createdAt": "2026-08-08T19:30:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the created variant |
| `modelId` | ID of the vehicle model associated with the variant |
| `modelName` | Name of the associated vehicle model |
| `color` | Color of the vehicle variant |
| `imageUrl` | Image URL of the variant |
| `price` | Price of the vehicle variant |
| `createdAt` | Timestamp when the variant was created |

## 

## **9.2 Update Vehicle Variants**

### **Requirements**

* Admin can update an existing vehicle variant.  
* The variant to be updated must be identified using the `id` path parameter.  
* The specified variant must exist; otherwise, the system must return an appropriate error response.  
* The variant can be updated with a different vehicle model by providing a valid `modelId`.  
* The `modelId` is mandatory and must reference an existing vehicle model.  
* The `color` is mandatory and must not exceed 50 characters.  
* The `imageUrl` is optional, but when provided, it must not exceed 500 characters.  
* The `price` is mandatory and must be greater than or equal to `0`.  
* The `createdAt` timestamp must remain unchanged when the variant is updated.  
* The system must update the variant details only after all validations are successfully completed.

### **API**

**PUT** `/api/vehicle-variants/{id}`

#### **Request Body**

{  
  "modelId": 1,  
  "color": "Metallic Blue",  
  "imageUrl": "https://example.com/images/metallic-blue.png",  
  "price": 1300000  
}

#### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the vehicle variant to be updated |

#### 

#### 

#### 

#### 

#### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `modelId` | Yes | Must reference an existing vehicle model |
| `color` | Yes | Must not exceed 50 characters |
| `imageUrl` | No | Must not exceed 500 characters when provided |
| `price` | Yes | Must be greater than or equal to `0` |

### **Response**

{  
  "id": 1,  
  "modelId": 1,  
  "modelName": "Model Name",  
  "color": "Metallic Blue",  
  "imageUrl": "https://example.com/images/metallic-blue.png",  
  "price": 1300000,  
  "createdAt": "2026-08-08T19:30:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the vehicle variant |
| `modelId` | ID of the vehicle model associated with the variant |
| `modelName` | Name of the associated vehicle model |
| `color` | Updated color of the vehicle variant |
| `imageUrl` | Updated image URL of the variant |
| `price` | Updated price of the vehicle variant |
| `createdAt` | Timestamp when the variant was originally created; remains unchanged during update |

## 

## **9.3 Delete Vehicle Variants**

### **Requirements**

* Admin can delete an existing vehicle variant.  
* The variant to be deleted must be identified using the `id` path parameter.  
* The specified variant must exist; otherwise, the system must return an appropriate error response.  
* On successful deletion, the variant must no longer be available through the vehicle variant APIs.  
* If the system supports soft deletion, the variant must be marked as deleted instead of being physically removed from the database.

### **API**

**DELETE** `/api/vehicle-variants/{id}`

#### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the vehicle variant to be deleted |

### **Response**

* **HTTP 204 No Content** on successful deletion.  
* The response body must be empty.

### **Error Handling**

* Return **404 Not Found** if the specified vehicle variant does not exist.  
* Return an appropriate **4xx** response if the deletion cannot be performed due to business or validation constraints.

## **9.4 View Vehicle Variants**

### **Requirements**

* Users can view all available vehicle variants.  
* The vehicle variants must be displayed with their associated vehicle model details.  
* Users can select a vehicle variant when adding or updating a vehicle in their garage.  
* Only active/non-deleted vehicle variants must be returned.  
* The API must return an empty list when no vehicle variants are available.  
* The response must include the variant's model, color, image, and price details.

### **API**

**GET** `/api/vehicle-variants`

### **Response**

\[  
  {  
    "id": 1,  
    "modelId": 1,  
    "modelName": "Model Name",  
    "color": "Pearl White",  
    "imageUrl": "https://example.com/images/pearl-white.png",  
    "price": 1250000,  
    "createdAt": "2026-08-08T19:30:00Z"  
  },  
  {  
    "id": 2,  
    "modelId": 1,  
    "modelName": "Model Name",  
    "color": "Metallic Blue",  
    "imageUrl": "https://example.com/images/metallic-blue.png",  
    "price": 1300000,  
    "createdAt": "2026-08-08T19:35:00Z"  
  }  
\]

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the vehicle variant |
| `modelId` | ID of the vehicle model associated with the variant |
| `modelName` | Name of the associated vehicle model |
| `color` | Color of the vehicle variant |
| `imageUrl` | Image URL of the vehicle variant |
| `price` | Price of the vehicle variant |
| `createdAt` | Timestamp when the variant was created |

# Service Station v1.0

# **10\. Service Station Management**

Service stations represent physical locations where users can get their vehicles serviced.

## **10.1 View Stations (User, Admin)**

### **Requirements**

* Users and Admins can view the available service stations.  
* The API must return the service station's basic information, location, manager details, contact information, and service capacity.  
* Only active/non-deleted service stations must be returned.  
* The API must return an empty list when no service stations are available.  
* Users can use the service station details to select a suitable station for vehicle servicing.

### **API**

**GET** `/api/service-stations`

### **Response**

\[  
  {  
    "id": 1,  
    "name": "ABC Motors Service Center",  
    "locationId": 101,  
    "city": "Bangalore",  
    "addressLine": "123, Main Road, Indiranagar",  
    "managerId": 501,  
    "managerName": "John Doe",  
    "phone": "+91XXXXXXXXXX",  
    "email": "manager@example.com",  
    "capacity": 50,  
    "createdAt": "2026-08-08T10:00:00Z",  
    "updatedAt": "2026-08-08T10:00:00Z"  
  }  
\]

### 

### 

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service station |
| `name` | Name of the service station |
| `locationId` | Identifier of the location associated with the service station |
| `city` | City where the service station is located |
| `addressLine` | Address of the service station |
| `managerId` | Unique identifier of the service station manager |
| `managerName` | Name of the service station manager |
| `phone` | Contact phone number of the service station |
| `email` | Contact email address of the service station |
| `capacity` | Maximum service capacity of the station |
| `createdAt` | Timestamp when the service station was created |
| `updatedAt` | Timestamp when the service station was last updated |

## **10.2 Create Station (Admin)**

### **Requirements**

* Admin can create a new service station.  
* The station name is mandatory and must not exceed 200 characters.  
* The `locationId` is mandatory and must reference a valid location.  
* The `managerId` is mandatory and must reference a valid user who can be assigned as a service station manager.  
* The `phone` is optional and must not exceed 20 characters when provided.  
* The `email` is optional and must be a valid email address when provided.  
* The `capacity` is mandatory and must be a non-negative value.  
* The system must generate a unique identifier for the service station upon successful creation.  
* The `createdAt` and `updatedAt` timestamps must be generated by the system.  
* The station must be available in the service-station listing after successful creation.

### **API**

**POST** `/api/service-stations`

### **Request Body**

{  
  "name": "ABC Motors Service Center",  
  "locationId": 101,  
  "managerId": 501,  
  "phone": "+91XXXXXXXXXX",  
  "email": "manager@example.com",  
  "capacity": 50  
}

### 

### 

### 

### 

### 

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `name` | Yes | Must not exceed 200 characters |
| `locationId` | Yes | Must reference an existing location |
| `managerId` | Yes | Must reference an existing eligible service station manager |
| `phone` | No | Must not exceed 20 characters when provided |
| `email` | No | Must be a valid email address when provided |
| `capacity` | Yes | Must be greater than or equal to `0` |

### **Response**

{  
  "id": 1,  
  "name": "ABC Motors Service Center",  
  "locationId": 101,  
  "city": "Bangalore",  
  "addressLine": "123, Main Road, Indiranagar",  
  "managerId": 501,  
  "managerName": "John Doe",  
  "phone": "+91XXXXXXXXXX",  
  "email": "manager@example.com",  
  "capacity": 50,  
  "createdAt": "2026-08-08T10:00:00Z",  
  "updatedAt": "2026-08-08T10:00:00Z"  
}

### 

### 

### 

### 

### 

### 

### 

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service station |
| `name` | Name of the service station |
| `locationId` | Identifier of the associated location |
| `city` | City derived from the associated location |
| `addressLine` | Address derived from the associated location |
| `managerId` | Identifier of the assigned station manager |
| `managerName` | Name of the assigned station manager |
| `phone` | Contact phone number of the service station |
| `email` | Contact email address of the service station |
| `capacity` | Maximum service capacity of the station |
| `createdAt` | Timestamp when the station was created |
| `updatedAt` | Timestamp when the station was last updated |

## 

## 

## 

## 

## 

## 

## 

## **10.3 Update Station (Admin)**

### **Requirements**

* Admin can update an existing service station.  
* The service station to be updated must be identified using the `id` path parameter.  
* The specified service station must exist; otherwise, the system must return an appropriate error response.  
* The station name is mandatory and must not exceed 200 characters.  
* The `locationId` is mandatory and must reference a valid location.  
* The `managerId` is mandatory and must reference a valid user who can be assigned as a service station manager.  
* The `phone` is optional and must not exceed 20 characters when provided.  
* The `email` is optional and must be a valid email address when provided.  
* The `capacity` is mandatory and must be greater than or equal to `0`.  
* The `createdAt` timestamp must remain unchanged during the update.  
* The `updatedAt` timestamp must be updated when the station details are successfully modified.

### **API**

**PUT** `/api/service-stations/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the service station to be updated |

### **Request Body**

{  
  "name": "ABC Motors Premium Service Center",  
  "locationId": 101,  
  "managerId": 502,  
  "phone": "+91XXXXXXXXXX",  
  "email": "newmanager@example.com",  
  "capacity": 75  
}

### 

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `name` | Yes | Must not exceed 200 characters |
| `locationId` | Yes | Must reference an existing location |
| `managerId` | Yes | Must reference an existing eligible service station manager |
| `phone` | No | Must not exceed 20 characters when provided |
| `email` | No | Must be a valid email address when provided |
| `capacity` | Yes | Must be greater than or equal to `0` |

### **Response**

{  
  "id": 1,  
  "name": "ABC Motors Premium Service Center",  
  "locationId": 101,  
  "city": "Bangalore",  
  "addressLine": "123, Main Road, Indiranagar",  
  "managerId": 502,  
  "managerName": "Jane Doe",  
  "phone": "+91XXXXXXXXXX",  
  "email": "newmanager@example.com",  
  "capacity": 75,  
  "createdAt": "2026-08-08T10:00:00Z",  
  "updatedAt": "2026-08-08T11:30:00Z"  
}

### 

### 

### 

### 

### 

### 

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service station |
| `name` | Updated name of the service station |
| `locationId` | Identifier of the associated location |
| `city` | City derived from the associated location |
| `addressLine` | Address derived from the associated location |
| `managerId` | Identifier of the assigned station manager |
| `managerName` | Name of the assigned station manager |
| `phone` | Contact phone number of the service station |
| `email` | Contact email address of the service station |
| `capacity` | Updated maximum service capacity of the station |
| `createdAt` | Original creation timestamp of the service station |
| `updatedAt` | Timestamp of the latest update |

## **10.4 Delete a Station (Admin)**

### **Requirements**

* Admin can delete an existing service station.  
* The service station to be deleted must be identified using the `id` path parameter.  
* The specified service station must exist; otherwise, the system must return an appropriate error response.  
* A service station must not be deleted if it has active dependencies or ongoing service bookings, unless the business rules explicitly allow deletion.  
* On successful deletion, the service station must no longer be available through the service-station listing API.  
* If the system supports soft deletion, the service station must be marked as deleted instead of being physically removed from the database.

### 

### **API**

**DELETE** `/api/service-stations/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the service station to be deleted |

### **Response**

* **HTTP 204 No Content** on successful deletion.  
* The response body must be empty.

### **Error Handling**

* Return **404 Not Found** if the specified service station does not exist.  
* Return an appropriate **4xx** response if the station cannot be deleted due to active dependencies or other business constraints.

# 

# 

# 

# 

# 

# 

# **11\. Service Station Inventory Management**

Service station inventory represents the physical spare parts and service tools available at a service station for servicing vehicles.

## **11.1 View Station Inventory (Station Manager, Admin, Mechanic)**

### **Requirements**

* Station Managers, Admins, and Mechanics can view the inventory of a service station.  
* The inventory must be retrieved for the service station identified by the `stationId` path parameter.  
* The API must return the spare parts and service tools available at the specified service station.  
* Each inventory item must include its associated spare part, price, available quantity, and last updated timestamp.  
* Users must only be able to view inventory for service stations they are authorized to access.  
* Only active/non-deleted inventory items must be returned.  
* The API must return an empty list when the service station has no inventory items.

### **API**

**GET** `/api/service-stations/{stationId}/inventory`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `stationId` | Yes | Unique identifier of the service station whose inventory is being retrieved |

### 

### 

### 

### 

### **Response**

\[  
  {  
    "id": 1,  
    "stationId": 101,  
    "stationName": "ABC Motors Service Center",  
    "sparePartId": 501,  
    "sparePartPrice": 2500.00,  
    "quantity": 25,  
    "updatedAt": "2026-08-08T12:30:00Z"  
  }  
\]

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the inventory record |
| `stationId` | Unique identifier of the service station |
| `stationName` | Name of the service station |
| `sparePartId` | Unique identifier of the spare part |
| `sparePartPrice` | Price of the associated spare part |
| `quantity` | Available quantity of the spare part at the service station |
| `updatedAt` | Timestamp when the inventory record was last updated |

## 

## **11.2 Update Particular Station Inventory Item (Station Manager, Admin)**

### **Requirements**

* Station Managers and Admins can update the inventory quantity of a spare part at a service station.  
* The service station must be identified using the stationId path parameter.  
* The spare part must be identified using the sparePartId path parameter.  
* The specified spare part must have an existing inventory record for the specified service station.  
* The quantity is mandatory and must be greater than or equal to 0\.  
* Users must only be able to update inventory for service stations they are authorized to manage.  
* The updatedAt timestamp must be updated when the inventory quantity is successfully modified.  
* The system must not modify the associated spare part price or service station details through this API.

### **API**

**PUT `/api/service-stations/{stationId}/inventory/{sparePartId}`**

### **Path Parameters**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| **`stationId`** | Yes | Unique identifier of the service station |
| **`sparePartId`** | Yes | Unique identifier of the spare part whose inventory quantity is being updated |

### **Request Body**

{  
  "quantity": 25  
}

### 

### 

### 

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `quantity` | Yes | Must be greater than or equal to `0` |

### **Response**

{  
  "id": 1,  
  "stationId": 101,  
  "stationName": "ABC Motors Service Center",  
  "sparePartId": 501,  
  "sparePartPrice": 2500.00,  
  "quantity": 25,  
  "updatedAt": "2026-08-08T13:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| **`id`** | Unique identifier of the inventory record |
| **`stationId`** | Unique identifier of the service station |
| **`stationName`** | Name of the service station |
| **`sparePartId`** | Unique identifier of the spare part |
| **`sparePartPrice`** | Current price of the associated spare part |
| **`quantity`** | Updated available quantity of the spare part |
| **`updatedAt`** | Timestamp when the inventory record was last updated |

### **Error Handling**

* Return 404 Not Found if the service station does not exist.  
* Return 404 Not Found if the spare part does not exist or has no inventory record for the specified station.  
* Return an appropriate 4xx response if the user is not authorized to update the station inventory.  
* Return a validation error if `quantity` is negative or not provided.

# Spare Parts v1.0

# **12\. Spare Parts Management**

Spare parts represent the physical parts used for servicing and maintaining vehicles.

## **12.1 View Spare Parts (All Authorized Users)**

### **Requirements**

* Users, Station Managers, Admins, and Mechanics can view all available spare parts.  
* The API must return the details of each available spare part, including its associated vehicle model, price, and image.  
* Only active/non-deleted spare parts must be returned.  
* The API must return an empty list when no spare parts are available.  
* Users can use the spare part details when selecting parts required for vehicle servicing or managing service station inventory.  
* The response must include the vehicle model associated with each spare part.

### **API**

**GET** `/api/spare-parts`

### **Response**

\[  
  {  
    "id": 1,  
    "name": "Front Brake Pad",  
    "modelId": 101,  
    "modelName": "Model Name",  
    "price": 2500.00,  
    "imageUrl": "https://example.com/images/front-brake-pad.png",  
    "createdAt": "2026-08-08T10:00:00Z",  
    "updatedAt": "2026-08-08T10:00:00Z"  
  }  
\]

### 

### 

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the spare part |
| `name` | Name of the spare part |
| `modelId` | Unique identifier of the vehicle model compatible with the spare part |
| `modelName` | Name of the compatible vehicle model |
| `price` | Current price of the spare part |
| `imageUrl` | Image URL of the spare part |
| `createdAt` | Timestamp when the spare part was created |
| `updatedAt` | Timestamp when the spare part was last updated |

## 

## 

## **12.2 View a Particular Spare Part (All Authorized Users)**

### **Requirements**

* Users, Admins, Mechanics, and Station Managers can view the details of a particular spare part.  
* The spare part must be identified using the `id` path parameter.  
* The specified spare part must exist; otherwise, the system must return an appropriate error response.  
* Only active/non-deleted spare parts can be retrieved.  
* The response must include the spare part details along with its associated vehicle model information.

### **API**

**GET** `/api/spare-parts/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the spare part to be retrieved |

### **Response**

{  
  "id": 1,  
  "name": "Front Brake Pad",  
  "modelId": 101,  
  "modelName": "Model Name",  
  "price": 2500.00,  
  "imageUrl": "https://example.com/images/front-brake-pad.png",  
  "createdAt": "2026-08-08T10:00:00Z",  
  "updatedAt": "2026-08-08T10:00:00Z"  
}

### 

### 

### 

### 

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the spare part |
| `name` | Name of the spare part |
| `modelId` | Unique identifier of the compatible vehicle model |
| `modelName` | Name of the compatible vehicle model |
| `price` | Current price of the spare part |
| `imageUrl` | Image URL of the spare part |
| `createdAt` | Timestamp when the spare part was created |
| `updatedAt` | Timestamp when the spare part was last updated |

### **Error Handling**

* Return **404 Not Found** if the specified spare part does not exist or has been deleted.

## 

## 

## 

## 

## 

## 

## 

## 

## 

## **12.3 Add a New Spare Part (Admin)**

### **Requirements**

* Admin can create a new spare part.  
* The spare part must be associated with a valid vehicle model using `modelId`.  
* The `name` is mandatory and must not exceed 200 characters.  
* The `modelId` is mandatory and must reference an existing vehicle model.  
* The `price` is mandatory and must be greater than or equal to `0`.  
* The `imageUrl` is optional, but when provided, it must not exceed 500 characters.  
* The system must generate a unique identifier for the spare part upon successful creation.  
* The `createdAt` and `updatedAt` timestamps must be generated by the system.  
* The newly created spare part must be available through the spare-parts listing API.

### **API**

**POST** `/api/spare-parts`

### **Request Body**

{  
  "name": "Front Brake Pad",  
  "modelId": 101,  
  "price": 2500.00,  
  "imageUrl": "https://example.com/images/front-brake-pad.png"  
}

### **Request Fields**

| Field | Required | Validation |
| :---- | :---- | :---- |
| name | Yes | Must not exceed 200 characters |
| modelId | Yes | Must reference an existing vehicle model |
| price | Yes | Must be greater than or equal to 0 |
| imageUrl | No | Must not exceed 500 characters when provided |

### 

### **Response**

{  
  "id": 1,  
  "name": "Front Brake Pad",  
  "modelId": 101,  
  "modelName": "Model Name",  
  "price": 2500.00,  
  "imageUrl": "https://example.com/images/front-brake-pad.png",  
  "createdAt": "2026-08-08T10:00:00Z",  
  "updatedAt": "2026-08-08T10:00:00Z"  
}

### **Response Fields**

| Field | Description |
| :---- | :---- |
| id | Unique identifier of the spare part |
| name | Name of the spare part |
| modelId | Unique identifier of the associated vehicle model |
| modelName | Name of the associated vehicle model |
| price | Price of the spare part |
| imageUrl | Image URL of the spare part |
| createdAt | Timestamp when the spare part was created |
| updatedAt | Timestamp when the spare part was last updated |

### **Error Handling**

* Return **400 Bad Request** for invalid or missing required fields.  
* Return **404 Not Found** if the specified `modelId` does not exist.  
* Return an appropriate **4xx** response if a spare part with the same applicable unique attributes already exists.

## **12.4 Update an Existing Spare Part (Admin)**

### **Requirements**

* Admin can update the details of an existing spare part.  
* The spare part to be updated must be identified using the `id` path parameter.  
* The specified spare part must exist and must not be deleted.  
* The `name` is mandatory and must not exceed 200 characters.  
* The `modelId` is mandatory and must reference an existing vehicle model.  
* The `price` is mandatory and must be greater than or equal to `0`.  
* The `imageUrl` is optional, but when provided, it must not exceed 500 characters.  
* The `createdAt` timestamp must remain unchanged during the update.  
* The `updatedAt` timestamp must be updated when the spare part is successfully modified.

### **API**

**PUT** `/api/spare-parts/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the spare part to be updated |

### **Request Body**

{  
  "name": "Premium Front Brake Pad",  
  "modelId": 101,  
  "price": 2800.00,  
  "imageUrl": "https://example.com/images/premium-front-brake-pad.png"  
}

### 

### 

### 

### 

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `name` | Yes | Must not exceed 200 characters |
| `modelId` | Yes | Must reference an existing vehicle model |
| `price` | Yes | Must be greater than or equal to `0` |
| `imageUrl` | No | Must not exceed 500 characters when provided |

### **Response**

{  
  "id": 1,  
  "name": "Premium Front Brake Pad",  
  "modelId": 101,  
  "modelName": "Model Name",  
  "price": 2800.00,  
  "imageUrl": "https://example.com/images/premium-front-brake-pad.png",  
  "createdAt": "2026-08-08T10:00:00Z",  
  "updatedAt": "2026-08-08T11:30:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the spare part |
| `name` | Updated name of the spare part |
| `modelId` | Unique identifier of the associated vehicle model |
| `modelName` | Name of the associated vehicle model |
| `price` | Updated price of the spare part |
| `imageUrl` | Updated image URL of the spare part |
| `createdAt` | Original creation timestamp of the spare part |
| `updatedAt` | Timestamp of the latest update |

## 

## **12.5 Delete an Existing Spare Part (Admin)**

### **Requirements**

* Admin can delete an existing spare part.  
* The spare part to be deleted must be identified using the `id` path parameter.  
* The specified spare part must exist; otherwise, the system must return an appropriate error response.  
* A spare part must not be deleted if it is currently associated with active service station inventory or ongoing service operations, unless the business rules explicitly allow deletion.  
* On successful deletion, the spare part must no longer be available through the spare-parts listing or detail APIs.  
* If the system supports soft deletion, the spare part must be marked as deleted instead of being physically removed from the database.

### **API**

**DELETE** `/api/spare-parts/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the spare part to be deleted |

### **Response**

* **HTTP 204 No Content** on successful deletion.  
* The response body must be empty..

# Service Requests v1.0

# **13\. Service Request Management**

Service requests represent requests raised by users for servicing or maintenance of their vehicles at a service station.

## **13.1 View All My Service Requests (User)**

### **Requirements**

* Users can view all service requests raised by them for their vehicles.  
* The API must return only service requests belonging to the authenticated user.  
* Users can view service requests associated with all of their vehicles.  
* The response must include the associated vehicle, customer, mechanic, service station, invoice, service status, service type, and service timing details.  
* Mechanic and invoice details may be `null` if they have not yet been assigned or generated.  
* The API must return an empty list if the user has not raised any service requests.

### **API**

**GET** `/api/service-requests/me`

### **Response**

\[  
  {  
    "id": 1,  
    "vehicleId": 101,  
    "vehicleName": "Model Name \- Pearl White",  
    "customerId": 501,  
    "customerName": "John Doe",  
    "mechanicId": 701,  
    "mechanicName": "Mike Smith",  
    "stationId": 201,  
    "stationName": "ABC Motors Service Center",  
    "invoiceId": 901,  
    "status": "IN\_PROGRESS",  
    "serviceType": "GENERAL\_SERVICE",  
    "startTime": "2026-08-09T10:00:00Z",  
    "endTime": "2026-08-09T14:00:00Z",  
    "createdAt": "2026-08-08T09:00:00Z",  
    "updatedAt": "2026-08-09T10:30:00Z"  
  }  
\]

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service request |
| `vehicleId` | Unique identifier of the vehicle associated with the request |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the customer who raised the request |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the assigned mechanic; may be `null` if not assigned |
| `mechanicName` | Name of the assigned mechanic; may be `null` if not assigned |
| `stationId` | Unique identifier of the service station |
| `stationName` | Name of the service station |
| `invoiceId` | Unique identifier of the associated invoice; may be `null` if an invoice has not been generated |
| `status` | Current status of the service request |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual start time of the service |
| `endTime` | Scheduled or actual completion time of the service |
| `createdAt` | Timestamp when the service request was created |
| `updatedAt` | Timestamp when the service request was last updated |

### **Access Control**

* The authenticated user can view only their own service requests.  
* Users must not be able to access another user's service requests.

## **13.2 View My Service Request (User)**

### **Requirements**

* Users can view the details of a specific service request raised by them for one of their vehicles.  
* The service request must be identified using the `id` path parameter.  
* The specified service request must exist and must belong to the authenticated user.  
* Users must not be able to view service requests belonging to another user.  
* The response must include the associated vehicle, customer, mechanic, service station, invoice, service status, service type, and service timing details.  
* Mechanic and invoice details may be `null` if they have not yet been assigned or generated.

### **API**

**GET** `/api/service-requests/me/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the service request to be retrieved |

### **Response**

{  
  "id": 1,  
  "vehicleId": 101,  
  "vehicleName": "Model Name \- Pearl White",  
  "customerId": 501,  
  "customerName": "John Doe",  
  "mechanicId": 701,  
  "mechanicName": "Mike Smith",  
  "stationId": 201,  
  "stationName": "ABC Motors Service Center",  
  "invoiceId": 901,  
  "status": "IN\_PROGRESS",  
  "serviceType": "GENERAL\_SERVICE",  
  "startTime": "2026-08-09T10:00:00Z",  
  "endTime": "2026-08-09T14:00:00Z",  
  "createdAt": "2026-08-08T09:00:00Z",  
  "updatedAt": "2026-08-09T10:30:00Z"  
}

### 

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service request |
| `vehicleId` | Unique identifier of the vehicle associated with the request |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the customer who raised the request |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the assigned mechanic; may be `null` if not assigned |
| `mechanicName` | Name of the assigned mechanic; may be `null` if not assigned |
| `stationId` | Unique identifier of the service station |
| `stationName` | Name of the service station |
| `invoiceId` | Unique identifier of the associated invoice; may be `null` if an invoice has not been generated |
| `status` | Current status of the service request |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual start time of the service |
| `endTime` | Scheduled or actual completion time of the service |
| `createdAt` | Timestamp when the service request was created |
| `updatedAt` | Timestamp when the service request was last updated |

## **13.3 Raise / Book a Service Request**

### **Requirements**

* Users can raise a service request for one of their vehicles.  
* The `vehicleId` is mandatory and must reference a vehicle owned by the authenticated user.  
* The `serviceType` is mandatory and must be a valid supported service type.  
* The `stationId` is mandatory and must reference an existing active service station.  
* The selected service station must be available to accept service requests.  
* A service request must be created with an appropriate initial status, such as `REQUESTED` or `PENDING`.  
* The `customerId` must be derived from the authenticated user and must not be accepted from the request body.  
* `mechanicId` and `mechanicName` must initially be `null` unless a mechanic is assigned during request creation.  
* `invoiceId` must initially be `null` until an invoice is generated.  
* `startTime` and `endTime` must remain `null` until the service is scheduled or started, unless the booking process includes scheduling.  
* The system must generate the `id`, `createdAt`, and `updatedAt` values upon successful creation.

### **API**

**POST** `/api/service-requests`

### **Request Body**

{  
  "vehicleId": 101,  
  "serviceType": "GENERAL\_SERVICE",  
  "stationId": 201  
}

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `vehicleId` | Yes | Must reference an existing vehicle owned by the authenticated user |
| `serviceType` | Yes | Must be a valid supported service type |
| `stationId` | Yes | Must reference an existing active service station |

### **Response**

{  
  "id": 1,  
  "vehicleId": 101,  
  "vehicleName": "Model Name \- Pearl White",  
  "customerId": 501,  
  "customerName": "John Doe",  
  "mechanicId": null,  
  "mechanicName": null,  
  "stationId": 201,  
  "stationName": "ABC Motors Service Center",  
  "invoiceId": null,  
  "status": "REQUESTED",  
  "serviceType": "GENERAL\_SERVICE",  
  "startTime": null,  
  "endTime": null,  
  "createdAt": "2026-08-09T10:00:00Z",  
  "updatedAt": "2026-08-09T10:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service request |
| `vehicleId` | Unique identifier of the vehicle for which the request was raised |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the authenticated user who raised the request |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the assigned mechanic; initially `null` if not assigned |
| `mechanicName` | Name of the assigned mechanic; initially `null` if not assigned |
| `stationId` | Unique identifier of the selected service station |
| `stationName` | Name of the selected service station |
| `invoiceId` | Unique identifier of the generated invoice; initially `null` |
| `status` | Current status of the service request |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual start time; initially `null` if not scheduled |
| `endTime` | Scheduled or actual completion time; initially `null` |
| `createdAt` | Timestamp when the service request was created |
| `updatedAt` | Timestamp when the service request was last updated |

## **13.4 Raise / Book a Service Request (User)**

### **Requirements**

* Users can raise a service request for one of their vehicles.  
* The `vehicleId` is mandatory and must reference a vehicle owned by the authenticated user.  
* The `serviceType` is mandatory and must be a valid supported service type.  
* The `stationId` is mandatory and must reference an existing active service station.  
* The selected service station must be available to accept service requests.  
* The `customerId` must be derived from the authenticated user and must not be accepted from the request body.  
* A newly created service request must have an initial status such as `REQUESTED` or `PENDING`.  
* `mechanicId` and `mechanicName` must be `null` until a mechanic is assigned.  
* `invoiceId` must be `null` until an invoice is generated.  
* `startTime` and `endTime` must be `null` until the service is scheduled or started, unless scheduling is part of the booking process.  
* The system must generate the `id`, `createdAt`, and `updatedAt` values upon successful creation.

### **API**

**POST** `/api/service-requests`

### **Request Body**

{  
  "vehicleId": 101,  
  "serviceType": "GENERAL\_SERVICE",  
  "stationId": 201  
}

**Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `vehicleId` | Yes | Must reference an existing vehicle owned by the authenticated user |
| `serviceType` | Yes | Must be a valid supported service type |
| `stationId` | Yes | Must reference an existing active service station |

### **Response**

{  
  "id": 1,  
  "vehicleId": 101,  
  "vehicleName": "Model Name \- Pearl White",  
  "customerId": 501,  
  "customerName": "John Doe",  
  "mechanicId": null,  
  "mechanicName": null,  
  "stationId": 201,  
  "stationName": "ABC Motors Service Center",  
  "invoiceId": null,  
  "status": "REQUESTED",  
  "serviceType": "GENERAL\_SERVICE",  
  "startTime": null,  
  "endTime": null,  
  "createdAt": "2026-08-09T10:00:00Z",  
  "updatedAt": "2026-08-09T10:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service request |
| `vehicleId` | Unique identifier of the vehicle for which the request was raised |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the authenticated user who raised the request |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the assigned mechanic; `null` until assigned |
| `mechanicName` | Name of the assigned mechanic; `null` until assigned |
| `stationId` | Unique identifier of the selected service station |
| `stationName` | Name of the selected service station |
| `invoiceId` | Unique identifier of the invoice; `null` until generated |
| `status` | Initial status of the service request |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual service start time; `null` if not yet scheduled |
| `endTime` | Scheduled or actual service completion time; `null` if not yet completed |
| `createdAt` | Timestamp when the service request was created |
| `updatedAt` | Timestamp when the service request was last updated |

## **13.5 Cancel a Service Request / Cancel Vehicle Service Booking (User)**

### **Requirements**

* Users can cancel a service request raised by them for one of their vehicles.  
* The service request to be cancelled must be identified using the `id` path parameter.  
* The specified service request must belong to the authenticated user.  
* A service request can be cancelled only when its current status allows cancellation.  
* A service request that has already been completed or cancelled cannot be cancelled again.  
* If the service has already started, cancellation must not be allowed unless explicitly permitted by the business rules.  
* On successful cancellation, the service request status must be updated to `CANCELLED`.  
* The system must update the `updatedAt` timestamp when the request is cancelled.  
* Existing vehicle, customer, service station, mechanic, invoice, and service details must remain unchanged.  
* Cancelling a service request must not delete the service request record.

### **API**

**PUT** `/api/service-requests/me/{id}/cancel`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the service request to be cancelled |

### **Response**

{  
  "id": 1,  
  "vehicleId": 101,  
  "vehicleName": "Model Name \- Pearl White",  
  "customerId": 501,  
  "customerName": "John Doe",  
  "mechanicId": null,  
  "mechanicName": null,  
  "stationId": 201,  
  "stationName": "ABC Motors Service Center",  
  "invoiceId": null,  
  "status": "CANCELLED",  
  "serviceType": "GENERAL\_SERVICE",  
  "startTime": null,  
  "endTime": null,  
  "createdAt": "2026-08-09T10:00:00Z",  
  "updatedAt": "2026-08-09T10:30:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service request |
| `vehicleId` | Unique identifier of the vehicle associated with the request |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the customer who raised the request |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the assigned mechanic; may be `null` |
| `mechanicName` | Name of the assigned mechanic; may be `null` |
| `stationId` | Unique identifier of the service station |
| `stationName` | Name of the service station |
| `invoiceId` | Unique identifier of the associated invoice; may be `null` |
| `status` | Current status of the service request; `CANCELLED` after successful cancellation |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual service start time |
| `endTime` | Scheduled or actual service completion time |
| `createdAt` | Timestamp when the service request was created |
| `updatedAt` | Timestamp when the service request was last updated |

## **13.6 View My Assigned Jobs (Mechanic)**

### **Requirements**

* Mechanics can view all service requests assigned to them.  
* The API must return only service requests assigned to the authenticated mechanic.  
* Mechanics must not be able to view jobs assigned to other mechanics.  
* The response must include the associated vehicle, customer, service station, invoice, service status, service type, and service timing details.  
* The API must return an empty list if no service requests are currently assigned to the mechanic.  
* Only service requests that the authenticated mechanic is authorized to access must be returned.

### **API**

**GET** `/api/service-requests/assigned`

### **Response**

\[  
  {  
    "id": 1,  
    "vehicleId": 101,  
    "vehicleName": "Model Name \- Pearl White",  
    "customerId": 501,  
    "customerName": "John Doe",  
    "mechanicId": 701,  
    "mechanicName": "Mike Smith",  
    "stationId": 201,  
    "stationName": "ABC Motors Service Center",  
    "invoiceId": null,  
    "status": "ASSIGNED",  
    "serviceType": "GENERAL\_SERVICE",  
    "startTime": "2026-08-09T10:00:00Z",  
    "endTime": null,  
    "createdAt": "2026-08-08T09:00:00Z",  
    "updatedAt": "2026-08-09T09:30:00Z"  
  }  
\]

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service request |
| `vehicleId` | Unique identifier of the vehicle associated with the service request |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the customer who raised the request |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the mechanic assigned to the request |
| `mechanicName` | Name of the assigned mechanic |
| `stationId` | Unique identifier of the service station |
| `stationName` | Name of the service station |
| `invoiceId` | Unique identifier of the associated invoice; may be `null` if not yet generated |
| `status` | Current status of the service request |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual start time of the service; may be `null` |
| `endTime` | Scheduled or actual completion time of the service; may be `null` |
| `createdAt` | Timestamp when the service request was created |
| `updatedAt` | Timestamp when the service request was last updated |

### **Access Control**

* Only authenticated Mechanics can access their assigned jobs through this endpoint.  
* The mechanic identity must be derived from the authenticated user's session/token.  
* The API must not accept a `mechanicId` query or request parameter to determine whose jobs are returned.

## **13.7 View All Service Bookings for the Station (Station Manager)**

### **Requirements**

* Station Managers can view all service requests/bookings associated with their service station.  
* The API must return only service requests associated with the station managed by the authenticated Station Manager.  
* The Station Manager must not be able to view service bookings belonging to other service stations.  
* The response must include the associated vehicle, customer, assigned mechanic, invoice, service status, service type, and service timing details.  
* Service requests that have not yet been assigned to a mechanic must still be included in the response, with `mechanicId` and `mechanicName` as `null`.  
* The API must return an empty list if there are no service bookings for the station.  
* The station identity must be derived from the authenticated Station Manager's station assignment rather than being supplied by the client.

### **API**

**GET** `/api/service-stations/me/service-requests`

### **Response**

\[  
  {  
    "id": 1,  
    "vehicleId": 101,  
    "vehicleName": "Model Name \- Pearl White",  
    "customerId": 501,  
    "customerName": "John Doe",  
    "mechanicId": 701,  
    "mechanicName": "Mike Smith",  
    "stationId": 201,  
    "stationName": "ABC Motors Service Center",  
    "invoiceId": null,  
    "status": "ASSIGNED",  
    "serviceType": "GENERAL\_SERVICE",  
    "startTime": "2026-08-09T10:00:00Z",  
    "endTime": null,  
    "createdAt": "2026-08-08T09:00:00Z",  
    "updatedAt": "2026-08-09T09:30:00Z"  
  }  
\]

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service request |
| `vehicleId` | Unique identifier of the vehicle associated with the request |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the customer who raised the request |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the assigned mechanic; may be `null` if not assigned |
| `mechanicName` | Name of the assigned mechanic; may be `null` if not assigned |
| `stationId` | Unique identifier of the service station |
| `stationName` | Name of the service station |
| `invoiceId` | Unique identifier of the associated invoice; may be `null` if not generated |
| `status` | Current status of the service request |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual start time of the service; may be `null` |
| `endTime` | Scheduled or actual completion time of the service; may be `null` |
| `createdAt` | Timestamp when the service request was created |
| `updatedAt` | Timestamp when the service request was last updated |

### **Access Control**

* Only authenticated Station Managers can access this endpoint.  
* The station associated with the authenticated Station Manager must be used to determine which service bookings are returned.  
* A Station Manager must not be able to retrieve bookings belonging to another station by modifying request parameters.

## **13.8 View All Service Bookings for a Station (Station Manager, Admin)**

### **Requirements**

* Station Managers and Admins can view service bookings associated with a service station.  
* The `stationId` request parameter is used to filter service bookings by service station.  
* Admins can view service bookings for any valid service station.  
* Station Managers can view only service bookings associated with the service station assigned to them.  
* A Station Manager must not be able to retrieve bookings for another station by modifying the `stationId` request parameter.  
* The response must include the associated vehicle, customer, assigned mechanic, invoice, service status, service type, and service timing details.  
* Service bookings that have not yet been assigned to a mechanic must still be included, with `mechanicId` and `mechanicName` as `null`.  
* The API must return an empty list when no service bookings exist for the specified station.  
* The `stationId` parameter is mandatory for this API.

### **API**

**GET** `/api/service-requests`

### **Request Parameters**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `stationId` | Yes | Unique identifier of the service station for which service bookings are to be retrieved |

### **Example Request**

`GET /api/service-requests?stationId=201`

### **Response**

\[  
  {  
    "id": 1,  
    "vehicleId": 101,  
    "vehicleName": "Model Name \- Pearl White",  
    "customerId": 501,  
    "customerName": "John Doe",  
    "mechanicId": 701,  
    "mechanicName": "Mike Smith",  
    "stationId": 201,  
    "stationName": "ABC Motors Service Center",  
    "invoiceId": null,  
    "status": "ASSIGNED",  
    "serviceType": "GENERAL\_SERVICE",  
    "startTime": "2026-08-09T10:00:00Z",  
    "endTime": null,  
    "createdAt": "2026-08-08T09:00:00Z",  
    "updatedAt": "2026-08-09T09:30:00Z"  
  }  
\]

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service request |
| `vehicleId` | Unique identifier of the vehicle associated with the request |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the customer who raised the request |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the assigned mechanic; may be `null` if not assigned |
| `mechanicName` | Name of the assigned mechanic; may be `null` if not assigned |
| `stationId` | Unique identifier of the service station |
| `stationName` | Name of the service station |
| `invoiceId` | Unique identifier of the associated invoice; may be `null` if not generated |
| `status` | Current status of the service request |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual start time of the service; may be `null` |
| `endTime` | Scheduled or actual completion time of the service; may be `null` |
| `createdAt` | Timestamp when the service request was created |
| `updatedAt` | Timestamp when the service request was last updated |

### **Access Control**

* **Admin:** Can retrieve service bookings for any valid `stationId`.  
* **Station Manager:** Can retrieve service bookings only for their assigned service station.  
* The API must validate the Station Manager's station assignment against the supplied `stationId`.  
* Unauthorized access to another station's bookings must return an appropriate authorization error.

## 

## 

## 

## **13.9 View a Service Booking Detail (Station Manager, Admin, Mechanic)**

### **Requirements**

* Admins, Station Managers, and Mechanics can view the details of a specific service booking.  
* The service booking must be identified using the `id` path parameter.  
* The specified service booking must exist.  
* Admins can view any service booking.  
* Station Managers can view service bookings associated with their assigned service station.  
* Mechanics can view service bookings assigned to them.  
* A Mechanic must not be able to view service bookings assigned to another mechanic unless explicitly authorized by the business rules.  
* A Station Manager must not be able to view service bookings belonging to another service station.  
* The response must include the associated vehicle, customer, mechanic, service station, invoice, service status, service type, and service timing details.  
* Mechanic and invoice details may be `null` if they have not yet been assigned or generated.

### **API**

**GET** `/api/service-requests/{id}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `id` | Yes | Unique identifier of the service booking to be retrieved |

### **Response**

{  
  "id": 1,  
  "vehicleId": 101,  
  "vehicleName": "Model Name \- Pearl White",  
  "customerId": 501,  
  "customerName": "John Doe",  
  "mechanicId": 701,  
  "mechanicName": "Mike Smith",  
  "stationId": 201,  
  "stationName": "ABC Motors Service Center",  
  "invoiceId": null,  
  "status": "ASSIGNED",  
  "serviceType": "GENERAL\_SERVICE",  
  "startTime": "2026-08-09T10:00:00Z",  
  "endTime": null,  
  "createdAt": "2026-08-08T09:00:00Z",  
  "updatedAt": "2026-08-09T09:30:00Z"  
}  
**Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service booking |
| `vehicleId` | Unique identifier of the vehicle associated with the booking |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the customer who raised the booking |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the assigned mechanic; may be `null` if not assigned |
| `mechanicName` | Name of the assigned mechanic; may be `null` if not assigned |
| `stationId` | Unique identifier of the service station |
| `stationName` | Name of the service station |
| `invoiceId` | Unique identifier of the associated invoice; may be `null` if not generated |
| `status` | Current status of the service booking |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual start time of the service; may be `null` |
| `endTime` | Scheduled or actual completion time of the service; may be `null` |
| `createdAt` | Timestamp when the service booking was created |
| `updatedAt` | Timestamp when the service booking was last updated |

### **Access Control**

* **Admin:** Can view any service booking.  
* **Station Manager:** Can view bookings associated with their assigned service station.  
* **Mechanic:** Can view bookings assigned to them.  
* The API must validate the authenticated user's role and relationship with the service booking before returning the booking details.

### **Error Handling**

* Return **404 Not Found** if the service booking does not exist.  
* Return an appropriate **4xx authorization response** if the authenticated user does not have permission to view the specified booking.

## **13.10 Assign a Mechanic to a Booking Request (Station Manager, Admin)**

### **Requirements**

* Station Managers and Admins can assign a mechanic to a service booking.  
* The service booking must be identified using the `id` path parameter.  
* The `mechanicId` is mandatory.  
* The specified mechanic must exist and be an active mechanic.  
* The mechanic must be associated with the same service station as the service booking.  
* A Station Manager can assign mechanics only to bookings belonging to their assigned service station.  
* Admins can assign mechanics to bookings for any service station.  
* The service booking must be in a status that allows mechanic assignment.  
* If a mechanic is already assigned, the assignment can be replaced only if the current booking status permits reassignment.  
* On successful assignment, the `mechanicId` and `mechanicName` must be updated.  
* The `updatedAt` timestamp must be updated after successful assignment.  
* The service request status should be updated to `ASSIGNED` if it is currently in a status that indicates no mechanic has been assigned.

### 

### **API**

**PUT** `/api/service-requests/{id}/assign-mechanic`

### **Path Parameter**

| Parameter | Required | Description |
| :---- | :---- | :---- |
| id | Yes | Unique identifier of the service booking to which the mechanic is being assigned |

### **Request Body**

{

  "mechanicId": 701

}

### **Request Fields**

| Field | Required | Validation |
| :---- | :---- | :---- |
| mechanicId | Yes | Must reference an existing active mechanic associated with the service station |

### **Response**

{  
  "id": 1,  
  "vehicleId": 101,  
  "vehicleName": "Model Name \- Pearl White",  
  "customerId": 501,  
  "customerName": "John Doe",  
  "mechanicId": 701,  
  "mechanicName": "Mike Smith",  
  "stationId": 201,  
  "stationName": "ABC Motors Service Center",  
  "invoiceId": null,  
  "status": "ASSIGNED",  
  "serviceType": "GENERAL\_SERVICE",  
  "startTime": null,  
  "endTime": null,  
  "createdAt": "2026-08-08T09:00:00Z",  
  "updatedAt": "2026-08-09T09:30:00Z"  
}

**Response Fields**

| Field | Description |
| :---- | :---- |
| id | Unique identifier of the service booking |
| vehicleId | Unique identifier of the vehicle associated with the booking |
| vehicleName | Name or display name of the vehicle |
| customerId | Unique identifier of the customer who raised the booking |
| customerName | Name of the customer |
| mechanicId | Unique identifier of the assigned mechanic |
| mechanicName | Name of the assigned mechanic |
| stationId | Unique identifier of the service station |
| stationName | Name of the service station |
| invoiceId | Unique identifier of the associated invoice; may be null if not generated |
| status | Current status of the service booking |
| serviceType | Type of service requested |
| startTime | Scheduled or actual start time of the service; may be null |
| endTime | Scheduled or actual completion time of the service; may be null |
| createdAt | Timestamp when the service booking was created |
| updatedAt | Timestamp when the service booking was last updated |

### **Access Control**

* **Admin:** Can assign a mechanic to any eligible service booking.  
* **Station Manager:** Can assign a mechanic only to service bookings belonging to their assigned service station.  
* The API must validate that the selected mechanic is eligible to work at the service station associated with the booking.

### **Error Handling**

* Return **400 Bad Request** if `mechanicId` is missing or invalid.  
* Return **404 Not Found** if the service booking does not exist.  
* Return **404 Not Found** if the specified mechanic does not exist.  
* Return an appropriate **4xx** response if the mechanic is inactive or not associated with the service station.  
* Return an appropriate **4xx** response if the booking status does not allow mechanic assignment.  
* Return an appropriate authorization error if a Station Manager attempts to assign a mechanic to a booking belonging to another station.

## **13.11 Update the Status of a Booking Request (Station Manager, Admin, Mechanic)**

### **Requirements**

* Station Managers, Admins, and Mechanics can update the status of a service booking.  
* The service booking must be identified using the `id` path parameter.  
* The `status` field is mandatory and must contain a valid service booking status.  
* The requested status transition must be valid according to the service booking workflow.  
* The authenticated user's role and relationship with the booking must be validated before allowing the status update.  
* Admins can update the status of any service booking.  
* Station Managers can update the status of bookings belonging to their assigned service station.  
* Mechanics can update the status of bookings assigned to them.  
* A service booking must not be moved directly to an invalid or incompatible status.  
* The `updatedAt` timestamp must be updated after a successful status change.  
* `startTime` should be recorded when the booking moves to the service-started status, if applicable.  
* `endTime` should be recorded when the booking moves to the completed status, if applicable.  
* A completed or cancelled booking must not be moved back to an earlier status unless explicitly permitted by the business rules.

### **API**

**PUT** `/api/service-requests/{id}/status`

### 

### **Path Parameter**

| Parameter | Required | Description |
| :---- | :---- | :---- |
| id | Yes | Unique identifier of the service booking whose status is being updated |

### **Request Body**

{  
  "status": "IN\_PROGRESS"  
}

### **Request Fields**

| Field | Required | Validation |
| :---- | :---- | :---- |
| status | Yes | Must be a valid status and must follow the allowed booking status transition rules |

### **Suggested Booking Statuses**

The exact statuses can be finalized based on the business workflow. A typical lifecycle would be:

`REQUESTED → ASSIGNED → IN_PROGRESS → COMPLETED`

with `CANCELLED` available from the statuses where cancellation is permitted.

### **Response**

{  
  "id": 1,  
  "vehicleId": 101,  
  "vehicleName": "Model Name \- Pearl White",  
  "customerId": 501,  
  "customerName": "John Doe",  
  "mechanicId": 701,  
  "mechanicName": "Mike Smith",  
  "stationId": 201,  
  "stationName": "ABC Motors Service Center",  
  "invoiceId": null,  
  "status": "IN\_PROGRESS",  
  "serviceType": "GENERAL\_SERVICE",  
  "startTime": "2026-08-09T10:00:00Z",  
  "endTime": null,  
  "createdAt": "2026-08-08T09:00:00Z",  
  "updatedAt": "2026-08-09T10:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service booking |
| `vehicleId` | Unique identifier of the vehicle associated with the booking |
| `vehicleName` | Name or display name of the vehicle |
| `customerId` | Unique identifier of the customer who raised the booking |
| `customerName` | Name of the customer |
| `mechanicId` | Unique identifier of the assigned mechanic; may be `null` |
| `mechanicName` | Name of the assigned mechanic; may be `null` |
| `stationId` | Unique identifier of the service station |
| `stationName` | Name of the service station |
| `invoiceId` | Unique identifier of the associated invoice; may be `null` |
| `status` | Updated status of the service booking |
| `serviceType` | Type of service requested |
| `startTime` | Scheduled or actual service start time |
| `endTime` | Scheduled or actual service completion time |
| `createdAt` | Timestamp when the service booking was created |
| `updatedAt` | Timestamp when the service booking was last updated |

### 

### 

### 

### **Access Control**

* **Admin:** Can update the status of any service booking.  
* **Station Manager:** Can update the status of bookings belonging to their assigned service station.  
* **Mechanic:** Can update the status of bookings assigned to them.  
* The API must validate the authenticated user's role and relationship with the booking before performing the update.

### **Error Handling**

* Return **400 Bad Request** if `status` is missing or invalid.  
* Return **404 Not Found** if the service booking does not exist.  
* Return an appropriate authorization error if the user does not have permission to update the booking.  
* Return **400 Bad Request** if the requested status transition is not permitted.

# **14.Service Spare Parts Management**

Service spare parts represent the spare parts used or required as part of a specific vehicle service request. Each service request can contain one or more spare parts with their applicable quantity and pricing details.

## **14.1 View Spare Parts (User, Admin)**

### **Requirements**

* Users and Admins can view all spare parts associated with a service request.  
* The service request must be identified using the `serviceRequestId` path parameter.  
* The API must return only spare parts associated with the specified service request.  
* The response must include the spare part, unit price, quantity, and subtotal for each service spare-part entry.  
* The `subtotal` must represent the calculated cost of the spare part based on its unit price and quantity.  
* Users can view spare parts only for their own service requests.  
* Admins can view spare parts associated with any service request.  
* The API must return an empty list when no spare parts have been added to the service request.

### **API**

**GET** `/api/service-requests/{serviceRequestId}/parts`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `serviceRequestId` | Yes | Unique identifier of the service request whose spare parts are being retrieved |

### **Response**

\[  
  {  
    "id": 1,  
    "sparePartId": 501,  
    "sparePartName": "Front Brake Pad",  
    "unitPrice": 2500.00,  
    "quantity": 2,  
    "subtotal": 5000.00  
  }  
\]

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service spare-part record |
| `sparePartId` | Unique identifier of the associated spare part |
| `sparePartName` | Name of the associated spare part |
| `unitPrice` | Unit price of the spare part at the time it was added to the service request |
| `quantity` | Quantity of the spare part used or required for the service |
| `subtotal` | Total cost for the spare part, calculated as `unitPrice × quantity` |

### **Access Control**

* **User:** Can view spare parts only for service requests raised by the authenticated user.  
* **Admin:** Can view spare parts for any service request.  
* The API must validate the authenticated user's access to the specified service request before returning its spare parts.

### **Error Handling**

* Return **404 Not Found** if the service request does not exist.  
* Return an appropriate authorization error if the user attempts to access spare parts belonging to another user's service request.

## **14.2 Add a Part to a Service Request (Mechanic, Station Manager)**

### **Requirements**

* Mechanics and Station Managers, and Admins can add a spare part to a service request.  
* The service request must be identified using the `serviceRequestId` path parameter.  
* The `sparePartId` is mandatory and must reference an existing active spare part.  
* The `quantity` is mandatory and must be greater than `0`.  
* The service request must exist and be in a status that allows spare parts to be added.  
* A Mechanic can add spare parts only to service requests assigned to them.  
* A Station Manager can add spare parts only to service requests belonging to their assigned service station.  
* Admins can add spare parts to service requests for any service station.  
* The `unitPrice` must be obtained from the current spare-part price at the time the part is added.  
* The `subtotal` must be calculated as `unitPrice × quantity`.  
* The system must generate the `id` for the service spare-part record.  
* The service request's `updatedAt` timestamp must be updated after a spare part is successfully added.

### **API**

**POST** `/api/service-requests/{serviceRequestId}/parts`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `serviceRequestId` | Yes | Unique identifier of the service request to which the spare part is being added |

### **Request Body**

{  
  "sparePartId": 501,  
  "quantity": 2  
}

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `sparePartId` | Yes | Must reference an existing active spare part |
| `quantity` | Yes | Must be greater than `0` |

### **Response**

{  
  "id": 1,  
  "sparePartId": 501,  
  "sparePartName": "Front Brake Pad",  
  "unitPrice": 2500.00,  
  "quantity": 2,  
  "subtotal": 5000.00  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service spare-part record |
| `sparePartId` | Unique identifier of the associated spare part |
| `sparePartName` | Name of the associated spare part |
| `unitPrice` | Spare-part price captured when the part was added to the service request |
| `quantity` | Quantity of the spare part added |
| `subtotal` | Total cost calculated as `unitPrice × quantity` |

### **Access Control**

* **Mechanic:** Can add spare parts only to service requests assigned to them.  
* **Station Manager:** Can add spare parts only to service requests belonging to their assigned service station.  
* **Admin:** Can add spare parts to any service request.

### **Error Handling**

* Return **400 Bad Request** if `sparePartId` or `quantity` is missing or invalid.  
* Return **400 Bad Request** if `quantity` is less than or equal to `0`.  
* Return **404 Not Found** if the service request does not exist.  
* Return **404 Not Found** if the specified spare part does not exist or is inactive.  
* Return an appropriate authorization error if the authenticated user does not have permission to modify the service request.  
* Return an appropriate **4xx** response if the service request status does not allow spare parts to be added.

## **14.3 Remove a Part from a Service Request (Mechanic, Station Manager, Admin)**

### **Requirements**

* Mechanics, Station Managers, and Admins can remove a spare-part entry from a service request.  
* The service request must be identified using the `serviceRequestId` path parameter.  
* The spare-part entry to be removed must be identified using the `partEntryId` path parameter.  
* The specified service request and spare-part entry must exist.  
* The spare-part entry must belong to the specified service request.  
* A Mechanic can remove spare parts only from service requests assigned to them.  
* A Station Manager can remove spare parts only from service requests belonging to their assigned service station.  
* Admins can remove spare parts from service requests for any service station.  
* A spare-part entry can be removed only when the service request is in a status that allows modification of its spare parts.  
* Removing the spare-part entry must not delete the master spare-part record.  
* The service request's `updatedAt` timestamp must be updated after successful removal.

### **API**

**DELETE** `/api/service-requests/{serviceRequestId}/parts/{partEntryId}`

### **Path Parameters**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `serviceRequestId` | Yes | Unique identifier of the service request |
| `partEntryId` | Yes | Unique identifier of the spare-part entry associated with the service request |

### **Response**

* **HTTP 204 No Content** on successful removal.  
* The response body must be empty.

### **Access Control**

* **Mechanic:** Can remove spare parts only from service requests assigned to them.  
* **Station Manager:** Can remove spare parts only from service requests belonging to their assigned service station.  
* **Admin:** Can remove spare parts from any service request.

### **Error Handling**

* Return **404 Not Found** if the service request does not exist.  
* Return **404 Not Found** if the specified spare-part entry does not exist.  
* Return **404 Not Found** if the spare-part entry does not belong to the specified service request.  
* Return an appropriate authorization error if the authenticated user does not have permission to modify the service request.  
* Return an appropriate **4xx** response if the service request status does not allow spare parts to be removed.

# **15\. Service Charge Management**

Service charges represent the standard charges applicable to different types of vehicle services.

## **15.1 View Service Charges**

### **Requirements**

* Users, Station Managers, Mechanics, and Admins can view the available service charges.  
* The API must return the service charge associated with each supported service type.  
* Each service charge must include its service type, applicable amount, and last updated timestamp.  
* Only active/non-deleted service charges must be returned.  
* The API must return an empty list when no service charges are available.  
* Users can use the service charge information to understand the applicable service cost before or during vehicle servicing.

### **API**

**GET** `/api/service-charge`

### **Response**

\[  
  {  
    "id": 1,  
    "serviceType": "GENERAL\_SERVICE",  
    "amount": 1500.00,  
    "updatedAt": "2026-08-09T10:00:00Z"  
  }  
\]  
**Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service charge |
| `serviceType` | Type of vehicle service to which the charge applies |
| `amount` | Applicable charge for the service type |
| `updatedAt` | Timestamp when the service charge was last updated |

## **15.2 Update Service Charge (Admin)**

### **Requirements**

* Admins can update the service charge for a specific service type.  
* The `serviceType` must be provided as a path parameter and must reference an existing service type.  
* The `amount` is mandatory and must be greater than or equal to `0`.  
* Users, Station Managers, and Mechanics can view service charges but cannot update them.  
* The service charge must be updated for the specified service type.  
* The `updatedAt` timestamp must be updated after a successful modification.  
* The service charge record's `id` and `serviceType` must remain unchanged during the update.

### **API**

**PUT** `/api/service-charge/{serviceType}`

### **Path Parameter**

| Parameter | Required | Description |
| ----- | ----- | ----- |
| `serviceType` | Yes | Service type for which the service charge is being updated |

### **Request Body**

{  
  "amount": 2000.00  
}

### **Request Fields**

| Field | Required | Validation |
| ----- | ----- | ----- |
| `amount` | Yes | Must be greater than or equal to `0` |

### **Response**

{  
  "id": 1,  
  "serviceType": "GENERAL\_SERVICE",  
  "amount": 2000.00,  
  "updatedAt": "2026-08-09T11:00:00Z"  
}

### **Response Fields**

| Field | Description |
| ----- | ----- |
| `id` | Unique identifier of the service charge |
| `serviceType` | Service type associated with the charge |
| `amount` | Updated service charge amount |
| `updatedAt` | Timestamp when the service charge was last updated |

### **Access Control**

* **Admin:** Can update service charges.  
* **User, Station Manager, Mechanic:** Read-only access to service charges.

### **Error Handling**

* Return **400 Bad Request** if `amount` is missing or negative.  
* Return **404 Not Found** if the specified `serviceType` does not have an existing service charge.  
* Return an appropriate authorization error if a non-Admin user attempts to update a service charge.

# Payment v1.0

# **16\. Payment Management** 

Service stations represent physical service locations.

## 16.1 View My Payment

### Requirements

* Users and admins can view all spare parts.

### API

 GET /api/payment/me/{id}

### Response 

{  
id,  
invoiceId,  
invoiceNumber,  
Amount,  
currencyCode,  
paymentMode,  
transactionRef,  
Status,  
paidAt,  
createdAt  
}

## 16.2 View My Payment By Invoice Id

### Requirements

* Users and admins can view all spare parts.

### API

 GET /api/payment/invoice/{invoiceId}

### Response 

{  
id,  
invoiceId,  
invoiceNumber,  
Amount,  
currencyCode,  
paymentMode,  
transactionRef,  
Status,  
paidAt,  
createdAt  
}

## 16.3 Make Payment For The Invoice Generated

### Requirements

* Users and admins can view all spare parts.

### API

 POST /api/payment

### Response 

{  
id,  
invoiceId,  
invoiceNumber,  
Amount,  
currencyCode,  
paymentMode,  
transactionRef,  
Status,  
paidAt,  
createdAt  
}

# **17\. Invoice Management** 

Service stations represent physical service locations.

## 17.1 View My Invoice For The Service

### Requirements

* Users and admins can view all spare parts.

### API

 GET /api/invoice/me/{id}

### Response 

{  
id,  
invoiceNumber,  
totalAmount,  
issuedAt,  
createdAt,  
serviceRequestId,  
serviceType,  
serviceCharge,  
partsTotal,  
\[{  
	id,  
	sparePartId,  
	sparePartName,  
	unitPrice,  
	quantity,  
	subTotal  
}\]  
}

## 17.2 View An Invoice By Id

### Requirements

* Users and admins can view all spare parts.

### API

 GET /api/invoice/{id}

### Response 

{  
id,  
invoiceNumber,  
totalAmount,  
issuedAt,  
createdAt,  
serviceRequestId,  
serviceType,  
serviceCharge,  
partsTotal,  
\[{  
	id,  
	sparePartId,  
	sparePartName,  
	unitPrice,  
	quantity,  
	subTotal  
}\]  
}

## 17.3 View An Invoice By Service Request Id

### Requirements

* Users and admins can view all spare parts.

### API

 GET /api/invoice/service-request/{serviceRequestId}

### Response 

{  
id,  
invoiceNumber,  
totalAmount,  
issuedAt,  
createdAt,  
serviceRequestId,  
serviceType,  
serviceCharge,  
partsTotal,  
\[{  
	id,  
	sparePartId,  
	sparePartName,  
	unitPrice,  
	quantity,  
	subTotal  
}\]  
}

# Feature

# **1\. Feature Flow by User Type**

## **1.1 Customer / User Flow**

The Customer manages their vehicles, browses the vehicle catalog, books services, tracks service requests, and reviews service-related information.

### **Vehicle Management Flow**

**View Vehicle Models**  
 → User views available vehicle models  
 → Selects a vehicle model

**View Vehicle Variants**  
 → User views variants available for the selected model  
 → Selects a variant

**Add Vehicle to Garage**  
 → Enter vehicle name  
 → Select model  
 → Select variant  
 → Enter purchase date  
 → Add vehicle to garage

**View My Vehicles**  
 → User views all vehicles in their garage  
 → Selects a vehicle

**View Vehicle Details**  
 → User views vehicle/model/variant information

**Update Vehicle**  
 → Modify vehicle details  
 → Save changes

**Delete Vehicle**  
 → Select vehicle  
 → Delete from garage  
 → Vehicle is removed from the user's garage

### **Service Booking Flow**

**View Service Charges**  
 → User views available service types and charges

**Create / Book Service**  
 → Select vehicle  
 → Select service type  
 → Select service station  
 → Submit service booking  
 → Booking is created with REQUESTED status

**View My Service Requests**  
 → User views all service requests raised by them  
 → Select a service request

**View Service Request Details**  
 → View vehicle  
 → Service type  
 → Service station  
 → Assigned mechanic  
 → Booking status  
 → Service timing  
 → Invoice information  
 → Spare parts associated with the service

**Cancel Service Booking**  
 → Select eligible booking  
 → Cancel booking  
 → Booking status changes to CANCELLED

# **1.2 Admin Flow**

The Admin manages the complete catalog, service stations, service inventory, service requests, service charges, and operational activities.

## **Vehicle Catalog Management**

### **Vehicle Model Management**

**Create Vehicle Model**  
 → Enter model name  
 → Enter release date  
 → Create model

**View Vehicle Models**  
 → View all vehicle models

**Update Vehicle Model**  
 → Select model  
 → Modify model details  
 → Save changes

**Delete Vehicle Model**  
 → Select model  
 → Validate dependencies  
 → Delete model if eligible

### **Vehicle Variant Management**

**Create Variant**  
 → Select vehicle model  
 → Enter color  
 → Add image  
 → Set price  
 → Create variant

**View Variants**  
 → View available variants

**Update Variant**  
 → Select variant  
 → Modify color/image/price  
 → Save changes

**Delete Variant**  
 → Select variant  
 → Delete variant if eligible

---

## **Service Station Management**

**View Service Stations**  
 → View all service stations  
 → View station details

**Create Station**  
 → Enter station name  
 → Select location  
 → Assign manager  
 → Enter contact information  
 → Set capacity  
 → Create station

**Update Station**  
 → Select station  
 → Modify station details  
 → Save changes

**Delete Station**  
 → Select station  
 → Validate dependencies  
 → Delete station if eligible

---

## **Station Inventory Management**

**View Station Inventory**  
 → Select service station  
 → View available spare parts and quantities

**Update Station Inventory**  
 → Select spare part  
 → Update quantity  
 → Save inventory

---

## **Spare Part Management**

**View Spare Parts**  
 → View complete spare-part catalog

**View Spare Part Details**  
 → Select spare part  
 → View model, price, image, etc.

**Create Spare Part**  
 → Enter spare-part details  
 → Associate with vehicle model  
 → Set price  
 → Add image  
 → Create spare part

**Update Spare Part**  
 → Select spare part  
 → Modify details  
 → Save changes

**Delete Spare Part**  
 → Select spare part  
 → Delete if eligible

---

## **Service Request Management**

**View All Service Bookings**  
 → Select service station  
 → View station bookings

**View Booking Details**  
 → Select booking  
 → View complete booking information

**Assign Mechanic**  
 → Select booking  
 → Select eligible mechanic  
 → Assign mechanic  
 → Booking becomes `ASSIGNED`

**Update Booking Status**  
 → Select booking  
 → Update status according to workflow

---

## **Service Spare Parts**

**View Parts Used in Service**  
 → Select service booking  
 → View associated spare parts

**Add Part**  
 → Select spare part  
 → Enter quantity  
 → Add to service request

**Remove Part**  
 → Select service-part entry  
 → Remove from service request

---

## **Service Charge Management**

**View Service Charges**  
 → View service types and charges

**Update Service Charge**  
 → Select service type  
 → Enter new amount  
 → Save charge

# **16.4 Mechanic Flow**

The Mechanic primarily handles service jobs assigned to them and manages the spare parts and status of those jobs.

## **Assigned Jobs**

**View Assigned Jobs**

→ Retrieve bookings assigned to the authenticated mechanic

GET /api/service-requests/assigned

→ View vehicle  
 → View customer  
 → View service type  
 → View service station  
 → View current status

**View Booking Details**

→ Select assigned booking  
 → View complete service information

---

## **Service Execution Flow**

**Start Service**

→ Update booking status  
 → `IN_PROGRESS`

**Add Spare Part**

→ Select required spare part  
 → Enter quantity  
 → Add to service request

**View Spare Parts**

→ Review spare parts already added to the booking

**Remove Spare Part**

→ Remove incorrectly added/unrequired part

**Complete Service**

→ Update booking status  
 → `COMPLETED`  
 → Record service completion time

1. Customer Flow Summary 

Vehicle Models  
      ↓  
Vehicle Variants  
      ↓  
Add Vehicle to Garage  
      ↓  
My Vehicles  
      ↓  
Select Vehicle  
      ↓  
View Service Charges  
      ↓  
Select Service Type  
      ↓  
Select Service Station  
      ↓  
Book Service  
      ↓  
REQUESTED  
      ↓  
View Booking Status  
      ↓  
Mechanic Assigned  
      ↓  
Service In Progress  
      ↓  
Service Completed

Admin Flow Summary   
                    ADMIN  
                      │  
       ┌──────────────┼───────────────┐  
       ↓              ↓               ↓  
Vehicle Catalog   Service Stations   Service Charges  
       │              │  
   ┌───┴───┐          ↓  
   ↓       ↓      Station Inventory  
 Models  Variants      │  
                       ↓  
                 Spare Parts  
                       │  
                       ↓  
               Service Bookings  
                       │  
              ┌────────┴────────┐  
              ↓                 ↓  
        Assign Mechanic    Update Status  
              │  
              ↓  
       Service Spare Parts

                 MECHANIC  
                    │  
                    ↓  
            View Assigned Jobs  
                    │  
                    ↓  
            Select Service Job  
                    │  
                    ↓  
           View Booking Details  
                    │  
                    ↓  
              Start Service  
                    │  
                    ↓  
              IN\_PROGRESS  
                    │  
             ┌──────┴──────┐  
             ↓             ↓  
        Add Spare Part  Remove Part  
             │             │  
             └──────┬──────┘  
                    ↓  
             Complete Service  
                    │  
                    ↓  
                COMPLETED

CUSTOMER  
   │  
   ├── Select Vehicle  
   │  
   ├── Select Service Type  
   │  
   ├── Select Service Station  
   │  
   └── Book Service  
            │  
            ↓  
        REQUESTED  
            │  
            │  
            ↓  
   STATION MANAGER / ADMIN  
            │  
            ├── View Booking  
            │  
            └── Assign Mechanic  
                    │  
                    ↓  
                ASSIGNED  
                    │  
                    ↓  
                MECHANIC  
                    │  
                    ├── View Assigned Job  
                    │  
                    ├── Start Service  
                    │  
                    ↓  
                IN\_PROGRESS  
                    │  
                    ├── Add Spare Parts  
                    ├── Remove Spare Parts  
                    │  
                    ↓  
             Complete Service  
                    │  
                    ↓  
                COMPLETED  
