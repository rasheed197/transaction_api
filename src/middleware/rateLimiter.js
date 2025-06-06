import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit"); // You pass either user_id or ip in the parenthesis

    if (!success) {
      return res.status(429).json({
        // 429 means too many requests
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default ratelimiter;
