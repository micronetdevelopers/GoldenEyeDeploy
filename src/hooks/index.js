import { useQuery, useMutation } from "@tanstack/react-query";
import axios from 'axios';

let Base_Url = process.env.REACT_APP_BASE_URL;

// Function to get the access token from localStorage
const getAccessToken = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        return parsedUser.access;
    }
    return null;
};

// Custom hook to fetch data using react-query and axios
export const useGetData = (url, queryKey) => {
    const access = getAccessToken();

    const fetchData = async () => {
        const response = await axios.get(`${Base_Url}/${url}`, {
            headers: {
                Authorization: `Bearer ${access}`, // Add token if available
            },
        });

        return response.data;
    };

    return useQuery(queryKey, fetchData, {
        enabled: !!access,
        staleTime: 5 * 60 * 1000, // 5 minutes caching of data   
        retry: 2, // Retry failed requests up to 2 times
        refetchOnWindowFocus: false,
    });
};

export const usePostData = (url, mutationKey) => {
    const access = getAccessToken();

    const mutation = useMutation({
        mutationKey,
        mutationFn: async (payload) => {
            const response = await axios.post(`${Base_Url}/${url}`, payload, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
            return response.data;
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        },
        onSuccess: (data) => {
            console.log('Mutation successful:', data);
        },
    });

    return {
        data: mutation.data,
        isLoading: mutation.isLoading,
        isError: mutation.isError,
        error: mutation.error,
        mutate: mutation.mutate,
        isSuccess: mutation.isSuccess,
    };
};

// Define your custom hook for fetching data with a POST request
export const useDatawithpost = (url, payload, queryKey, isValidSearch) => {
    const access = getAccessToken();

    const fetchData = async () => {
        const response = await axios.post(`${Base_Url}/${url}`, payload, {
            headers: {
                Authorization: `Bearer ${access}`, // Add token if available
            },
        });

        return response.data;
    };

    return useQuery(queryKey, fetchData, {
        enabled: !!access && isValidSearch,
        refetchOnWindowFocus: false,
    });
};
