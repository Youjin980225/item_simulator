import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//회원가입 API
//아이디 유효성 검사
const validateUserId = (id) => {
  const idRegex = /^[a-z0-9]+$/;
  return idRegex.test(id);
};
//사용자 회원가입 API
router.post("/sign-up", async (req, res, next) => {
  try {
    const {
      id,
      email,
      password,
      passwordConfirm,
      name,
      age,
      gender,
      profileImage,
    } = req.body;
    //아이디 조합 확인-오류
    if (!validateUserId(id)) {
      return res
        .status(400)
        .json({ message: "ID는 영어 소문자와 숫자 조합만 이용 가능합니다." });
    }
    //중복 아이디 확인
    const isExistId = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (isExistId) {
      return res.status(409).json({ message: "이미 존재하는 아이디 입니다." });
    }
    //중복 이메일 확인
    const isExistUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (isExistUser) {
      return res.status(409).json({ message: "이미 등록된 이메일 입니다." });
    }
    //비밀번호 조합 확인-오류
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "비밀번호는 6자 이상 입력해주세요." });
    }
    //비밀번호 확인 일치 여부
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다" });
    }
    //비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    //계정 테이블 사용자 추가
    const user = await prisma.user.create({
      data: {
        id,
        email,
        password: hashedPassword,
      },
    });
    //계정 정보 테이블 사용자 정보 추가
    const userInfo = await prisma.userInfo.create({
      data: {
        userId: user.userId,
        name,
        age,
        gender: gender.toUpperCase(),
        profileImage,
      },
    });
    //회원가입 완료
    return res.status(201).json({ message: "회원가입이 완료 되었습니다." });
  } catch (err) {
    next(err);
  }
});

//로그인 API
router.post("/login", async (req, res, next) => {
  const { id, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { id: id },
  });
  //DB에 저장된 ID와 입력된 ID 비교
  if (!user)
    return res.status(401).json({ message: "존재하지 않는 ID입니다." });
  //DB에 저장된 비밀번호와 입력된 비밀번호 비교
  else if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  //로그인 성공시 jwt(토큰)발급
  const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);
  //authorization 쿠키에 Berer토큰 형식으로 JWT 지정
  res.cookie("authorization", `Bearer${token}`);
  return res.status(200).json({ message: "로그인에 성공했습니다." });
});

//사용자 정보 조회 API
router.get("/user", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.user.firstFind({
    where: { userId: +userId },
    select: {
      userId: true,
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      UserInfo: {
        select: {
          name: true,
          age: true,
          gender: true,
          profileImage: true,
        },
      },
    },
  });
  return res.status(200).json({ data: user });
});

export default router;
