// Components/CryptoList.js

'use client';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const CryptoTracker = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [inrToGbpRate, setInrToGbpRate] = useState(0); // Store the conversion rate

    useEffect(() => {
        const fetchConversionRate = async () => {
            try {
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR');
                setInrToGbpRate(response.data.rates.GBP); // Get INR to GBP rate
            } catch (error) {
                console.error('Error fetching conversion rate:', error);
            }
        };

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchConversionRate();  // Fetch conversion rate
        fetchData();  // Fetch crypto data
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter the data based on search query
    const filteredData = data.filter((crypto) => {
        return crypto.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <>
            <Navbar />
            <div className="container">
                <h1 className="my-4 text-success">Listings</h1>
                <input
                    type="text"
                    placeholder="Search crypto name"
                    className="form-control mb-4"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <table className="table">
                    <thead className="bg-dark">
                        <tr style={{fontSize:'0.7rem'}}>
                            <th className="bs-primary">Name</th>
                            <th className="bs-primary">Symbol</th>
                            <th className="bs-primary">Price (£)</th> {/* Changed to GBP */}
                            <th className="bs-primary">Market Cap (M £)</th> {/* Changed to Million GBP */}
                            <th className="bs-primary">1h change</th>
                            <th className="bs-primary">24h change</th>
                            <th className="bs-primary">7D Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((crypto) => (
                            <tr key={crypto.id}>
                                <td style={{fontSize:'0.7rem'}}>
                                    <img
                                        src={crypto.image}
                                        alt={crypto.name}
                                        className="rounded-circle mr-2"
                                        style={{ width: '30px', height: '30px' }}
                                    />

                                <Link 
                                    href={{
                                        pathname: `/crypto/${crypto.id}`,
                                        query: { inrToGbpRate: inrToGbpRate }  // Pass the conversion rate
                                    }}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit'
                                    }}>
                                    {crypto.name}
                                </Link>
                                </td>
                                <td style={{fontSize:'0.7rem'}}>{crypto.symbol.toUpperCase()}</td>
                                <td style={{fontSize:'0.7rem'}}>{(crypto.current_price * inrToGbpRate).toFixed(2)}</td> {/* Convert Price to GBP */}
                                <td style={{fontSize:'0.7rem'}}>{(crypto.market_cap * inrToGbpRate / 1_000_000).toFixed(0)}</td> {/* Convert Market Cap to Million GBP */}
                                <td style={{
                                    color: crypto.price_change_percentage_1h_in_currency < 0 ? 'red' : 'green',
                                    fontSize:'0.7rem'

                                }}>
                                    {Number(
                                        crypto.price_change_percentage_1h_in_currency
                                    ).toFixed(2)}</td>
                                <td style={{
                                    color: crypto.price_change_percentage_24h_in_currency < 0 ? 'red' : 'green',
                                    fontSize:'0.7rem'
                                }}>
                                    {Number(
                                        crypto.price_change_percentage_24h_in_currency
                                    ).toFixed(2)}</td>
                                <td style={{
                                    color: crypto.price_change_percentage_7d_in_currency < 0 ? 'red' : 'green',
                                    fontSize:'0.7rem'
                                }}>
                                    {Number(
                                        crypto.price_change_percentage_7d_in_currency
                                    ).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CryptoTracker;
