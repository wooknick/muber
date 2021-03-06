import Chat from "../../../entities/Chat";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse,
} from "../../../types/graph";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req, pubSub }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === "ACCEPTED") {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  status: "REQUESTING",
                },
                { relations: ["passenger", "driver"] }
              );
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
                const chat = await Chat.create({
                  driver: user,
                  passenger: ride.passenger,
                }).save();
                ride.chat = chat;
                ride.save();
              }
            } else {
              if (args.status === "FINISHED") {
                user.isTaken = false;
                await user.save();
              }
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  driver: user,
                },
                { relations: ["passenger", "driver"] }
              );
            }
            if (ride) {
              const passenger: User = ride.passenger;
              passenger.isRiding = false;
              await passenger.save();
              ride.status = args.status;
              ride.save();
              pubSub.publish("rideUpdate", {
                RideStatusSubscription: ride,
              });
              return {
                ok: true,
                error: null,
                rideId: ride.id,
              };
            } else {
              return {
                ok: false,
                error: "cant update ride",
                rideId: null,
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rideId: null,
            };
          }
        } else {
          return {
            ok: false,
            error: "you are not driving",
            rideId: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
