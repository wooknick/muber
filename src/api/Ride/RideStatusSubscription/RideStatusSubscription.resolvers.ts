import { withFilter } from "graphql-yoga";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        RideStatusSubscription: {
            subscribe: withFilter(
                (_, __, { pubSub }) => {
                    return pubSub.asyncIterator("rideUpdate");
                },
                (payload, _, { context }) => {
                    const user: User = context.currentUser;
                    const {
                        RideStatusSubscription: { driverId, passengerId }
                    }: { RideStatusSubscription: Ride } = payload;
                    return user.id === driverId || user.id === passengerId;
                }
            )
        }
    }
};

export default resolvers;
