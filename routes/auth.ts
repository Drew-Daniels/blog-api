import { Router, Request, Response } from "express";

const router = Router();

router.post('/', function handleLogin(req: Request, res: Response): void {
    // verify token, logout user
    console.log(req);
    console.log(res);
});

router.delete('/', function handleLogout(req: Request, res: Response): void {
   // verify token, logout user
    console.log(req);
    console.log(res);
});

export default router;
