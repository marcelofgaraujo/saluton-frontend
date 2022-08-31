import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { Country } from '../../types/country'
import { Greeting } from '../../types/greeting';
import axios from 'axios';
import './style.css';

function CountryPage() {
    const [country, setCountry] = useState<Country>();
    const [greetings, setGreetings] = useState<Greeting[]>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [clicked, setClicked] = useState<boolean>(false);

    // const [languageParams, setLanguageParams] = useSearchParams();

    const { Name, Language } = useParams<string>();

    useEffect(() => {
        loadCountryInfo(), loadGreeting()
    }, [])
    
    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        let name = e.target.value.split(" ")
        setFirstName(name[0])
        name.length > 1 && setLastName(name[1])
    }

    const handleNameReplace = (string: string) => {
        string.replace('[first name]', firstName!)
        lastName && string.replace('[last name]', lastName)
        return string
    }

    // const getLanguageFilter = () => {
    //     languageParams.get('language')
    //     setLanguageParams(languageParams)
    //     console.log(languageParams)
    // }

    const loadCountryInfo = async () => {
        const countryResponse = await axios.get<Country>(`http://localhost:3000/countryquery/${Name}`)
        setCountry(countryResponse.data)
    }

    const loadGreeting = async () => {
        // tratamento de dados - array de linguagens do país
        if (!Language) return console.error('foi possivel nao boy')
        const langGreetings = Language.replace(/,/g, '').split(" ")
        if (!langGreetings) return console.error('foi possivel nao boy')
        const andIndex = langGreetings.findIndex(item => item === 'and')
        andIndex > -1 && langGreetings.splice(andIndex, 1)

        // get em todos os greetings existentes
        const ALL_GREETINGS = (await axios.get<Greeting[]>(`http://localhost:3000/greetings`)).data

        // comparaçao entre as linguages do país e as linguagens de greetings existentes, dando get nos que existem
        let existentGreetings: Greeting[] = [];
        for (let language of langGreetings) {
            if (ALL_GREETINGS.some((item) => item.Language === language)) {
                let fetchGreeting = await axios.get<Greeting>(`http://localhost:3000/greetingquery/${language}`);
                existentGreetings.push(fetchGreeting.data)
            }
        }
        setGreetings(existentGreetings)
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
            {greetings && greetings.length < 1 ? <p>sorry, we don't find greetings for this country :[ (yet...)</p> :
                <>
                    <label htmlFor='name'>Name:</label>
                    <input name='name' onChange={(e) => handleName(e)} placeholder='type first and last name' type={'text'} />
                    <button onClick={() => setClicked(true)}>Generate greetings</button>
                    {clicked && 
                        <>
                            {
                                greetings && greetings.map((item, index) => {
                                    <div key={index}>
                                        <li><b>Language:</b> {item.Language}</li>
                                        <li><b>Men:</b> {handleNameReplace(item.Greeting_Men)}</li>
                                        <li><b>Women:</b> {handleNameReplace(item.Greeting_Women)}</li>
                                        <li><b>Dear Sir or Madam:</b> {handleNameReplace(item.Dear_Sir_or_Madam)}</li>
                                    </div>
                                })
                            }
                        </>}
                </>}
        </div>
    )
}

export default CountryPage