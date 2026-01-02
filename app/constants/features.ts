import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ChartBarSquareIcon,
  InformationCircleIcon,
  SunIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import { Theme } from 'config/theme';
import { sectionTypes } from 'models/form';

export const features = [
  {
    title: 'Modular Builder',
    desc: `Pick from ${sectionTypes.length} section types like multiple choice and file uploads to build your perfect flow.`,
    icon: WrenchIcon,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Smart Limits',
    desc: 'Stay in control. Set automatic submission limits or expiration dates to manage your data collection window.',
    icon: AdjustmentsHorizontalIcon,
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    title: 'Visual Branding',
    desc: `Choose from ${Object.keys(Theme).length} professional themes and custom cover images to match your brand identity.`,
    icon: SunIcon,
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    title: 'AI Insights',
    desc: "Don't just collect data—understand it. Use AI to analyze sentiment and compare answers with visual charts.",
    icon: ChartBarSquareIcon,
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    title: 'Easy Export',
    desc: 'Your data is yours. Export all form responses to CSV in one click for external analysis or sharing.',
    icon: ArrowDownTrayIcon,
    color: 'bg-rose-500/10 text-rose-600',
  },
  {
    title: 'Priority Support',
    desc: 'Never get stuck. Our dedicated support team is here to help you build and scale your forms.',
    icon: InformationCircleIcon,
    color: 'bg-indigo-500/10 text-indigo-600',
  },
];
