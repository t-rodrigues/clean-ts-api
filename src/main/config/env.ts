export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-ts-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.ENCRYPT_SECRET || 'e4488daa3a0d127d0d44704c832a0c83',
};
