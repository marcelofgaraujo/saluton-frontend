import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Country } from '../../types/country'
import { Greeting } from '../../types/greeting';
import axios from 'axios';
import './style.css';

function CountryPage() {
    const [country, setCountry] = useState<Country>();
    const [greetings, setGreetings] = useState<Greeting[]>();
    const [firstName, setFirstName] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [lastName, setLastName] = useState<string>();
    const [clicked, setClicked] = useState<boolean>(false);
    const { name } = useParams<string>();

    useEffect(() => {
        loadCountryInfo()
    }, [])

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        //to-do: condiçao para ajustar nome de acordo com caracteristica do país (first or last name)
        let name = e.target.value.split(" ")
        setFirstName(name[0])
        name.length > 1 && setLastName(name[1])
    }

    const handleNameReplace = (string: string): string => {
        if (firstName && lastName) {
            let newString = string.replace(/\[first name\]/g, firstName).replace(/\[last name\]/g, lastName);
            return newString
        } else return string
    }

    const handleClick = () => {
        setClicked(true)
    }

    const loadCountryInfo = async () => {
        setLoading(true)
        const countryResponse = await axios.get<Country>(`http://localhost:3000/countryquery/${name}`)
        setCountry(countryResponse.data)
        loadGreeting(countryResponse.data.Language)
    }

    const loadGreeting = async (lang: string) => {
        // tratamento de dados - array de linguagens do país
        if (!lang) return console.error('foi possivel nao boy')
        const langGreetings: string[] = lang.replace(/,/g, '').split(" ")
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
        setLoading(false)
    }

    return (
        loading ? <h3>ŝarĝo...</h3> :
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
                {greetings && greetings.length < 1 ? <p>sorry, we can't find any greetings for this country :[ (yet...)</p> :
                    <>
                        <label htmlFor='name'>Name:</label>
                        <input name='name' onChange={(e) => handleName(e)} placeholder='type first and/or last name' type={'text'} />
                        <button onClick={handleClick}>Generate greetings</button>
                        {clicked &&
                            <>
                                {
                                    greetings && greetings.map((item, index) =>
                                        <div key={index}>
                                            <h2>{item.Language} greetings</h2>
                                            <ul>
                                                <li><b>Men:</b> {handleNameReplace(item.Greeting_Men)}</li>
                                                <li><b>Women:</b> {handleNameReplace(item.Greeting_Women)}</li>
                                                <li><b>Dear Sir or Madam:</b> {handleNameReplace(item.Dear_Sir_or_Madam)}</li>
                                            </ul>
                                        </div>
                                    )
                                }
                            </>
                        }
                    </>
                }
            </div>
    )
}

export default CountryPage