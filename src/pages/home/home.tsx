import axios from 'axios'
import { useState, useEffect } from 'react'
import { Country } from '../../model/country'
import { Link } from 'react-router-dom'
import './style.css'

function Home() {
    const [countries, setCountries] = useState<Country[]>();

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const response = await axios.get<Country[]>(`http://localhost:3000/countries`)
        setCountries(response.data)
    }

    return (
        <div className="App">
            {countries && countries.map((item, index) =>
                <Link key={index} to={`${item.Name}`}>
                    <div className="countries">{item.Name}</div>
                </Link>
            )}
        </div>
    )
}

export default Home