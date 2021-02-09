import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './Loading';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


export default function SettingsPage() {

    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const history = useHistory();

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
                                            onClick={() => history.push('/')}
                                    >
                                        Home
                                    </button>
                                    <button className="text-indigo-600 background-transparent font-bold px-4 py-2 mr-2 outline-none hover:text-white focus:outline-none" 
                                            type="button" 
                                            style={{ transition: "all .15s ease" }}
                                            onClick={() => history.push('/analytics')}
                                    >
                                        Analytics
                                    </button>
                                    <LogoutButton></LogoutButton>
                                </div>
                            }
                        </div>
                    </header>
                </div>
                <div class="flex flex-col items-center h-screen justify-start space-y-40">
                    
                </div>
            </div>
        </div>
    )
}