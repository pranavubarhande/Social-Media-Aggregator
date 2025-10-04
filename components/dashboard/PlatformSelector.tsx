import { Check, Youtube, Instagram, Linkedin, Facebook, Twitter, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlatformType } from '@/types/supabase';

const platforms = [
  {
    id: 'youtube' as PlatformType,
    name: 'YouTube',
    icon: Youtube,
  },
  {
    id: 'instagram' as PlatformType,
    name: 'Instagram',
    icon: Instagram,
  },
  {
    id: 'linkedin' as PlatformType,
    name: 'LinkedIn',
    icon: Linkedin,
  },
  {
    id: 'facebook' as PlatformType,
    name: 'Facebook',
    icon: Facebook,
  },
  {
    id: 'twitter' as PlatformType,
    name: 'Twitter',
    icon: Twitter,
  },
  {
    id: 'medium' as PlatformType,
    name: 'Medium',
    icon: Globe,
  },
  {
    id: 'google_analytics' as PlatformType,
    name: 'Google Analytics',
    icon: Globe,
  },
];

interface PlatformSelectorProps {
  value: PlatformType;
  onChange: (platform: PlatformType) => void;
}

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        return (
          <Button
            key={platform.id}
            variant={value === platform.id ? 'default' : 'outline'}
            className={cn(
              'flex items-center space-x-2',
              value === platform.id && 'bg-primary text-primary-foreground'
            )}
            onClick={() => onChange(platform.id)}
          >
            <Icon className="h-4 w-4" />
            <span>{platform.name}</span>
            {value === platform.id && <Check className="h-4 w-4 ml-2" />}
          </Button>
        );
      })}
    </div>
  );
}