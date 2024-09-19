import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const CryptoDetails = () => {
    const router = useRouter();
    const { id } = router.query; // Dynamic route parameter for crypto id
    const [cryptoData, setCryptoData] = useState(null);
    const [inrToGbpRate, setInrToGbpRate] = useState(0); // Store the conversion rate

    useEffect(() => {
        const fetchConversionRate = async () => {
            try {
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR');
                setInrToGbpRate(response.data.rates.GBP); // INR to GBP conversion rate
            } catch (error) {
                console.error('Error fetching conversion rate:', error);
            }
        };

        const fetchData = async () => {
            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
                setCryptoData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (id) {
            fetchConversionRate();
            fetchData();
        }
    }, [id]);

    if (!cryptoData || inrToGbpRate === 0) {
        return <div className="container">Loading...</div>;
    }

    // Extract description up to the first period (.)
    const description = cryptoData.description.en.split('.')[0];

    // Helper function to format large numbers with commas
    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5 d-flex justify-content-center">
                
                <div style={{backgroundColor:'pink'}} className="card">
                <Link style={{textAlign:'center'}} href='/'>Home</Link>
                    <img src={cryptoData.image.small}
                        className="card-img-top img-fluid" alt={`${cryptoData.name} logo`}
                        style={{ maxWidth: '200px', width: '70px', height: '70px', marginLeft:'20px' }} />
                    <div className="card-body">
                        <h1 className="card-title">{cryptoData.name}</h1>
                        <h5 className="card-text">{description}</h5>
                        <p className="card-text">
                            <b>Symbol:</b> {cryptoData.symbol.toUpperCase()}
                        </p>
                        <p className="card-text">
                            <b>Rank:</b> {cryptoData.market_cap_rank}
                        </p>
                        <p className="card-text">
                            <b>Market Cap - <span 
                                style={{fontStyle:'italic', fontSize:'0.8rem', fontWeight:'lighter'}}>
                                    The total market value of all coins currently in circulation, calculated as current price multiplied by circulating supply. 
                                    For {cryptoData.symbol.toUpperCase()}, it is  
                                </span> </b> 
                                <span style={{color:'blue'}}>
                                    £{(cryptoData.market_data.market_cap.inr * inrToGbpRate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </p>

                        <p className="card-text">
                            <b>Current Price - <span 
                                style={{fontStyle:'italic', fontSize:'0.8rem', fontWeight:'lighter'}}>
                                    The most recent price of a single unit of the cryptocurrency. {cryptoData.symbol.toUpperCase()} is currently valued at 
                                </span> </b><span style={{color:'blue'}}>
                                    £{(cryptoData.market_data.current_price.inr * inrToGbpRate).toFixed(2)}</span>
                        </p>

                        <p className="card-text">
                            <b>Total Supply - <span 
                            style={{fontStyle:'italic', fontSize:'0.8rem', fontWeight:'lighter'}}>
                                The total number of coins or tokens that will ever be created or are currently in existence. {cryptoData.symbol.toUpperCase()} has a maximum supply of  
                                 <span style={{fontSize:'1rem', color:'blue'}}> {(cryptoData.market_data.total_supply).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </span> tokens.
                                </span> </b> 
                        </p>

                        <p className="card-text">
                            <b>% Market Cap Change - <span style={{fontStyle:'italic', fontSize:'0.8rem', fontWeight:'lighter'}}>
                                The percentage change in the total market capitalization of the cryptocurrency over the past 24 hours. {cryptoData.symbol.toUpperCase()} market cap has moved by <span style={{fontSize:'1rem', color:'blue'}}>{cryptoData.market_data.market_cap_change_percentage_24h.toFixed(2)}%</span> in the last day.
                            </span></b> 
                        </p>
                        <p className="card-text">
                            <b>High (24h) - <span style={{fontStyle:'italic', fontSize:'0.8rem', fontWeight:'lighter'}}>The highest price of the cryptocurrency in the past 24 hours. {cryptoData.symbol.toUpperCase()} reached a maximum of <span style={{fontSize:'1rem', color:'blue'}} > £{(cryptoData.market_data.high_24h.inr * inrToGbpRate).toFixed(2)}</span> in the last 24 hours.
                            </span></b> 
                        </p>
                        <p className="card-text">
                            <b>Low (24h) - <span style={{fontStyle:'italic', fontSize:'0.8rem', fontWeight:'lighter'}}>The most recent price of a single unit of the cryptocurrency. XRP is currently valued at 
                            </span></b> {(cryptoData.market_data.low_24h.inr * inrToGbpRate).toFixed(2)}
                        </p>
                        <p className="card-text">
                        <b>Total Volume - <span style={{fontStyle:'italic', fontSize:'0.8rem', fontWeight:'lighter'}}>The most recent price of a single unit of the cryptocurrency. XRP is currently valued at 
                        </span></b> {(cryptoData.market_data.total_volume.inr * inrToGbpRate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="card-text">
                            <b>Circulating Supply - <span style={{fontStyle:'italic', fontSize:'0.8rem', fontWeight:'lighter'}}>The most recent price of a single unit of the cryptocurrency. XRP is currently valued at 
                            </span></b> {(cryptoData.market_data.circulating_supply).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CryptoDetails;
