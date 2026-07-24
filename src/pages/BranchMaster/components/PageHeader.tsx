import React from "react";

export interface PageHeaderProps {
  icon: string;
  iconAlt: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  iconClassName?: string;
}

function PageHeader({
  icon,
  iconAlt,
  titleEn,
  titleHi,
  subtitleEn,
  subtitleHi,
  iconClassName = "object-contain",
}: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <img src={icon} alt={iconAlt} className={iconClassName} />
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          {titleEn} / {titleHi}
        </h2>
        <p className="text-sm text-gray-500">
          {subtitleEn} / {subtitleHi}
        </p>
      </div>
    </div>
  );
}

export default PageHeader;