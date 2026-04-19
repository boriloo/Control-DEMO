import db from "../lib/prisma";
import { updateUserData, UserData } from "../types/user";

// GET ME
export const getMeService = async (id: string) => {
    const user = await db.prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new Error("User doesn't exist.");
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
        ...userWithoutPassword,
        profileImage: user.profileImage ? Buffer.from(user.profileImage).toString('base64') : null,
    } as unknown as UserData;
};

// UPDATE USER
export const updateUserService = async (id: string, data: updateUserData) => {
    try {
        const updated = await db.prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                // Converte Buffer para Uint8Array apenas se fornecido
                profileImage: data.profileImage ? new Uint8Array(data.profileImage) : undefined,
            },
        });

        const { password: _, ...userWithoutPassword } = updated;

        return {
            ...userWithoutPassword,
            profileImage: updated.profileImage ? Buffer.from(updated.profileImage).toString('base64') : null,
        };
    } catch (error) {
        throw new Error("User not found or update failed.");
    }
};

// DELETE USER
export const deleteUserService = async (id: string) => {
    try {
        await db.prisma.file.deleteMany({
            where: { ownerId: id },
        })

        await db.prisma.desktop.deleteMany({
            where: { ownerId: id },
        })

        await db.prisma.user.delete({
            where: { id },
        });
    } catch (error) {
        throw new Error("User doesn't exist.");
    }
};