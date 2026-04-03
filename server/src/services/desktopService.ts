import { prisma } from "../lib/prisma";
import { CreateDesktopData } from "../types/desktop";

// CREATE DESKTOP
export const createDesktopService = async (data: CreateDesktopData) => {
    const desktop = await prisma.desktop.create({
        data: {
            name: data.name,
            ownerId: data.ownerId,
            backgroundImage: new Uint8Array(data.backgroundImage),
        },
    });

    return {
        ...desktop,
        backgroundImage: Buffer.from(desktop.backgroundImage).toString('base64'),
    };
};

// GET DESKTOP BY ID
export const getDesktopByIdService = async (id: string) => {
    const desktop = await prisma.desktop.findUnique({
        where: { id },
    });

    if (!desktop) {
        throw new Error("Desktop doesn't exist.");
    }

    return {
        ...desktop,
        backgroundImage: Buffer.from(desktop.backgroundImage).toString('base64'),
    };
};

// GET DESKTOPS BY OWNER ID
export const getDesktopByOwnerService = async (ownerId: string) => {
    const desktops = await prisma.desktop.findMany({
        where: { ownerId },
    });

    if (desktops.length === 0) {
        throw new Error("No desktops were found.");
    }

    return desktops.map((desktop) => ({
        ...desktop,
        backgroundImage: desktop.backgroundImage ? Buffer.from(desktop.backgroundImage).toString('base64') : null,
    }));
};

// UPDATE DESKTOP
export const updateDesktopService = async (id: string, data: { name?: string; backgroundImage?: Buffer }) => {
    try {
        const updated = await prisma.desktop.update({
            where: { id },
            data: {
                name: data.name,
                backgroundImage: data.backgroundImage ? new Uint8Array(data.backgroundImage) : undefined,
            },
        });

        return {
            ...updated,
            backgroundImage: updated.backgroundImage ? Buffer.from(updated.backgroundImage).toString('base64') : null,
        };
    } catch (error) {
        throw new Error("Desktop not found or update failed.");
    }
};

// DELETE DESKTOP
export const deleteDesktopService = async (id: string) => {
    try {
        await prisma.desktop.delete({
            where: { id },
        });
    } catch (error) {
        throw new Error("Desktop doesn't exist.");
    }
};