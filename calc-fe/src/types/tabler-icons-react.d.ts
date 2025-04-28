declare module '@tabler/icons-react' {
  import { FC, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    stroke?: number | string;
    color?: string;
  }
  
  export const IconUpload: FC<IconProps>;
  export const IconEraser: FC<IconProps>;
  export const IconPencil: FC<IconProps>;
  export const IconText: FC<IconProps>;
  export const IconCalculator: FC<IconProps>;
  export const IconRefresh: FC<IconProps>;
} 