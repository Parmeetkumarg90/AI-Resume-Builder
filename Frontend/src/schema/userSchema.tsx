interface userCreationSchema {
    id: string;
    email: string;
    mobileNumber: string;
    createdAt: string;
    isAccountActive: boolean;
    isSendForApproval: number;
}

interface NewUserModalInterface {
    open: boolean,
    onClose: () => void
    onSubmit: ({ email, mobileNumber }: newUserInterface) => void
}

interface ProfileViewModalInterface {
    open: boolean;
    onClose: () => void;
    id: string;
}

interface newUserInterface {
    email: string,
    mobileNumber: string
}

export type { userCreationSchema, NewUserModalInterface, newUserInterface, ProfileViewModalInterface };