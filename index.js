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
      title: cleanOutput(title),
      minicardTitle: cleanOutput(minicardTitle),
      result: cleanOutput(result),
      details: cleanOutput(details),
      explanation: cleanOutput(explanation),
      todo: cleanOutput(todo),
      text: cleanOutput(text),
      group: cleanOutput(group),
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

const cleanOutput = (inputQuery) => {
  const newLineRegEx = /\r?\n|\r/;
  const htmlRegEx = /(<([^>]+)>)/gi;
  return inputQuery.replace(newLineRegEx, "").replace(htmlRegEx, "").toString();
};

app.get("/check", async function (req, res) {
  try {
    const grammarly = new Grammarly();
    const query = req.query.search;
    if (query.length > 0) {
      const parsedQuery = cleanOutput(query);
      const results = await grammarly.analyse(parsedQuery).then(correct);
      const finalResults = getRequiredDetailsFromGrammarly(results);
      res.status(200).send(finalResults);
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
