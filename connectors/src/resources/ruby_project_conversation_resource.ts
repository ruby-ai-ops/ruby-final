import { RubyProjectConversationModel } from "@connectors/lib/models/ruby_project";
import logger from "@connectors/logger/logger";
import { BaseResource } from "@connectors/resources/base_resource";
import type { ConnectorResource } from "@connectors/resources/connector_resource";
import type { ReadonlyAttributesType } from "@connectors/resources/storage/types";
import type { ModelId } from "@connectors/types";
import { normalizeError } from "@connectors/types";
import type { Result } from "@ruby-ai/client";
import { Err, Ok } from "@ruby-ai/client";
import type { Attributes, ModelStatic, Transaction } from "sequelize";

// Attributes are marked as read-only to reflect the stateless nature of our Resource.
// This design will be moved up to BaseResource once we transition away from Sequelize.

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface RubyProjectConversationResource
  extends ReadonlyAttributesType<RubyProjectConversationModel> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RubyProjectConversationResource extends BaseResource<RubyProjectConversationModel> {
  static model: ModelStatic<RubyProjectConversationModel> =
    RubyProjectConversationModel;

  constructor(
    model: ModelStatic<RubyProjectConversationModel>,
    blob: Attributes<RubyProjectConversationModel>
  ) {
    super(RubyProjectConversationModel, blob);
  }

  async postFetchHook(): Promise<void> {
    return;
  }

  static async makeNew({
    connectorId,
    conversationId,
    projectId,
    sourceUpdatedAt,
    documentPartCount,
    transaction,
  }: {
    connectorId: ModelId;
    conversationId: string;
    projectId: string;
    sourceUpdatedAt: Date;
    documentPartCount: number;
    transaction?: Transaction;
  }): Promise<RubyProjectConversationResource> {
    const model = await RubyProjectConversationModel.create(
      {
        connectorId,
        conversationId,
        projectId,
        sourceUpdatedAt,
        documentPartCount,
      },
      { transaction }
    );

    return new RubyProjectConversationResource(RubyProjectConversationModel, {
      ...model.get({ plain: true }),
    });
  }

  static async fetchByConnectorIdAndConversationId(
    connectorId: ModelId,
    conversationId: string
  ): Promise<RubyProjectConversationResource | null> {
    const model = await RubyProjectConversationModel.findOne({
      where: {
        connectorId,
        conversationId,
      },
    });

    if (!model) {
      return null;
    }

    return new RubyProjectConversationResource(RubyProjectConversationModel, {
      ...model.get({ plain: true }),
    });
  }

  static async fetchByConnectorId(
    connectorId: ModelId
  ): Promise<RubyProjectConversationResource[]> {
    const models = await RubyProjectConversationModel.findAll({
      where: {
        connectorId,
      },
    });

    return models.map(
      (model) =>
        new RubyProjectConversationResource(RubyProjectConversationModel, {
          ...model.get({ plain: true }),
        })
    );
  }

  async updateLastSyncedAt(
    lastSyncedAt: Date | null,
    transaction?: Transaction
  ): Promise<Result<void, Error>> {
    try {
      await RubyProjectConversationModel.update(
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

  async updateLastMessageAt(
    sourceUpdatedAt: Date,
    transaction?: Transaction
  ): Promise<Result<void, Error>> {
    try {
      await RubyProjectConversationModel.update(
        { sourceUpdatedAt },
        {
          where: { id: this.id },
          transaction,
        }
      );
      return new Ok(undefined);
    } catch (err) {
      logger.error(
        { connectorId: this.connectorId, error: err },
        "Error updating sourceUpdatedAt"
      );
      return new Err(normalizeError(err));
    }
  }

  async delete(transaction?: Transaction): Promise<Result<undefined, Error>> {
    try {
      await RubyProjectConversationModel.destroy({
        where: { id: this.id },
        transaction,
      });
      return new Ok(undefined);
    } catch (err) {
      logger.error(
        { connectorId: this.connectorId, error: err },
        "Error deleting conversation"
      );
      return new Err(normalizeError(err));
    }
  }

  static async deleteByConnector(
    connector: ConnectorResource,
    transaction?: Transaction
  ): Promise<Result<undefined, Error>> {
    await this.model.destroy({
      where: {
        connectorId: connector.id,
      },
      transaction,
    });
    return new Ok(undefined);
  }

  static async getMaxSourceUpdatedAt(
    connectorId: ModelId
  ): Promise<Date | null> {
    const model = await RubyProjectConversationModel.max<
      Date | null,
      RubyProjectConversationModel
    >("sourceUpdatedAt", {
      where: { connectorId },
    });
    return model;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      connectorId: this.connectorId,
      conversationId: this.conversationId,
      projectId: this.projectId,
      lastSyncedAt: this.lastSyncedAt,
      sourceUpdatedAt: this.sourceUpdatedAt,
      documentPartCount: this.documentPartCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
