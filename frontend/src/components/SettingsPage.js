import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './Loading';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

// Fa icon for loading spinner
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import Tippy from '@tippyjs/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';


export default function SettingsPage() {

    const { user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
    const [apiKey, setApiKey] = useState("");
    const [generating, setGenerating] = useState(false);
    const [deletingLinks, setDeletingLinks] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [copied, setCopied] = useState(false);

    // Get user API_KEY
    useEffect(() => {
        (async () => {
            const token = await getAccessTokenSilently();

            // Request list of user links from server
            axios.get(process.env.REACT_APP_API_URL + '/api/v1/user/api_key', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response)
                setApiKey(response.data.api_key)
            })
            .then((error) => {
                console.log(error);
            })
        })();
    }, [user]);

    const generateApiKey = async () => {
        setGenerating(true);

        // Check if user is authenticated
        if(isAuthenticated && user) {
            // Make API call using auth0 api key
            const token = await getAccessTokenSilently();

            axios.post(process.env.REACT_APP_API_URL + '/api/v1/user/api_key', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response);
                setApiKey(response.data.api_key);
                setGenerating(false);
            })
            .catch((error) => {
                console.log(error);
                setGenerating(false);
            })
        }
    }

    const history = useHistory();

    const setCopyState = () => {
        setCopied(true);
        setTimeout(
            () => setCopied(false),
            2000
        );
    }

    const deleteAllLinks = async () => {
        setDeletingLinks(true);

        // Check if user is authenticated
        if(isAuthenticated && user) {
            // Make API call using auth0 api key
            const token = await getAccessTokenSilently();

            axios.delete(process.env.REACT_APP_API_URL + '/api/v1/user/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response);
                setDeletingLinks(false);
            })
            .catch((error) => {
                console.log(error);
                setDeletingLinks(false);
            })
        }
    }

    const deleteAccountAndLogout = async () => {
        setDeletingAccount(true);

        // Check if user is authenticated
        if(isAuthenticated && user) {
            // Make API call using auth0 api key
            const token = await getAccessTokenSilently();

            axios.delete(process.env.REACT_APP_API_URL + '/api/v1/user/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response);
                setDeletingAccount(false);
                logout({ returnTo: window.location.origin })
            })
            .catch((error) => {
                console.log(error);
                setDeletingAccount(false);
            })
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
                                    <button className="text-indigo-600 background-transparent font-bold px-4 py-2 outline-none hover:text-white focus:outline-none" 
                                            type="button" 
                                            style={{ transition: "all .15s ease" }}
                                            onClick={() => history.push('/')}
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
                                    <button className="text-white background-transparent font-bold px-4 py-2 mr-2 outline-none hover:text-white focus:outline-none" 
                                            type="button" 
                                            style={{ transition: "all .15s ease" }}
                                            onClick={() => history.push('/settings')}
                                            disabled
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
                <div class="flex flex-col items-center justify-center w-full mx-0 my-10">
                        <div class="shadow-xl p-12 bg-white max-w-3xl rounded-lg w-full">
                            <div class="flex flex-col items-center">
                                <h1 class="text-2xl font-bold font-black mb-4">Develop your own tools with your personal api key.</h1>
                                <div class="flex">
                                    <input class="input border border-gray-400 ppearance-none rounded w-full px-3 py-3 text-2xl focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600" 
                                        id="link" 
                                        type="text" 
                                        placeholder="YOUR_DEVELOPER_API_KEY"
                                        value={apiKey}
                                        readOnly
                                        autoFocus 
                                    />
                                    { !copied &&
                                        <CopyToClipboard 
                                            text={apiKey}
                                            onCopy={setCopyState}
                                        >
                                            <div class="flex items-center justify-center">
                                                <Tippy content={<span class="shadow text-white bg-gray-400 rounded px-1 py-1">Copy</span>}>
                                                    <span 
                                                        class="cursor-pointer text-gray-400 px-1 py-3 font-bold hover:text-gray-800 hover:border-black-400 focus:outline-none ml-4"
                                                    >
                                                        <FontAwesomeIcon icon={faCopy} size='2x'/>
                                                    </span>
                                                </Tippy>
                                            </div>
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
                                    { !generating &&
                                        <button
                                            class="bg-indigo-600 font-bold rounded py-3 px-5 mx-3 text-white"
                                            onClick={generateApiKey}
                                        >
                                            {apiKey ? "Reset" : "Generate"}
                                        </button>
                                    }
                                    { generating &&
                                        <button
                                            class="bg-indigo-600 font-bold rounded py-3 px-5 mx-3 text-white"
                                            disabled
                                        >
                                            <span class="text-indigo-900 mx-auto">
                                                <FontAwesomeIcon icon={faCircleNotch} size='2x' spin/>
                                            </span>
                                        </button>
                                    }
                                </div>
                                <p class="my-4">
                                    It's simple to use, just include it in the Authorization header when accessing our API.
                                </p>
                                <div class="flex mt-12 mb-2 items-center justify-center">
                                    { !deletingLinks &&
                                    <button 
                                        class='bg-indigo-600 text-white font-bold py-4 px-5 rounded hover:text-indigo-800 hover:border-black-400 focus:outline-none'
                                        onClick={deleteAllLinks}
                                    >
                                        Delete All Links
                                    </button>
                                    }
                                    { deletingLinks &&
                                        <button 
                                            class='bg-indigo-600 text-white font-bold py-4 px-5 rounded hover:text-indigo-800 hover:border-black-400 focus:outline-none'
                                            disabled
                                        >
                                            Deleting
                                            <span class="text-indigo-900 mx-2">
                                                <FontAwesomeIcon icon={faCircleNotch} size='1x' spin/>
                                            </span>
                                        </button>
                                    }
                                </div>
                                <p class="my-0">
                                    Want a fresh start? Delete all of the links that belong to your account.
                                </p>
                                <div class="flex mt-8 mb-2 items-center justify-center">
                                    { !deletingAccount &&
                                        <button 
                                            class='bg-red-500 text-white font-bold py-4 px-5 rounded hover:text-red-800 hover:border-black-400 focus:outline-none'
                                            onClick={deleteAccountAndLogout}
                                        >
                                            Delete Account
                                        </button>
                                    }
                                    { deletingAccount &&
                                        <button 
                                            class='bg-red-500 text-white font-bold py-4 px-5 rounded hover:text-red-800 hover:border-black-400 focus:outline-none'
                                            disabled
                                        >
                                            Deleting
                                            <span class="text-red-800 mx-2">
                                                <FontAwesomeIcon icon={faCircleNotch} size='1x' spin/>
                                            </span>
                                        </button>
                                    }
                                </div>
                                <p class="my-0">
                                    Clear all of your data and delete your account.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}