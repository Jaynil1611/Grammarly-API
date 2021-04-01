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
      title: title,
      minicardTitle: minicardTitle,
      result: result,
      details: details,
      explanation: explanation,
      todo: todo,
      text: text,
      group: group,
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

// const cleanOutput = (inputQuery) => {
//   const newLineRegEx = /\r?\n|\r/;
//   const htmlRegEx = /(<([^>]+)>)/gi;
//   const removeSpace = /\u00a0/g;
//   const removeWhiteSpace = /\s+/g;
//   return inputQuery
//     .replace(newLineRegEx, " ")
//     .replace(htmlRegEx, " ")
//     .replace(removeSpace, " ")
//     .replace(removeWhiteSpace, " ")
//     .trim();
// };

app.get("/check", async function (req, res) {
  try {
    const grammarly = new Grammarly();
    // const grammarly = new Grammarly({
    //   auth: {
    //     grauth:
    //       "AABJGSpHn0Z6HKWDU9BbHFaZcOmSeqfQuyv-WO26b42m8bPHydqCh_iGOkQ_ZqJ5CxWfOuTfPtMqSBjf",
    //     "csrf-token": "AABJGfVQ2px4puEa8z+4wNGWORbZpEJi6LX0PQ",
    //   },
    // });
    const { search } = req.query;
    if (search.length > 0) {
      const results = await grammarly.analyse(search).then(correct);
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
