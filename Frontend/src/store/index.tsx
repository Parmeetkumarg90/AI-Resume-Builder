import { create } from 'zustand';
import type { AppState, overallData } from '../schema/authSchema';
import { GetRequest, getSession } from '../serivces/auth';
import env from '../config/env';

const sessionStore = create<AppState>((set) => ({
    session: null,
    allProfileData: null,
    async init() {
        set({ session: null, allProfileData: null });
        const session = await getSession();
        console.log(session);
        const result = await GetRequest(`${env.VITE_BACKEND_URL}/api/user/`);
        console.log(result);
        set({
            session,
            allProfileData: result?.allProfileData
        });
    },
    updateAllProfileData(obj: overallData) {
        set((state) => {
            if (!state.allProfileData) return { allProfileData: obj };
            return {
                allProfileData: {
                    ...state.allProfileData, ...obj
                },
            };
        });
    },
    updateStage(stage: number) {
        set((state) => {
            if (!state.session) return { session: null };
            return {
                session: {
                    ...state.session, Credential: { ...state.session.Credential, stage, },
                },
            };
        });
    },
    updateDBStage(stage: number) {
        set((state) => {
            if (!state.session) {
                return { session: null }
            };
            if (state.session.Credential.dbStage >= stage) {
                return state;
            }
            // console.log("stage", stage);
            return {
                session: {
                    ...state.session, Credential: { ...state.session.Credential, dbStage: stage, },
                },
            };
        });
    },
}));

export default sessionStore;