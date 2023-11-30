import { Utils } from '@/utils';
import React from 'react';
import { IWalletHistory } from '@/interface/walletPage';

interface WalletHistoryTabProps {
  history: IWalletHistory;
}

const WalletHistoryTab = ({ history }: WalletHistoryTabProps) => {
  return (
    <div className="w-full py-1 flex justify-between items-center">
      <div className="w-7/12 flex flex-col items-start gap-1">
        <p className="font-semibold line-clamp-2 text-ellipsis">
          {history.title}
        </p>
        <p className="text-xs text-gray-500">
          {Utils.getDDMonthYYYYTime(history.date)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 max-w-full">
        <p
          className={`${
            history.is_debit ? 'text-green-500' : 'text-destructive'
          } truncate max-w-full`}
        >{`${history.is_debit ? '+' : '-'}${Utils.convertPrice(
          history.amount,
        )}`}</p>
        {!history.is_debit && history.shop_name && (
          <p className="text-xs text-gray-500">{`to: ${history.shop_name}`}</p>
        )}
      </div>
    </div>
  );
};

export default WalletHistoryTab;
