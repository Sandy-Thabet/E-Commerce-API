const AppError = require('../../utils/appError');
const Merchant = require('../../database/models/merchantModel');
const MerchantNationalData = require('../../database/models/merchant-national-data-model');

exports.approveMerchant = async (merchantId) => {
  try {
    const merchant = await Merchant.findById(merchantId);

    if (
      !merchant ||
      merchant.status === 'blocked' ||
      merchant.status === 'inactive'
    ) {
      throw new AppError('No merchant found by this id!', 404);
    }

    if (merchant.status === 'pending') {
      throw new AppError('Merchant is not activated yet!', 400);
    }

    if (merchant.status === 'active') {
      throw new AppError('Merchant is already activated.', 400);
    }

    let activatedMerchant;
    if (merchant.status === 'pendingAdminApproval') {
      activatedMerchant = await Merchant.findByIdAndUpdate(merchantId, {
        status: 'active',
      });
      activatedMerchant.status = 'active';
      activatedMerchant.validationCode = undefined;
      return { activatedMerchant };
    }

    throw new AppError('ERROR', 400);
  } catch (err) {
    throw err;
  }
};

exports.getAllMerchants = async (filter, page, size, sort) => {
  try {
    const query = {};

    const { ...otherFilters } = filter;
    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        query[key] = value;
      }
    });

    const totalMerchants = await Merchant.find(query);
    const merchants = await Merchant.find(query)
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size)
      .select('-validationCode');

    return { totalMerchants, merchants };
  } catch (err) {
    throw err;
  }
};

exports.getMerchant = async (id) => {
  try {
    const merchant = await Merchant.findById(id).select('-validationCode');

    if (!merchant) {
      throw new AppError('No merchant found by this id.', 404);
    }

    const NationalData = await MerchantNationalData.find({ merchantId: id });

    merchant.validationCode = undefined;

    return { merchant, NationalData };
  } catch (err) {
    throw err;
  }
};

exports.blockMerchant = async (id) => {
  try {
    const merchant = await Merchant.findById(id);

    if (
      !merchant ||
      merchant.status === 'inactive' ||
      merchant.status === 'blocked'
    ) {
      throw new AppError('no merchant found by this id!', 404);
    }

    const blockedM = await Merchant.findByIdAndUpdate(id, {
      status: 'blocked',
    });
    blockedM.status = 'blocked';
    blockedM.validationCode = undefined;

    return blockedM;
  } catch (err) {
    throw err;
  }
};

exports.deleteMerchant = async (id) => {
  try {
    const merchant = await Merchant.findById(id);

    if (
      !merchant ||
      merchant.status === 'inactive' ||
      merchant.status === 'blocked'
    ) {
      throw new AppError('no merchant found by this id!', 404);
    }

    const deleted = await Merchant.findByIdAndUpdate(id, {
      status: 'inactive',
    });
    deleted.status = 'inactive';
    deleted.validationCode = undefined;

    return deleted;
  } catch (err) {
    throw err;
  }
};
