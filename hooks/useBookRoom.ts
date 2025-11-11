import {create} from "zustand";
import { IRoom } from "@/models/Hotel";
import {persist} from "zustand/middleware";


interface BookRoomStore{
    bookingRoomData: RoomDataType | null;
    paymentIntent: string | null; //from stripe
    clientSecret: string | undefined;//from stripe
    setRoomData: (data: RoomDataType) => void;
    setPaymentIntent: (paymentIntent: string) => void;
    setClientSecret: (clientSecret: string)=> void;
    resetBookRoom: ()=> void;
}

interface RoomDataType{
    room: IRoom;
    totalPrice: number;
    breakFastIncluded: boolean;
    startDate: Date;
    endDate: Date;
}

const useBookRoom = create<BookRoomStore>()(
    persist((set) => ({
    bookingRoomData: null,
    paymentIntent: null,
    clientSecret: undefined,
    setRoomData: (data: RoomDataType) => set({ bookingRoomData: data }),
    setPaymentIntent: (paymentIntent: string) => set({ paymentIntent }),
    setClientSecret: (clientSecret: string) => set({ clientSecret }),
    resetBookRoom: () => set({ bookingRoomData: null, paymentIntent: null, clientSecret: undefined }),
}), {
    name: "BookRoom",
    //storage: localStorage,
})
);

export default useBookRoom;