import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Quiz from './components/Quiz'
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'

function App() {
  
  const [appState, setAppState] = React.useState(1)
  const [questions, setQuestions] = React.useState([])
  const [correctCount, setCorrectCount] = React.useState(0)
  const [gameId, setGameId] = React.useState(nanoid())



  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then(res => res.json())
      .then(data => {
        const dataTrivia = data.results

        const triviaArray = dataTrivia.map((trivia) => {

          let triviaChoices = trivia.incorrect_answers.map(incorrect => {return {id: nanoid(), label: decode(incorrect), selected: false, color: ""} })
          const triviaAnswerArray = {id: nanoid(), label: decode(trivia.correct_answer), selected: false, color: ""}

          // Generating random number to randomly insert the answer into the choices array
          const randomNum = Math.floor(Math.random() * triviaChoices.length)
          
          triviaChoices.splice(randomNum, 0, triviaAnswerArray)


          return {
            id: nanoid(),
            question: decode(trivia.question),
            choices: triviaChoices,
            answer: triviaAnswerArray.id
          }
        })

        console.log(triviaArray)
        
        setQuestions(triviaArray)
      })
  }, [gameId])

  function handleAnswerChoice(questionId, answerId) {
    if(appState === 2) {
      setQuestions(prevQuestions => {
        return prevQuestions.map(prevQuestion => {
          if (prevQuestion.id === questionId) {
            const tempChoices = prevQuestion.choices.map(choice => {
              if (choice.id === answerId) {
                return { ...choice, selected: !choice.selected }
              } else {
                return { ...choice, selected: false }
              }
            })
            return {...prevQuestion, choices: tempChoices}
          } else {
            return {...prevQuestion}
          }
        })
      })

    }



    
  }

  function handleCheckAnswer() {

    const checkAnswer = questions.map(checkQuestion => {
      const tempAnswer = checkQuestion.choices.map(choice => {
        if (choice.id === checkQuestion.answer && choice.selected) {
          setCorrectCount(prevCount => prevCount = prevCount+1)
          return {...choice, color: "green"}
        } else if (choice.id !== checkQuestion.answer && choice.selected) {
          return {...choice, color: "red"}
        } else if (choice.id === checkQuestion.answer && !choice.selected) {
          return {...choice, color: "blue"}
        } else {
          return {...choice}
        }
        
      })



      return {...checkQuestion, choices: tempAnswer}
    })

    setQuestions(checkAnswer)
    setAppState(3)
  }


  function handlePlayAgain() {
    setGameId(nanoid())
    setAppState(2)
  }




  const questionElements = questions.map(q => {
    return (
      <Quiz 
        key={q.id} 
        questionId={q.id} 
        question={q.question} 
        choices={q.choices} 
        onClick={handleAnswerChoice} 
        color={q.color}
      />
    )
  })


  const buttonElements = appState === 2
    ?
      <button onClick={handleCheckAnswer}>Check Answers</button>
    :
      <button onClick={handlePlayAgain}>Play Again</button>

  return (
    <main>
      {appState === 1
      ? 
        <div className='intro-container'>
          <h1>Quizzical</h1>
          <button onClick={() => setAppState(2)}>Start Quiz</button>
        </div>
      :
        <div className='game-container'>
          <div className='question-container'>
            {questionElements}
          </div>
          
          <div className='button-container'>
            {appState === 3 && <p>You scored {correctCount}/{questions.length} correct answers</p>}
            {buttonElements}
          </div>
          
        </div>
        
      }
    </main>
  )
}

export default App
