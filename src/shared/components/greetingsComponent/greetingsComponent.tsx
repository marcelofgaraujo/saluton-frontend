import { Greeting } from "../../../types/greeting";
import copy from "copy-to-clipboard";
import './style.css';

type Props = {
    data: Greeting,
    replaceName: (string: string) => string
}

const handleCopy = (string: string) => {
    copy(string)
    return alert('Greeting sucessfully copied to clipboard!')
}

export const GreetingsComponent = ({ data, replaceName }: Props) => {

    return (

        <div>
            <h2>{data.Language} greetings</h2>
            <ul className="list-greetings">
                <li>
                    <b>Men:</b> {replaceName(data.Greeting_Men)}
                    <div className="copy" onClick={() => handleCopy(replaceName(data.Greeting_Men))} title={'Copy to clipboard'} />
                </li>
                <li>
                    <b>Women:</b> {replaceName(data.Greeting_Women)}
                    <div className="copy" onClick={() => handleCopy(replaceName(data.Greeting_Women))} title={'Copy to clipboard'} />
                </li>
                <li>
                    <b>Dear Sir or Madam:</b> {replaceName(data.Dear_Sir_or_Madam)}
                    <div className="copy" onClick={() => handleCopy(replaceName(data.Dear_Sir_or_Madam))} title={'Copy to clipboard'} />
                </li>
            </ul>
        </div>

    )
}