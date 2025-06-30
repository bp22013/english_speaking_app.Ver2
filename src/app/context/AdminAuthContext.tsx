'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type User = {
    id: string;
    email?: string;
};

const AuthContext = createContext<{
    user: User | null;
}>({
    user: null,
});

export const useAdminSession = () => useContext(AuthContext);

export const AuthProvider = ({
    children,
    initialUser,
}: {
    children: ReactNode;
    initialUser: User | null;
}) => {
    const [user] = useState<User | null>(initialUser);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
