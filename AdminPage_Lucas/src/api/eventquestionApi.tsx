import axios from "axios";


export const addEventQuestion = async (questionId: string, accessToken: string, eventId: string) => {
    try {
        console.log(accessToken)
        const response = await axios.patch(
            `http://ec2-13-212-138-4.ap-southeast-1.compute.amazonaws.com:8082//api/addEventQuestion/event/${eventId}/question/${questionId}`,
            null,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch
        (error) {
        console.error(error);
        throw error;
    }
};