# API Endpoints Documentation

## Site: Soundboard SoundButtons.com

**Domain:** soundboard.soundbuttons.com

**Base URL:** https://soundboard.soundbuttons.com

**Description:** https://soundboard.soundbuttons.com/

---

## Sounds

List all sounds (GET) or upload/create a new sound (POST). POST requires authentication.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds

### POST http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds

**Authentication:**
- **GET:** Not required (public)
- **POST:** Required (Token authentication)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `category` | Filter by category ID (integer). Example: ?category=5 |
| `tag` | Filter by tag (string). Example: ?tag=funny |
| `search` | Search in name or tags (string). Example: ?search=music |
| `page` | Page number for pagination (integer). Example: ?page=2 |
| `page_size` | Items per page (integer, max 100). Example: ?page_size=20 |

**Request Payload:**

**POST Request:**

**Fields:**
```json
{
  "name": "Sound name (required, string)",
  "sound_file": "Audio file (optional, file)",
  "sound_file_url": "URL to existing audio file (optional, string)",
  "tag": "Comma-separated tags (optional, string). Example: \"funny, music, test\"",
  "category": "Category ID (optional, integer)"
}
```

**Example:**
```json
{
  "name": "My Sound",
  "sound_file": "[file upload]",
  "tag": "funny, music",
  "category": 5
}
```

**Response Examples:**

**GET Response:**
```json
{
  "status": 200,
  "data": {
    "count": 100,
    "next": "http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "name": "Sound Name",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3",
        "tag": "funny, music",
        "tags": [
          "funny",
          "music"
        ],
        "category": 5,
        "category_id": 5,
        "category_name": "Music",
        "views": 150,
        "is_liked": false,
        "is_favorited": false,
        "likes_count": 10,
        "favorites_count": 5,
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

**POST Response:**
```json
{
  "status": 201,
  "data": {
    "id": 101,
    "name": "My Sound",
    "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/20250115_103000_My_Sound.mp3",
    "tag": "funny, music",
    "tags": [
      "funny",
      "music"
    ],
    "category": 5,
    "category_id": 5,
    "category_name": "Music",
    "views": 0,
    "is_liked": false,
    "is_favorited": false,
    "likes_count": 0,
    "favorites_count": 0,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

## Sounds By Category

Get sounds filtered by category. Replace {category_id} with actual category ID.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds?category={category_id}

**Authentication:**
Not required (public endpoint)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `category` | Category ID (required, integer). Example: ?category=5 |
| `page` | Page number (optional, integer) |
| `page_size` | Items per page (optional, integer, max 100) |

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "count": 25,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "name": "Sound in Category",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3",
        "category_id": 5,
        "category_name": "Music",
        "views": 50,
        "is_liked": false,
        "is_favorited": false,
        "likes_count": 3,
        "favorites_count": 1
      }
    ]
  }
}
```

---

## Sound Search

Search sounds by name for this specific site. Returns sounds whose names contain the search term (case-insensitive).

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/search

**Authentication:**
Not required (public endpoint)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `name` | Sound name to search for (required, string). Example: ?name=music |
| `page` | Page number for pagination (optional, integer). Example: ?page=2 |
| `page_size` | Items per page (optional, integer, max 100). Example: ?page_size=20 |

**Request Payload:**

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "name": "Music Sound",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3",
        "tag": "funny, music",
        "tags": [
          "funny",
          "music"
        ],
        "category": 5,
        "category_id": 5,
        "category_name": "Music",
        "views": 150,
        "is_liked": false,
        "is_favorited": false,
        "likes_count": 10,
        "favorites_count": 5,
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-15T10:30:00Z"
      },
      {
        "id": 2,
        "name": "Music Beat",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file2.mp3",
        "tag": "music, beat",
        "tags": [
          "music",
          "beat"
        ],
        "category": 5,
        "category_id": 5,
        "category_name": "Music",
        "views": 75,
        "is_liked": false,
        "is_favorited": false,
        "likes_count": 5,
        "favorites_count": 2,
        "created_at": "2025-01-14T08:20:00Z",
        "updated_at": "2025-01-14T08:20:00Z"
      }
    ]
  }
}
```

---

## User Favorite Sounds

Get all favorite sounds for the logged-in user.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/user/favorites

**Authentication:**
Required (Token authentication)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `page` | Page number (optional, integer) |
| `page_size` | Items per page (optional, integer, max 100) |

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "count": 10,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 5,
        "name": "Favorite Sound",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3",
        "is_liked": true,
        "is_favorited": true,
        "likes_count": 20,
        "favorites_count": 15
      }
    ]
  }
}
```

---

## User Liked Sounds

Get all liked sounds for the logged-in user.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/user/likes

**Authentication:**
Required (Token authentication)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `page` | Page number (optional, integer) |
| `page_size` | Items per page (optional, integer, max 100) |

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "count": 15,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 7,
        "name": "Liked Sound",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3",
        "is_liked": true,
        "is_favorited": false,
        "likes_count": 25,
        "favorites_count": 10
      }
    ]
  }
}
```

---

## User Uploaded Sounds

Get all sounds uploaded by a specific user for this site. If authenticated and no user_id is provided, returns the logged-in user's sounds.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/user/uploaded

**Authentication:**
Optional (if user_id is provided, authentication not required; if not provided, authentication required)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `user_id` | User ID to get sounds for (optional, integer). If not provided and user is authenticated, returns logged-in user's sounds. Example: ?user_id=5 |
| `page` | Page number for pagination (optional, integer). Example: ?page=2 |
| `page_size` | Items per page (optional, integer, max 100). Example: ?page_size=20 |

**Request Payload:**

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "count": 8,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 10,
        "name": "My Uploaded Sound",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3",
        "tag": "funny, music",
        "tags": [
          "funny",
          "music"
        ],
        "category": 5,
        "category_id": 5,
        "category_name": "Music",
        "views": 150,
        "is_liked": false,
        "is_favorited": false,
        "likes_count": 10,
        "favorites_count": 5,
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-15T10:30:00Z"
      },
      {
        "id": 11,
        "name": "Another Sound",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file2.mp3",
        "tag": "test",
        "tags": [
          "test"
        ],
        "category": null,
        "category_id": null,
        "category_name": null,
        "views": 25,
        "is_liked": false,
        "is_favorited": false,
        "likes_count": 2,
        "favorites_count": 1,
        "created_at": "2025-01-14T08:20:00Z",
        "updated_at": "2025-01-14T08:20:00Z"
      }
    ]
  }
}
```

---

## Sound Detail

Get detailed information about a specific sound.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/{id}

**Authentication:**
Not required (public endpoint)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Sound ID (integer) |

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Sound Name",
    "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3",
    "tag": "funny, music",
    "tags": [
      "funny",
      "music"
    ],
    "category": 5,
    "category_id": 5,
    "category_name": "Music",
    "views": 150,
    "is_liked": false,
    "is_favorited": false,
    "likes_count": 10,
    "favorites_count": 5,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

## Related Sounds

Get related sounds for a specific sound. Returns sounds from the same category and/or with similar tags, ordered by relevance.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/{id}/related

**Authentication:**
Not required (public endpoint)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Sound ID (integer) |

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `limit` | Maximum number of related sounds to return (optional, integer, default: 10, max: 50). Example: ?limit=20 |
| `page` | Page number for pagination (optional, integer). Example: ?page=2 |
| `page_size` | Items per page (optional, integer, max 100). Example: ?page_size=20 |

**Request Payload:**

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "count": 8,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 2,
        "name": "Related Sound 1",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file2.mp3",
        "tag": "funny, music, beat",
        "tags": [
          "funny",
          "music",
          "beat"
        ],
        "category": 5,
        "category_id": 5,
        "category_name": "Music",
        "views": 120,
        "is_liked": false,
        "is_favorited": false,
        "likes_count": 8,
        "favorites_count": 4,
        "created_at": "2025-01-14T10:30:00Z",
        "updated_at": "2025-01-14T10:30:00Z"
      },
      {
        "id": 3,
        "name": "Related Sound 2",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file3.mp3",
        "tag": "funny, comedy",
        "tags": [
          "funny",
          "comedy"
        ],
        "category": 5,
        "category_id": 5,
        "category_name": "Music",
        "views": 95,
        "is_liked": false,
        "is_favorited": false,
        "likes_count": 6,
        "favorites_count": 3,
        "created_at": "2025-01-13T10:30:00Z",
        "updated_at": "2025-01-13T10:30:00Z"
      }
    ]
  }
}
```

---

## Sound Audio

Stream or download audio file. Returns binary audio data. Can be used for inline playback (in <audio> tag) or download. No authentication required.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/{id}/audio

**Authentication:**
Not required (public endpoint)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Sound ID (integer) |

**Response Examples:**

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "audio/mpeg",
    "Content-Disposition": "inline; filename=\"Sound Name.mp3\"",
    "Access-Control-Allow-Origin": "*"
  },
  "body": "[Binary audio data stream]"
}
```

---

## Sound Download

Download sound audio file. Same endpoint as sound_audio - can be used for downloading. Returns binary audio file that can be saved.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/{id}/audio

**Authentication:**
Not required (public endpoint)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Sound ID (integer) |

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `download` | Optional query parameter (true/false) - forces download if set to true |

**Response Examples:**

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "audio/mpeg",
    "Content-Disposition": "inline; filename=\"Sound Name.mp3\"",
    "Access-Control-Allow-Origin": "*"
  },
  "body": "[Binary audio data stream - save as file]",
  "note": "Response contains the audio file binary data. Use JavaScript fetch() or HTML download attribute to save the file."
}
```

---

## Sound Like

Like (POST) or unlike (DELETE) a sound.

### POST http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/{id}/like

### DELETE http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/{id}/like

**Authentication:**
Required (Token authentication)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Sound ID (integer) |

**Request Payload:**

**POST Request:**

No body required

**DELETE Request:**

No body required

**Response Examples:**

**POST Response:**
```json
{
  "status": 201,
  "data": {
    "message": "Sound liked successfully",
    "sound": {
      "id": 1,
      "name": "Sound Name",
      "is_liked": true,
      "likes_count": 11
    }
  }
}
```

**DELETE Response:**
```json
{
  "status": 200,
  "data": {
    "message": "Sound unliked successfully",
    "sound": {
      "id": 1,
      "name": "Sound Name",
      "is_liked": false,
      "likes_count": 10
    }
  }
}
```

---

## Sound Favorite

Add to favorites (POST) or remove from favorites (DELETE).

### POST http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/{id}/favorite

### DELETE http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/{id}/favorite

**Authentication:**
Required (Token authentication)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Sound ID (integer) |

**Request Payload:**

**POST Request:**

No body required

**DELETE Request:**

No body required

**Response Examples:**

**POST Response:**
```json
{
  "status": 201,
  "data": {
    "message": "Sound added to favorites successfully",
    "sound": {
      "id": 1,
      "name": "Sound Name",
      "is_favorited": true,
      "favorites_count": 6
    }
  }
}
```

**DELETE Response:**
```json
{
  "status": 200,
  "data": {
    "message": "Sound removed from favorites successfully",
    "sound": {
      "id": 1,
      "name": "Sound Name",
      "is_favorited": false,
      "favorites_count": 5
    }
  }
}
```

---

## New Sounds

Get new sounds (recently created, last 30 days).

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/new

**Authentication:**
Not required (public endpoint)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `page` | Page number (optional, integer) |
| `page_size` | Items per page (optional, integer, max 100) |

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "count": 20,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 100,
        "name": "New Sound",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3",
        "created_at": "2025-01-14T10:30:00Z"
      }
    ]
  }
}
```

---

## Trending Sounds

Get trending sounds (ordered by views, descending).

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/trending

**Authentication:**
Not required (public endpoint)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `page` | Page number (optional, integer) |
| `page_size` | Items per page (optional, integer, max 100) |

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "count": 50,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 5,
        "name": "Trending Sound",
        "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3",
        "views": 1000,
        "likes_count": 50,
        "favorites_count": 30
      }
    ]
  }
}
```

---

## Update Views

Update view count for a sound.

### POST http://play.soundboard.cloud/api/soundboard.soundbuttons.com/sounds/views

**Authentication:**
Not required (public endpoint)

**Request Payload:**

**Content Type:** `application/json`

**Fields:**
```json
{
  "sound_id": "Sound ID (required, integer)",
  "id": "Sound ID (alternative field name, integer)"
}
```

**Example:**
```json
{
  "sound_id": 1
}
```

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Sound Name",
    "views": 151,
    "sound_file": "https://soundbuttons.s3.us-east-2.amazonaws.com/sounds/file.mp3"
  }
}
```

---

## User Register

Register a new user for this site.

### POST http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/register

**Authentication:**
Not required (public endpoint)

**Request Payload:**

**Content Type:** `application/json`

**Fields:**
```json
{
  "username": "Username (required, string, unique)",
  "email": "Email address (required, string, unique)",
  "password": "Password (required, string, min 8 characters)",
  "full_name": "Full name (optional, string)"
}
```

**Example:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response Examples:**

```json
{
  "status": 201,
  "data": {
    "user": {
      "id": 10,
      "username": "johndoe",
      "email": "john@example.com",
      "full_name": "John Doe"
    },
    "token": "800df6861e90abc91d200fed1dbd0b60db8f0bba3c1ded6f8e19af8158eed00f",
    "message": "User registered successfully"
  }
}
```

---

## User Login

Login user for this site.

### POST http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/login

**Authentication:**
Not required (public endpoint)

**Request Payload:**

**Content Type:** `application/json`

**Fields:**
```json
{
  "email": "Email address (required, string)",
  "password": "Password (required, string)"
}
```

**Example:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "user": {
      "id": 10,
      "username": "johndoe",
      "email": "john@example.com",
      "full_name": "John Doe"
    },
    "token": "800df6861e90abc91d200fed1dbd0b60db8f0bba3c1ded6f8e19af8158eed00f",
    "message": "Login successful"
  }
}
```

---

## User Profile

Get or update current user profile. GET returns profile, POST updates profile.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/profile

### POST http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/profile

**Authentication:**
Required (Token authentication)

**Request Payload:**

**POST Request:**

**Fields:**
```json
{
  "first_name": "First name (optional, string)",
  "last_name": "Last name (optional, string)",
  "phone_number": "Phone number (optional, string)"
}
```

**Example:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890"
}
```

**Response Examples:**

**GET Response:**
```json
{
  "status": 200,
  "data": {
    "id": 10,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "role": 4,
    "role_name": "User",
    "role_code": "USER",
    "is_active": true,
    "is_verified": false,
    "phone_number": "+1234567890",
    "site": 1,
    "site_id": 1,
    "site_name": "Meme SoundBoard Pro",
    "date_joined": "2025-01-15T10:30:00Z",
    "created_at": "2025-01-15T10:30:00Z",
    "last_login": "2025-01-15T12:00:00Z"
  }
}
```

**POST Response:**
```json
{
  "status": 200,
  "data": {
    "user": {
      "id": 10,
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "full_name": "John Doe",
      "phone_number": "+1234567890"
    },
    "message": "Profile updated successfully"
  }
}
```

---

## User Forgot Password

Request password reset. Sends password reset email to user.

### POST http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/forgot-password

**Authentication:**
Not required (public endpoint)

**Request Payload:**

**Content Type:** `application/json`

**Fields:**
```json
{
  "email": "Email address (required, string)"
}
```

**Example:**
```json
{
  "email": "john@example.com"
}
```

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "message": "If an account exists with this email, a password reset link has been sent."
  }
}
```

---

## User Reset Password

Reset password using token from email. Token is sent via email after forgot password request.

### POST http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/reset-password

**Authentication:**
Not required (public endpoint)

**Request Payload:**

**Content Type:** `application/json`

**Fields:**
```json
{
  "uid": "User ID encoded in base64 (required, string) - from email link",
  "token": "Password reset token (required, string) - from email link",
  "password": "New password (required, string, min 8 characters)"
}
```

**Example:**
```json
{
  "uid": "MTE",
  "token": "abc123def456",
  "password": "newsecurepassword123"
}
```

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "message": "Password has been reset successfully. You can now login with your new password."
  }
}
```

---

## Get Category List

List all active categories for this site in tree structure (nested with children).

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/categories

**Authentication:**
Not required (public endpoint)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `0` | N |
| `1` | o |
| `2` | n |
| `3` | e |

**Response Examples:**

```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Music",
      "order": 0,
      "is_active": true,
      "children": [
        {
          "id": 2,
          "name": "Rock",
          "order": 0,
          "is_active": true,
          "children": []
        },
        {
          "id": 3,
          "name": "Jazz",
          "order": 1,
          "is_active": true,
          "children": []
        }
      ]
    },
    {
      "id": 4,
      "name": "Sound Effects",
      "order": 1,
      "is_active": true,
      "children": []
    }
  ]
}
```

---

## Get Category Detail

Get detailed information about a specific category.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/categories/{id}

**Authentication:**
Not required (public endpoint)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Category ID (integer) |

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Music",
    "parent": null,
    "parent_id": null,
    "parent_name": null,
    "order": 0,
    "is_active": true,
    "children_count": 2,
    "full_path": "Music",
    "depth": 0,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "created_by": 1,
    "created_by_name": "John Doe",
    "created_by_email": "john@example.com"
  }
}
```

---

## User Blogs

List all published blogs for this site.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/blogs

**Authentication:**
Not required (public endpoint)

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `search` | Search in title or excerpt (optional, string). Example: ?search=music |
| `page` | Page number (optional, integer) |
| `page_size` | Items per page (optional, integer, max 100) |

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "count": 15,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "Blog Title",
        "slug": "blog-title",
        "excerpt": "Blog excerpt text...",
        "featured_image": "https://soundbuttons.s3.us-east-2.amazonaws.com/blogs/image.png",
        "created_at": "2025-01-15T10:30:00Z",
        "published_at": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## User Blog Detail

Get detailed information about a specific blog.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/blogs/{id}

**Authentication:**
Not required (public endpoint)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Blog ID (integer) |

**Response Examples:**

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "title": "Blog Title",
    "slug": "blog-title",
    "content": "<p>Full blog content HTML...</p>",
    "excerpt": "Blog excerpt text...",
    "featured_image": "https://soundbuttons.s3.us-east-2.amazonaws.com/blogs/image.png",
    "metadata": {},
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

## User Blog Image

Stream or download blog featured image. Returns binary image data. Can be used for inline display (in <img> tag) or download. No authentication required.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/blogs/{id}/image

**Authentication:**
Not required (public endpoint)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Blog ID (integer) |

**Response Examples:**

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "image/png",
    "Content-Disposition": "inline; filename=\"blog-title.png\"",
    "Access-Control-Allow-Origin": "*"
  },
  "body": "[Binary image data stream]"
}
```

---

## Blog Image Download

Download blog featured image. Same endpoint as user_blog_image - can be used for downloading. Returns binary image file that can be saved.

### GET http://play.soundboard.cloud/api/soundboard.soundbuttons.com/user/blogs/{id}/image

**Authentication:**
Not required (public endpoint)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Blog ID (integer) |

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| `download` | Optional query parameter (true/false) - forces download if set to true |

**Response Examples:**

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "image/png",
    "Content-Disposition": "inline; filename=\"blog-title.png\"",
    "Access-Control-Allow-Origin": "*"
  },
  "body": "[Binary image data stream - save as file]",
  "note": "Response contains the image file binary data. Use JavaScript fetch() or HTML download attribute to save the file."
}
```

---
