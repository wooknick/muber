import { withFilter } from "graphql-yoga";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        NearbyRidesSubscription: {
            subscribe: withFilter(
                (_, __, { pubSub }) => {
                    return pubSub.asyncIterator("rideRequest");
                },
                (payload, _, { context }) => {
                    const user: User = context.currentUser;
                    const {
                        NearbyRidesSubscription: { pickUpLat, pickUpLng }
                    }: { NearbyRidesSubscription: Ride } = payload;
                    const { lastLat: userLastLat, lastLng: userLastLng } = user;
                    return (
                        pickUpLat >= userLastLat - 0.05 &&
                        pickUpLat <= userLastLat + 0.05 &&
                        pickUpLng >= userLastLng - 0.05 &&
                        pickUpLng <= userLastLng + 0.05
                    );
                }
            )
        }
    }
};

export default resolvers;
