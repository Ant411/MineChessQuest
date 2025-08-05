# Overview

This is a Minecraft-themed 3D chess game built with React Three Fiber and TypeScript. The application combines traditional chess gameplay with Minecraft aesthetics, featuring multiple game modes (1-4 players), different biomes as environments, and immersive 3D visuals. Players can enjoy classic chess with Minecraft characters as pieces in various themed environments like forest, desert, ocean, and nether biomes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client uses React with TypeScript and is built with Vite as the bundler. The 3D rendering is handled by React Three Fiber (@react-three/fiber) with additional utilities from @react-three/drei for enhanced 3D components. The UI components are built using Radix UI primitives with custom Minecraft-themed styling via Tailwind CSS and custom CSS.

The application follows a component-based architecture with clear separation of concerns:
- **Game Components**: Handle 3D chess board, pieces, and game environment
- **UI Components**: Manage menus, controls, and user interactions
- **Custom Hooks**: Provide reusable logic for mobile detection and other utilities

## Backend Architecture  
The server uses Express.js with TypeScript, configured as an ESM module. The architecture is minimal and prepared for expansion:
- **Routes**: Currently stubbed out with basic structure for future API endpoints
- **Storage**: Implements an abstraction layer with in-memory storage for users, easily replaceable with database storage
- **Vite Integration**: Development server integrates Vite middleware for hot module replacement

## State Management
The application uses Zustand for client-side state management with multiple stores:
- **Chess Game Store**: Manages game state, moves, and game logic
- **Theme Store**: Handles light/dark mode switching
- **Audio Store**: Controls sound effects and music
- **Player Store**: Manages player information and scores

## Data Storage Solutions
Currently uses in-memory storage via a simple Map-based implementation. The database configuration uses Drizzle ORM with PostgreSQL, specifically configured for Neon database with the following setup:
- **Schema**: Defined in TypeScript with user authentication tables
- **Migrations**: Managed through Drizzle Kit with PostgreSQL dialect
- **Connection**: Uses environment variable DATABASE_URL for database connectivity

## 3D Graphics and Game Engine
The chess game leverages React Three Fiber for 3D rendering with several specialized components:
- **Chess Board**: Dynamically rendered based on game mode (2-4 players)
- **Chess Pieces**: Minecraft-themed character models with animations
- **Biome Environments**: Different themed backgrounds (forest, desert, ocean, nether)
- **Lighting System**: Dynamic lighting based on biome and theme selection
- **Animation Controller**: Handles piece movements, captures, and special effects

## Audio System
Implements a comprehensive audio system for game immersion:
- **Sound Effects**: Move sounds, capture effects, and UI interactions
- **Background Music**: Biome-specific ambient tracks
- **Audio Controls**: Mute/unmute functionality with persistent settings

## Game Logic Architecture
The chess engine supports multiple game modes:
- **Traditional Chess**: Standard 2-player chess rules
- **Multi-player Variants**: 3-player triangular and 4-player team modes
- **AI System**: Multiple difficulty levels with minimax algorithm implementation
- **Move Validation**: Comprehensive chess rule enforcement
- **Special Moves**: Castling, en passant, and pawn promotion

# External Dependencies

## 3D Graphics and Animation
- **@react-three/fiber**: Core 3D rendering engine for React
- **@react-three/drei**: Utility components and helpers for Three.js
- **@react-three/postprocessing**: Visual effects and post-processing
- **three**: Underlying 3D graphics library
- **vite-plugin-glsl**: GLSL shader support for custom visual effects

## UI Framework and Styling
- **@radix-ui/react-***: Complete set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant system
- **clsx**: Conditional className utility
- **cmdk**: Command menu component

## Database and ORM
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database schema management and migrations
- **@neondatabase/serverless**: Neon database driver for PostgreSQL
- **pg-core**: PostgreSQL integration for Drizzle

## State Management and Data Fetching
- **zustand**: Lightweight state management solution
- **@tanstack/react-query**: Server state management and caching
- **zod**: Runtime type validation and schema definition

## Development and Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Session Management
- **express-session**: Session middleware for Express
- **connect-pg-simple**: PostgreSQL session store

## Audio and Assets
- **@fontsource/inter**: Inter font family
- Various texture and audio files for Minecraft theming