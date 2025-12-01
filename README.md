RateHub is a currency converter that lets users compare and convert multiple currencies at once.
It supports dynamic currency management, syncing values across all inputs automatically, and using daily exchange rates from an [API](https://www.exchangerate-api.com/).

## ✨ Features

- 🔄 **Daily exchange rates**, updated once per day
 💾 **Rate caching in localStorage** for optimal performance and minimal API/token usage
- ➕ **Add or remove currencies dynamically**
- 🧮 **Auto-synced conversion** — when one input changes, all currencies update
- ⏱️ **Automatic next-update detection** from `time_next_update_unix`

## 🧠 How It Works

RateHub fetches exchange rates **once per day** from selected API.
To optimize cost and improve speed:

1. When the user opens the app:
   - Check if daily rates exist in `localStorage`
   - Check if they are still valid (based on `time_next_update_unix`)
2. If valid → reuse cached rates (no API call)
3. If expired → fetch fresh daily rates and store them again
4. All conversions are calculated locally

## 🚀 Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/ratehub.git
cd ratehub
```
### 2. Install dependencies:
```bash
npm install
```
### 3. Environment Variables:
``` env
EXCHANGE_RATE_API_KEY=YOUR_API_KEY
```
### 4. Start development:
```bash
npm run dev
```
