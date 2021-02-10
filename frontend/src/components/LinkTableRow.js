import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import Tippy from '@tippyjs/react';
import Moment from 'react-moment';
import moment from 'moment';


const LinkTableRow = (props) => {
    const { link, updateFlag, setUpdateFlag } = props;
    const [deleting, setDeleting] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    // Delete link by its short url
    const deleteLink = async () => {
        setDeleting(true);
        const token = await getAccessTokenSilently();
    
         axios.delete(process.env.REACT_APP_API_URL + '/api/v1/links/' + link.short_url, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          })
          .then((results) => {
            // Successfully deleted all images byt id
            setUpdateFlag(!updateFlag);
            setDeleting(false);
          })
          .then((error) => {
            console.log(error);
          });
    }

    return (
        <tr class="transition-all hover:bg-gray-200 hover:shadow-lg cursor-pointer">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex flex-row justify-center items-center">
                        <a 
                            href={window.location.protocol + '//' + window.location.hostname + '/' + link.short_url}
                            class="text-sm text-gray-500 hover:text-gray-800"
                        >
                            {window.location.protocol + '//' + window.location.hostname + '/' + link.short_url}
                        </a>
                        <CopyToClipboard text={link.short_link}>
                            <Tippy content={<span class="shadow text-white bg-gray-400 rounded px-1 py-1">Copy Link</span>} placement="right">
                                <span 
                                    class="cursor-pointer text-gray-400 font-bold hover:text-gray-800 hover:border-black-400 focus:outline-none active:text-gray-300 ml-4"
                                >   
                                    <FontAwesomeIcon icon={faCopy} size='1x'/>
                                </span>
                            </Tippy>
                        </CopyToClipboard>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex flex-row justify-center items-center">
                        <a 
                            href={link.long_url}
                            class="truncate text-sm text-gray-500 xl:max-w-3xl lg:max-w-xl md:max-w-sm sm:max-w-xs hover:text-gray-800"
                        >
                            {link.long_url}
                        </a>
                        <CopyToClipboard text={link.short_link}>
                            <Tippy content={<span class="shadow text-white bg-gray-400 rounded px-1 py-1">Copy Link</span>} placement="right">
                                <span 
                                    class="cursor-pointer text-gray-400 font-bold hover:text-gray-800 hover:border-black-400 focus:outline-none active:text-gray-300 ml-4"
                                >   
                                    <FontAwesomeIcon icon={faCopy} size='1x'/>
                                </span>
                            </Tippy>
                        </CopyToClipboard>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 uppercase">{link.access_count}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                    { link.last_access_date &&
                    <Moment format="MM/DD/YYYY hh:mm:ss">
                        {link.last_access_date}
                    </Moment>
                    }
                    { !link.last_access_date &&
                        "None"
                    }
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {link.expiry &&
                <Moment format="MM/DD/YYYY hh:mm:ss">
                    {link.expiry}
                </Moment>
                }
                { !link.expiry &&
                    "Never"
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex flex-col items-center">
                        <span 
                            class="cursor-pointer text-gray-500 font-bold hover:text-red-500 hover:border-black-400 focus:outline-none"
                            onClick={deleteLink}
                        >   
                            { !deleting &&
                                <FontAwesomeIcon icon={faTrash} size='1x'/>
                            }
                            { deleting &&
                                <FontAwesomeIcon icon={faCircleNotch} size='1x' spin/>
                            }
                        </span>
                    </div>
                </div>
            </td>
        </tr>
    );
}

export default LinkTableRow;