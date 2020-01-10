import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { RequestRideMutationArgs, RequestRideResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../../utils/cleanNullArgs";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
    Mutation: {
        RequestRide: privateResolver(
            async (
                _,
                args: RequestRideMutationArgs,
                { req, pubSub }
            ): Promise<RequestRideResponse> => {
                const user: User = req.user;
                const notNull = cleanNullArgs(args);
                if (!user.isRiding) {
                    try {
                        const ride: any = await Ride.create({
                            ...notNull,
                            passenger: user
                        }).save();
                        pubSub.publish("rideRequest", {
                            NearbyRidesSubscription: ride
                        });
                        user.isRiding = true;
                        user.save();
                        return {
                            ok: true,
                            error: null,
                            ride
                        };
                    } catch (error) {
                        return {
                            ok: false,
                            error: error.message,
                            ride: null
                        };
                    }
                } else {
                    return {
                        ok: false,
                        error: "you cant request two rides",
                        ride: null
                    };
                }
            }
        )
    }
};

export default resolvers;
