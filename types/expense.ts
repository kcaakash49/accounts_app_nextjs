

export type AdminType = {
    id : number;
    name: string;
    username: string;
    createdAt: Date;
}

export type ExpenseType = {
    id: number;
    amount: number;
    title: string;
    expenseType: string;
    note: string;
    quantity: number;
    total: number;
    createdAt: Date;
    adminUserId: number;
    recordedBy: AdminType;
}