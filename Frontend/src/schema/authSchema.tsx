import type { stage1FormInterface, stage3FormInterface, stage5FormInterface, stage7FormInterface } from "./stageSchema";

interface loginFields {
    email: string,
    mobileNumber?: number,
    password?: string,
    confirmPassword?: string,
    admin?: string,
    otp?: string
}

interface sessionData {
    status: string;
    Credential: {
        userId: string;
        email: string;
        role: string;
        dbStage: number;
        stage: number;
    };
}

interface AppState {
    init: () => Promise<void>,
    session: sessionData | null,
    allProfileData: overallData | null,
    updateAllProfileData: (obj: overallData) => void;
    updateStage: (stage: number) => void;
    updateDBStage: (dbStage: number) => void;
}

interface adminInterface {
    id: string,
    email: string,
    mobileNumber: string
}

interface overallData extends Partial<stage1FormInterface>, Partial<stage3FormInterface>, Partial<stage5FormInterface>, Partial<stage7FormInterface> {
    createdAt?: string;
    email?: string;
    currentLifeRecording?: string;
    earlyLifeRecording?: string;
    professionalLifeRecording?: string;
    linkedinHandle?: string;
    instagramHandle?: string;
    twitterHandle?: string;
    isSendForApproval?: number;
    accounctId?: string;
}

export type { loginFields, sessionData, AppState, adminInterface, overallData };