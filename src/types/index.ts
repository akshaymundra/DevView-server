type User = {
    _id: string;
    email: string;
    password: string;
    fullName: string;
    skills: { label: string, value: string }[];
    experianceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Not Specified';
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestWithUser extends Request {
    user: User;
};