import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { waveformData, waveformTooltips } from '@/lib/mockData';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkle } from '@phosphor-icons/react';
function generatePath(data: number[], width: number, height: number): string {
  const step = width / (data.length - 1);
  const mid = height / 2;
  let path = `M 0 ${mid + data[0] * mid}`;
  data.forEach((d, i) => {
    path += ` L ${i * step} ${mid + d * mid}`;
  });
  return path;
}
export function WaveformViz() {
  const isMobile = useIsMobile();
  const width = 500;
  const height = 100;
  const path = generatePath(waveformData, width, height);
  if (isMobile) {
    return (
      <div className="space-y-4">
        {waveformTooltips.map((tip, i) => (
          <Card key={i} className="bg-healthos-ice/50 dark:bg-healthos-ice/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkle weight="fill" className="text-healthos-prism-start" />
                {tip.insight}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{tip.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <TooltipProvider delayDuration={100}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <path d={path} stroke="hsl(var(--healthos-ice))" strokeWidth="2" fill="none" />
        {waveformTooltips.map((tip, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <circle
                cx={(tip.position / 100) * width}
                cy={height / 2 + waveformData[tip.position] * (height / 2)}
                r="6"
                className="fill-healthos-prism-start/50 stroke-healthos-prism-end stroke-2 cursor-pointer transition-all hover:fill-healthos-prism-start/100 hover:r-8"
              />
            </TooltipTrigger>
            <TooltipContent className="glass-card-styles p-4 max-w-xs">
              <p className="font-bold mb-1">{tip.insight}</p>
              <p className="text-sm text-muted-foreground">{tip.details}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </svg>
    </TooltipProvider>
  );
}