const { readJSON, writeJSON } = require("fs-extra");
const { join } = require("path");

const questionsFilePath = join(__dirname, "../exam/questions.json");
const answersFilePath = join(__dirname, "../exam/answers.json");

const readDB = async (filePath) => {
  try {
    const fileJson = await readJSON(filePath);
    return fileJson;
  } catch (error) {
    throw new Error(error);
  }
};

const writeDB = async (filePath, fileContent) => {
  try {
    await writeJSON(filePath, fileContent);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getQuestions: async () => readDB(questionsFilePath),
  writeQuestions: async (questionsData) =>
    writeDB(questionsFilePath, questionsData),
  getAnswers: async () => readDB(answersFilePath),
  writeAnswers: async (answersData) => writeDB(answersFilePath, answersData),
};
