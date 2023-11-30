import React from 'react';

interface TabItemProps {
  label: string;
}

const TabItem = ({ label }: TabItemProps) => {
  return <div>{label}</div>;
};

export default TabItem;
