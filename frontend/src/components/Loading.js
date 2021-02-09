import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
    return (
        <div class="flex flex-col items-center justify-center w-full h-screen bg-indigo-200 mx-0 my-0">
            <span class="text-indigo-900 mx-auto">
                <FontAwesomeIcon icon={faCircleNotch} size='3x' spin/>
            </span>
        </div>
    );
}