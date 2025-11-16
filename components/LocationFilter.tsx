// "use client"
// import React from 'react'
// import Container from './Container'
// import { Select, SelectItem } from './ui/select'
// //import { SelectContent, SelectTrigger, SelectValue } from '@radix-ui/react-select'
// import useLocation from '@/hooks/useLocation'
// import { SelectTrigger, SelectValue, SelectContent } from './ui/select'
// import { ICity, IState } from 'country-state-city'
// import { useRouter, useSearchParams } from 'next/navigation'
// import qs from "query-string"
// import { Button } from './ui/button'
// const LocationFilter = () => {
//     const [country, setCountry] = React.useState("")
//     const [state, setState] = React.useState("")
//     const [city, setCity] = React.useState("")
//     const [states, setStates] = React.useState<IState[]>([])
//     const [cities, setCities] = React.useState<ICity[]>([])
//     const {getAllCountries, getCountryStates, getStateCities} = useLocation();
//     const countries = getAllCountries()
//     const router = useRouter()
//     const params = useSearchParams()
//     //const state = getCountryStates()


//     React.useEffect(()=>{
//         const countryStates = getCountryStates(country)
//         if(countryStates){
//             setStates(countryStates)
//             setState("")
//             setCity("")
//         }
//     }, [country])

//     React.useEffect(()=>{
//         const stateCities = getStateCities(country, state)
//         if(stateCities){
//             setCities(stateCities)
//             //setState("")
//             setCity("")
//         }
//     }, [country, state])

//     React.useEffect(()=>{
//         if(country === "" && state === "" && city === "") return router.push("/")
//             let currentQuery: any ={}
//         if(params){
//             currentQuery = qs.parse(params.toString())
//         }
//         if(country){
//             currentQuery = {
//                 ...currentQuery,
//                 country
//             }
//         }
//         if(state){
//             currentQuery = {
//                 ...currentQuery,
//                 state
//             }
//         }
//         if(city){
//             currentQuery = {
//                 ...currentQuery,
//                 city
//             }
//         }

//         if(state === "" && currentQuery.state){
//             delete currentQuery.state
//         }

//         if(city === "" && currentQuery.city){
//             delete currentQuery.city
//         }

//         const url = qs.stringifyUrl({
//             url: "/",
//             query: currentQuery
//         }, {skipNull: true, skipEmptyString: true})
//         router.push(url)
//     }, [country, state, city])

//     const handleClear=()=>{
//         router.push("/")
//         setCountry("")
//         setState("")
//         setCity("")
//     }

//   return (
//     <Container>
//         <div className='flex gap-2 md:gap-4 items-center justify-center text-sm'>
//             <div>
//                 <Select value={country} onValueChange={(value)=> setCountry(value)}>
//                     <SelectTrigger className='bg-background'>
//                         <SelectValue placeholder="Country"/>
//                     </SelectTrigger>
//                     <SelectContent>
//                         {countries.map((country)=>(
//                             <SelectItem key={country.isoCode} value={country.isoCode}>
//                                 {country.name}    
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             </div>
//             <div>
//                 <Select value={state} onValueChange={(value)=> setState(value)}>
//                     <SelectTrigger className='bg-background'>
//                         <SelectValue placeholder="States"/>
//                     </SelectTrigger>
//                     <SelectContent>
//                         {state.length && states.map((state)=>(
//                             <SelectItem key={state.isoCode} value={state.isoCode}>
//                                 {state.name}    
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             </div>
//             <div>
//                 <Select value={city} onValueChange={(value)=> setCity(value)}>
//                     <SelectTrigger className='bg-background'>
//                         <SelectValue placeholder="City"/>
//                     </SelectTrigger>
//                     <SelectContent>
//                         {cities.length && cities.map((city)=>(
//                             <SelectItem key={city.name} value={city.name}>
//                                 {city.name}    
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             </div>
//             <Button onClick={()=> handleClear()} variant="outline">Clear Filters</Button>
//         </div>
//     </Container>
//   )
// }

// export default LocationFilter


"use client";

import React from "react";
import Container from "./Container";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "./ui/select";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "./ui/button";

const LocationFilter = () => {
  const [country, setCountry] = React.useState("");
  const [stateCode, setStateCode] = React.useState("");
  const [city, setCity] = React.useState("");

  const [states, setStates] = React.useState<IState[]>([]);
  const [cities, setCities] = React.useState<ICity[]>([]);

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();

  const countries = getAllCountries();

  const router = useRouter();
  const params = useSearchParams();

  // Load states when country changes
  React.useEffect(() => {
    if (!country) {
      setStates([]);
      setStateCode("");
      setCity("");
      return;
    }

    const countryStates = getCountryStates(country);
    setStates(countryStates || []);
    setStateCode("");
    setCity("");
  }, [country]);

  // Load cities when state changes
  React.useEffect(() => {
    if (!stateCode) {
      setCities([]);
      setCity("");
      return;
    }

    const result = getStateCities(country, stateCode);
    setCities(result || []);
    setCity("");
  }, [stateCode, country]);

  // Sync URL with selected values
  React.useEffect(() => {
    if (!params) return;

    let currentQuery: any = qs.parse(params.toString());

    if (country) currentQuery.country = country;
    else delete currentQuery.country;

    if (stateCode) currentQuery.state = stateCode;
    else delete currentQuery.state;

    if (city) currentQuery.city = city;
    else delete currentQuery.city;

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: currentQuery,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [country, stateCode, city]);

  const handleClear = () => {
    router.push("/");
    setCountry("");
    setStateCode("");
    setCity("");
    setStates([]);
    setCities([]);
  };

  return (
    <Container>
      <div className="flex gap-2 md:gap-4 items-center justify-center text-sm">
        
        {/* Country */}
        <Select value={country} onValueChange={(value) => setCountry(value)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.isoCode} value={c.isoCode}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* States */}
        <Select value={stateCode} onValueChange={(value) => setStateCode(value)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {states.length > 0 &&
              states.map((st) => (
                <SelectItem key={st.isoCode} value={st.isoCode}>
                  {st.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Cities */}
        <Select value={city} onValueChange={(value) => setCity(value)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            {cities.length > 0 &&
              cities.map((ct) => (
                <SelectItem key={ct.name} value={ct.name}>
                  {ct.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Button onClick={handleClear} variant="outline">
          Clear Filters
        </Button>
      </div>
    </Container>
  );
};

export default LocationFilter;
