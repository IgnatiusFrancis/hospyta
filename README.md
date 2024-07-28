# Nest gRPC API Documentation

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Starting the Server](#starting-the-server)
- [Challenge](#challenge)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

# Prerequisites

- Node.js: Ensure you have Node.js installed (version 14.x or higher recommended)
- NestJS: Familiarity with the NestJS framework.
- TypeScript: Knowledge of TypeScript.
- Prisma: For ORM with PostgreSQL.
- PostgreSQL: Database for storing data.
- Cloudinary: For image hosting and management.

# Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/IgnatiusFrancis/SAAS.git

   ```

# Install dependencies:

npm install

# Configuration

Create a .env file in the root directory and configure the following environment variables:

```env
DATABASE_URL="postgres://user:password@host:port/dbname"
PORT="3000"
CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
JWT_SECRET="your_jwt_secret_key"

```

# Usage

## Starting the Server

To start the API server, run the following command:

````bash
# Auth microservice
$ npm run start:dev auth

# Post microservice
$ npm run start:dev post

# ApiGateway microservice
$ npm run start:dev apiGateway

```bash

````

# challenge

Implemented a monorepo microservice architecture. Created apiGateway that acts as a proxy to direct requests to different services using gPRC as a broker. Could not completely test and implement other features because of time constraint.

## Contributing

To contribute to this project, please follow these guidelines:

- Fork the repository.
- Create a feature branch (git checkout -b feature/your-feature).
- Commit your changes (git commit -am 'Add new feature').
- Push to the branch (git push origin feature/your-feature).
- Open a pull request.
  ...

## License

...

## Contact

For any inquiries, please reach out to:

- **Name: Ignatius Francis**
- **Email: obiignatiusfrancis@outlook.com**
- **GitHub: IgnatiusFrancis**
