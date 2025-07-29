import express from "express";
import { prisma } from "../utils/prisma/index.js";
// import authMiddleware from "../middlewares/auth.middleware.js"; // 필요 시 주석 해제

const router = express.Router();

// 아이템 생성 API
router.post("/item", async (req, res, next) => {
  try {
    const { itemCode, itemName, itemPrice, itemStat } = req.body;

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

// 아이템 수정 API
router.patch("/item/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { itemName, itemStat } = req.body;
    const id = parseInt(itemId, 10);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "유효하지 않은 아이템 ID입니다." });
    }

    if (itemStat && (typeof itemStat !== "object" || itemStat === null)) {
      return res
        .status(400)
        .json({ message: "능력치는 객체 포맷으로 전달해주세요." });
    }

    const updateData = {};
    if (itemName) updateData.itemName = itemName;
    if (itemStat) {
      if (typeof itemStat.itemHealth === "number") {
        updateData.itemHealth = itemStat.itemHealth;
      }
      if (typeof itemStat.itemPower === "number") {
        updateData.itemPower = itemStat.itemPower;
      }
    }

    const isExistItem = await prisma.item.findFirst({ where: { itemId: id } });
    if (!isExistItem) {
      return res
        .status(404)
        .json({ message: "해당 아이템을 찾을 수 없습니다." });
    }

    const updatedItem = await prisma.item.update({
      where: { itemId: id },
      data: updateData,
    });

    return res.status(200).json({
      message: "아이템이 수정되었습니다.",
      item: updatedItem,
    });
  } catch (err) {
    next(err);
  }
});

// 아이템 삭제 API
router.delete("/item/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const id = parseInt(itemId, 10);

    const isExistItem = await prisma.item.findFirst({
      where: { itemId: id },
    });

    if (!isExistItem) {
      return res
        .status(404)
        .json({ message: "해당 아이템을 찾을 수 없습니다." });
    }

    await prisma.item.delete({
      where: { itemId: id },
    });

    return res.status(200).json({ message: "아이템이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
});

// 아이템 목록 조회 API
router.get("/items", async (req, res, next) => {
  try {
    const items = await prisma.item.findMany({
      select: {
        itemId: true,
        itemCode: true,
        itemName: true,
        itemPrice: true,
      },
    });

    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

// 아이템 상세 조회 API
router.get("/item/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await prisma.item.findFirst({
      where: {
        itemId: parseInt(itemId),
      },
      select: {
        itemId: true,
        itemCode: true,
        itemName: true,
        itemHealth: true,
        itemPower: true,
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
