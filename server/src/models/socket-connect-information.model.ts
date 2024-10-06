import mongoose, { Schema } from "mongoose";

export interface Subscriptions {
    endpoint: string;
    keys: Record<string, string>;
}
export interface SocketConnectInformation {
    _id?: mongoose.Types.ObjectId,
    socketId: string;
    idUser: string;
    ipAddress: string;
    subscriptions: Subscriptions;
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
    socketId: { type: String, required: true },
    idUser: { type: String },
    ipAddress: { type: String, required: true },
    subscriptions: { type: subscriptionsSchema },
});

// Create and export the model
export const SocketConnectInformationModel = mongoose.model<SocketConnectInformation>(
    'SocketConnectInformation',
    socketConnectInformationSchema
);