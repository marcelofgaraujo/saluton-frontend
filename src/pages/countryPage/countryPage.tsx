import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Country } from '../../types/country'
import { Greeting } from '../../types/greeting';
import axios from 'axios';
import './style.css';

function CountryPage() {
    const [country, setCountry] = useState<Country>();
    const [greetings, setGreetings] = useState<Greeting[]>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [fullName, setFullName] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(false);
    const { name } = useParams<string>();

    useEffect(() => {
        loadCountryInfo()
    }, [])

    const handleName = () => {
        if (!country) return console.error("this country don't exists! (i mean don't exists on my database yet, geographically it probably exists)")
        if (!fullName) return alert("please give me a name!")
        let name = fullName.split(" ")
        const emptyStringIndex = name.findIndex(str => str === "")
        emptyStringIndex > -1 && name.splice(emptyStringIndex, 1)
        const emptyString = name.includes("")
        if (emptyString) return alert("please give me a name!")
        if (name.length === 1) {
            country.First_or_last_name === 'First' ? setFirstName(name[0]) : setLastName(name[0])
        } else {
            setFirstName(name[0])
            setLastName(name[name.length - 1])
        }
        setClicked(true)
    }

    const handleNameReplace = (string: string): string => {
        if (!firstName && !lastName) return string
        if (country?.Name === 'Czech Republic') {
            let newString = string.replace(/\[last name\]/g, lastName!).replace('[last name + _ or ov_]', `${lastName!}_ (or ${lastName!}ov_)`);
            return newString
        } else {
            let newString = string.replace(/\[first name\]/g, firstName!).replace(/\[last name\]/g, lastName!);
            return newString
        }
    }

    const loadCountryInfo = async () => {
        setLoading(true)
        const countryResponse = await axios.get<Country>(`http://localhost:3000/countryquery/${name}`)
        setCountry(countryResponse.data)
        loadGreeting(countryResponse.data.Language)
    }

    const loadGreeting = async (lang: string) => {
        // tratamento de dados - array de linguagens do país
        const langGreetings: string[] = lang.replace(/,/g, '').split(" ")
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
                        <input name='name' onChange={(e) => setFullName(e.target.value)} placeholder='type first and/or last name' type={'text'} />
                        <button onClick={handleName}>Generate greetings</button>
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