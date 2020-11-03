import React, { useState } from 'react';
import { QuestionCard } from './Components/QuestionCard';
import { fetchQuestions, Difficulty, QuestionState} from './API';
import { SelectCategory } from './SelectCategory';
import { GlobalStyle, Wrapper } from './App.styles';

const TOTAL_QUESTIONS = 10;

type answerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

function App() {
  const [ loading, setLoading ] = useState(false);
  const [ questions, setQuestions ] = useState<QuestionState[]>([]);
  const [ number, setNumber ] = useState(0);
  const [ gameOver, setGameOver ] = useState(true);
  const [ score, setScore ] = useState(0);
  const [ userAnswer, setUserAnswer ] = useState<answerObject[]>([]);
  const [ cat, setCat ] = useState('');

  const startQuiz = async() => {
    setLoading(true);
    setNumber(0);
    const newQuestions = await fetchQuestions(TOTAL_QUESTIONS, cat, Difficulty.EASY);
    setQuestions(newQuestions);
    setGameOver(false);
    setLoading(false);
    setScore(0);
    setUserAnswer([]);
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    } 
    else{
      setNumber(nextQuestion);
    }
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
    const answer = e.currentTarget.value;
    const correct = questions[number].correct_answer === answer;
    if(correct) setScore(prev => prev + 1);
    const answerObject = {
      question: questions[number].question,
      answer,
      correct,
      correctAnswer: questions[number].correct_answer,
    }
    setUserAnswer(prev => [...prev, answerObject]);

    }
  }

  const Category = (e: any) => {
    let x = e.target.value;
    setCat(x);
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div className="App">
          <h1>Quiz</h1>
          {gameOver?(
          <SelectCategory call={Category} />): null}
          {gameOver?(
          <button className="start" onClick={startQuiz}>Start Quiz</button>): null}
          {!gameOver?(
          <p className='score'>Score: {score}</p>): null}
          {loading?(
          <p>loading...</p>): null}
          {!gameOver?(
          <QuestionCard
            question= {questions[number].question}
            answers={questions[number].answers}
            callback={checkAnswer}
            userAnswer = {userAnswer? userAnswer[number]: undefined}
            questionNum={number}
            totalQuestions={TOTAL_QUESTIONS}
          />): null}
          {!gameOver && userAnswer.length === number + 1 && !loading && number !== TOTAL_QUESTIONS?(
          <button className='next' onClick={nextQuestion}>Next</button>): null}
        </div>
      </Wrapper>
    </>
  );
}

export default App;
