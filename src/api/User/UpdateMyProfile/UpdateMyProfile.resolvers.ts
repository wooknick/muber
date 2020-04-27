import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../../utils/cleanNullArgs";
import privateResolver from "../../../utils/privateResolver";
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse,
} from "../../../types/graph.d";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        { req }
      ): Promise<UpdateMyProfileResponse> => {
        const user: User = req.user;
        const notNull: any = cleanNullArgs(args);
        if (notNull.password !== null) {
          user.password = notNull.password;
          await user.save();
          delete notNull.password;
        }
        try {
          await User.update({ id: user.id }, { ...notNull });
          return {
            ok: true,
            error: null,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
          };
        }
      }
    ),
  },
};

export default resolvers;
