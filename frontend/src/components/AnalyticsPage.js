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

// Icon for delete
import { faTrash } from '@fortawesome/free-solid-svg-icons';


export default function AnalyticsPage() {

    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const history = useHistory();

    const [links, setLinks] = useState(null);
    const [linkCount, setLinkCount] = useState(null);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);

    // State update flags
    const [updateFlag, setUpdateFlag] = useState(false);


    // Get list of links from API
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
                setLinkCount(response.data.link_count)
                setLinks(response.data.links);
            })
            .catch((error) => {
                console.log(error);
            })
        })();
    }, [user, limit, offset, updateFlag]);

    return (
        <div class="bg-indigo-200">
            <div class="container flex flex-col h-screen overflow-y-hidden mx-auto space-y-32">
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
                                    <button className="text-white background-transparent font-bold px-4 py-2 outline-none hover:text-white focus:outline-none" 
                                            type="button" 
                                            style={{ transition: "all .15s ease" }}
                                            onClick={() => history.push('/analytics')}
                                            disabled
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
                <div class="flex flex-col items-center h-screen justify-start space-y-20">
                    <div class="flex flex-col items-center justify-center my-0">
                        <h1 class="lg:text-6xl md:text-4xl text-3xl text-center">
                            Analytics
                        </h1>
                        <p class="text-xl mt-4">
                            View, share, and delete your links. Access tracking lets you monitor traffic.
                        </p>
                    </div>
                    <div class="flex flex-col w-full mt-2">
                        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div class="overflow-x-scroll border-b border-gray-200 rounded-md shadow-md">
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
                                        Original Url
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
                                        Last Access
                                        </th>
                                        <th
                                        scope="col"
                                        class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                        Expiry
                                        </th>
                                        <th>
                                            <span class="sr-only">
                                                Delete
                                            </span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        { !links &&
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td class="flex flex-row items-end w-full justify-center">
                                                    <span class="text-indigo-900">
                                                        <FontAwesomeIcon icon={faCircleNotch} size='3x' spin/>
                                                    </span>
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                        { links && links.map(link => {
                                            return <LinkTableRow key={link.short_url} link={link} updateFlag={updateFlag} setUpdateFlag={setUpdateFlag}/>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination offset={offset} setOffset={setOffset} limit={limit} linkCount={linkCount}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}