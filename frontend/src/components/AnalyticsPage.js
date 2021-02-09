import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './Loading';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Pagination from './Pagination';
import LinkTableRow from './LinkTableRow';

// Fa icon for loading spinner
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';


export default function AnalyticsPage() {

    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const history = useHistory();

    const [links, setLinks] = useState(null);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        (async () => {
            const token = await getAccessTokenSilently();

            // Request list of user links from server
            axios.get(process.env.REACT_APP_API_URL + '/api/v1/links', {
                params: {
                    limit: limit,
                    offset: offset
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response)
                setLinks(response.data.links);
            })
            .then((error) => {
                console.log(error);
            })
        })();
    }, [user, limit, offset]);

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
                    <div class="flex flex-col w-full mt-6">
                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div class="overflow-hidden border-b border-gray-200 rounded-md shadow-md">
                                    <table class="min-w-full overflow-x-scroll divide-y divide-gray-200 z-50">
                                        <thead class="bg-gray-50">
                                        <tr>
                                            <th
                                            scope="col"
                                            class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                            Short Url
                                            </th>
                                            <th
                                            scope="col"
                                            class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                            Access Count
                                            </th>
                                            <th
                                            scope="col"
                                            class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                            Expiry
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            { !links &&
                                                <tr>
                                                    <td>

                                                    </td>
                                                    <td class="flex flex-row items-center justify-center">
                                                        <span class="text-indigo-900">
                                                            <FontAwesomeIcon icon={faCircleNotch} size='3x' spin/>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        
                                                    </td>
                                                </tr>
                                            }
                                            { links && links.map(link => {
                                                return <LinkTableRow key={link._id.$oid} link={link}/>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Pagination offset={offset} setOffset={setOffset} limit={limit} />
                </div>
            </div>
        </div>
    )
}