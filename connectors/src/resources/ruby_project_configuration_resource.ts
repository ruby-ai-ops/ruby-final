import { RubyProjectConfigurationModel } from "@connectors/lib/models/ruby_project";
import logger from "@connectors/logger/logger";
import { BaseResource } from "@connectors/resources/base_resource";
import type { ReadonlyAttributesType } from "@connectors/resources/storage/types";
import type { ModelId } from "@connectors/types";
import { normalizeError } from "@connectors/types";
import type { Result } from "@ruby-ai/client";
import { Err, Ok } from "@ruby-ai/client";
import type { Attributes, ModelStatic, Transaction } from "sequelize";

// Attributes are marked as read-only to reflect the stateless nature of our Resource.
// This design will be moved up to BaseResource once we transition away from Sequelize.

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface RubyProjectConfigurationResource
  extends ReadonlyAttributesType<RubyProjectConfigurationModel> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RubyProjectConfigurationResource extends BaseResource<RubyProjectConfigurationModel> {
  static model: ModelStatic<RubyProjectConfigurationModel> =
    RubyProjectConfigurationModel;

  constructor(
    model: ModelStatic<RubyProjectConfigurationModel>,
    blob: Attributes<RubyProjectConfigurationModel>
  ) {
    super(RubyProjectConfigurationModel, blob);
  }

  async postFetchHook(): Promise<void> {
    return;
  }

  static async makeNew({
    connectorId,
    projectId,
    transaction,
  }: {
    connectorId: ModelId;
    projectId: string;
    transaction: Transaction;
  }): Promise<RubyProjectConfigurationResource> {
    const model = await RubyProjectConfigurationModel.create(
      {
        connectorId,
        projectId,
      },
      { transaction }
    );

    return new RubyProjectConfigurationResource(RubyProjectConfigurationModel, {
      ...model.get({ plain: true }),
    });
  }

  static async fetchByConnectorId(
    connectorId: ModelId
  ): Promise<RubyProjectConfigurationResource | null> {
    const model = await RubyProjectConfigurationModel.findOne({
      where: {
        connectorId,
      },
    });

    if (!model) {
      return null;
    }

    return new RubyProjectConfigurationResource(RubyProjectConfigurationModel, {
      ...model.get({ plain: true }),
    });
  }

  async updateLastSyncedAt(
    lastSyncedAt: Date | null,
    transaction?: Transaction
  ): Promise<Result<void, Error>> {
    try {
      await RubyProjectConfigurationModel.update(
        { lastSyncedAt },
        {
          where: { id: this.id },
          transaction,
        }
      );
      return new Ok(undefined);
    } catch (err) {
      logger.error(
        { connectorId: this.connectorId, error: err },
        "Error updating lastSyncedAt"
      );
      return new Err(normalizeError(err));
    }
  }

  async delete(transaction?: Transaction): Promise<Result<undefined, Error>> {
    try {
      await RubyProjectConfigurationModel.destroy({
        where: { id: this.id },
        transaction,
      });
      return new Ok(undefined);
    } catch (err) {
      logger.error(
        { connectorId: this.connectorId, error: err },
        "Error deleting configuration"
      );
      return new Err(normalizeError(err));
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      connectorId: this.connectorId,
      projectId: this.projectId,
      lastSyncedAt: this.lastSyncedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
