import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI as string,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expiration: process.env.JWT_EXPIRATION,
  node_env: process.env.NODE_ENV,
  client_url: process.env.CLIENT_URL,

  smpt_host: process.env.SMPT_HOST as string,
  smpt_port: process.env.SMPT_PORT,
  smpt_mail: process.env.SMPT_MAIL as string,
  smpt_password: process.env.SMPT_PASSWORD as string,
  smpt_service: process.env.SMPT_SERVICE as string,

  cloudinary: {
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.API_KEY as string,
    api_secret: process.env.API_SECRET as string,
  },
};
