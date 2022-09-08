import axios from "axios";
import { Country } from "../types/country";
import { Greeting } from "../types/greeting";

const http = axios.create({ baseURL: 'http://localhost:3000' });

export const api = {

    getAllCountries: async () => {
        let response = await http.get<Country[]>('/countries')
        return response.data
    },

    getCountryByName: async (name: string) => {
        let response = await http.get<Country>(`/countryquery/${name}`)
        return response.data
    },

    getAllGreetings: async () => {
        let response = await http.get<Greeting[]>('/greetings')
        return response.data
    },

    getGreetingByLang: async (lang: string) => {
        let response = await http.get<Greeting>(`/greetingquery/${lang}`)
        return response.data
    }

}