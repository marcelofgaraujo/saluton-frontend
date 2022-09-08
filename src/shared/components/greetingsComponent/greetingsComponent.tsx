import { Greeting } from "../../../types/greeting"
import './style.css'

type Props = {
    data: Greeting,
    replaceName: (string: string) => string
}

export const GreetingsComponent = ({data, replaceName}: Props) => {

    return (
        <div>
            <h2>{data.Language} greetings</h2>
            <ul>
                <li><b>Men:</b> {replaceName(data.Greeting_Men)}</li>
                <li><b>Women:</b> {replaceName(data.Greeting_Women)}</li>
                <li><b>Dear Sir or Madam:</b> {replaceName(data.Dear_Sir_or_Madam)}</li>
            </ul>
        </div>
    )
}