# API Endpoints for memesoundboard.org

## Base URL
```
https://play.soundboard.cloud/api/memesoundboard.org
```

## Sound Endpoints

### 1. Get All Sounds
```
GET https://play.soundboard.cloud/api/memesoundboard.org/sounds
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `page_size` (optional) - Items per page, max 100 (default: 40)
- `category` (optional) - Filter by category ID
- `tag` (optional) - Filter by tag
- `search` (optional) - Search in name or tags

**Example:**
```
https://play.soundboard.cloud/api/memesoundboard.org/sounds?page=1&page_size=40
```

### 2. Get New Sounds
```
GET https://play.soundboard.cloud/api/memesoundboard.org/sounds/new
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `page_size` (optional) - Items per page, max 100 (default: 40)

**Example:**
```
https://play.soundboard.cloud/api/memesoundboard.org/sounds/new?page=1&page_size=40
```

### 3. Get Trending Sounds
```
GET https://play.soundboard.cloud/api/memesoundboard.org/sounds/trending
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `page_size` (optional) - Items per page, max 100 (default: 40)

**Example:**
```
https://play.soundboard.cloud/api/memesoundboard.org/sounds/trending?page=1&page_size=40
```

### 4. Search Sounds
```
GET https://play.soundboard.cloud/api/memesoundboard.org/sounds/search
```

**Query Parameters:**
- `name` (required) - Sound name to search for
- `page` (optional) - Page number (default: 1)
- `page_size` (optional) - Items per page, max 100 (default: 40)

**Example:**
```
https://play.soundboard.cloud/api/memesoundboard.org/sounds/search?name=music&page=1&page_size=40
```

### 5. Get Sound by ID
```
GET https://play.soundboard.cloud/api/memesoundboard.org/sounds/{id}
```

**Example:**
```
https://play.soundboard.cloud/api/memesoundboard.org/sounds/1
```

### 6. Get Related Sounds
```
GET https://play.soundboard.cloud/api/memesoundboard.org/sounds/{id}/related
```

**Query Parameters:**
- `limit` (optional) - Max number of related sounds (default: 10, max: 50)
- `page` (optional) - Page number
- `page_size` (optional) - Items per page

**Example:**
```
https://play.soundboard.cloud/api/memesoundboard.org/sounds/1/related?limit=10
```

### 7. Update Views
```
POST https://play.soundboard.cloud/api/memesoundboard.org/sounds/views
```

**Body:**
```json
{
  "sound_id": 1
}
```

## Category Endpoints

### 8. Get All Categories
```
GET https://play.soundboard.cloud/api/memesoundboard.org/user/categories
```

### 9. Get Category by ID
```
GET https://play.soundboard.cloud/api/memesoundboard.org/user/categories/{id}
```

## Response Format

All endpoints return:
```json
{
  "status": 200,
  "data": {
    "count": 100,
    "next": "http://...",
    "previous": null,
    "results": [...]
  }
}
```

## Test URLs

You can test these endpoints directly in your browser or with curl:

```bash
# Test new sounds
curl "https://play.soundboard.cloud/api/memesoundboard.org/sounds/new?page=1&page_size=40"

# Test trending sounds
curl "https://play.soundboard.cloud/api/memesoundboard.org/sounds/trending?page=1&page_size=40"

# Test all sounds
curl "https://play.soundboard.cloud/api/memesoundboard.org/sounds?page=1&page_size=40"
```
