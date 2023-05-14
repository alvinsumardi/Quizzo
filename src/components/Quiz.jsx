export default function Quiz(props) {

    const buttonElements = props.choices.map(choice => {
        const buttonClasses = `button-small ${choice.selected && " selected"} ${choice.color === "green" && " green"} ${choice.color === "red" && " red"} ${choice.color === "blue" && " blue"}`
        return <button key={choice.id} className={buttonClasses} id={choice.id} onClick={() => props.onClick(props.questionId, choice.id)}>{choice.label}</button>
    })


    return (
        <div>
            <article className='question-group'>
                <h2>{props.question}</h2>
                <div className="button-group">
                    {buttonElements}
                </div>
            </article>
        </div>
    )
}