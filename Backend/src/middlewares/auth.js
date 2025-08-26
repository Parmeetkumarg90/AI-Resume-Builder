function authAdmin(request, response, next) {
    if (!request?.session || !request?.session?.userId || !request?.session?.email || !request?.session?.role || request?.session?.role != 'admin') {
        return response.status(401).json({ status: "You are not allowed to do this operation" });
    }
    next();
}

function authUser(request, response, next) {
    if (!request?.session || !request?.session?.userId || !request?.session?.email || !request?.session?.role || request?.session?.role != 'user') {
        return response.status(401).json({ status: "You are not allowed to do this operation" });
    }
    next();
}

function loginCheck(request, response, next) {
    if (!request?.session || !request?.session?.userId || !request?.session?.email || !request?.session?.role) {
        return response.status(401).json({ status: "You are not allowed to do this operation" });
    }
    next();
}

export { authAdmin, authUser, loginCheck };