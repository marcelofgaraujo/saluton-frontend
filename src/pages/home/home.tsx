import { useState, useEffect, useContext } from 'react'
import { Country } from '../../types/country'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import './style.css'

function Home() {
    const [countries, setCountries] = useState<Country[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        let response = await api.getAllCountries()
        setCountries(response)
        setLoading(false)
    }

    return (
        
        loading ? <h3>ŝarĝo...</h3> :
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