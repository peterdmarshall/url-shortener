import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './Loading';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'react-moment';
import moment from 'moment';

import Tippy from '@tippyjs/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Fa icon for loading spinner
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function MainPage() {

    const [link, setLink] = useState("");
    const [shortLink, setShortLink] = useState("");
    const [showShort, setShowShort] = useState(false);
    const [shortening, setShortening] = useState(false);
    const [expiryDate, setExpiryDate] = useState(null);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    // For copy
    const [copied, setCopied] = useState(false);

    const history = useHistory();

    const handleLinkChange = (e) => {
        setLink(e.target.value);
    }

    // Gets shortened URL from API
    const shortenLink = async (event) => {
        event.preventDefault();
        console.log(process.env.REACT_APP_MASTER_API_KEY);
        setShortening(true);

        // Check if user is authenticated
        if(isAuthenticated && user) {
            // Make API call using auth0 api key
            const token = await getAccessTokenSilently();

            const data = {
                "link": {
                    "url": link,
                    "expiry": expiryDate
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
            .catch((error) => {
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

    const setCopyState = () => {
        setCopied(true);
        setTimeout(
            () => setCopied(false),
            2000
        );
    }

    const toggleAdvancedOptions = () => {
        setShowAdvancedOptions(!showAdvancedOptions);
        if(expiryDate == null) {
            // Set default expiry to one week from now
            var oneWeek = moment().add(7, 'd').toDate();
            setExpiryDate(oneWeek);
        } else {
            // Close advanced options so no expiry
            setExpiryDate(null);
        }
    }

    return (
        <div class="bg-indigo-200">
            <div class="container flex flex-col h-screen overflow-y-hidden mx-auto space-y-40">
                <div class="flex flex-col flex-1 h-full">
                    <header class="flex-shrink-0 border-b">
                        <div class="flex items-center justify-between p-2 w-full">
                            <div class="flex items-center space-x-3">
                                <span onClick={() => history.push('/')} class="cursor-pointer p-2 text-xl font-semibold tracking-wider uppercase">Urlmin</span>
                            </div>
                            { !isAuthenticated &&
                                <LoginButton></LoginButton>
                            }
                            { isAuthenticated &&
                                <div class="flex flex-row items-center justify-center">
                                    <button className="text-white background-transparent font-bold px-4 py-2 outline-none hover:text-white focus:outline-none" 
                                            type="button" 
                                            style={{ transition: "all .15s ease" }}
                                            onClick={() => history.push('/')}
                                            disabled
                                    >
                                        Home
                                    </button>
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
                        <h1 class="lg:text-7xl md:text-6xl sm:text-4xl text-2xl text-center">
                            Shorter links get more clicks.
                        </h1>
                    </div>
                    { !showShort &&
                    <div class="flex flex-col items-center justify-center w-full mx-0 my-10">
                        <div class="shadow-xl bg-white max-w-3xl rounded-lg w-full">
                            <div class="flex flex-col items-center">
                                <h1 class="text-4xl font-bold font-black mb-4 mt-12">Shorten your link.</h1>
                                <form class="flex flex-col w-full" onSubmit={shortenLink}>
                                    <div class="flex flex-row w-full px-12">
                                        <input class="input border border-gray-400 appearance-none rounded w-full px-3 py-3 text-xl focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600" 
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
                                            type="submit"
                                        >
                                            Shorten
                                        </button>
                                        }
                                        { shortening &&
                                        <button
                                            class="bg-indigo-600 font-bold rounded py-3 px-5 mx-2 text-white"
                                            disabled
                                        >
                                            <span class="text-indigo-900 mx-auto">
                                                <FontAwesomeIcon icon={faCircleNotch} size='3x' spin/>
                                            </span>
                                        </button>
                                        }
                                    </div>
                                    { isAuthenticated && !showAdvancedOptions &&
                                    <span onClick={() => toggleAdvancedOptions(true)} class="cursor-pointer text-gray-400 mx-auto mt-10 mb-2">
                                        <FontAwesomeIcon icon={faChevronDown} size='2x'/>
                                    </span>
                                    }
                                    { isAuthenticated && showAdvancedOptions &&
                                    <div class="mx-auto mt-10 mb-2 flex flex-col items-center justify-center">
                                        <div class="flex items-center justify-end space-x-4">
                                            <p class="font-bold text-xl">Set Link Expiration</p>
                                            <div class="flex items-center justify-center my-2 rounded b">
                                                <DatePicker class="border border-gray-500" selected={expiryDate} onChange={date => setExpiryDate(date)} autoFocus/>
                                            </div>
                                        </div>
                                        <p class="text-sm text-gray-400">After this time your shortened link will no longer work.</p>
                                        
                                        <span onClick={() => toggleAdvancedOptions(false)} class="cursor-pointer text-gray-400 mx-auto">
                                            <FontAwesomeIcon icon={faChevronUp} size='2x'/>
                                        </span>
                                    </div>
                                    }
                                    { !isAuthenticated &&
                                    <div class="mx-auto mt-10 mb-2"></div>
                                    }
                                </form>
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
                                <input class="input border border-gray-400 text-gray-800 appearance-none rounded w-full px-3 py-3 text-2xl focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600" 
                                    id="link" 
                                    type="text" 
                                    placeholder="Shorten your link"
                                    readOnly
                                    value={shortLink}
                                />
                                
                                { !copied &&
                                <CopyToClipboard 
                                    text={shortLink}
                                >
                                    <Tippy content={<span class="shadow text-white bg-gray-400 rounded px-1 py-1">Copy Link</span>}>
                                        <span 
                                            class="cursor-pointer text-gray-400 px-1 py-3 font-bold hover:text-gray-800 hover:border-black-400 focus:outline-none ml-4"
                                            onClick={setCopyState}
                                        >   
                                            <FontAwesomeIcon icon={faCopy} size='2x'/>
                                        </span>
                                    </Tippy>
                                </CopyToClipboard>
                                }
                                { copied &&
                                <Tippy content={<span class="shadow text-white bg-gray-400 rounded px-1 py-1">Copied</span>}>
                                    <span 
                                        class="cursor-pointer text-green-400 px-1 py-3 font-bold hover:text-green-400 hover:border-black-400 focus:outline-none ml-4"
                                    >  
                                        <FontAwesomeIcon icon={faCheckCircle} size='2x'/>
                                    </span>
                                </Tippy>
                                }
                            </div>
                            <button class="bg-indigo-600 font-bold rounded py-3 px-3 mt-6 text-white"
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