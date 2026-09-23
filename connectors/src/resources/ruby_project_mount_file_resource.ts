import { RubyProjectMountFileModel } from "@connectors/lib/models/ruby_project";
import logger from "@connectors/logger/logger";
import { BaseResource } from "@connectors/resources/base_resource";
import type { ConnectorResource } from "@connectors/resources/connector_resource";
import type { ReadonlyAttributesType } from "@connectors/resources/storage/types";
import type { ModelId } from "@connectors/types";
import { normalizeError } from "@connectors/types";
import type { Result } from "@ruby-ai/client";
import { Err, Ok } from "@ruby-ai/client";
import type { Attributes, ModelStatic, Transaction } from "sequelize";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface RubyProjectMountFileResource
  extends ReadonlyAttributesType<RubyProjectMountFileModel> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RubyProjectMountFileResource extends BaseResource<RubyProjectMountFileModel> {
  static model: ModelStatic<RubyProjectMountFileModel> =
    RubyProjectMountFileModel;

  constructor(
    model: ModelStatic<RubyProjectMountFileModel>,
    blob: Attributes<RubyProjectMountFileModel>
  ) {
    super(RubyProjectMountFileModel, blob);
  }

  async postFetchHook(): Promise<void> {
    return;
  }

  static async makeNew({
    connectorId,
    projectId,
    scopedPath,
    documentId,
    sourceUpdatedAt,
    transaction,
  }: {
    connectorId: ModelId;
    projectId: string;
    scopedPath: string;
    documentId: string;
    sourceUpdatedAt: Date;
    transaction?: Transaction;
  }): Promise<RubyProjectMountFileResource> {
    const model = await RubyProjectMountFileModel.create(
      {
        connectorId,
        projectId,
        scopedPath,
        documentId,
        sourceUpdatedAt,
      },
      { transaction }
    );

    return new RubyProjectMountFileResource(RubyProjectMountFileModel, {
      ...model.get({ plain: true }),
    });
  }

  static async fetchByConnectorId(
    connectorId: ModelId
  ): Promise<RubyProjectMountFileResource[]> {
    const models = await RubyProjectMountFileModel.findAll({
      where: { connectorId },
    });

    return models.map(
      (m) =>
        new RubyProjectMountFileResource(RubyProjectMountFileModel, {
          ...m.get({ plain: true }),
        })
    );
  }

  static async fetchByConnectorIdAndScopedPath(
    connectorId: ModelId,
    scopedPath: string
  ): Promise<RubyProjectMountFileResource | null> {
    const model = await RubyProjectMountFileModel.findOne({
      where: { connectorId, scopedPath },
    });

    if (!model) {
      return null;
    }

    return new RubyProjectMountFileResource(RubyProjectMountFileModel, {
      ...model.get({ plain: true }),
    });
  }

  static async getMaxSourceUpdatedAt(
    connectorId: ModelId
  ): Promise<Date | null> {
    return RubyProjectMountFileModel.max<
      Date | null,
      RubyProjectMountFileModel
    >("sourceUpdatedAt", {
      where: { connectorId },
    });
  }

  async updateRow({
    documentId,
    sourceUpdatedAt,
    transaction,
  }: {
    documentId: string;
    sourceUpdatedAt: Date;
    transaction?: Transaction;
  }): Promise<Result<void, Error>> {
    try {
      await RubyProjectMountFileModel.update(
        { documentId, sourceUpdatedAt },
        { where: { id: this.id }, transaction }
      );
      return new Ok(undefined);
    } catch (err) {
      logger.error(
        { connectorId: this.connectorId, error: err },
        "Error updating ruby_project_mount_file"
      );
      return new Err(normalizeError(err));
    }
  }

  async delete(transaction?: Transaction): Promise<Result<undefined, Error>> {
    try {
      await RubyProjectMountFileModel.destroy({
        where: { id: this.id },
        transaction,
      });
      return new Ok(undefined);
    } catch (err) {
      logger.error(
        { connectorId: this.connectorId, error: err },
        "Error deleting ruby_project_mount_file"
      );
      return new Err(normalizeError(err));
    }
  }

  static async deleteByConnector(
    connector: ConnectorResource,
    transaction?: Transaction
  ): Promise<Result<undefined, Error>> {
    await this.model.destroy({
      where: { connectorId: connector.id },
      transaction,
    });
    return new Ok(undefined);
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      connectorId: this.connectorId,
      projectId: this.projectId,
      scopedPath: this.scopedPath,
      documentId: this.documentId,
      sourceUpdatedAt: this.sourceUpdatedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
