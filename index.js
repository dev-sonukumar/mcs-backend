require("dotenv").config(); // Load environment variables
const app = require("express")();
const db = require("./db");

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const faqRouter = require("./routes/faqRouter");
app.use("/faq", faqRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
