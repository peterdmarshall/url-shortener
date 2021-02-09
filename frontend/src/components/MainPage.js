import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './Loading';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import { DatePicker } from 'react-datepicker';
import { useHistory } from 'react-router-dom';

// Fa icon for loading spinner
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';


export default function MainPage() {

    const [link, setLink] = useState("");
    const [shortLink, setShortLink] = useState("");
    const [showShort, setShowShort] = useState(false);
    const [shortening, setShortening] = useState(false);
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const history = useHistory();

    const handleLinkChange = (e) => {
        setLink(e.target.value);
    }

    // Gets shortened URL from API
    const shortenLink = async () => {
        console.log(process.env.REACT_APP_MASTER_API_KEY);
        setShortening(true);

        // Check if user is authenticated
        if(isAuthenticated && user) {
            // Make API call using auth0 api key
            const token = await getAccessTokenSilently();

            const data = {
                "link": {
                    "url": link
                }
            }

            axios.post(process.env.REACT_APP_API_URL + '/api/v1/links', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response);
                setShortLink(window.location.protocol + '//' + window.location.hostname + '/' + response.data.short_url);
                setShowShort(true);
                setShortening(false);
            })
            .then((error) => {
                console.log(error);
                setShortening(false);
            })
        } else {
            // If not authenticated, use master api key
            const MASTER_API_KEY = process.env.REACT_APP_MASTER_API_KEY;

            const data = {
                "link": {
                    "url": link
                }
            }

            axios.post(process.env.REACT_APP_API_URL + '/api/v1/links', data, {
                headers: {
                    Authorization: MASTER_API_KEY
                }
            })
            .then((response) => {
                console.log(response);
                setShortLink(window.location.protocol + '//' + window.location.hostname + '/' + response.data.short_url);
                setShowShort(true);
                setShortening(false);
            })
            .then((error) => {
                console.log(error);
                setShortening(false);
            })
        }
    }

    // Resets the URL input form
    const resetForm = () => {
        // Reset short link
        setShortLink("")
        // Reset link
        setLink("")
        // Switch to url input
        setShowShort(false)
    }

    // Copies the link to user clipboard
    const copyLink = () => {

    }

    return (
        <div class="bg-indigo-200">
            <div class="container flex flex-col h-screen overflow-y-hidden mx-auto space-y-40">
                <div class="flex flex-col flex-1 h-full">
                    <header class="flex-shrink-0 border-b">
                        <div class="flex items-center justify-between p-2 w-full">
                            <div class="flex items-center space-x-3">
                                <span class="p-2 text-xl font-semibold tracking-wider uppercase">Urlmin</span>
                            </div>
                            { !isAuthenticated &&
                                <LoginButton></LoginButton>
                            }
                            { isAuthenticated &&
                                <div class="flex flex-row items-center justify-center">
                                    <button className="text-indigo-600 background-transparent font-bold px-4 py-2 outline-none hover:text-white focus:outline-none" 
                                            type="button" 
                                            style={{ transition: "all .15s ease" }}
                                            onClick={() => history.push('/analytics')}
                                    >
                                        Analytics
                                    </button>
                                    <button className="text-indigo-600 background-transparent font-bold px-4 py-2 mr-2 outline-none hover:text-white focus:outline-none" 
                                            type="button" 
                                            style={{ transition: "all .15s ease" }}
                                            onClick={() => history.push('/settings')}
                                    >
                                        Settings
                                    </button>
                                    <LogoutButton></LogoutButton>
                                </div>
                            }
                        </div>
                    </header>
                </div>
                <div class="flex flex-col items-center h-screen justify-start space-y-40">
                    <div class="flex flex-col items-center justify-center w-full mt-10">
                        <h1 class="lg:text-7xl md:text-5xl text-3xl text-center">
                            Shorter links get more clicks.
                        </h1>
                    </div>
                    { !showShort &&
                    <div class="flex flex-col items-center justify-center w-full mx-0 my-10">
                        <div class="shadow-xl p-12 bg-white max-w-xl rounded-lg w-full">
                            <div class="flex flex-col items-center">
                                <h1 class="text-4xl font-bold font-black mb-4">Shorten your link.</h1>
                                <div class="flex">
                                    <input class="input border border-gray-400 appearance-none rounded w-full px-3 py-3 pt-5 pb-2 text-xl focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600" 
                                        id="link" 
                                        type="text" 
                                        placeholder="Paste link here" 
                                        value={link}
                                        onChange={handleLinkChange}
                                        autoFocus 
                                    />
                                    { !shortening &&
                                    <button
                                        class="bg-indigo-600 font-bold rounded py-3 px-5 mx-2 text-white"
                                        onClick={shortenLink}
                                    >
                                        Shorten
                                    </button>
                                    }
                                    { shortening &&
                                    <button
                                        class="bg-indigo-600 font-bold rounded py-3 px-5 mx-2 text-white"
                                        onClick={shortenLink}
                                        disabled
                                    >
                                        <span class="text-indigo-900 mx-auto">
                                            <FontAwesomeIcon icon={faCircleNotch} size='3x' spin/>
                                        </span>
                                    </button>
                                    }
                                </div>
                            </div>
                        </div>
                        { !isAuthenticated &&
                        <div>
                            <p class="text-xl my-3 mx-3">Log in to access more features and analytics</p>
                        </div>
                        }
                    </div>
                    }
                    { showShort &&
                    <div class="flex flex-col items-center justify-center w-full mx-0 my-10">
                        <div class="flex flex-col shadow-xl p-12 bg-white max-w-xl rounded-lg w-full">
                            <div class="flex">
                                <input class="input border border-gray-400 text-gray-500 appearance-none rounded w-full px-3 py-3 pt-5 pb-2 text-xl focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600" 
                                    id="link" 
                                    type="text" 
                                    placeholder="Shorten your link" 
                                    value={shortLink}
                                    disabled
                                />
                                <button
                                    class="bg-indigo-600 font-bold rounded py-3 px-5 mx-2 text-white"
                                    onClick={copyLink}
                                >
                                    Copy
                                </button>
                            </div>
                            <button class="bg-indigo-600 font-bold rounded py-3 px-5 mx-2 mt-6 text-white"
                                    onClick={resetForm}
                            >
                                Shorten Another
                            </button>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}