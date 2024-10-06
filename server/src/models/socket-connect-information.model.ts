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
    ipAddress: string;
    subscription?: Subscriptions | null;
}

const subscriptionsSchema = new Schema<Subscriptions>({
    endpoint: { type: String, required: true },
    keys: {
        type: Map,
        of: String,
        required: true,
    },
});

// Create the main SocketConnectInformation schema
const socketConnectInformationSchema = new Schema<SocketConnectInformation>({
    _id: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    socketId: { type: String },
    idUser: { type: String, required: true },
    ipAddress: { type: String },
    subscription: { type: subscriptionsSchema },
});

// Create and export the model
export const SocketConnectInformationModel = mongoose.model<SocketConnectInformation>(
    'SocketConnectInformation',
    socketConnectInformationSchema
);