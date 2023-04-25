import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(
        async (url, method = "GET", headers = {}, body = null) => {
            setIsLoading(true);
            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                });
                // console.log(url);
                const responseData = await response.json();
                if (!response.ok) {
                    //response.ok is true if 2-300 status code and will not go inside this block

                    throw new Error(responseData.message);
                }
                // console.log(responseData);
                setIsLoading(false);
                return responseData;
            } catch (err) {
                console.log(err.message);
                setError(err.message);
                setIsLoading(false);

                throw err;
            }
        },
        []
    ); 

    const clearError = () => {
        setError(null);
    };



    return { isLoading, error, sendRequest, clearError };
};