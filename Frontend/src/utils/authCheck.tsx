import sessionStore from "../store";

function checkAuth() {
    const session = sessionStore.getState().session;
    return (session != null);
}

export { checkAuth };