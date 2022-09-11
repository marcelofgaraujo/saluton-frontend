import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Country } from '../../types/country'
import { Greeting } from '../../types/greeting';
import { api } from '../../services/api';
import './style.css';
import { CountryComponent } from '../../shared/components/countryComponent/countryComponent';
import { GreetingsComponent } from '../../shared/components/greetingsComponent/greetingsComponent';

function CountryPage() {
    const [country, setCountry] = useState<Country>();
    const [greetings, setGreetings] = useState<Greeting[]>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [fullName, setFullName] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(false);
    const { name } = useParams<string>();
    const regEx = /[a-zA-Z\u00C0-\u00FF ]+/i;

    useEffect(() => {
        loadCountryInfo()
    }, [])

    const handleName = () => {

        if (!country) return console.error("This country don't exists! (I mean don't exists on my database yet, geographically it probably exists)")
        if (!fullName) return alert("Please give me a name!")

        let name = fullName.split(" ")
        while (name.includes("")) {
            let emptyIndex = name.findIndex(str => str === "")
            name.splice(emptyIndex, 1)
        }
        if (name.length === 0) return alert("Please give me a name!")

        for (let str of name) {
            if (!regEx.test(str)) return alert("Please insert a valid name!")
        }

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
            let newString = string
            .replace(/\[last name\]/g, capitalizeString(lastName!))
            .replace('[last name + _ or ov_]', `${capitalizeString(lastName!)}_ (or ${capitalizeString(lastName!)}ov_)`);
            return newString
        } else {
            let newString = string
            .replace(/\[first name\]/g, capitalizeString(firstName!))
            .replace(/\[last name\]/g, capitalizeString(lastName!));
            return newString
        }
    }

    const capitalizeString = (string: string): string => {
        
        if (!string) return string

        let newString = string[0].toUpperCase() + string.slice(1)
        return newString
    }

    const loadCountryInfo = async () => {

        setLoading(true)
        if (!name) return alert('INTERNAL SERVER ERROR 500')
        let response = await api.getCountryByName(name)
        setCountry(response)
        loadGreeting(response.Language)
    }

    const loadGreeting = async (lang: string) => {

        const langGreetings: string[] = lang.replace(/,/g, '').split(" ")
        const andIndex = langGreetings.findIndex(item => item === 'and')
        andIndex > -1 && langGreetings.splice(andIndex, 1)

        const ALL_GREETINGS = await api.getAllGreetings()

        let existentGreetings: Greeting[] = [];
        for (let language of langGreetings) {
            if (ALL_GREETINGS.some(item => item.Language === language)) {
                let fetchGreeting = await api.getGreetingByLang(language)
                existentGreetings.push(fetchGreeting)
            }
        }

        setGreetings(existentGreetings)
        setLoading(false)
    }

    return (

        loading ? <h3>ŝarĝo...</h3> :

            <div className='body'>

                <CountryComponent country={country && country} />

                {greetings && greetings.length < 1 ? <p>sorry, we can't find any greetings for this country :[ (yet...)</p> :
                    <>
                        <label htmlFor='name'>Name:</label>
                        <input name='name' onChange={(e) => setFullName(e.target.value)} placeholder='type first and/or last name' type={'text'} />
                        <button onClick={handleName}>Generate greetings</button>

                        {clicked &&
                            <>
                                {
                                    greetings && greetings.map((data, index) =>
                                    <GreetingsComponent key={index} data={data} replaceName={handleNameReplace} />
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