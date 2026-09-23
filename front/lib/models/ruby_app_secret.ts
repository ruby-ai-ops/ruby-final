import { frontSequelize } from "@app/lib/resources/storage";
import {
  DANGEROUSLY_UNBOUNDED_TEXT,
  DataTypes,
} from "@app/lib/resources/storage/data_types";
import { UserModel } from "@app/lib/resources/storage/models/user";
import { WorkspaceAwareModel } from "@app/lib/resources/storage/wrappers/workspace_models";
import type { CreationOptional, ForeignKey, NonAttribute } from "sequelize";

export class RubyAppSecretModel extends WorkspaceAwareModel<RubyAppSecretModel> {
  declare createdAt: CreationOptional<Date>;

  declare name: string;
  declare hash: string;

  declare userId: ForeignKey<UserModel["id"]>;

  declare user: NonAttribute<UserModel>;
}
RubyAppSecretModel.init(
  {
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hash: {
      type: DANGEROUSLY_UNBOUNDED_TEXT,
      allowNull: false,
    },
  },
  {
    modelName: "ruby_app_secrets",
    sequelize: frontSequelize,
    indexes: [{ fields: ["workspaceId"] }],
  }
);
// We don't want to delete keys when a user gets deleted.
UserModel.hasMany(RubyAppSecretModel, {
  foreignKey: { allowNull: true },
  onDelete: "SET NULL",
});
RubyAppSecretModel.belongsTo(UserModel);
