import { Country } from "../../../types/country"
import './style.css'

type Props = {
    country?: Country
}

export const CountryComponent = ({country}: Props) => {

    return (
        <div>
            <h1>{country && country.Name}</h1>
            <ul>
                <li><b>Language:</b> {country && country.Language}</li>
                <li><b>Percent of population who speaks english:</b> {country && country.Percent_Speak_English}</li>
                <li><b>First or last name:</b> {country && country.First_or_last_name}</li>
                <li><b>Formal or informal:</b> {country && country.Formal_or_informal}</li>
                <li><b>Punctuality:</b> {country && country.Punctuality}</li>
                <li><b>Time Zone:</b> {country && country.Time_Zone}</li>
                <li><b>Cultural aspects:</b> {country && country.Insights_into_cultural_aspects}</li>
            </ul>
        </div>
    )
}