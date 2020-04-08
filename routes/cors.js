const cors = require("cors");
const RefusalError = require("./../utils/RefusalError");

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000 http://localhost:3001").split(" ");
const corsOptions = {
	origin: (origin, callback) => {

		if (! origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === "development")
			callback(null, true);
		else
			callback(new RefusalError("Not allowed by CORS", "ERR_HTTP2_INVALID_ORIGIN"));

	},
	credentials: true
};

module.exports = cors(corsOptions);
