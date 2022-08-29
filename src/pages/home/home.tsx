import axios from 'axios'
import { useState, useEffect } from 'react'
import { Country } from '../../types/country'
import { Link, useSearchParams } from 'react-router-dom'
import './style.css'

function Home() {
    const [countries, setCountries] = useState<Country[]>();
    // const [languageParams, setLanguageParams] = useSearchParams();

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const response = await axios.get<Country[]>(`http://localhost:3000/countries`)
        setCountries(response.data)
    }

    // const setLanguageFilter = (language: string) => {
    //     languageParams.set('language', language)
    //     setLanguageParams(languageParams)
    // }

    return (
        <div className="App">
            {countries && countries.map((item, index) =>
                <Link key={index} to={`/${item.Name}/${item.Language}`}>
                    <div /*onClick={() => setLanguageFilter(item.Language)}*/ className="countries">{item.Name}</div>
                </Link>
            )}
        </div>
    )
}

export default Home