# Slack Issue Whisperer Backend

A NestJS backend for a Slack-integrated issue tracking assistant that helps teams manage and track issues directly from Slack.

## Features

- Create and manage issues through Slack commands
- Real-time notifications for issue updates
- AI-powered issue analysis and suggestions
- Interactive Slack messages for issue management
- User management with Slack integration
- Issue history tracking

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- Slack workspace with admin access

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/slack-issue-whisperer-be.git
cd slack-issue-whisperer-be
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=slack_issue_whisperer

# Slack
SLACK_SIGNING_SECRET=your_slack_signing_secret
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token

# Frontend
FRONTEND_URL=http://localhost:3001
```

4. Set up the database:
```bash
# Create the database
createdb slack_issue_whisperer

# Run migrations (if any)
npm run migration:run
```

5. Start the development server:
```bash
npm run start:dev
```

## Slack App Setup

1. Create a new Slack app at https://api.slack.com/apps
2. Enable the following features:
   - Slash Commands
   - Interactive Components
   - Bot Token Scopes
   - Event Subscriptions
3. Install the app to your workspace
4. Copy the necessary tokens and secrets to your `.env` file

## API Endpoints

### Issues
- `POST /api/issues` - Create a new issue
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get a specific issue
- `PATCH /api/issues/:id` - Update an issue
- `POST /api/issues/:id/poke` - Poke an issue's assignee

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `PATCH /api/users/:id` - Update a user

### Slack
- `POST /api/slack/commands` - Handle Slack commands
- `POST /api/slack/interactions` - Handle Slack interactions

## Development

### Running Tests
```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Migrations
```bash
# Generate a migration
npm run migration:generate

# Run migrations
npm run migration:run

# Revert migrations
npm run migration:revert
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 