const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");
const {
  getQuestions,
  writeQuestions,
  writeAnswers,
  getAnswers,
} = require("../lib/fsUtil");

const answerValidation = [
  check("providedAnswer").exists().withMessage("Question already answered!"),
];

const examsRouter = express.Router();

examsRouter.get("/exams/start", async (req, res, next) => {
  try {
    const questions = await getQuestions();
    const randQues = questions[Math.floor(Math.random() * questions.length)];
    const randomQuestions = [];
    for (let i = 0; i <= 5; i++) {
      randomQuestions.push(randQues);
    }

    res.send(randomQuestions);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
examsRouter.post("/exams/start", async (req, res, next) => {
  try {
    const questions = await getQuestions();
    const exams = await getAnswers();
    const randQues = questions[Math.floor(Math.random() * questions.length)];
    exams.push({
      ...req.body,
      createdAt: new Date(),

      id: uniqid(),

      questions: randQues,
    });
    await writeAnswers(exams);
    res.send(exams);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
examsRouter.post(
  "/exams/:id/answers",

  async (req, res, next) => {
    try {
      const exams = await getAnswers();

      const examIndex = exams.findIndex((exam) => exam.id === req.params.id);
      if (examIndex !== -1) {
        exams[examIndex].questions.push({
          providedAnswer: [...req.body],
        });

        await writeAnswers(exams);
        res.status(201).send(exams);
      } else {
        const error = new Error();
        error.httpStatusCode = 404;
        next(error);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
examsRouter.get("/exams/:id", async (req, res, next) => {
  try {
    const exams = await getAnswers();

    const examFound = exams.find((exam) => exam.id === req.params.id);

    if (examFound) {
      res.send(examFound);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = examsRouter;
