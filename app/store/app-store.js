import { create } from 'zustand';
import { getJWT, setJWT, removeJWT, getMe } from '../api/api-utils';
import { endpoints } from '../api/config';
import { isResponseOk } from '../api/api-utils';

export const useStore = create((set) => ({
    isAuth: false,
    user: null,
    token: null,
    login: (user, token) => {
        set({ isAuth: true, user, token });
        setJWT(token);
    },
    logout: () => {
        set({ isAuth: false, user: null, token: null });
        removeJWT();
    },
    checkAuth: async () => {
        const jwt = getJWT();
        if (jwt) {
            const user = await getMe(endpoints.me, jwt);
            if (isResponseOk(user)) {
            set({ isAuth: true, user: { ...user, id: user._id }, token: jwt }); 
              setJWT(jwt);
            } else {
              set({ isAuth: false, user: null, token: null });
              removeJWT();
            }
        } else {
            set({ isAuth: false, user: null, token: null });
        }
    },
}));