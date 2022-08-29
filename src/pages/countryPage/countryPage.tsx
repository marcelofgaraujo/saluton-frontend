import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { Country } from '../../types/country'
import { Greeting } from '../../types/greeting';
import axios from 'axios';
import './style.css';

function CountryPage() {
    const [country, setCountry] = useState<Country>();
    const [greetings, setGreetings] = useState<Greeting[]>();
    const [allGreetings, setAllGreetings] = useState<Greeting[]>();
    // const [languageParams, setLanguageParams] = useSearchParams();
    const { Name, Language } = useParams<string>();

    useEffect(() => {
        loadCountryInfo(), getAllGreetings() /*loadGreeting()*/
    }, [])

    // const getLanguageFilter = () => {
    //     languageParams.get('language')
    //     setLanguageParams(languageParams)
    //     console.log(languageParams)
    // }

    const loadCountryInfo = async () => {
        const countryResponse = await axios.get<Country>(`http://localhost:3000/countryquery/${Name}`)
        setCountry(countryResponse.data)
    }

    const getAllGreetings = async () => {
        const fetchAllGreetings = await axios.get<Greeting[]>(`http://localhost:3000/greetings`)
        setAllGreetings(fetchAllGreetings.data)
        loadGreeting();
    }

    const loadGreeting = async () => {

        if (!Language) return console.error('foi possivel nao boy')
        const langGreetings = Language.replace(/,/g, '').split(" ")
        if (!langGreetings) return console.error('foi possivel nao boy')
        const andIndex = langGreetings.findIndex(item => item === 'and')
        andIndex > -1 && langGreetings.splice(andIndex, 1)

        console.log(langGreetings)

        let existentGreetings: string[] = []
        if (!allGreetings) return console.error('deu nao boy')
        allGreetings.forEach(item => existentGreetings.push(item.Language))
        console.log(existentGreetings)

        let fetchGreetings: Greeting[] = [];
        for (let language of langGreetings) {
            let mockGreeting = await axios.get<Greeting>(`http://localhost:3000/greetingquery/${language}`);
            //to-do: FETCH EM TODOS OS GREETINGS E DEPOIS FILTRAR GREETINGS EXISTENTES
        }
        setGreetings(fetchGreetings)
    }

    return (
        <div className='body'>
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

export default CountryPage