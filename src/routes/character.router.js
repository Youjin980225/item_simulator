import express from "express";
import { prisma } from "../util/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//캐릭터 생성 API
router.post("/create-character", authMiddleware, async (req, res, next) => {
  const { characterName } = req.body;
  const userId = req.user.userId;

  try {
    const isExistCharacterName = await prisma.character.findFirst({
      where: { characterName },
    });
    //캐릭터 이름 중복 확인
    if (isExistCharacterName) {
      return res
        .status(409)
        .json({ message: "이미 존재하는 캐릭터 이름입니다." });
    }
    //캐릭터 생성
    const newCharacter = await prisma.character.create({
      data: {
        userId: +userId,
        characterName,
        characterLevel: 1,
        characterExp: 0,
        health: 500,
        power: 100,
        money: 10000,
      },
    });
    return res.status(201).json({
      message: "캐릭터 생성이 완료되었습니다.",
      character: newCharacter.characterId,
    });
    //캐릭터 생성 오류
  } catch (error) {
    next(err);
  }
});

//캐릭터 삭제 API
router.delete(
  "character/:characterId",
  authMiddleware,
  async (req, res, next) => {
    const { characterId } = req.params;
    try {
      const id = parseInt(characterId, 10);
      //캐릭터 존재 확인
      const isExistCharacter = await prisma.character.findFirst({
        where: { userId: +userId, characterId: +characterId },
      });
      if (!isExistCharacter) {
        return res.status(409).json({ message: "캐릭터가 존재하지 않습니다." });
      }
      //사용자 캐릭터가 맞는 지 확인
      if (character.userId !== userId) {
        return res
          .status(401)
          .json({ message: "캐릭터를 삭제 할 수 없습니다." });
      }
      //캐릭터 삭제
      await prisma.character.delete({
        where: { characterId: id },
      });
      return res.status(200).json({ message: "캐릭터가 삭제되었습니다." });
    } catch (error) {
      next(err);
    }
  }
);

//캐릭터 정보 조회 API
router.get("/character/:characterId", async (req, res, next) => {
  try {
    const { characterId } = req.params.characterId;
    const { userId } = req.query.userId;

    const character = await prisma.character.findFirst({
      where: { characterId: parseInt(characterId) },
    });
    //조회하고자 하는 캐릭터가 없을 경우
    if (!character) {
      return res.status(404).json({ message: "캐릭터를 찾을 수 없습니다." });
    }
    //캐릭터 정보 조회
    const response = {
      characterName: character.characterName,
      characterLevel: character.characterLevel,
      characterExp: character.character.Exp,
      health: character.health,
      power: character.power,
    };
    //내 캐릭터일 경우
    if (userID && parseInt(userId) === character.userId) {
      response.money = character.money;
    }
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
