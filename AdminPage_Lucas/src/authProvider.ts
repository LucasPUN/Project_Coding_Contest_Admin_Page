import axios from 'axios';
import { AuthProvider, HttpError } from 'react-admin';
import BASE_URL from './BaseUrl';
export const signInUser = async (userName: any, password: any) => {
  try {
    const response = await axios.post(

      `${BASE_URL}/api/auth/signin`,
      { mode: 'no-cors', userName, password },
    );
    return response.data; // Assuming the user data is returned from the API
  } catch (error) {
    console.error(error);
    throw new HttpError("Login failed", 401, {
      message: "Invalid username or password",
    });
  }
};


export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const user = await signInUser(username, password);

      // Check if user has "ROLE_MODERATOR" in roles
      if (user && user.roles /*&& user.roles.includes("ROLE_ADMIN") */) {
        // Handle user authentication or store user data as needed
        // For example, storing user data in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        //  console.log(JSON.stringify(user.accessToken));

        return Promise.resolve();
      } else {
        return Promise.reject(
          new HttpError("Unauthorized", 401, {
            message: "User does not have required role",
          })
        );
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => Promise.resolve(undefined),
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
  getQuestions: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/questions`);
      const questions = response.data;
      console.log("response : " + response)
      console.log('questions : ' + questions);
      // Store question IDs in localStorage
      localStorage.setItem("question", JSON.stringify(questions.map((question: { id: number; }) => question.id)));
      return Promise.resolve(questions);
    } catch (error) {
      console.error(error);
      return Promise.reject(new HttpError("Failed to fetch questions", 500));
    }
  }
};
export default authProvider;