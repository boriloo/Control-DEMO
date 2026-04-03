import { prisma } from "../lib/prisma";
import { CreateFileData, FilePositionsData } from "../types/file";

// CREATE FILE
export const createFileService = async (data: CreateFileData) => {
  const file = await prisma.file.create({
    data: {
      name: data.name,
      ownerId: data.ownerId,
      desktopId: data.desktopId,
      parentId: data.parentId,
      fileType: data.fileType,
      xPos: data.xPos,
      yPos: data.yPos,
      url: data.url,
    },
  });

  return file;
};

// GET ALL FILES FROM DESKTOP
export const getAllFilesFromDesktopService = async (desktopId: string) => {
  return await prisma.file.findMany({
    where: { desktopId },
  });
};

// GET ROOT FILES FROM DESKTOP
export const getFilesFromDesktopService = async (desktopId: string) => {
  return await prisma.file.findMany({
    where: {
      desktopId,
      parentId: "root",
    },
  });
};

// GET FILE BY ID
export const getFileByIdService = async (fileId: string) => {
  return await prisma.file.findUnique({
    where: { id: fileId },
  });
};

// GET FILES BY PARENT ID
export const getFilesFromParentService = async (parentId: string) => {
  return await prisma.file.findMany({
    where: { parentId },
  });
};



// GET PARENT NAMES (RECURSIVE)
export const getFilesParentNamesService = async (parentId: string) => {
  if (parentId === "root") return [];

  // Prisma não tem suporte nativo para WITH RECURSIVE, usamos queryRaw
  const result = await prisma.$queryRaw<{ id: string; name: string }[]>`
    WITH RECURSIVE parents AS (
        SELECT id, name, parent_id
        FROM files
        WHERE id = ${parentId}::uuid

        UNION ALL

        SELECT f.id, f.name, f.parent_id
        FROM files f
        INNER JOIN parents p ON f.id = p.parent_id::uuid
        WHERE p.parent_id != 'root'
    )
    SELECT id, name FROM parents
  `;

  return result;
};

// UPDATE FILE POSITIONS
export const updateFilePositionService = async (files: FilePositionsData[]) => {
  if (files.length < 1) throw new Error("No files received.");

  // Usamos uma transação para garantir que todas as posições sejam atualizadas
  await prisma.$transaction(
    files.map((file) =>
      prisma.file.update({
        where: { id: file.id },
        data: {
          xPos: file.xPos,
          yPos: file.yPos,
        },
      })
    )
  );
};

// DELETE FILE
export const deleteFileService = async (id: string) => {
  try {
    await prisma.file.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error("File doesn't exist.");
  }
};