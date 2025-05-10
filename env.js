import 'dotenv/config';
import { cleanEnv, str, port } from 'envalid'

const env = cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ['production', 'staging', 'dev'],
    }),
    PORT: port({ default: 3000 }),
    MONGO_URL: str({ default: 'mongodb://localhost:27017/' }),
})

export { env };