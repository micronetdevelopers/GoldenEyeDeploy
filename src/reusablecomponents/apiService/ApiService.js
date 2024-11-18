import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/customers`; // Base URL for API

// Fetch user profile by username with Authorization token
export const fetchUserProfile = async (username, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        },
    };

    const response = await axios.get(`${API_BASE_URL}/profile/${username}`, config);
    return response.data.userDetails;
};

// Update user profile via POST request
export const updateUserProfile = async ({ username, profileData, token }) => {
    const response = await axios.post(`${API_BASE_URL}/profile/${username}`, profileData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const API_PROVIDER_SEARCH_URL = `${process.env.REACT_APP_BASE_URL}/providers/airbus/searches`; // Search API endpoint

// Function to search providers (airbus) via POST request
export const searchAirbusProviders = async (searchCriteria, token) => {
    try {
        const response = await axios.post(API_PROVIDER_SEARCH_URL, searchCriteria, {
            headers: {
                Authorization: `Bearer ${token}`, // Set the token in the Authorization header
                'Content-Type': 'application/json', // Set the content type for the request
            },
        });
        // Assuming the response contains the search results
        return response.data;
    } catch (error) {
        // Handle error
        console.error('Error searching providers:', error.response?.data || error.message);
        throw error;
    }
};

// Modified onClickMore function that directly passes the response
export const onClickMore = async (initialSearchCriteria, page, token) => {
    const nextSearchCriteria = {
        ...initialSearchCriteria, // Spread existing search criteria
        startPage: page + 1, // Increment the page number for pagination
    };

    try {
        const data = await searchAirbusProviders(nextSearchCriteria, token);

        if (data.features.length === 0) {
            return { message: "No More Images!" };
        } else {
            return data; // Return the search results data directly
        }
    } catch (err) {
        console.error(err);
        throw new Error("Error loading more data");
    }
};
















// import axios from 'axios';

// const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/customers`; // Base URL for API

// // Fetch user profile by username with Authorization token
// export const fetchUserProfile = async (username, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`, // Set the token in the Authorization header
//         },
//     };

//     const response = await axios.get(`${API_BASE_URL}/profile/${username}`, config);
//     return response.data.userDetails;
// };

// // Update user profile via POST request
// export const updateUserProfile = async ({ username, profileData, token }) => {
//     const response = await axios.post(`${API_BASE_URL}/profile/${username}`, profileData, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     return response.data;
// };


// const API_PROVIDER_SEARCH_URL = `${process.env.REACT_APP_BASE_URL}/providers/airbus/searches`; // Search API endpoint

// // Function to search providers (airbus) via POST request
// export const searchAirbusProviders = async (searchCriteria, token) => {
//     try {
//         const response = await axios.post(API_PROVIDER_SEARCH_URL, searchCriteria, {
//             headers: {
//                 Authorization: `Bearer ${token}`, // Set the token in the Authorization header
//                 'Content-Type': 'application/json', // Set the content type for the request
//             },
//         });
//         // Assuming the response contains the search results
//         return response.data;
//     } catch (error) {
//         // Handle error
//         console.error('Error searching providers:', error.response?.data || error.message);
//         throw error;
//     }
// };

