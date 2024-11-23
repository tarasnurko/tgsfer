import { z, type TypeOf } from "zod";
import "dotenv/config"

const zodEnv = z.object({
    DATABASE_URL: z.string(),
    TELEGRAM_BOT_TOKEN: z.string()
});

const getEnv = (): TypeOf<typeof zodEnv> => {
    try {
        return zodEnv.parse(process.env);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const { fieldErrors } = err.flatten();
            const errorMessage = Object.entries(fieldErrors)
                .map(([field, errors]) =>
                    errors ? `${field}: ${errors.join(", ")}` : field,
                )
                .join("\n  ");
            throw new Error(`Missing environment variables:\n  ${errorMessage}`);
        }
        throw new Error('Error while parsing process.env')
    }
}

const env = getEnv()

export { env }