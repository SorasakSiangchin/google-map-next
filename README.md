# Next.js Google Map Location Search

This project is a simple Next.js application that demonstrates how to integrate Google Maps with location search functionality. It uses React, Next.js, Tailwind CSS, Material UI, and Google Maps APIs.

## Features
- Display Google Map
- Search for locations
- Responsive UI with Material UI and Tailwind CSS

## Prerequisites
- Node.js (v18 or higher recommended)
- Google Maps API Key (with Maps JavaScript API and Places API enabled)

## Getting Started (Step by Step)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd google-map-next
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Google Maps API Key
Create a `.env.local` file in the root directory and add your Google Maps API key:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure
- `app/` - Main application code
  - `components/Map.tsx` - Google Map component
  - `page.tsx` - Main page
- `public/` - Static assets
- `package.json` - Project dependencies and scripts

## Customization
- Update the map logic or UI in `app/components/Map.tsx` as needed.
- Style the app using Tailwind CSS and Material UI components.

## Build for Production
```bash
npm run build
npm start
```

## License
MIT
