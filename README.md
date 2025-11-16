# PixPotion 🎨

**The Complete Professional Pixel Art Suite for Game Developers and Web Creators**

Transform your creative workflow with PixPotion - a comprehensive platform that combines AI-powered pixel art generation with professional-grade tools designed specifically for game developers and web designers.

![PixPotion](pixPotion.png)

## 🌟 Why PixPotion?

PixPotion goes beyond simple pixel art generation. It's a complete ecosystem designed to solve real problems for creators:

- **Save Time**: Batch generate multiple variations in seconds instead of hours
- **Stay Consistent**: Use palette managers and templates to maintain visual coherence across your projects
- **Export Anywhere**: Native support for Godot, Unity, Tiled, and more
- **Monetize Your Work**: Built-in marketplace to sell your creations
- **Professional Workflows**: Tools designed by game developers, for game developers

## ✨ Core Features

### 🎨 AI-Powered Generation
- **Text-to-Pixel Art**: Transform descriptions into pixel-perfect sprites
- **Multiple Artistic Styles**: 15+ styles from retro to modern
- **Customizable Dimensions**: 64x64 to 512x512 pixels
- **Reference Image Support**: Guide generation with your own images
- **Seed Control**: Reproduce results with consistent seeds

### 🛠️ Professional Tools Suite

#### 📦 Sprite Sheet Generator
Perfect for game developers who need organized sprite sheets:
- **Auto-Grid Layout**: Automatically arranges sprites with customizable spacing
- **Multiple Export Formats**:
  - TexturePacker JSON
  - Starling XML
  - CSS Sprites
- **Metadata Generation**: Complete frame data for easy integration
- **Custom Padding & Spacing**: Fine-tune your sprite sheets

#### 🎬 Animation Creator
Create professional sprite animations with ease:
- **Frame-by-Frame Control**: Precise animation editing
- **Animation Templates**:
  - Walk cycles (8 frames)
  - Idle breathing (4 frames)
  - Attack animations (6 frames)
  - Jump cycles (6 frames)
  - Run cycles (8 frames)
- **Playback Preview**: See your animations in real-time
- **FPS Control**: Adjust animation speed (1-60 FPS)
- **Multiple Export Options**:
  - Sprite sheet
  - GIF animation
  - JSON metadata

#### 🗺️ Tileset Generator
Generate complete, cohesive tilesets for level design:
- **Platform Tileset**: Complete with corners, edges, and fills
- **Auto-tile Terrain**: Advanced terrain with slopes and cliffs
- **Dungeon Tiles**: Walls, floors, doors, and decorations
- **Nature Packs**: Grass, dirt, stone, water elements
- **Theme Support**: 8 themes including grass, desert, ice, lava, space
- **Game Engine Export**:
  - Godot (.tres)
  - Unity (.json)
  - Tiled (.tsx)

#### 🎨 Color Palette Manager
Professional color management for consistent art:
- **Classic Presets**:
  - Game Boy (4 colors)
  - PICO-8 (16 colors)
  - NES (14 colors)
  - Commodore 64 (16 colors)
  - Nord, Dracula, and more
- **Harmony Generators**:
  - Complementary
  - Triadic
  - Analogous
  - Monochromatic
- **Export Formats**:
  - HEX list
  - JSON
  - CSS variables
  - GIMP Palette (.gpl)
- **Save & Organize**: Manage unlimited palettes

#### 🚀 Batch Generator
Massive productivity boost for asset creation:
- **Variation Types**:
  - Color variations (red, blue, green, etc.)
  - Style variations (cute, scary, realistic)
  - Mood variations (happy, angry, peaceful)
  - Time of day (day, night, sunset)
  - Elemental (fire, water, earth, air)
- **Quick Templates**:
  - Character variations
  - Weapon sets
  - Environment packs
  - Enemy variants
- **Bulk Operations**: Generate up to 20 variations at once (Ultimate plan)
- **Batch Export**: Download all or individual results

### 💼 Marketplace & Monetization

- **Sell Your Assets**: Turn your creativity into revenue
- **Tiered Commissions**:
  - Pro: 30% platform fee
  - Ultimate: 20% platform fee
- **Licensing System**: Clear commercial licensing
- **Browse Community**: Discover and purchase assets from other creators
- **Filter & Search**: Find exactly what you need

### 📊 Professional Plans

#### Free Plan - Get Started
- 25 credits (5 images)
- Up to 256x256 resolution
- Sprite Sheet Generator ✓
- Animation Creator ✓
- Color Palette Manager ✓
- Basic export formats

#### Pro Plan - $9.99/month
- 349 credits (~70 images)
- Up to 512x512 resolution
- All Free features
- **Tileset Generator** with auto-tiling
- **Batch Generator** (up to 10 variations)
- Advanced exports (Godot, Unity, Tiled)
- Marketplace selling (30% commission)
- Priority email support

#### Ultimate Plan - $19.99/month
- 699 credits (~140 images)
- All Pro features
- **Batch Generator** (up to 20 variations)
- Premium Asset Packs access
- **API Access** for integrations
- Commercial licensing
- Marketplace selling (20% commission)
- Priority support + Discord access

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Styled Components** - Component-scoped styling
- **React Router v6** - Client-side routing
- **Supabase Auth** - Secure authentication
- **Axios** - API communication
- **Howler.js** - Professional audio system

### Backend
- **Express.js** - Web application framework
- **MongoDB** with Mongoose - Scalable database
- **JWT** - Secure token authentication
- **Multer** - File upload handling
- **bcrypt** - Password security

## 📦 Installation

### Prerequisites
- Node.js v16 or higher
- MongoDB database
- Supabase account (for authentication)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/pixpotion.git
cd pixpotion

# Install all dependencies
npm run install-all

# Set up environment variables
cd server && cp example.env .env
cd ../client && cp example.env .env

# Edit .env files with your configuration
# Then start development

# Run both client and server
npm run dev
```

### Environment Configuration

#### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pixpotion
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

#### Client (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
pixpotion/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── animation/          # Animation Creator
│   │   │   ├── batch/              # Batch Generator
│   │   │   ├── palette/            # Color Palette Manager
│   │   │   ├── spritesheet/        # Sprite Sheet Generator
│   │   │   ├── tileset/            # Tileset Generator
│   │   │   ├── auth/               # Authentication
│   │   │   ├── generator/          # AI Generator
│   │   │   ├── marketplace/        # Asset Marketplace
│   │   │   ├── layout/             # Header, Footer
│   │   │   └── ui/                 # Retro UI components
│   │   ├── pages/                  # Page components
│   │   ├── context/                # State management
│   │   ├── styles/                 # Global styles & theme
│   │   └── utils/                  # Helper functions
│   └── public/                     # Static assets
├── server/                          # Express backend
│   ├── controllers/                # Business logic
│   ├── models/                     # Database schemas
│   ├── routes/                     # API endpoints
│   ├── middleware/                 # Auth, validation
│   └── uploads/                    # User uploads
└── package.json                    # Root configuration
```

## 🎮 Usage Examples

### Basic Generation
1. Sign up/Login
2. Enter a prompt: "8-bit warrior with sword"
3. Choose dimensions and style
4. Generate and download

### Creating Sprite Sheets
1. Navigate to Tools → Sprite Sheet Generator
2. Upload multiple sprite frames
3. Adjust grid settings (columns, spacing, padding)
4. Export with metadata (JSON, XML, or CSS)

### Generating Tilesets
1. Go to Tools → Tileset Generator
2. Select template (Platform, Terrain, Dungeon)
3. Choose theme (grass, desert, ice, etc.)
4. Generate complete tileset
5. Export for your game engine (Godot, Unity, Tiled)

### Batch Generation
1. Open Tools → Batch Generator
2. Enter base prompt: "fantasy sword"
3. Select variation type (color, element, style)
4. Set batch size (2-20)
5. Generate all variations at once

### Animation Workflow
1. Access Tools → Animation Creator
2. Upload animation frames or generate them
3. Select template (walk, idle, attack)
4. Adjust FPS and loop settings
5. Preview animation
6. Export as sprite sheet or GIF

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      - Create account
POST   /api/auth/login         - User login
POST   /api/auth/provider      - OAuth login
GET    /api/auth/me            - Get current user
```

### Images
```
POST   /api/images/generate    - Generate pixel art
POST   /api/images/upload      - Upload image
GET    /api/images             - Get user images
DELETE /api/images/:id         - Delete image
PUT    /api/images/:id         - Update image
```

### Marketplace
```
GET    /api/images/public      - Browse marketplace
POST   /api/images             - List item for sale
```

## 🎯 Use Cases

### Game Developers
- Generate consistent character sprites
- Create complete tilesets for levels
- Batch generate enemy variations
- Export directly to Unity, Godot, or Tiled
- Animate characters with preset templates

### Web Designers
- Create pixel art icons
- Generate UI elements
- Design retro-style websites
- Build cohesive design systems with palette manager

### Indie Studios
- Rapid prototyping
- Asset variation testing
- Consistent art style across team
- Marketplace for asset sharing

### NFT Creators
- Generate unique character variations
- Export with metadata
- Batch generation for collections

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## 📝 Roadmap

### Coming Soon
- [ ] Asset pack templates
- [ ] API for external integrations
- [ ] Advanced animation interpolation
- [ ] AI-powered color palette suggestions
- [ ] Real-time collaboration features
- [ ] Mobile app (iOS/Android)
- [ ] Plugin system for custom exporters
- [ ] Advanced auto-tiling algorithms

## 💡 Tips & Tricks

1. **Use Consistent Palettes**: Create and save palettes for each project to maintain visual consistency
2. **Batch Generate**: Save time by generating multiple variations at once
3. **Template Workflow**: Use animation templates as starting points
4. **Seed Control**: Note down seeds for reproducible results
5. **Marketplace Strategy**: Build a following by sharing quality assets regularly

## 🐛 Troubleshooting

### Common Issues

**Generation fails**
- Check your credit balance
- Verify prompt doesn't contain restricted content
- Try reducing image dimensions

**Export issues**
- Ensure browser allows downloads
- Check file permissions for uploads directory
- Verify sufficient disk space

**Authentication problems**
- Clear browser cache
- Check Supabase configuration
- Verify environment variables

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/pixpotion/issues)
- **Email**: support@pixpotion.com
- **Discord**: Join our community (Ultimate plan members)
- **Docs**: Full documentation at docs.pixpotion.com

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Community feedback and feature requests
- Open source libraries and tools
- Retro gaming aesthetics inspiration
- Game development community

---

**Built with ❤️ and lots of pixels by creators, for creators**

Ready to revolutionize your pixel art workflow? [Get started now](https://pixpotion.com) 🚀
