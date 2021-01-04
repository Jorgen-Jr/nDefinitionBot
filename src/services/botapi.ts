import api from "axios";

const token = process.env.BOT_TOKEN;

export default api.create({
  baseURL: `https://api.telegram.org/bot${token}`,
});
