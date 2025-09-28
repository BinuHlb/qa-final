'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Dynamically import recharts components to avoid SSR and type issues
const ResponsiveContainer = dynamic(
  () => import('recharts').then(mod => mod.ResponsiveContainer as React.ComponentType<any>),
  { ssr: false }
);
const RechartsTooltip = dynamic(
  () => import('recharts').then(mod => mod.Tooltip as React.ComponentType<any>),
  { ssr: false }
);
const RechartsLegend = dynamic(
  () => import('recharts').then(mod => mod.Legend as unknown as React.ComponentType<any>),
  { ssr: false }
);

type ThemeKey = 'light' | 'dark';
const THEMES: Record<ThemeKey, string> = { light: '', dark: '.dark' };

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Partial<Record<ThemeKey, string>>;
  }
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

type ChartContainerProps = React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ReactNode;
  id?: string;
  aspectRatio?: string;
  minWidth?: string | number;
  minHeight?: string | number;
};

const DEFAULT_ASPECT_RATIO = 'aspect-video';
const DEFAULT_TEXT_SIZE = 'text-xs';

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      id,
      className,
      children,
      config,
      aspectRatio = DEFAULT_ASPECT_RATIO,
      minWidth,
      minHeight,
      ...props
    },
    ref
  ) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;
    return (
      <ChartContext.Provider value={{ config }}>
        <div
          data-chart={chartId}
          ref={ref}
          className={cn(
            'flex justify-center',
            aspectRatio,
            DEFAULT_TEXT_SIZE,
            '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
            '[&_.recharts-cartesian-grid_line]:stroke-border/50',
            '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border',
            '[&_.recharts-dot[stroke="#fff"]]:stroke-transparent',
            '[&_.recharts-layer]:outline-none',
            '[&_.recharts-polar-grid_]:stroke-border',
            '[&_.recharts-radial-bar-background-sector]:fill-muted',
            '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted',
            '[&_.recharts-reference-line_]:stroke-border',
            '[&_.recharts-sector[stroke="#fff"]]:stroke-transparent',
            '[&_.recharts-sector]:outline-none',
            '[&_.recharts-surface]:outline-none',
            className
          )}
          style={{
            minWidth,
            minHeight,
            ...props.style,
          }}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <ResponsiveContainer>
            {children}
          </ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = 'ChartContainer';

const ChartStyle: React.FC<{ id: string; config: ChartConfig }> = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([, conf]) => conf.theme || conf.color
  );
  if (!colorConfig.length) return null;

  const css = (Object.entries(THEMES) as [ThemeKey, string][])
    .map(([theme, prefix]) => {
      const lines = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            (itemConfig.theme && itemConfig.theme[theme]) ||
            itemConfig.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join('\n');
      return lines
        ? `${prefix} [data-chart=${id}] {\n${lines}\n}`
        : '';
    })
    .filter(Boolean)
    .join('\n');
  return css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null;
};

const ChartTooltip = (props: any) => <RechartsTooltip {...props} />;

type ChartTooltipContentProps = Omit<any, 'payload'> &
  React.ComponentProps<'div'> & {
    payload?: Array<any>;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
    labelClassName?: string;
    formatter?: (
      value: any,
      name: string,
      item: any,
      index: number,
      payload: any
    ) => React.ReactNode;
    labelFormatter?: (value: any, payload: any[]) => React.ReactNode;
    color?: string;
  };

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload = [],
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      ...rest
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload.length) return null;
      const [item] = payload;
      const key = labelKey || item.dataKey || item.name || 'value';
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        // Avoid returning undefined, always return a ReactNode
        const formatted = labelFormatter(value, payload);
        return formatted ? (
          <div className={cn('font-medium', labelClassName)}>
            {formatted}
          </div>
        ) : null;
      }
      if (!value) return null;
      return <div className={cn('font-medium', labelClassName)}>{value}</div>;
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ]);

    if (!active || !payload.length) return null;

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
          className
        )}
        {...rest}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = nameKey || item.name || item.dataKey || 'value';
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item?.payload?.fill || item.color;

            return (
              <div
                key={item.dataKey ?? index}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center'
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  // Ensure formatter returns a valid ReactNode
                  formatter(item.value, item.name, item, index, item.payload) ?? null
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                            {
                              'h-2.5 w-2.5': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            }
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center'
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value !== undefined && item.value !== null && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {typeof item.value === 'number'
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

const ChartLegend = (props: any) => <RechartsLegend {...props} />;

type ChartLegendContentProps = React.ComponentProps<'div'> & {
  payload?: Array<any>;
  verticalAlign?: 'top' | 'bottom' | 'middle';
  hideIcon?: boolean;
  nameKey?: string;
};

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  (
    { className, hideIcon = false, payload = [], verticalAlign = 'bottom', nameKey, ...rest },
    ref
  ) => {
    const { config } = useChart();

    if (!Array.isArray(payload) || !payload.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-4',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className
        )}
        {...rest}
      >
        {payload.map((item, idx) => {
          const key = nameKey || item.dataKey || 'value';
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value ?? idx}
              className={cn(
                'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label ?? item.value}
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = 'ChartLegendContent';

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: any,
  key: string
) {
  if (!payload || typeof payload !== 'object') return undefined;

  // Try to resolve the config key from payload or its nested payload
  let configLabelKey: string = key;
  if (
    key in payload &&
    typeof payload[key] === 'string'
  ) {
    configLabelKey = payload[key];
  } else if (
    payload.payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null &&
    key in payload.payload &&
    typeof payload.payload[key] === 'string'
  ) {
    configLabelKey = payload.payload[key];
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
