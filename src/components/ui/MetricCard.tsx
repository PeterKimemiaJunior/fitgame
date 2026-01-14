import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  containerClass: string;
  titleClass: string;
  valueClass: string;
  subValue?: ReactNode;
  subValueClass?: string;
}

export function MetricCard({
  title,
  value,
  containerClass,
  titleClass,
  valueClass,
  subValue,
  subValueClass,
}: MetricCardProps) {
  return (
    <div className={containerClass}>
      <p className={titleClass}>{title}</p>
      <div>
        <p className={valueClass}>{value}</p>
        {subValue && <p className={subValueClass}>{subValue}</p>}
      </div>
    </div>
  );
}