import React, { ComponentType, memo, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Component factory for creating scalable, performant components
 */

export interface ComponentConfig {
  displayName?: string;
  shouldMemoize?: boolean;
  shouldForwardRef?: boolean;
  className?: string;
  variants?: Record<string, any>;
}

export interface ComponentFactoryOptions {
  baseClassName?: string;
  defaultVariants?: Record<string, any>;
  shouldMemoize?: boolean;
  shouldForwardRef?: boolean;
}

/**
 * Creates a scalable component factory
 */
export function createComponentFactory<T extends Record<string, any>>(
  options: ComponentFactoryOptions = {}
) {
  const {
    baseClassName = '',
    defaultVariants = {},
    shouldMemoize = true,
    shouldForwardRef = true,
  } = options;

  return function createComponent<P extends Record<string, any>>(
    Component: ComponentType<P>,
    config: ComponentConfig = {}
  ) {
    const {
      displayName,
      shouldMemoize: memoize = shouldMemoize,
      shouldForwardRef: forwardRef = shouldForwardRef,
      className: configClassName,
      variants = {},
    } = config;

    const mergedVariants = { ...defaultVariants, ...variants };

    let WrappedComponent: ComponentType<P>;

    if (forwardRef && React.forwardRef) {
      WrappedComponent = forwardRef<any, P>((props, ref) => {
        const { className, ...restProps } = props;
        const combinedClassName = cn(
          baseClassName,
          configClassName,
          className
        );

        return (
          <Component
            ref={ref}
            className={combinedClassName}
            {...mergedVariants}
            {...restProps}
          />
        );
      });
    } else {
      WrappedComponent = (props: P) => {
        const { className, ...restProps } = props;
        const combinedClassName = cn(
          baseClassName,
          configClassName,
          className
        );

        return (
          <Component
            className={combinedClassName}
            {...mergedVariants}
            {...restProps}
          />
        );
      };
    }

    if (memoize) {
      WrappedComponent = memo(WrappedComponent);
    }

    if (displayName) {
      WrappedComponent.displayName = displayName;
    }

    return WrappedComponent;
  };
}

/**
 * Creates a scalable table component factory
 */
export const createTableComponentFactory = createComponentFactory({
  baseClassName: 'table-component',
  shouldMemoize: true,
  shouldForwardRef: true,
});

/**
 * Creates a scalable form component factory
 */
export const createFormComponentFactory = createComponentFactory({
  baseClassName: 'form-component',
  shouldMemoize: true,
  shouldForwardRef: true,
});

/**
 * Creates a scalable card component factory
 */
export const createCardComponentFactory = createComponentFactory({
  baseClassName: 'card-component',
  shouldMemoize: true,
  shouldForwardRef: false,
});

/**
 * Creates a scalable button component factory
 */
export const createButtonComponentFactory = createComponentFactory({
  baseClassName: 'button-component',
  shouldMemoize: true,
  shouldForwardRef: true,
});

/**
 * Higher-order component for performance optimization
 */
export function withPerformanceOptimization<P extends object>(
  Component: ComponentType<P>,
  options: {
    shouldMemoize?: boolean;
    memoDependencies?: (props: P) => any[];
  } = {}
) {
  const { shouldMemoize = true, memoDependencies } = options;

  if (!shouldMemoize) {
    return Component;
  }

  return memo(Component, (prevProps, nextProps) => {
    if (memoDependencies) {
      const prevDeps = memoDependencies(prevProps);
      const nextDeps = memoDependencies(nextProps);
      
      return prevDeps.every((dep, index) => dep === nextDeps[index]);
    }

    return false; // Re-render by default for safety
  });
}

/**
 * Creates a scalable layout component
 */
export function createLayoutComponent<T extends Record<string, any>>(
  baseComponent: ComponentType<T>,
  layoutConfig: {
    containerClassName?: string;
    responsive?: boolean;
    maxWidth?: string;
  } = {}
) {
  const {
    containerClassName = '',
    responsive = true,
    maxWidth = 'max-w-7xl',
  } = layoutConfig;

  return withPerformanceOptimization(
    forwardRef<any, T>((props, ref) => {
      const { className, children, ...restProps } = props;

      return (
        <div
          ref={ref}
          className={cn(
            'w-full mx-auto px-4',
            responsive && 'sm:px-6 lg:px-8',
            maxWidth,
            containerClassName,
            className
          )}
          {...restProps}
        >
          {children}
        </div>
      );
    })
  );
}

/**
 * Creates a scalable section component
 */
export function createSectionComponent<T extends Record<string, any>>(
  baseComponent: ComponentType<T>,
  sectionConfig: {
    spacing?: string;
    background?: string;
    border?: string;
  } = {}
) {
  const {
    spacing = 'py-8',
    background = '',
    border = '',
  } = sectionConfig;

  return withPerformanceOptimization(
    forwardRef<any, T>((props, ref) => {
      const { className, children, ...restProps } = props;

      return (
        <section
          ref={ref}
          className={cn(
            'w-full',
            spacing,
            background,
            border,
            className
          )}
          {...restProps}
        >
          {children}
        </section>
      );
    })
  );
}
