# SkillSwap Server

The backend API server for SkillSwap - a skill exchange platform where users can teach and learn skills from each other.

## Features

- User authentication with JWT tokens
- Skill management (offered and wanted skills)
- Skill swap requests with acceptance/rejection
- Request completion tracking
- Feedback and rating system
- AI-powered skill suggestions
- Error handling and validation middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS
- **HTTP Client**: Axios
- **Environment Management**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vk57434/SkillSwap.git
cd SkillSwap/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Running the Server

Start the development server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication endpoints
│   ├── skillController.js    # Skill management endpoints
│   ├── requestController.js  # Skill swap request endpoints
│   ├── feedbackController.js # Feedback system endpoints
│   └── aiController.js       # AI-powered endpoints
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   └── errorMiddleware.js    # Global error handling
├── models/
│   ├── User.js               # User schema
│   ├── Skill.js              # Skill schema
│   ├── Request.js            # Swap request schema
│   └── Feedback.js           # Feedback schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── skillRoutes.js        # Skill endpoints
│   ├── requestRoutes.js      # Request endpoints
│   ├── feedbackRoutes.js     # Feedback endpoints
│   └── aiRoutes.js           # AI endpoints
├── utils/
│   └── generateToken.js      # JWT token generation
├── server.js                 # Main server file
└── README.md                 # This file
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/all` - Get all users (protected)
- `GET /auth/profile` - Get current user profile (protected)

### Skills
- `POST /skills` - Add a new skill (protected)
- `GET /skills/all/users` - Get all skills from all users
- `GET /skills/my-skills` - Get current user's skills (protected)
- `DELETE /skills/:id` - Delete a skill (protected)

### Requests
- `POST /requests` - Send a skill swap request (protected)
- `GET /requests` - Get user's requests (protected)
- `PUT /requests/:id` - Update request status (protected)

### Feedback
- `POST /feedback` - Leave feedback for a user (protected)
- `GET /feedback/:userId` - Get feedback for a user



## Authentication

All protected routes require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## Database Models

### User
- `name` - User's name
- `email` - User's email (unique)
- `password` - Hashed password
- `location` - User's location (optional)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Skill
- `user` - Reference to User
- `name` - Skill name
- `type` - "offered" or "wanted"
- `createdAt` - Timestamp

### Request
- `sender` - Reference to User sending request
- `receiver` - Reference to User receiving request
- `skillOffered` - Skill being offered
- `skillWanted` - Skill being requested
- `message` - Optional message
- `status` - "pending", "accepted", "rejected", "cancelled", or "completed"
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Feedback
- `from` - Reference to User giving feedback
- `to` - Reference to User receiving feedback
- `rating` - 1-5 star rating
- `comment` - Feedback comment
- `createdAt` - Timestamp

## Error Handling

The server includes comprehensive error handling:
- Request validation
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

All errors are returned in the format:
```json
{
  "message": "Error message",
  "stack": "Stack trace (only in development)"
}
```

## Security

- Uses bcryptjs for password hashing
- JWT tokens for authentication
- CORS enabled for frontend communication
- Helmet for security headers
- Environment variables for sensitive data

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

ISC License - See LICENSE file for details

## Support

For support, please open an issue in the GitHub repository.
