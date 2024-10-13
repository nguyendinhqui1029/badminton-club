import mongoose, { Schema } from "mongoose";

export interface Subscriptions {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}
export interface SocketConnectInformation {
    _id?: mongoose.Types.ObjectId,
    socketId: string;
    idUser: string;
    subscription?: Subscriptions | null;
}

const subscriptionsSchema = new Schema<Subscriptions>({
    endpoint: { type: String, required: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
    },
});

// Create the main SocketConnectInformation schema
const socketConnectInformationSchema = new Schema<SocketConnectInformation>({
    _id: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    socketId: { type: String, required: true  },
    idUser: { type: String, required: true, unique: true },
    subscription: { type: subscriptionsSchema, default: null  },
});

// Create and export the model
export const SocketConnectInformationModel = mongoose.model<SocketConnectInformation>(
    'socket-connect-information',
    socketConnectInformationSchema
);