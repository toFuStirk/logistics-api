export interface UserJDLocalInfoResBody {
    code: string;
    charge: boolean;
    remain: number;
    msg: string;
    result: {
        ret: string;
        ip: string;
        data: string[];
    };
}