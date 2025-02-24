import React, { useState } from "react";

const Quiz = ({ quizzes }) => {
  const filteredQuizzes = quizzes?.filter((quiz) => !quiz.is_deleted);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [marks, setMarks] = useState([]);

  const handleOptionSelect = (event) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = event.target.value;
    setSelectedAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    const selectedAnswer = selectedAnswers[currentQuestion];
    const correctAnswers = filteredQuizzes[currentQuestion].correct_answers;

    if (correctAnswers && correctAnswers.includes(selectedAnswer)) {
      const updatedMarks = [...marks];
      updatedMarks[currentQuestion] = 1;
      setMarks(updatedMarks);
    } else {
      const updatedMarks = [...marks];
      updatedMarks[currentQuestion] = 0;
      setMarks(updatedMarks);
    }

    if (currentQuestion < filteredQuizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setSelectedAnswers([]);
    setMarks([]);
  };

  const calculateTotalScore = () => {
    return marks.reduce((acc, curr) => acc + curr, 0);
  };

  return (
    <>
      {filteredQuizzes ? (
        <div className="m-5 bg-[#1A1C1E] rounded-lg border border-[#37383A]">
          <div className="flex items-center justify-between header-title">
            <h4>Quiz</h4>
            <h6 className="text-xl text-[#BDBEBE] font-[OpenSans]">
              <span className="text-2xl font-bold">{currentQuestion + 1}</span>{" "}
              / {filteredQuizzes.length}
            </h6>
          </div>

          <div className="p-8">
            {showScore ? (
              <div>
                <h2 className="text-xl mb-4 font-bold text-[#BDBEBE]">Quiz Results</h2>

                <h5 className="text-2xl mb-4 text-[#BDBEBE]">
                  Your Score: {calculateTotalScore()} out of{" "}
                  {filteredQuizzes.length}
                </h5>
                <div className="flex items-center justify-between w-full mt-4">
                  <button
                    onClick={handleRetakeQuiz}
                    className="bg-[#282B2F] hover:bg-[#5b52e7] hover:text-[#fff] hover:border-[#282B2F] border border-[#37383A] text-[#BDBEBE] text-sm  font-bold px-6 py-3 mr-2.5 rounded-[4px]"
                  
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-bold mb-4 text-[#BDBEBE]">
                  {filteredQuizzes[currentQuestion].question}
                </h4>
                <div className="flex flex-col gap-3 mb-9">
                  {filteredQuizzes[currentQuestion].answer_options.map(
                    (option, index) => (
                      <label
                        key={index}
                        className="bg-[#242728] p-3 rounded-[4px] text-white flex gap-3 items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          value={option}
                          checked={selectedAnswers[currentQuestion] === option}
                          onChange={handleOptionSelect}
                          className="hidden peer"
                        />
                        <div className="flex items-center justify-center w-5 h-5 border border-[#393C3D] rounded-full peer-checked:bg-[#5b52e7] peer-checked:bg-opacity-100">
                          <div className="w-2.5 h-2.5 bg-transparent rounded-full peer-checked:bg-[#5b52e7]"></div>
                        </div>
                        {option}
                      </label>
                    )
                  )}
                </div>

                <div className="flex">
                  {currentQuestion > 0 && (
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={showScore}
                      className="bg-[#282B2F] hover:bg-[#5b52e7] hover:text-[#fff] hover:border-[#282B2F] border border-[#37383A] text-[#BDBEBE] text-sm  font-bold px-6 py-3 mr-2.5 rounded-[4px]"
                    >
                      Previous
                    </button>
                  )}

                  <button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswers[currentQuestion] || showScore}
                    className="bg-[#282B2F] hover:bg-[#5b52e7] hover:text-[#fff] hover:border-[#282B2F] border border-[#37383A] text-[#BDBEBE] text-sm  font-bold px-6 py-3 mr-2.5 rounded-[4px]"
                  >
                    {currentQuestion === filteredQuizzes.length - 1
                      ? "Submit"
                      : "Next"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="m-5 p-5 text-white bg-[#1A1C1E] rounded-lg border border-[#37383A]">
          Quiz Not Found
        </div>
      )}
    </>
  );
};

export default Quiz;
