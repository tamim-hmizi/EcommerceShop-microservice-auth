# EcommerceShop Auth Microservice

Handles user registration and login. Passwords are hashed with bcryptjs in a Mongoose pre-save hook, and successful register/login responses return a signed JWT (30-day expiry).

This service is one of seven Express/MongoDB microservices (auth, users, products, categories, carts, orders, favorites) that together form the backend of the EcommerceShop MERN application. Each service owns its routes under `/api/auth`, connects to MongoDB through Mongoose and exposes Prometheus metrics, so it can be built, deployed, scaled and monitored independently on Kubernetes.

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a user (name, email, password) and return it with a JWT |
| POST | `/api/auth/login` | Authenticate with email and password and return a JWT |
| GET | `/api/auth/profile` | Return the profile of `req.user` |
| GET | `/api/auth/metrics` | Prometheus metrics |

> The profile route expects `req.user` to be resolved upstream; this service has no JWT verification middleware.

Data model: `User` (name, email, password, isAdmin, profilePicture, bio, favorites).

## Tech stack

- Node.js 22, Express 5 (ES modules)
- MongoDB with Mongoose
- prom-client (HTTP request duration histogram)
- bcryptjs, jsonwebtoken
- Docker (node:22-alpine, non-root user)

## Environment variables

Copy `.env.example` to `.env` and set your own values. Never commit `.env`.

| Variable | Description |
|---|---|
| `PORT` | HTTP port (defaults to 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JSON Web Tokens |

## Run locally

```bash
npm install
cp .env.example .env   # then edit the values
npm start
```

The service listens on `http://localhost:5000` by default.

## Docker

```bash
docker build -t ecommerceshop-auth .
docker run --env-file .env -p 5000:5000 ecommerceshop-auth
```

## Related repositories

- [EcommerceShop-Frontend-K8S](https://github.com/tamim-hmizi/EcommerceShop-Frontend-K8S) - frontend for the microservice deployment
- [EcommerceShop-Frontend](https://github.com/tamim-hmizi/EcommerceShop-Frontend) - frontend for the monolithic backend
- [EcommerceShop-monolithic-backend](https://github.com/tamim-hmizi/EcommerceShop-monolithic-backend) - monolithic version of the backend
- [QuickOps-Frontend](https://github.com/tamim-hmizi/QuickOps-Frontend) - QuickOps platform used to deploy this application on AKS
- Other microservices: [users](https://github.com/tamim-hmizi/EcommerceShop-microservice-users), [products](https://github.com/tamim-hmizi/EcommerceShop-microservice-products), [categories](https://github.com/tamim-hmizi/EcommerceShop-microservice-categories), [carts](https://github.com/tamim-hmizi/EcommerceShop-microservice-carts), [orders](https://github.com/tamim-hmizi/EcommerceShop-microservice-orders), [favorites](https://github.com/tamim-hmizi/EcommerceShop-microservice-favorites)

## License

See [LICENSE](LICENSE).

---

Part of the MERN e-commerce use case for QuickOps, 2025, by Tamim Hmizi — https://tamim-hmizi.github.io/Portfolio/
