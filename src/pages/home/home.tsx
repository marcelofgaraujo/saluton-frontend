import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { Country } from '../../types/country'
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
        <div className="homeBody">
            <h1 className='title'>Saluton</h1>
            {countries && countries.map((item, index) =>
                <Link key={index} to={`/${item.Name}`}>
                    <div className="countries">{item.Name}</div>
                </Link>
            )}
        </div>
    )
}

export default Home