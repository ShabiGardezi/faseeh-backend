const express = require("express");
const pdf = require("html-pdf-node");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const { PORT } = require("./config/environment");
const connectDB = require("./config/dbconnection");
const chromium = require("@sparticuz/chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

//commit

const app = express();

const corsOptions = {
  origin: "*",
  // credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);
app.use(errorHandler);

app.get("/", (req, res) => res.send("Express on Vercel"));

app.post("/api/generate-pdf", async (req, res) => {
  try {
    const { content } = req.body;

    const htmlContent = `
      <html>
        <body style="direction: rtl; text-align: right;">
          <p>${content}</p>
        </body>
      </html>`;

    const file = { content: htmlContent };
    const options = { format: "A4" };

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const pdfBuffer = await pdf.generatePdf(file, options, browser);

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating PDF");
  }
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
