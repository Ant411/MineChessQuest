import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface MinecraftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'selected' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export function MinecraftButton({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className,
  disabled,
  ...props 
}: MinecraftButtonProps) {
  const baseClasses = 'minecraft-button';
  const variantClasses = {
    primary: 'minecraft-button-primary',
    secondary: 'minecraft-button-secondary',
    selected: 'minecraft-button-selected',
    danger: 'minecraft-button-danger'
  };
  const sizeClasses = {
    small: 'minecraft-button-small',
    medium: 'minecraft-button-medium',
    large: 'minecraft-button-large'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'minecraft-button-disabled',
        className
      )}
      disabled={disabled}
      {...props}
    >
      <div className="minecraft-button-content">
        {children}
      </div>
    </button>
  );
}
