# League Roaster Bot - REST API Documentation

## Base URL
```
http://localhost:3000
```
For production, replace with your deployed URL (e.g., Railway URL)

## API Endpoints

### 1. Health Check
Get server status and available endpoints.

**Endpoint:** `GET /`

**Response:**
```json
{
  "status": "✅ League Roaster Bot is running!",
  "mode": "webhook",
  "endpoints": {
    "register": "POST /api/register",
    "roast": "POST /api/roast",
    "analysis": "POST /api/analysis",
    "nameRoast": "POST /api/roast-name",
    "matchDetails": "GET /api/match/:matchId"
  }
}
```

---

### 2. Register User
Register a new user with their League of Legends Riot ID.

**Endpoint:** `POST /api/register`

**Request Body:**
```json
{
  "userId": 123456789,
  "gameName": "PlayerName",
  "tagLine": "NA1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 123456789,
    "gameName": "PlayerName",
    "tagLine": "NA1",
    "puuid": "xxx-xxx-xxx-xxx",
    "nameRoast": "PlayerName? More like PlayerLame..."
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123456789,
    "gameName": "PlayerName",
    "tagLine": "NA1"
  }'
```

---

### 3. Get Match Roast
Get a roast for the user's latest match.

**Endpoint:** `POST /api/roast`

**Request Body:**
```json
{
  "userId": 123456789
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matchId": "SEA_1234567890",
    "playerStats": {
      "champion": "Yasuo",
      "level": 18,
      "role": "MIDDLE",
      "kills": 5,
      "deaths": 12,
      "assists": 3,
      "kda": "0.67",
      "cs": 156,
      "gold": 12500,
      "goldPerMin": "380.25",
      "damage": 18500,
      "damageTaken": 35000,
      "visionScore": 15,
      "win": false
    },
    "roast": "With 12 deaths and barely 156 CS, you're basically a walking gold bag...",
    "timelineRoast": "Died at 5m, 8m, 12m... you spent more time watching gray screen..."
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/roast \
  -H "Content-Type: application/json" \
  -d '{"userId": 123456789}'
```

---

### 4. Get Detailed Analysis
Get detailed match history analysis with statistics and graphs.

**Endpoint:** `POST /api/analysis`

**Request Body:**
```json
{
  "userId": 123456789,
  "matchCount": 10
}
```

**Parameters:**
- `userId` (required): User's unique ID
- `matchCount` (optional): Number of matches to analyze (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "player": {
      "gameName": "PlayerName",
      "tagLine": "NA1"
    },
    "overallStats": {
      "winRate": "45%",
      "wins": 4,
      "losses": 6,
      "avgKills": 6.5,
      "avgDeaths": 7.8,
      "avgAssists": 8.2,
      "avgKDA": 1.89,
      "avgCS": 165,
      "avgGold": 385,
      "avgDamage": 19500,
      "avgVision": 22
    },
    "championPool": {
      "best": {
        "name": "Lux",
        "games": 3,
        "winRate": "67%",
        "avgKDA": 3.5
      },
      "worst": {
        "name": "Yasuo",
        "games": 4,
        "winRate": "25%",
        "avgKDA": 0.8
      },
      "mostPlayed": [...]
    },
    "deathAnalysis": {
      "highDeathMatches": 6,
      "maxDeathsInMatch": 15
    },
    "graphs": {
      "kdaTrend": "https://quickchart.io/chart?c={...}",
      "championPerformance": "https://quickchart.io/chart?c={...}"
    },
    "roast": "45% win rate? Your champions are embarrassed...",
    "championReport": "Stop playing Yasuo. Seriously. Your 25% win rate...",
    "matches": [...]
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123456789,
    "matchCount": 10
  }'
```

---

### 5. Roast Player Name
Roast a player's name without registration (standalone endpoint).

**Endpoint:** `POST /api/roast-name`

**Request Body:**
```json
{
  "gameName": "xXxDragonSlayer69xXx",
  "tagLine": "NA1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "gameName": "xXxDragonSlayer69xXx",
    "tagLine": "NA1",
    "puuid": "xxx-xxx-xxx-xxx",
    "roast": "xXxDragonSlayer69xXx? The only thing you're slaying is your own dignity..."
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/roast-name \
  -H "Content-Type: application/json" \
  -d '{
    "gameName": "xXxDragonSlayer69xXx",
    "tagLine": "NA1"
  }'
```

---

### 6. Get Match Details
Get detailed information about a specific match.

**Endpoint:** `GET /api/match/:matchId`

**Parameters:**
- `matchId`: The match ID (e.g., SEA_1234567890)

**Response:**
```json
{
  "success": true,
  "data": {
    "metadata": {...},
    "info": {
      "gameDuration": 1856,
      "gameMode": "CLASSIC",
      "participants": [...]
    }
  }
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/match/SEA_1234567890
```

---

### 7. Get User Info
Get information about a registered user.

**Endpoint:** `GET /api/user/:userId`

**Parameters:**
- `userId`: User's unique ID

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 123456789,
    "gameName": "PlayerName",
    "tagLine": "NA1",
    "puuid": "xxx-xxx-xxx-xxx",
    "lastMatch": "SEA_1234567890",
    "lastRoastTime": "2025-11-11T10:30:00.000Z",
    "createdAt": "2025-11-10T15:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/user/123456789
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing required fields)
- `404` - Not Found (user or match not found)
- `500` - Internal Server Error

---

## Integration Examples

### JavaScript (Fetch API)
```javascript
// Register user
const registerUser = async (userId, gameName, tagLine) => {
  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, gameName, tagLine })
  });
  return await response.json();
};

// Get roast
const getRoast = async (userId) => {
  const response = await fetch('http://localhost:3000/api/roast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  return await response.json();
};

// Get analysis
const getAnalysis = async (userId, matchCount = 10) => {
  const response = await fetch('http://localhost:3000/api/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, matchCount })
  });
  return await response.json();
};
```

### Python (requests)
```python
import requests

BASE_URL = "http://localhost:3000"

# Register user
def register_user(user_id, game_name, tag_line):
    response = requests.post(
        f"{BASE_URL}/api/register",
        json={
            "userId": user_id,
            "gameName": game_name,
            "tagLine": tag_line
        }
    )
    return response.json()

# Get roast
def get_roast(user_id):
    response = requests.post(
        f"{BASE_URL}/api/roast",
        json={"userId": user_id}
    )
    return response.json()

# Get analysis
def get_analysis(user_id, match_count=10):
    response = requests.post(
        f"{BASE_URL}/api/analysis",
        json={
            "userId": user_id,
            "matchCount": match_count
        }
    )
    return response.json()
```

---

## Notes

1. **User ID**: Can be any unique identifier (Telegram user ID, custom ID, etc.)
2. **Rate Limits**: Be mindful of Riot API rate limits
3. **Region**: Currently configured for SEA/ASIA region
4. **Graphs**: Generated using QuickChart.io (URLs expire after some time)
5. **Roasts**: Generated by AI and may vary in content

---

## Environment Variables Required

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
MONGODB_URI=your_mongodb_connection_string
RIOT_API_KEY=your_riot_api_key
GROQ_API_KEY=your_groq_api_key
WEBHOOK_URL=your_webhook_url (optional, for production)
PORT=3000 (optional, default is 3000)
```
