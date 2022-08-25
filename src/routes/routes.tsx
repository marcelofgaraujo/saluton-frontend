import { useRoutes } from "react-router-dom";
import Home from '../pages/home/home'
import CountryPage from '../pages/countryPage/countryPage'

export const RouteList = () => {
    return useRoutes([
        {path:'/', element:<Home/>},
        {path:'/:Name/:Language', element: <CountryPage/>}
    ])
}