import express from "express";
import { prisma } from "../util/prisma/index.js";
//import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//아이템 생성 API
router.post("/item", async (req, res, next) => {
  try {
    const { itemCode, itemName, itemStat } = req.body;
    //아이템 생성
    const newItem = await prisma.item.create({
      data: {
        itemCode,
        itemName,
        itemPrice,
        itemHealth: itemStat.itemHealth,
        itemPower: itemStat.itemPower,
      },
    });
    return res.status(201).json({
      message: "아이템이 생성되었습니다.",
      itemCode: newItem.itemCode,
    });
  } catch (err) {
    next(err);
  }
});

//아이템 수정 API
router.patch("/item/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { itemName, itemStat } = req.body;
    const id = parseInt(itemId, 10);

    //아이템 코드 유효성 검사
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "유효하지 않은 아이템 코드 입니다." });
    }
    //stat 유효성 검사
    if (stat && (typeof stat !== "object" || stat === null)) {
      return res
        .status(400)
        .json({ message: "능력치는 객체 포맷으로 전달해주세요." });
    }
    //수정 부분 객체 구성
    const updateData = {};
    if (itemName) updateData.itemName = itemName;
    if (itemStat) {
      if (typeof stat.itemHealth === "number")
        updateData.itemHealth = stat.itemHealth;
      if (typeof stat.itemPower === "number")
        updateData.itemPower = stat.itemPower;
    }
    //아이템 존재 여부 확인
    const isExistItem = await prisma.item.findFirst({ where: { itemId: id } });
    if (!isExistItem) {
      return res
        .status(404)
        .json({ message: "해당 아이템을 찾을 수 없습니다." });
    }
    //아이템 수정
    const updatedItem = await prisma.item.update({
      where: { itemId: id },
      data: updateData,
    });
    return res
      .status(200)
      .json({ message: "아이템이 수정되었습니다.", item: updatedItem });
  } catch (err) {
    next(err);
  }
});

//아이템 삭제API
router.delete("/item/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    //아이템 존재 여부 확인
    const isExistItem = await prisma.item.findFirst({ where: { itemId: id } });
    if (!isExistItem) {
      return res
        .status(404)
        .json({ message: "해당 아이템을 찾을 수 없습니다." });
    }
    //아이템 삭제
    await prisma.item.delete({
      where: { itemId },
    });
    return res.status(200).json({ message: "아이템이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
});

//아이템 목록 조회 API
router.get("/item/:itemId", async (req, res, next) => {
  try {
    const item = await prisma.item.findMany({
      select: {
        itemCode: true,
        itemName: true,
        itemPrice: true,
      },
    });
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
});

//아이템 상세 조회 API
router.get("/item/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await prisma.item.findFirst({
      where: {
        itemId: parseInt(itemId),
      },
      select: {
        itemId: true,
        itemName: true,
        itemStat: true,
        itemPrice: true,
      },
    });
    if (!item) {
      return res
        .status(404)
        .json({ message: "해당 아이템을 찾을 수 없습니다." });
    }
    return res.status(200).json(item);
  } catch (err) {
    next(err);
  }
});

export default router;
