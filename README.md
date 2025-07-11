# Drawing App

A full-stack drawing application built with React, Node.js, Express, and TypeScript. Users can create drawings on an HTML5 canvas and save them to view in a gallery.

## Features

- 🎨 **Interactive Drawing Canvas**: Draw with customizable colors and brush sizes
- 💾 **Save Drawings**: Save your artwork with custom titles
- 🖼️ **Gallery View**: Browse all saved drawings
- 🎯 **Responsive Design**: Works on desktop and mobile devices
- 🔧 **TypeScript**: Full type safety across the entire stack
- 🚀 **Modern Stack**: React 18, Express, Vite, Tailwind CSS

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **CORS** enabled for cross-origin requests
- **UUID** for unique identifiers

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **Concurrently** for running multiple processes
- **Nodemon** for backend hot reload

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/erdelp/drawing-app.git
   cd drawing-app
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `.env` files in both server and client directories:

   ```bash
   # server/.env
   PORT=5000
   NODE_ENV=development

   # client/.env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

### Individual Commands

- **Start frontend only**: `npm run dev:client`
- **Start backend only**: `npm run dev:server`
- **Build for production**: `npm run build`
- **Run linting**: `npm run lint`
- **Format code**: `npm run format`

## Project Structure

```
drawing-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── ...
│   ├── public/            # Static files
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── ...
│   └── package.json
├── shared/                # Shared TypeScript types
│   └── types.ts
└── package.json          # Root package.json
```

## API Endpoints

### Drawings
- `GET /api/drawings` - Get all drawings
- `GET /api/drawings/:id` - Get specific drawing
- `POST /api/drawings` - Create new drawing
- `DELETE /api/drawings/:id` - Delete drawing

### Health Check
- `GET /health` - Server health check

## Usage

1. **Drawing**: Navigate to the main page to access the drawing canvas
2. **Tools**: Use the color picker and brush size slider to customize your drawing
3. **Save**: Enter a title and click "Save Drawing" to save your artwork
4. **Gallery**: View all saved drawings in the gallery page
5. **Delete**: Remove drawings from the gallery

## Development

### Adding New Features

1. **Frontend Components**: Add new React components in `client/src/components/`
2. **API Endpoints**: Add new routes in `server/src/routes/`
3. **Shared Types**: Define interfaces in `shared/types.ts`

### Code Style

This project uses ESLint and Prettier for consistent code formatting. Run:

```bash
npm run lint    # Check for linting errors
npm run format  # Format code with Prettier
```

### Database Integration

Currently, the app uses in-memory storage. To add persistent storage:

1. Choose a database (PostgreSQL, MongoDB, etc.)
2. Add database connection logic in `server/src/`
3. Update the routes to use database queries instead of in-memory arrays
4. Add database migration scripts

## Deployment

### Frontend (Client)
1. Build the client: `npm run build:client`
2. Deploy the `client/dist` folder to a static hosting service (Vercel, Netlify, etc.)

### Backend (Server)
1. Build the server: `npm run build:server`
2. Deploy the `server/dist` folder to a hosting service (Heroku, DigitalOcean, etc.)
3. Set environment variables on your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the existing GitHub issues
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## Roadmap

- [ ] User authentication
- [ ] Drawing collaboration features
- [ ] More drawing tools (shapes, text, etc.)
- [ ] Export drawings as images
- [ ] Database integration
- [ ] Mobile app version

## Acknowledgments

- HTML5 Canvas API for drawing functionality
- React community for excellent documentation
- Express.js for the robust backend framework