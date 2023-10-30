/* eslint-disable @typescript-eslint/no-empty-function */
import React, { PropsWithChildren, useState, createContext } from 'react';

type TableStateProps = {
  reloadData: () => void;
};

type DataTableContextProps = {
  tableState: TableStateProps;
  setTableState: React.Dispatch<React.SetStateAction<TableStateProps>>;
};

const DEFAULT_VALUES: DataTableContextProps = {
  tableState: { reloadData: () => {} },
  setTableState: () => {},
};

export const DataTableContext = createContext<DataTableContextProps>(DEFAULT_VALUES);

const DataTableContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tableState, setTableState] = useState(DEFAULT_VALUES.tableState);

  return (
    <DataTableContext.Provider
      value={{
        tableState,
        setTableState,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};

export default DataTableContextProvider;
