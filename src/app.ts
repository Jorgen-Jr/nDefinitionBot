import dotenv from "dotenv";

//Load all environment variables (Used in testing and develop enviromnent).
if (process.env.NODE_ENV !== "production") {
  if (process.env.NODE_ENV === "test") {
    dotenv.config({
      path: ".env.test",
    });
  } else {
    dotenv.config({
      path: ".env",
    });
  }
}

export default dotenv;
