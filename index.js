import { correct, Grammarly } from "@stewartmcgown/grammarly-api";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const getRequiredDetailsFromGrammarly = (response) => {
  const alerts = response.alerts.map((alert) => {
    const {
      title,
      minicardTitle,
      result,
      details,
      explanation,
      todo,
      text,
      cardLayout: { group },
    } = alert;
    return {
      title,
      minicardTitle,
      result,
      details,
      explanation,
      todo,
      text,
      group,
    };
  });
  const { score } = response.result;
  const { corrected } = response;
  return {
    alerts,
    score,
    corrected,
  };
};

app.get("/check", async function (req, res) {
  try {
    const grammarly = new Grammarly();
    const query = req.query.search;
    if (query.length > 0) {
      const results = await grammarly.analyse(query.trim()).then(correct);
      const finalResults = getRequiredDetailsFromGrammarly(results);
      res.status(200).send(JSON.stringify(finalResults));
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    res.status(404).send("Error! Something is really wrong.");
  }
});

app.get("/", (req, res) =>
  res.status(200).send("Welcome to Jaynil's Grammar Checker!")
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Grammar Checker Running on ${port}`);
});
