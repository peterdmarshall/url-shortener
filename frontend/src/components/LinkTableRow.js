import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const LinkTableRow = (props) => {
    const { link } = props;
    const { getAccessTokenSilently } = useAuth0();

    return (
        <tr class="transition-all hover:bg-gray-200 hover:shadow-lg cursor-pointer">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex flex-col items-center">
                        <a 
                            href={window.location.protocol + '//' + window.location.hostname + '/' + link.short_url}
                            class="text-sm text-gray-500"
                        >
                            {window.location.protocol + '//' + window.location.hostname + '/' + link.short_url}
                        </a>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 uppercase">{link.access_count}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{link.expiry}</td>
        </tr>
    );
}

export default LinkTableRow;