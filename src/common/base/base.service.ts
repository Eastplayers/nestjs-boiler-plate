/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from 'express';
import {
  FindAttributeOptions,
  Includeable,
  Op,
  Order,
  Transaction,
} from 'sequelize';
import { ModelCtor, Sequelize } from 'sequelize-typescript';
import { REQUEST } from '@nestjs/core';
import { Inject, NotFoundException } from '@nestjs/common';
import { BaseModel } from './base.model';

export enum IncludeTypes {
  Required = 'required',
  List = 'list',
  Detail = 'detail',
}

export interface ActionOptions {
  transaction?: Transaction;
  skip_return?: boolean;
  skip_attributes?: Boolean;
  skip_include?: Boolean;
  include?: Includeable | Includeable[];
}

export interface FindOptions extends ActionOptions {
  include_deleted?: boolean;
  throw_error_not_found?: boolean;
  attributes?: FindAttributeOptions;
  order?: Order;
}

export interface FindListOptions extends FindOptions {
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: string;
  sorts?: string[][];
  passIncludeOnCount?: boolean;
}

export abstract class BaseService {
  protected readonly schema: string = 'public';
  @Inject(REQUEST)
  protected request: Request;

  @Inject()
  protected sequelize: Sequelize;
  constructor() {
    // this.schema = getSchemaFromUrl(this.request);
  }
}

export abstract class BaseModuleService<
  T extends BaseModel,
> extends BaseService {
  protected readonly includes: {
    required?: any[];
    list?: Includeable[];
    detail?: Includeable[];
  };

  constructor(protected model: ModelCtor<T>) {
    super();
  }

  protected defaultSortBy = 'created_at';
  protected defaultSortOrder = 'desc';
  protected searchColumns: string[] = [];
  protected attributes: FindAttributeOptions = undefined;

  async findList(
    condition: any,
    options?: FindListOptions,
  ): Promise<{ count: number; rows: T[] }> {
    const { passIncludeOnCount } = options;
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;
    const paranoid = !options?.include_deleted;
    const throw_error_not_found =
      options?.throw_error_not_found == undefined ||
      options?.throw_error_not_found == null
        ? false
        : options?.throw_error_not_found;

    let search = null;
    if (condition && condition['search']) {
      search = condition['search'];
      delete condition.search;
    }

    const searchCondition = await this.prepareSearchPayload(search, options);
    let include = this.prepareInclude(IncludeTypes.List, options);
    let payload = await this.beforeFind(
      {
        where: { ...searchCondition, ...condition },
        transaction: options?.transaction,
        include: passIncludeOnCount ? include : undefined,
        paranoid,
        ...(passIncludeOnCount && include.length && { distinct: true }),
      },
      'countList',
    );
    const total = (await this.model.schema(this.schema).count(payload)) as any;
    if (total === 0 && throw_error_not_found) throw new NotFoundException();

    include = this.prepareInclude(IncludeTypes.List, options);
    payload = await this.beforeFind(
      {
        where: { ...searchCondition, ...condition },
        order: this.prepareSortPayload(options),
        limit,
        offset,
        include,
        paranoid,
      },
      'findList',
    );
    let data = await this.model.schema(this.schema).findAll({
      ...payload,
      transaction: options?.transaction,
      attributes: options?.attributes || this.attributes,
      ...(options?.order ? { order: options.order } : {}),
    });
    data = data.map((x) => x.transformToResponse());
    await this.afterFind(data, 'findList', options);

    return { count: total, rows: data };
  }

  async findAll(condition: any, options?: FindOptions): Promise<T[]> {
    const paranoid = !options?.include_deleted;
    const throw_error_not_found =
      options?.throw_error_not_found == undefined ||
      options?.throw_error_not_found == null
        ? false
        : options?.throw_error_not_found;

    let search = null;
    if (condition && condition['search']) {
      search = condition['search'];
      delete condition.search;
    }

    const searchCondition = await this.prepareSearchPayload(search, options);
    const include = this.prepareInclude(IncludeTypes.List, options);
    const payload = await this.beforeFind(
      {
        where: { ...searchCondition, ...condition },
        order: this.prepareSortPayload(options),
        include,
        paranoid,
      },
      'findAll',
    );
    let data = await this.model.schema(this.schema).findAll({
      ...payload,
      transaction: options?.transaction,
      attributes: options?.attributes || this.attributes,
    });
    if (data.length === 0 && throw_error_not_found)
      throw new NotFoundException();

    data = data.map((x) => x.transformToResponse());
    await this.afterFind(data, 'findAll', options);
    return data;
  }

  async findOne(condition: any, options?: FindOptions): Promise<T> {
    const paranoid = !options?.include_deleted;
    const throw_error_not_found =
      options?.throw_error_not_found == undefined ||
      options?.throw_error_not_found == null
        ? false
        : options?.throw_error_not_found;

    let search = null;
    if (condition && condition['search']) {
      search = condition['search'];
      delete condition.search;
    }

    const searchCondition = await this.prepareSearchPayload(search, options);
    const include = options?.skip_include
      ? []
      : this.prepareInclude(IncludeTypes.Detail, options);
    const payload = await this.beforeFind(
      {
        where: { ...searchCondition, ...condition },
        include,
        paranoid,
      },
      'findOne',
    );
    let data = await this.model.schema(this.schema).findOne({
      ...payload,
      transaction: options?.transaction,
      attributes: options?.attributes || this.attributes,
    });
    if (!data && throw_error_not_found) throw new NotFoundException();
    if (!data) return null;

    data = data.transformToResponse();
    await this.afterFind([data], 'findOne', options);
    return data;
  }

  async findById(id: string, options?: FindOptions): Promise<T> {
    const paranoid = !options?.include_deleted;
    const throw_error_not_found =
      options?.throw_error_not_found == undefined ||
      options?.throw_error_not_found == null
        ? true
        : options?.throw_error_not_found;

    const query: any = {};
    query.id = id;

    const include = options?.skip_include
      ? []
      : this.prepareInclude(IncludeTypes.Detail, options);
    const payload = await this.beforeFind(
      {
        where: query,
        include,
        paranoid,
      },
      'findById',
    );
    let data = await this.model.schema(this.schema).findOne({
      ...payload,
      transaction: options?.transaction,
      attributes: options?.attributes || this.attributes,
      ...(options?.order ? { order: options.order } : {}),
    });
    if (!data && throw_error_not_found) throw new NotFoundException(id);
    if (!data) return null;

    data = data.transformToResponse();
    await this.afterFind([data], 'findById', options);
    return data;
  }

  async findByIds(ids: string[], options?: FindOptions): Promise<T[]> {
    const paranoid = !options?.include_deleted;
    const throw_error_not_found =
      options?.throw_error_not_found == undefined ||
      options?.throw_error_not_found == null
        ? true
        : options?.throw_error_not_found;

    const query: any = {};
    query.id = ids;

    const include = this.prepareInclude(IncludeTypes.Detail, options);
    const payload = await this.beforeFind(
      {
        where: query,
        include,
        paranoid,
      },
      'findByIds',
    );
    let data = await this.model.schema(this.schema).findAll({
      ...payload,
      transaction: options?.transaction,
      attributes: options?.attributes || this.attributes,
    });

    if (throw_error_not_found) {
      const missingIds = ids.filter((id) => !data.some((x) => x.id === id));
      if (missingIds.length > 0) throw new NotFoundException(missingIds);
    }

    data = data.map((x) => x.transformToResponse());
    await this.afterFind(data, 'findByIds', options);
    return data;
  }

  async beforeFind(payload: any, method: string) {
    return payload;
  }

  async afterFind(
    data: T[],
    method: string,
    options: ActionOptions,
  ): Promise<void> {
    return;
  }

  async count(condition: any, options?: FindOptions): Promise<number> {
    const paranoid = !options?.include_deleted;

    const result = await this.model.schema(this.schema).count({
      where: condition,
      paranoid,
      transaction: options?.transaction,
    });
    return result;
  }

  async create(payload: any, options?: ActionOptions): Promise<T> {
    const result = await this.model
      .schema(this.schema)
      .create(payload, { transaction: options?.transaction });

    let data = result.transformToResponse();
    if (!options?.skip_return) data = await this.findById(data.id, options);
    await this.afterFind([data], 'findById', options);
    return data;
  }

  async update(id: string, payload: any, options?: FindOptions): Promise<T> {
    const item = await this.findById(id, options);
    const query: any = {};
    query.id = item.id;

    const result = await this.model.schema(this.schema).update(payload, {
      where: query,
      returning: true,
      transaction: options?.transaction,
    });

    let data = result[1][0].transformToResponse();
    if (!options?.skip_return) data = await this.findById(data.id, options);
    await this.afterFind([data], 'findById', options);
    return data;
  }

  async updateAll(
    condition: any,
    payload: any,
    options?: FindOptions,
  ): Promise<void> {
    await this.model.schema(this.schema).update(payload, {
      where: condition,
      returning: true,
      transaction: options?.transaction,
    });
  }

  async delete(id: string, options?: ActionOptions): Promise<void> {
    const item = await this.findById(id, {
      include_deleted: false,
      throw_error_not_found: true,
    });

    const query: any = {};
    query.id = item.id;

    await this.model.schema(this.schema).destroy({
      where: query,
      transaction: options?.transaction,
    });
  }

  async restore(id: string, options?: ActionOptions): Promise<void> {
    const item = await this.findById(id, {
      include_deleted: true,
      throw_error_not_found: true,
    });

    const query: any = {};
    query.id = item.id;

    await this.model.schema(this.schema).restore({
      where: query,
      transaction: options?.transaction,
    });
  }

  async destroy(id: string, options?: ActionOptions): Promise<void> {
    const item = await this.findById(id, {
      include_deleted: true,
      throw_error_not_found: true,
    });

    const query: any = {};
    query.id = item.id;

    await this.model.schema(this.schema).destroy({
      where: query,
      force: true,
      transaction: options?.transaction,
    });
  }

  async destroyByCondition(
    condition: any,
    options?: ActionOptions,
  ): Promise<void> {
    await this.model.schema(this.schema).destroy({
      where: condition,
      force: true,
      transaction: options?.transaction,
    });
  }

  protected prepareInclude(type: IncludeTypes, options?: FindOptions) {
    let include = [];

    switch (type) {
      case IncludeTypes.Required:
        if (this.includes?.required) {
          include = include.concat(this.includes.required);
        }
        break;
      case IncludeTypes.List:
        if (this.includes?.required) {
          include = include.concat(this.includes.required);
        }
        if (this.includes?.list) {
          include = include.concat(this.includes.list);
        }
        break;
      case IncludeTypes.Detail:
        if (this.includes?.required) {
          include = include.concat(this.includes.required);
        }
        if (this.includes?.detail) {
          include = include.concat(this.includes.detail);
        }
        break;
    }

    if (options?.include) include = include.concat(options.include);
    return include;
  }

  protected async prepareSearchPayload(
    search: string,
    options: ActionOptions,
  ): Promise<any> {
    if (!search || search.trim() === '') return {};

    const condition = {};
    for (const col of this.searchColumns) {
      condition[col] = { [Op.iLike]: `%${search}%` };
    }

    return { [Op.or]: condition };
  }

  protected prepareSortPayload(options: FindListOptions) {
    if (options?.sorts) return options.sorts;

    const sort_by = options?.sort_by ?? this.defaultSortBy;
    const sort_order = options?.sort_order ?? this.defaultSortOrder;
    return [[sort_by, sort_order]];
  }

  async bulkCreate(payload: Array<any>, options?: ActionOptions): Promise<T[]> {
    const createdRecord = await this.model
      .schema(this.schema)
      .bulkCreate(payload, {
        transaction: options?.transaction,
        include: options?.include,
      });
    const recordIds = createdRecord.map((record) => record.id);

    return this.findAll({ id: recordIds }, options);
  }

  async deleteByCondition(
    condition: any,
    options?: ActionOptions,
    force = false,
  ): Promise<number> {
    return this.model.schema(this.schema).destroy({
      where: condition,
      transaction: options?.transaction,
      force,
    });
  }
}
