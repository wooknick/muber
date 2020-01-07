import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        DriversSubscription: {
            subscribe: withFilter(
                (_, __, { pubSub }) => {
                    return pubSub.asyncIterator("driverUpdate");
                },
                (payload, _, { context }) => {
                    const user: User = context.currentUser;
                    const {
                        DriversSubscription: {
                            id: driverId,
                            lastLat: driverLastLat,
                            lastLng: driverLastLng,
                            isDriving
                        }
                    } = payload;
                    const {
                        id: userId,
                        lastLat: userLastLat,
                        lastLng: userLastLng
                    } = user;
                    return (
                        driverId !== userId &&
                        isDriving &&
                        driverLastLat >= userLastLat - 0.05 &&
                        driverLastLat <= userLastLat + 0.05 &&
                        driverLastLng >= userLastLng - 0.05 &&
                        driverLastLng <= userLastLng + 0.05
                    );
                }
            )
        }
    }
};
export default resolvers;
