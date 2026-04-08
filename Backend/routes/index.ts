import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { prisma } from "../prisma/db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { SignupSchema, SigninSchema } from "../Types/types";
import cors from "cors";

const app = express();
const SECRET = process.env.JWT_SECRET ?? "changeme_in_prod";

app.use(express.json());
app.use(cors());
// ── helpers ──────────────────────────────────────────────────────────────────
function ferr(msg: string, code: number, res: Response) {
  return res.status(code).json({ success: false, data: null, error: msg });
}


export function authMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.headers);
    // console.log(req.headers.authorization);
    try {
      const token = req.headers.authorization?.split(" ")[1];
      // console.log(token);
      if (!token) return ferr("UNAUTHORIZED", 401, res);
      const payload = jwt.verify(token, SECRET) as JwtPayload;
      req.id = payload.id;
      req.role = payload.role;
      next();
    } catch (e){
      console.log(e.message);
      return ferr("UNAUTHORIZED", 401, res);
    }
  };
}

// ── routes ───────────────────────────────────────────────────────────────────
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) return ferr("INVALID_REQUEST", 400, res);

  const exists = await prisma.users.findFirst({
    where: { email: parsed.data.email },
  });
  if (exists) return ferr("EMAIL_ALREADY_EXISTS", 400, res);

  await prisma.users.create({
    data: { email: parsed.data.email, password: parsed.data.password, role: parsed.data.role }
  });

  return res.status(201).json({ success: true, error: null, msg: "you have been signed up" });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const parsed = SigninSchema.safeParse(req.body);
  if (!parsed.success) return ferr("INVALID_REQUEST", 400, res);

  const user = await prisma.users.findUnique({
    where: { email: parsed.data.email },
  });
  if (!user) return ferr("INVALID_CREDENTIALS", 401, res);

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET);

  return res.status(200).json({
    success: true,
    data: { token, user: { id: user.id, email: user.email, msg: "you have signed in " } },
    error: null,
  });
});



app.post("/teacher/createroom", authMiddleware(), async (req: Request, res: Response) => {
  console.log("reached  cretaed room here");
  let id = req.id
  let role = req.role
  if (role != "teacher") {
    return ferr("only teacher ACCESS allowed", 401, res);
  }
  if (!id || !role) {
    return ferr("ID OR ROLE MISSING", 404, res);
  }
  console.log("making db call fron backend");
  const roomadd = await prisma.rooms.create({
    data: {
      teacher_id: id,
    }
  })
  if (roomadd) {
    return res.status(201).json({
      status: " room has been crrated successfully",
      success: true,
      roomid: roomadd.id,
      teacher_id : roomadd.teacher_id
    })
    console.log(roomadd);
  }
})

app.put("/user/join", authMiddleware(), async (req: Request, res: Response) => {
    const url = req.url
    console.log(url);
    const roomId = req.query.roomId as string;
    if (!roomId) {
      return ferr("ROOMID MISSING", 403, res);
    }
    let id = req.id;
    let role = req.role;
    if (!id || !role) {
      return ferr("ID OR ROLE MISSING", 404, res);
    }
    const isRoomFull = await prisma.rooms.findFirst({
      where: {
        id: roomId
      }
    })
    console.log(isRoomFull);
    console.log(id);
    if (isRoomFull?.student_id == id || isRoomFull?.teacher_id == id){
      return res.status(200).json({
        msg : "WELCOME BACK ",
        student_id : isRoomFull.student_id
      })
    }
    if (isRoomFull?.student_id != null && isRoomFull.student_id != null) {
      return ferr("Room is already Full", 401, res);
    }
    const roomfind = await prisma.rooms.update({
      where: {
        id: roomId
      },
      data: {
        student_id: id
      }
    })
    if (!roomfind) {
      return ferr("no such room exists", 404, res);
    }
    return res.status(201).json({
      msg: "record has been updated successfully",
      success: true,
      student_id : roomfind.student_id  
    })
  })


// ── start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

