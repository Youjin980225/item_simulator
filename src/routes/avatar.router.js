import express from "express";
import { prisma } from "../utils/prisma/index.js"; // 올바른 경로 사용
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 캐릭터 생성 API
router.post("/create-avatar", authMiddleware, async (req, res, next) => {
  const { avatarName } = req.body;
  const userId = req.user.userId;

  try {
    const isExistAvatarName = await prisma.avatar.findFirst({
      where: { avatarName },
    });

    if (isExistAvatarName) {
      return res
        .status(409)
        .json({ message: "이미 존재하는 캐릭터 이름입니다." });
    }

    const newAvatar = await prisma.avatar.create({
      data: {
        userId: +userId,
        avatarName,
        avatarLevel: 1,
        avatarExp: 0,
        health: 500,
        power: 100,
        money: 10000,
      },
    });

    return res.status(201).json({
      message: "캐릭터 생성이 완료되었습니다.",
      avatar: newAvatar.avatarId,
    });
  } catch (err) {
    next(err);
  }
});

// 캐릭터 삭제 API
router.delete("/avatar/:avatarId", authMiddleware, async (req, res, next) => {
  const userId = req.user.userId;
  const { avatarId } = req.params;

  try {
    const id = parseInt(avatarId, 10);

    const avatar = await prisma.avatar.findFirst({
      where: { userId: +userId, avatarId: id },
    });

    if (!avatar) {
      return res.status(409).json({ message: "캐릭터가 존재하지 않습니다." });
    }

    if (avatar.userId !== userId) {
      return res.status(401).json({ message: "캐릭터를 삭제할 수 없습니다." });
    }

    await prisma.avatar.delete({
      where: { avatarId: id },
    });

    return res.status(200).json({ message: "캐릭터가 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

// 캐릭터 정보 조회 API
router.get("/avatar/:avatarId", async (req, res, next) => {
  try {
    const { avatarId } = req.params;
    const { userId } = req.query;

    const avatar = await prisma.avatar.findFirst({
      where: { avatarId: parseInt(avatarId) },
    });

    if (!avatar) {
      return res.status(404).json({ message: "캐릭터를 찾을 수 없습니다." });
    }

    const response = {
      avatarName: avatar.avatarName,
      avatarLevel: avatar.avatarLevel,
      avatarExp: avatar.avatarExp,
      health: avatar.health,
      power: avatar.power,
    };

    if (userId && parseInt(userId) === avatar.userId) {
      response.money = avatar.money;
    }

    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
