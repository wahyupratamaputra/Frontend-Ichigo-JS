import React, { useState, useEffect } from 'react';
import axios from "axios";
import _ from "lodash";
import { formatConvertedDateToString } from "./helpers/datetime"

const App = ()=>{
  const [listCurrency, setListCurrency] = useState([])
  const [listCachedCurrency, setListCachedCurrency] = useState([])
  const [convertedCurrency, setConvertedCurrency] = useState(null)
  const [formData, setFormData] = useState({from: null, to: null})

  const isButtonConvertDisabled = (!formData.from || !formData.to)

  useEffect(()=>{
    fetchAllCurrencies()
  },[])

  const fetchAllCurrencies = ()=>{
    axios.get('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json')
    .then((response)=>{
      // convert all keys in object to array
      const convertObjectToArray = Object.entries(response.data).map(([value, name]) => ({value,name}));
      setListCurrency(convertObjectToArray)

    })
    .catch((error)=>{
      console.log(error);
    })
  }

  const handleSelectFrom = (value)=>{
    setFormData({...formData, from: value})
  }

  const handleSelectTo = (value)=>{
    setFormData({...formData, to: value})
  }

  const handleConvertCurrency = ()=>{
    // check the cache by key 'from' and 'to'
    const findInCache = _.find(listCachedCurrency, { 'from': formData.from, 'to': formData.to });

    // check if found in cache, set the found object to converted value
    if (findInCache) {
      setConvertedCurrency(findInCache)
    }else{
      axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${formData.from}/${formData.to}.json`)
      .then((response)=>{
        // added new key 'from' and 'to' for caching purpose
        let converted = response.data;
        converted.from = formData.from;
        converted.to = formData.to;
  
        setConvertedCurrency(converted)
  
  
        let listCached = [...listCachedCurrency];
        listCached.push(converted);
        setListCachedCurrency(listCached)
  
      })
      .catch((error)=>{
        console.log(error);
      })
    }
  }

  return (
    <div className="container">
      <h1 className="my-4">Currency Converter</h1>
      <div className="row">
        {
          listCurrency.length > 0 && 
          <div className="col-md-6 col-xs-12">
            <div className="mb-3 row">
              <label htmlFor="staticEmail" className="col-sm-2 col-form-label">From</label>
              <div className="col-sm-10">
                <select className="form-select" onChange={(e)=> handleSelectFrom(e.target.value)} defaultValue={0}>
                  <option value={0} disabled>Select Currency</option>
                  {listCurrency.map((element, index) => <option key={index} value={element.value}>{element.name}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="staticEmail" className="col-sm-2 col-form-label">To</label>
              <div className="col-sm-10">
              <select className="form-select" onChange={(e)=> handleSelectTo(e.target.value)} defaultValue={0}>
                  <option value={0} disabled>Select Currency</option>
                  {listCurrency.map((element, index) => <option key={index} value={element.value}>{element.name}</option>)}
                </select>
              </div>
            </div>
  
            <button type="button" className="btn btn-primary w-100" disabled={isButtonConvertDisabled} onClick={()=> handleConvertCurrency()}>Convert currency</button>
  
            { convertedCurrency &&
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">date: {formatConvertedDateToString(convertedCurrency.date)}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Convertion Price: {convertedCurrency[convertedCurrency.to]}</h6>
                </div>
              </div>
            }
            
          </div>
        }
      </div>
    </div>
  );
}

export default App;
